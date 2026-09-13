const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connection");
const { sendDailyReminderEmail } = require("./sendEmail");

// Schedule: "0 8 * * *" runs daily at 8:00 AM
// (Use "* * * * *" when testing every minute)
cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(
        pendingRequests
          .filter((request) => request.toUserId?.email)
          .map((request) => request.toUserId.email),
      ),
    ];

    console.log(
      `[Cron Job] Found ${listOfEmails.length} users with pending connection requests from yesterday.`,
    );

    for (const email of listOfEmails) {
      try {
        await sendDailyReminderEmail(email);
      } catch (error) {
        console.error(
          `[Cron Job] Failed to send reminder to ${email}:`,
          error.message,
        );
      }
    }
  } catch (error) {
    console.error("[Cron Job] Error executing scheduled reminder job:", error);
  }
});
