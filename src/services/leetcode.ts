import { convert } from "html-to-text";
import { DailyChallenge, LeetCode, TopicTag } from "leetcode-query";
import { fmt, bold, spoiler, underline } from "telegraf/format";
import { setCache, getCache } from "../utils/cache";
import { calculateSecondsUntilMidnightUTC } from "../utils/helpers";

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
  const challenge = await leetcode.daily();
  setCache("dailyChallenge", challenge, calculateSecondsUntilMidnightUTC());
  return challenge;
}

export async function getChallengeInformation() {
  // Try to get the challenge from the cache
  let challenge = getCache<DailyChallenge>("dailyChallenge");

  if (challenge) {
    console.log("fetched from cache!");
  } else {
    // If the challenge is not in the cache or has expired, fetch it from the API
    challenge = await leetcode.daily();
    setCache("dailyChallenge", challenge, calculateSecondsUntilMidnightUTC());
  }

  const date = new Date(challenge.date).toLocaleDateString();
  const title = challenge.question.title;
  const difficulty = challenge.question.difficulty;
  const content = convert(challenge.question.content, formatContentOptions);
  const topics = challenge.question.topicTags.map(
    (topicTag: TopicTag) => topicTag.name
  );
  const message = fmt`
  LeetCode Daily Challenge for ${date}!
  \nTitle: ${underline`${bold`${title}`}`}
  \nDifficulty: ${difficulty}
  \n${content}
  \nTopics: ${spoiler`${topics.join(", ")}`}
  `;

  return message;
}
