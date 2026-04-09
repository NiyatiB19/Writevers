import axios from 'axios';

async function testCors() {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t`;
  const params = new URLSearchParams();
  params.append('q', "Hello world");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "http://localhost:3000"
      },
      body: params
    });
    console.log("Status:", res.status);
    console.log("CORS Header:", res.headers.get("access-control-allow-origin"));
    const data = await res.json();
    console.log(data[0][0][0]);
  } catch (e) {
    console.error(e);
  }
}
testCors();
