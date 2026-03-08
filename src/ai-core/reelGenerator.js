import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateReel(topic) {

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You create short educational reels."
      },
      {
        role: "user",
        content: `Create a 60 second educational reel about ${topic}.

Return JSON format:

{
 "scenes":[
   {"visual":"...","narration":"..."},
   {"visual":"...","narration":"..."},
   {"visual":"...","narration":"..."}
 ]
}`
      }
    ]
  });

  return completion.choices[0].message.content;
}