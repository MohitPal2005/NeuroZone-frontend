// utils/authFetch.js
export async function authFetch(url, method="GET", body=null) {
  const token = localStorage.getItem("idToken"); // Firebase user token
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
}
