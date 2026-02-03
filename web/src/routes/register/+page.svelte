<script>
  import { postJSON } from '../../utils/api.js';
  let identifier = '', secret = '', msg = '';
  let kind = 'user';
  async function onSubmit() {
    try {
      await postJSON('auth/register', { identifier, secret, kind }, { auth: false });
      msg = '✅ Registered! Please log in.';
      identifier = secret = '';
    } catch (e) {
      msg = `❌ ${e.message}`;
    }
  }
</script>

<h1>Register</h1>
<form on:submit|preventDefault={onSubmit}>
  <input bind:value={identifier} placeholder="Username" required />
  <input type="password" bind:value={secret} placeholder="Password" required />
  <button type="submit">Register</button>
</form>
{#if msg}<p>{msg}</p>{/if}
