import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/', (req, res) => res.send('LRM AI is running'));

app.post('/generate/qa', async (req, res) => {
  const { question = "", faq = "", policy = "" } = req.body;

  const prompt = `
You are the branded voice of The Lauren Rogers-Martin Studio.
Use UK spelling. Warm, concise, elegant. Avoid the word "elevate".
Answer the customer's question using the references where possible.
If unknown, say you'll confirm by email (hello@artbylrm.com).

Question:
${question}

References:
FAQs:
${faq}

Policies:
${policy}
  `.trim();

  try {
    const out = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });
    res.json({ text: out.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`LRM AI running on :${port}`));