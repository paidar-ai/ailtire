// views/prompt/administrator/UserManagement/hints/resetToken.js
const AIHelper = require('../../../../src/Server/AIHelper');

module.exports = {
  name: 'resetToken',
  description: 'Reset API token for a user',

  when: ctx => ctx.userRegistered,

  pre: async (userText) => {
    const prompt = `User said: "${userText}".\n`
      + `If they want to reset token, return JSON: {"action":"resetToken","email":"..."}`;
    return AIHelper.ask([{ role:'user', content: prompt }]);
  },

  post: (llmText, context) => {
    let cmd;
    try { cmd = JSON.parse(llmText); }
    catch { return { replyText: "Could not parse resetToken data." }; }

    context.lastAction = 'resetToken';
    return {
      replyText: `🔄 API token reset for <${cmd.email}>.`,
      actionsToTrigger: [{ path: '/AUser/resetToken', inputs: { email: cmd.email } }]
    };
  }
};
