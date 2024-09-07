const fs = require("fs").promises;
const path = require("path");

const WORK_RECORDS_FILE = path.join(__dirname, "../tmp/work_records.json");

async function getWorkRecord(userId, date) {
  try {
    const data = await fs.readFile(WORK_RECORDS_FILE, "utf8");
    const records = JSON.parse(data);
    return records[`${userId}:${date}`] || null;
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function updateWorkRecord(userId, date, workRecord) {
  try {
    let records = {};
    try {
      const fileContent = await fs.readFile(WORK_RECORDS_FILE, "utf8");
      records = JSON.parse(fileContent);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    records[`${userId}:${date}`] = workRecord;
    await fs.writeFile(WORK_RECORDS_FILE, JSON.stringify(records, null, 2));
  } catch (error) {
    console.error("Error saving work record:", error);
    throw error;
  }
}

module.exports = { getWorkRecord, updateWorkRecord };
