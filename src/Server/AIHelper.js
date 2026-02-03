let _defaultSession = null;

class AIHelper {
    static async ask(messages, env, opts) {
        let session = _getSession(env);
        return _ask(messages, session,opts);
    }

    static async askForCode(messages, env, opts) {
        let session = _getSession(env);
        return _askForCode(messages, session, opts);
    }

    static async chat(userText, env) {
        const {userId, actorKey} = env;
        const context = {userId, actorKey};

        let user = AUser.get(userId);
        let actor = AActor.get(actorKey);

        // 1) Load history as moments
        context.history = user.recentMoment({actor: actor});

        // 2) Load Practices & Insights
        context.practices = actor.practice();
        context.insights = user.getInsight({actor: actor});

        // 3) Select the correct Guidance flow
        const guidance = await user.getGuidance({actor: actor, context: context});

        // 4) guidance.pre (inject persona, system prompts)
        const promptForHints = guidance.pre
            ? await guidance.pre(userText, context)
            : userText;

        // 5) Delegate to guidance.handle (runs hint pre/post, LLM, backend actions)
        const {replyText, nextHints, actionsToTrigger, contextUpdates, feedback} =
            await guidance.handle(promptForHints, context);

        // 6) Record a Moment for this interaction
        await AMoment.create({
            user: userId,
            actor: actorKey,
            action: 'chat',
            outcome: replyText,
            prompt: userText,
            // context: { input: userText, ...contextUpdates }
        });

        // 7) Update Insights based on any feedback
        if (feedback) {
            await AInsight.updateFromFeedback(userId, actorKey, feedback);
        }

        // 8) Return structured result
        return {
            reply: replyText,
            suggestions: nextHints || [],
            actions: actionsToTrigger || []
        };
    }
}

module.exports = AIHelper;

function _getSession(env) {

    if (env?.aisession) {
        return env.aisession;
    } else {
        if (!_defaultSession) {
            _defaultSession = new GenAISession({name: "default"});
            let root = AIdentity.find({identifier: 'root'});
            _defaultSession.identity = root;
            if(env) {
                env.aisession = _defaultSession;
            }
        }
    }
    return _defaultSession;
}

async function _askForCode(messages, session, opts) {
    let response = await _ask(messages, session, opts);
    let valid = false;
    let tries = 0;
    let retval = null;
    while (!valid && tries < 5) {
        try {
            if (response.includes('```')) {
                let strip = response.match(/```[a-zA-Z]*([\s\S]*?)```/i);
                response = strip[1];
                response = response.trimStart();
            }
            if (response[0] === '(') {
                response = response;
            } else if (response[0] !== '[') {
                response = '[' + response + ']';
            }
            if (response[0] !== '(') {
                repsonse = '(' + response + ')';
            }
            retval = eval(response);
            if (typeof retval === 'string') {
                retval = eval('(' + retval + ')');
            }
            valid = true;
            tries++;
        } catch (e) {
            console.warn("Fixing the response:", e);
            console.warn(response);
            let nMessages = [
                {
                    role: 'system', content: "Given the following error from evaluting this string with" +
                        ` javascript eval function: ${e}. Make sure the response can` +
                        " is a string that can be evaluated  whith the the following command: eval(response)." +
                        " The results of the eval call should return an array of javascript objects."
                },
                {
                    role: 'user',
                    content: `${response}`
                }];
            response = await _ask(nMessages,session,opts);
        }
    }
    if (tries === 5) {
        // Try from scratch again.
        return _askForCode(messages, session, opts);
    } else {
        return retval;
    }
}

async function _ask(messages, session, opts) {
    // let context = _getContext();

    // context.add(messages);
    try {
        const content = await session.chat({
            messages: messages,
            noContext: opts?.noContext || false
        });
        // _recordMoment({messages: messages, reply: content});
        return content;
    } catch (e) {
        console.error("Calling OpenAI Error:", e.message);
    }
}

function _getContext() {
    const {userId, actorKey} = session;
    const context = {userId, actorKey};

    let user = AUser.get(userId);
    let actor = AActor.get(actorKey);

    // 1) Load history as moments
    context.history = user.recentMoments({actor: actor});

    // 2) Load Practices & Insights
    context.practices = actor.practice();
    context.insights = user.getInsight({actor: actor});
    let messages = [{
        role: 'system',
        content: `You are an assistant for ${user.name} which is taking on the role of ${actor.name}.
        Helping ${user.name} you should follow the following best practices for the role. Use the following: 
        ${context.practices}. Through your interactions you have developed the following insight about your 
        job to support ${user.name}. Use these insights to help ${user.name} based on the user prompt. Here 
        are the insights you have about your interactions: ${context.insights}. The latest interactions with 
        ${user.name} include the following: ${context.history}. `
    }];
    return messages;

}

function _recordMoment({messages, reply, session}) {
    const {userId, actorKey} = session;

    new AMoment({
        user: userId,
        actor: actorKey,
        action: 'ask',
        outcome: reply,
        prompt: messages,
    });
}

function _limitMessages(messages) {
    let totalLength = 0;
    let numOfMessages = 0;
    for (let i in messages) {
        totalLength += messages[i].content.length;
        if (messages[i].role === 'system') {
            numOfSystems++;
        }
    }
    if (totalLength > 100000) {
        // Find the longest system prompt and cut the end off?
        let cutNumber = Math.floor((totalLength - 100000) / numOfSystems);
        for (let i in messages) {
            if (messages[i].role === 'system') {
                messages[i].content = messages[i].content.substring(0, messages[i].content.length - cutNumber);
            }
        }
    }
    return messages;
}
