async function homeTabHandler({ event, client, logger }) {
  try {
    const result = await client.views.publish({
      user_id: event.user,
      view: {
        type: "home",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "*👋ようこそ！<@" +
                event.user +
                ">*\n\nこのSlackアプリでは以下のことが行えます。\n1. #attendance の通知\n2. 自身の勤怠統計の確認&アラート\n3. 勤怠webへの自動連携",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*出勤*",
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "🏢 オフィス出勤",
                },
                value: "click_me_123",
                action_id: "start_work_at_office_action",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "🏠 リモート出勤",
                },
                value: "click_me_123",
                action_id: "start_work_at_home_action",
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*休憩*",
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "🔜 休憩入り",
                },
                value: "click_me_123",
                action_id: "start_break_action",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "🔙 休憩戻り",
                },
                value: "click_me_123",
                action_id: "end_break_action",
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*退勤*",
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "🍻 退勤",
                },
                value: "click_me_123",
                action_id: "end_work_action",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*本日の勤怠*\n\n出勤: 09:55\n休憩入り: 13:00\n休憩戻り: 13:55",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*今月の勤怠*\n\n実働: 80:05 / 基準: 160:00",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*あなたの傾向*\n\n一日あたりの平均実働: 08:23\n直近5日間の平均実働: 09:45",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "いつもと比べて稼働時間が増加しています。体調には気をつけてください😌",
            },
          },
        ],
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = { homeTabHandler };
