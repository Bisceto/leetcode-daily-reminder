import { convert } from "html-to-text";
import { LeetCode } from "leetcode-query";
import { setCache } from "../utils/cache";
import { calculateSecondsUntilMidnightUTC } from "../utils/helpers";
import { openai } from "../config/connection";

const leetcode = new LeetCode();

const formatContentOptions = {
  wordwrap: null,
};

const openaiSystemPrompt =
  "You are an expert in data structures and algorithms. You will only receive problem statements. You are tasked to summarise any problems you receive into an easy-to-understand paragraph. Ensure that there are no unnecessary special characters in your answer. You can give a brief description of the example but keep it simple.";
// Retrieves daily challenge data and caches it.
export async function getDailyChallenge() {
  let challenge = await leetcode.daily();
  const formattedContent = convert(
    challenge.question.content,
    formatContentOptions
  );
  let generatedText = undefined;
  if (process.env.NODE_ENV === "production") {
    const summarisedContent = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: openaiSystemPrompt,
        },
        {
          role: "user",
          content: formattedContent,
        },
      ],
    });
    generatedText = summarisedContent.choices[0].message.content;
  }
  challenge["question"]["content"] = generatedText || formattedContent;

  setCache("dailyChallenge", challenge, calculateSecondsUntilMidnightUTC());
  return challenge;
}
