const { App } = require("@slack/bolt");
const config = require("./config");
const homeTabHandler = require("./handlers/homeTabHandler");
const formatDate = require("./utils/dateFormatter");
const { getSettings, saveSettings } = require("./utils/settingsManager");
const {
  getWorkRecord,
  updateWorkRecord,
} = require("./utils/workRecordManager");

const app = new App(config.slackConfig);

app.event("app_home_opened", homeTabHandler);

async function getUserSettings(userId) {
  const settings = await getSettings(userId);
  if (!settings) {
    throw new Error("User settings not found");
  }
  return settings;
}

app.action(
  "start_work_at_office_action",
  async ({ body, ack, client, logger }) => {
    await ack();

    try {
      const settings = await getUserSettings(body.user.id);
      const currentTime = new Date();
      const today = currentTime.toISOString().split("T")[0];

      let workRecord = await getWorkRecord(body.user.id, today);
      if (!workRecord) {
        workRecord = {
          userId: body.user.id,
          date: today,
          actions: [],
        };
      }

      workRecord.actions.push({
        type: "start_work_at_office",
        label: "出勤",
        timestamp: currentTime.toISOString(),
      });

      await updateWorkRecord(body.user.id, today, workRecord);

      const result = await client.chat.postMessage({
        channel: settings?.channelId,
        thread_ts: settings?.threadTs,
        text: `<@${body.user.id}> がオフィスに出勤しました。(${formatDate()})`,
      });

      logger.info(result);
    } catch (error) {
      logger.error(error);
      await client.chat.postEphemeral({
        channel: body.user.id,
        user: body.user.id,
        text: "設定が見つかりません。投稿先の設定を行ってください。",
      });
    }
  }
);

app.action(
  "start_work_at_home_action",
  async ({ body, ack, client, logger }) => {
    await ack();

    try {
      const settings = await getUserSettings(body.user.id);
      const currentTime = new Date();
      const today = currentTime.toISOString().split("T")[0];

      let workRecord = await getWorkRecord(body.user.id, today);
      if (!workRecord) {
        workRecord = {
          userId: body.user.id,
          date: today,
          actions: [],
        };
      }

      workRecord.actions.push({
        type: "start_work_at_home",
        label: "出勤",
        timestamp: currentTime.toISOString(),
      });

      await updateWorkRecord(body.user.id, today, workRecord);

      const result = await client.chat.postMessage({
        channel: settings?.channelId,
        thread_ts: settings?.threadTs,
        text: `<@${body.user.id}> がリモートで出勤しました。(${formatDate()})`,
      });

      logger.info(result);
    } catch (error) {
      logger.error(error);
      await client.chat.postEphemeral({
        channel: body.user.id,
        user: body.user.id,
        text: "設定が見つかりません。投稿先の設定を行ってください。",
      });
    }
  }
);

