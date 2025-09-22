// views/prompt/administrator/UserManagement/hints/registerUser.js
const AIHelper = require('../../../../src/Server/AIHelper');

module.exports = {
  name: 'registerUser',
  description: 'Register a new user by email and name',

  when: ctx => !ctx.userRegistered,

  pre: async (userText, context) => {
    const prompt = `User said: "${userText}".\n`
      + `If they want to register, return JSON: `
      + `{"action":"register","email":"...","name":"..."}`;
    const res = await AIHelper.ask([{ role:'user', content: prompt }]);
    return res;
  },

  post: (llmText, context) => {
    let cmd;
    try { cmd = JSON.parse(llmText); }
    catch { return { replyText: "Could not parse registration data." }; }

    context.userRegistered = true;
    context.lastEmail = cmd.email;

    return {
      replyText: `✅ Registered ${cmd.name} <${cmd.email}>.`,
      actionsToTrigger: [{ path: '/auth/register', inputs: cmd }]
    };
  }
};
