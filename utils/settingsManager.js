const fs = require("fs").promises;
const path = require("path");

const SETTINGS_FILE = path.join(__dirname, "../tmp/settings.json");

async function getSettings(userId) {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf8");
    const settings = JSON.parse(data);
    return settings[userId];
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function saveSettings(userId, settings) {
  try {
    let data = {};
    try {
      const fileContent = await fs.readFile(SETTINGS_FILE, "utf8");
      data = JSON.parse(fileContent);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    data[userId] = settings;
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
}

module.exports = { getSettings, saveSettings };
