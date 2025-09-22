<script>
  import { postJSON } from '../utils/api.js';
  import { goto } from '@sveltejs/kit'; // if SvelteKit; otherwise use your router
  let username = '', password = '', msg = '';
  async function onSubmit() {
    try {
      const { token } = await postJSON('/api/auth/login', { username, password }, { auth: false });
      localStorage.setItem('authToken', token);
      msg = '✅ Logged in';
      // redirect to chat
      goto('/chat');
    } catch (e) {
      msg = `❌ ${e.message}`;
    }
  }
</script>

<h1>Login</h1>
<form on:submit|preventDefault={onSubmit}>
  <input bind:value={username} placeholder="Username" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Login</button>
</form>
{#if msg}<p>{msg}</p>{/if}
