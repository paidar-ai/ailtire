// views/prompt/administrator/UserManagement/hints/listUsers.js
const AIHelper = require('../../../../src/Server/AIHelper');

module.exports = {
  name: 'listUsers',
  description: 'List all users',

  when: () => true,

  pre: async () => {
    const prompt = 'Return JSON: {"action":"list","users":["user1","user2",...]}';
    return AIHelper.askForCode([{ role:'system', content: prompt }]);
  },

  post: (llmText) => {
    let data;
    try { data = JSON.parse(llmText); }
    catch { return { replyText: "Could not parse users list." }; }

    return { replyText: `👥 Users:\n${data.users.join('\n')}` };
  }
};
