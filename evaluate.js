
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing text input' });
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Evaluate the following French student writing and assign it to one ACTFL level: Novice Low, Novice Mid, Novice High, Intermediate Low, Intermediate Mid, Intermediate High, Advanced Low, Advanced Mid, Advanced High, Superior, or Distinguished. Explain briefly.

Text:
${text}`,
      max_tokens: 200,
    });

    const output = completion.data.choices[0].text.trim();
    res.status(200).json({ proficiency: output });
  } catch (err) {
    res.status(500).json({ error: 'OpenAI error', details: err.message });
  }
};
