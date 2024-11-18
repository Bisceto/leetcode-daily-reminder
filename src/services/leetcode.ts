import { convert } from "html-to-text";
import { DailyChallenge, LeetCode, TopicTag } from "leetcode-query";
import { fmt, bold, spoiler, link } from "telegraf/format";
import { setCache, getCache } from "../utils/cache";
import { calculateSecondsUntilMidnightUTC } from "../utils/helpers";
import { openai } from "../config/connection";

const leetcode = new LeetCode();

const formatContentOptions = {
  wordwrap: null,
  encodeCharacters: {
    "<=": "&lt;",
    ">=": "&gt;",
  },
};

// Retrieves daily challenge data and caches it.
export async function getDailyChallenge() {
  let challenge = await leetcode.daily();
  const formattedContent = convert(
    challenge.question.content,
    formatContentOptions
  );
  if (process.env.NODE_ENV === "production") {
    const summarisedContent = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in data structures and algorithms. You will only receive problem statements. You are tasked to summarise any problems you receive into an easy-to-understand paragraph.",
        },
        {
          role: "user",
          content: formattedContent,
        },
      ],
    });
    let generatedText =
      summarisedContent.choices[0].message.content ||
      challenge.question.content;
    challenge["question"]["content"] = generatedText;
  }

  setCache("dailyChallenge", challenge, calculateSecondsUntilMidnightUTC());
  return challenge;
}

export async function getChallengeInformation() {
  // Try to get the challenge from the cache
  let challenge = getCache<DailyChallenge>("dailyChallenge");

  if (!challenge) {
    // If the challenge is not in the cache or has expired, fetch it from the API
    challenge = await getDailyChallenge();
    setCache("dailyChallenge", challenge, calculateSecondsUntilMidnightUTC());
  }

  const date = new Date(challenge.date).toLocaleDateString();
  const title = `${challenge.question.title}`;
  const url = `https://leetcode.com${challenge.link}`;
  const difficulty = challenge.question.difficulty;
  const content = convert(challenge.question.content, formatContentOptions);
  const topics = challenge.question.topicTags.map(
    (topicTag: TopicTag) => topicTag.name
  );
  const message = fmt`
  ${bold`LeetCode Daily Challenge for ${date}.`}
  \nTitle: ${link(title, url)}
  \nDifficulty: ${difficulty}
  \n${content}
  \nTopics: ${spoiler`${topics.join(", ")}`}
  `;

  return message;
}
