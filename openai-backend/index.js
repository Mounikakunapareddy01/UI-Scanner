const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Only allow requests from React local dev server
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/openai-scan', async (req, res) => {
  const { pageInfo } = req.body;
  if (!pageInfo) {
    return res.status(400).json({ error: "No page details provided." });
  }

  // Build OpenAI prompt
  const prompt = `
    Based on this web page info, suggest improvements for background/text color, button size, and font size. Be specific and actionable.
    Page info: ${JSON.stringify(pageInfo)}
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    const aiReply = response.data.choices[0].message.content;
    res.json({ suggestions: aiReply });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message); // More useful error log!
    res.status(500).json({ error: 'AI request failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`OpenAI backend running on port ${PORT}`);
});
