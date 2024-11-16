import { convert } from "html-to-text";
import { LeetCode, TopicTag } from "leetcode-query";
import { fmt, bold, italic, spoiler, underline } from "telegraf/format";

const leetcode = new LeetCode();

const formatContentOptions = {
  wordwrap: null,
  encodeCharacters: {
    "<=": "&lt;",
    ">=": "&gt;",
  },
};

function formatChallengeMessage(challenge: {
  date: string;
  title: string;
  difficulty: string;
  content: string;
  topics: string[];
}) {
  const { date, title, difficulty, content, topics } = challenge;
  const message = fmt`
  LeetCode Daily Challenge for ${date}!
  \nTitle: ${underline`${bold`${title}`}`}
  \nDifficulty: ${difficulty}
  \n${content}
  \nTopics: ${spoiler`${topics.join(", ")}`}
  `;

  return message;
}
export async function getDailyChallenge() {
  const daily = await leetcode.daily();
  // console.log(JSON.stringify(daily, null, 2));
  const date = new Date(daily.date).toLocaleDateString();
  const title = daily.question.title;
  const difficulty = daily.question.difficulty;
  const content = convert(daily.question.content, formatContentOptions);
  const topics = daily.question.topicTags.map(
    (topicTag: TopicTag) => topicTag.name
  );
  const challenge = { date, title, difficulty, content, topics };

  return formatChallengeMessage(challenge);
}
