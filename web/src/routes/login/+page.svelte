<script>
  import { postJSON } from '../../utils/api.js';
  import { goto } from '$app/navigation';
  let identifier = '', secret = '', msg = '';
  async function onSubmit() {
    try {
      const resp = await postJSON('auth/login', { identifier, secret }, { auth: false });
      localStorage.setItem('authToken', resp.accessToken);
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
  <input bind:value={identifier} placeholder="Username" required />
  <input type="password" bind:value={secret} placeholder="Password" required />
  <button type="submit">Login</button>
</form>
{#if msg}<p>{msg}</p>{/if}
