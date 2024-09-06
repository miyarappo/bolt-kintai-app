const { App } = require("@slack/bolt");
const config = require("./config");
const homeTabHandler = require("./handlers/homeTab");

const app = new App(config.slackConfig);

app.event("app_home_opened", homeTabHandler);

app.action(
  "start_work_at_office_action",
  async ({ body, ack, client, logger }) => {
    await ack();

    try {
      const channelId = "C032W9QNRAP";

      const threadTs = "1725616398.091779";

      const now = new Date();
      const days = ["日", "月", "火", "水", "木", "金", "土"];
      const formattedDate = `${now.getFullYear()}/${
        now.getMonth() + 1
      }/${now.getDate()}(${days[now.getDay()]}) ${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

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

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
