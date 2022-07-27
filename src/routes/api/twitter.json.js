export async function POST({body}) {
  const token = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
  const requestOptions = {
    status: 200,
    headers: {
      "Authorization": `Bearer ${token}`,
      "User-Agent" : "v2UserLookupJS",
      "Content-Type" : "application/json"
    },
    body: body
  }
  const res = await fetch('https://api.twitter.com/2/tweets', requestOptions)
  const resJSON = await res.json();
  return { body: resJSON };    
}
