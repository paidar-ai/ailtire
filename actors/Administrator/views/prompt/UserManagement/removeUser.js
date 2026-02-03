// views/prompt/administrator/UserManagement/hints/removeUser.js
const AIHelper = require('../../../../src/Server/AIHelper');

module.exports = {
  name: 'removeUser',
  description: 'Remove an existing user by email',

  when: ctx => ctx.userRegistered,

  pre: async (userText) => {
    const prompt = `User said: "${userText}".\n`
      + `If they want to remove, return JSON: {"action":"remove","email":"..."}`;
    return AIHelper.ask([{ role:'user', content: prompt }]);
  },

  post: (llmText, context) => {
    let cmd;
    try { cmd = JSON.parse(llmText); }
    catch { return { replyText: "Could not parse removal data." }; }

    context.userRegistered = false;
    return {
      replyText: `🗑️ Removed user <${cmd.email}>.`,
      actionsToTrigger: [{ path: '/AUser/remove', inputs: { email: cmd.email } }]
    };
  }
};
