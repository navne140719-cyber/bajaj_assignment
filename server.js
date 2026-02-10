const express = require("express");
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());

// health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: "navneet0833.be23@chitkara.edu.in"
  });
});

// helper functions
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => (a * b) / gcd(a, b);

// POST /bfhl
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    let data = null;

    if (body.fibonacci !== undefined) {
      let n = body.fibonacci;
      let fib = [0,1];
      for (let i=2;i<n;i++){
        fib[i] = fib[i-1] + fib[i-2];
      }
      data = fib.slice(0,n);
    }

    else if (body.prime) {
      data = body.prime.filter(isPrime);
    }

    else if (body.hcf) {
      data = body.hcf.reduce((a,b)=>gcd(a,b));
    }

    else if (body.lcm) {
      data = body.lcm.reduce((a,b)=>lcm(a,b));
    }

    else if (body.AI) {
      const prompt = body.AI;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      data = response.text();
}

    else {
      return res.status(400).json({is_success:false});
    }

    res.json({
      is_success:true,
      official_email:"navneet0833.be23@chitkara.edu.in",
      data:data
    });

  } catch {
    res.status(500).json({is_success:false});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Running on",PORT));
