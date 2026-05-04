import axios from 'axios';

async function test() {
  try {
    const authRes = await axios.post('http://20.207.122.201/evaluation-service/auth', {
      email: "priyanshu.26584@ggnindia.dronacharya.info",
      name: "priyanshu",
      rollNo: "26584",
      accessCode: "uksdWT",
      clientID: "88bf1133-0171-400f-bf04-0c93962e4456",
      clientSecret: "mjRrtJCwvgWYjhwJ"
    });
    
    const token = authRes.data.token || authRes.data.access_token;
    
    try {
      const logRes = await axios.post('http://20.207.122.201/evaluation-service/logs', {
        stack: "frontend",
        level: "info",
        package: "api",
        message: "Fetching notifications — page=1, limit=5, type=Placement",
        timestamp: new Date().toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Log Success:', logRes.status);
    } catch (e) {
      console.error('Log Error:', e.response?.status, e.response?.data);
    }
  } catch (err) {
    console.error('Auth Error:', err.message);
  }
}

test();
