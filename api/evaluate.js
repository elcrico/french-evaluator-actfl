const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing text input" });
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Evaluate the French proficiency level of this student writing according to ACTFL scale:\n\n${text}\n\nRespond only with the ACTFL level (Novice Low, Novice Mid, Intermediate Mid, Advanced Low, etc.)`,
      max_tokens: 50,
    });

    const proficiency = response.data.choices[0].text.trim();
    res.status(200).json({ proficiency });
  } catch (err) {
    res.status(500).json({ error: "Failed to connect to OpenAI" });
  }
};
