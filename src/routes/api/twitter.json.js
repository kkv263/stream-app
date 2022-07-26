

export async function GET() {
  const token = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
  const requestOptions = {
    status: 200,
    headers: {
      "Authorization": `Bearer ${token}`,
      "User-Agent" : "v2UserLookupJS",
      "Content-Type" : "application/json"
    }
  }
  const res = await fetch("https://api.twitter.com/2/users/by?usernames=cursedleviatha1", requestOptions)
  const body = await res.json();
  return { body: body };    
}
