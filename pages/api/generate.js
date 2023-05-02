import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const { age, weight, height, gender, activityLevel } = req.body;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(age, weight, height, gender, activityLevel),
      temperature: 0.6,
      max_tokens: 500,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(age, weight, height, gender, activityLevel) {
  return `Generate a personalized diet plan for a person with the following details:
Age: ${age}
Weight: ${weight}
Height: ${height}
Gender: ${gender}
Activity Level: ${activityLevel}

Generate a 3-day diet plan in the following format with approximate calories inside:

Day 1:
Breakfast (200kcals):
Lunch (300kcals):
Dinner (600kcals):
Snacks (150kcals):

...and so on.

Diet Plan: `;
}