app.action("start_break_action", async ({ body, ack, client, logger }) => {
  await ack();

  try {
    const settings = await getUserSettings(body.user.id);
    const currentTime = new Date();
    const today = currentTime.toISOString().split("T")[0];

    let workRecord = await getWorkRecord(body.user.id, today);
    if (!workRecord) {
      workRecord = {
        userId: body.user.id,
        date: today,
        actions: [],
      };
    }

    workRecord.actions.push({
      type: "start_break",
      label: "休憩入り",
      timestamp: currentTime.toISOString(),
    });

    await updateWorkRecord(body.user.id, today, workRecord);

    const result = await client.chat.postMessage({
      channel: settings?.channelId,
      thread_ts: settings?.threadTs,
      text: `<@${body.user.id}> が休憩に入りました。(${formatDate()})`,
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
    await client.chat.postEphemeral({
      channel: body.user.id,
      user: body.user.id,
      text: "設定が見つかりません。投稿先の設定を行ってください。",
    });
  }
});

app.action("end_break_action", async ({ body, ack, client, logger }) => {
  await ack();

  try {
    const settings = await getUserSettings(body.user.id);
    const currentTime = new Date();
    const today = currentTime.toISOString().split("T")[0];

    let workRecord = await getWorkRecord(body.user.id, today);
    if (!workRecord) {
      workRecord = {
        userId: body.user.id,
        date: today,
        actions: [],
      };
    }

    workRecord.actions.push({
      type: "end_break",
      label: "休憩戻り",
      timestamp: currentTime.toISOString(),
    });

    await updateWorkRecord(body.user.id, today, workRecord);

    const result = await client.chat.postMessage({
      channel: settings?.channelId,
      thread_ts: settings?.threadTs,
      text: `<@${body.user.id}> が休憩から戻りました。(${formatDate()})`,
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
    await client.chat.postEphemeral({
      channel: body.user.id,
      user: body.user.id,
      text: "設定が見つかりません。投稿先の設定を行ってください。",
    });
  }
});

app.action("end_work_action", async ({ body, ack, client, logger }) => {
  await ack();

  try {
    const settings = await getUserSettings(body.user.id);
    const currentTime = new Date();
    const today = currentTime.toISOString().split("T")[0];

    let workRecord = await getWorkRecord(body.user.id, today);
    if (!workRecord) {
      workRecord = {
        userId: body.user.id,
        date: today,
        actions: [],
      };
    }

    workRecord.actions.push({
      type: "end_work",
      label: "退勤",
      timestamp: currentTime.toISOString(),
    });

    await updateWorkRecord(body.user.id, today, workRecord);

    const result = await client.chat.postMessage({
      channel: settings?.channelId,
      thread_ts: settings?.threadTs,
      text: `<@${body.user.id}> が退勤しました。(${formatDate()})`,
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

app.action(
  "open_post_settings_modal",
  async ({ body, ack, client, logger }) => {
    await ack();

    try {
      const settings = await getUserSettings(body.user.id);

      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          callback_id: "post_settings_modal",
          title: {
            type: "plain_text",
            text: "投稿先の設定",
          },
          blocks: [
            {
              type: "input",
              block_id: "channel_input",
              label: {
                type: "plain_text",
                text: "投稿先チャンネル",
              },
              element: {
                type: "channels_select",
                placeholder: {
                  type: "plain_text",
                  text: "チャンネルを選択",
                },
                action_id: "channel_select",
                initial_channel: settings?.channelId,
              },
            },
            {
              type: "input",
              block_id: "thread_input",
              label: {
                type: "plain_text",
                text: "スレッドURL",
              },
              element: {
                type: "plain_text_input",
                action_id: "thread_ts_input",
                initial_value: settings?.threadUrl,
              },
            },
          ],
          submit: {
            type: "plain_text",
            text: "保存",
          },
        },
      });
    } catch (error) {
      logger.error(error);
    }
  }
);

app.view("post_settings_modal", async ({ ack, body, view, client, logger }) => {
  await ack();

  const userId = body.user.id;
  const channelId =
    view.state.values.channel_input.channel_select.selected_channel;
  const threadUrl = view.state.values.thread_input.thread_ts_input.value;

  try {
    const channelInfo = await client.conversations.info({ channel: channelId });
    const channelName = channelInfo.channel.name;

    const threadTs = threadUrl
      .split("/p")
      .pop()
      .replace(/(\d{10})(\d{6})/, "$1.$2");

    const settings = {
      channelId,
      channelName,
      threadUrl,
      threadTs,
    };

    await saveSettings(userId, settings);

    await client.chat.postEphemeral({
      channel: userId,
      user: userId,
      text: `設定が保存されました。\nチャンネル: #${channelName}\nスレッドURL: ${threadUrl}`,
    });
  } catch (error) {
    logger.error(error);
    await client.chat.postEphemeral({
      channel: userId,
      user: userId,
      text: "設定の保存中にエラーが発生しました。",
    });
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
