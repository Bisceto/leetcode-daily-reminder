import { Context, Markup, Telegraf } from "telegraf";
import { getDailyChallenge } from "../../services/leetcode";
import { getCache, setCache } from "../../utils/cache";
import { DailyChallenge, TopicTag } from "leetcode-query";
import { calculateSecondsUntilMidnightUTC } from "../../utils/helpers";
import { bold, fmt, link, spoiler } from "telegraf/format";

export async function dailyCommand(bot: Telegraf) {
  let challenge = getCache<DailyChallenge>("dailyChallenge");
  if (!challenge) {
    // If the challenge is not in the cache or has expired, fetch it from the API
    challenge = await getDailyChallenge();
    setCache("dailyChallenge", challenge, calculateSecondsUntilMidnightUTC());
  }
  async function getChallengeInformation(
    ctx: Context,
    challenge: DailyChallenge
  ) {
    // Try to get the challenge object from the cache

    const date = new Date(challenge.date).toLocaleDateString();
    const title = `${challenge.question.title}`;
    const url = `https://leetcode.com${challenge.link}`;
    const content = challenge.question.content;
    const hints = challenge.question.hints;
    const topics = challenge.question.topicTags.map(
      (topicTag: TopicTag) => topicTag.name
    );

    const buttons = [];

    // Add a button for each hint in the hints array
    if (hints && hints.length > 0) {
      hints.forEach((_, index) => {
        buttons.push(
          Markup.button.callback(`Hint ${index + 1}`, `hint_${index + 1}`)
        );
      });
    }
    buttons.push(Markup.button.callback("Difficulty", "difficulty"));

    // Create the inline keyboard
    const keyboard = Markup.inlineKeyboard(buttons);

    const message = fmt`
  ${bold`LeetCode Daily Challenge for ${date}.`}
  \nTitle: ${link(title, url)}
  \n${content}
  \nTopics: ${spoiler`${topics.join(", ")}`}
  `;

    await ctx.reply(message, keyboard);
  }

  bot.command("daily", (ctx) => getChallengeInformation(ctx, challenge));

  // Handle "Hint" button callbacks
  challenge.question.hints.forEach((hint, index) => {
    bot.action(`hint_${index + 1}`, (ctx) => {
      ctx.reply(`Hint ${index + 1}: ${hint}`);
      ctx.answerCbQuery(); // Acknowledge the button click
    });
  });

  bot.action("difficulty", (ctx) => {
    ctx.reply(
      `Today's Daily Challenge difficulty is ${challenge.question.difficulty}`
    );
    ctx.answerCbQuery(); // Acknowledge the button click
  });
}
