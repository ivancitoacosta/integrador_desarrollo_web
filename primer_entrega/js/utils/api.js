// {
//   "id": 1,
//   "username": "emilys",
//   "email": "emily.johnson@x.dummyjson.com",
//   "firstName": "Emily",
//   "lastName": "Johnson",
//   "gender": "female",
//   "image": "https://dummyjson.com/icon/emilys/128",
//   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT accessToken (for backward compatibility) in response and cookies
//   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // refreshToken in response and cookies
// }

export async function fetchLogin(data) {
  const fetchLogin = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'content-Type': 'application/json' },
    body: JSON.stringify({
      username: data.username,
      password: data.password
    })
  })
    .then(res => res.json())

  return fetchLogin;
}
