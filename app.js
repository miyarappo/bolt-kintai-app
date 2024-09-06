const { App } = require("@slack/bolt");
const config = require("./config");
const homeTabHandler = require("./handlers/homeTabHandler");
const formatDate = require("./utils/dateFormatter");

const app = new App(config.slackConfig);

const channelId = "C032W9QNRAP";
const threadTs = "1725616398.091779";

app.event("app_home_opened", homeTabHandler);

app.action(
  "start_work_at_office_action",
  async ({ body, ack, client, logger }) => {
    await ack();

    try {
      const formattedDate = formatDate();

      const result = await client.chat.postMessage({
        channel: channelId,
        thread_ts: threadTs,
        text: `<@${body.user.id}> がオフィスに出勤しました。(${formattedDate})`,
      });

      logger.info(result);
    } catch (error) {
      logger.error(error);
    }
  }
);

app.action(
  "start_work_at_home_action",
  async ({ body, ack, client, logger }) => {
    await ack();

    try {
      const formattedDate = formatDate();

      const result = await client.chat.postMessage({
        channel: channelId,
        thread_ts: threadTs,
        text: `<@${body.user.id}> がリモートで出勤しました。(${formattedDate})`,
      });

      logger.info(result);
    } catch (error) {
      logger.error(error);
    }
  }
);

app.action("start_break_action", async ({ body, ack, client, logger }) => {
  await ack();

  try {
    const formattedDate = formatDate();

    const result = await client.chat.postMessage({
      channel: channelId,
      thread_ts: threadTs,
      text: `<@${body.user.id}> が休憩に入りました。(${formattedDate})`,
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

app.action("end_break_action", async ({ body, ack, client, logger }) => {
  await ack();

  try {
    const formattedDate = formatDate();

    const result = await client.chat.postMessage({
      channel: channelId,
      thread_ts: threadTs,
      text: `<@${body.user.id}> が休憩から戻りました。(${formattedDate})`,
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

app.action("end_work_action", async ({ body, ack, client, logger }) => {
  await ack();

  try {
    const formattedDate = formatDate();

    const result = await client.chat.postMessage({
      channel: channelId,
      thread_ts: threadTs,
      text: `<@${body.user.id}> が退勤しました。(${formattedDate})`,
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
