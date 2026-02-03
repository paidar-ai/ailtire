// src/utils/api.js
export async function postJSON(url, body, { auth=true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('authToken');
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`http://localhost/ailtire/${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || JSON.stringify(data));
  return data;
}
