// views/prompt/administrator/UserManagement/hints/resetPassword.js
const AIHelper = require('../../../../src/Server/AIHelper');

module.exports = {
  name: 'resetPassword',
  description: 'Reset password for a user',

  when: ctx => ctx.userRegistered,

  pre: async (userText) => {
    const prompt = `User said: "${userText}".\n`
      + `If they want to reset password, return JSON: {"action":"resetPassword","email":"..."}`;
    return AIHelper.ask([{ role:'user', content: prompt }]);
  },

  post: (llmText, context) => {
    let cmd;
    try { cmd = JSON.parse(llmText); }
    catch { return { replyText: "Could not parse resetPassword data." }; }

    context.lastAction = 'resetPassword';
    return {
      replyText: `🔑 Password reset for <${cmd.email}>.`,
      actionsToTrigger: [{ path: '/AUser/resetPassword', inputs: { email: cmd.email } }]
    };
  }
};
