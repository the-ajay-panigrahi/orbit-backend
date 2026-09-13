const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (
  toAddress,
  fromAddress,
  subject,
  htmlBody,
  textBody,
) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data:
            htmlBody || "<p>You have a new connection request on Orbit.</p>",
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody || "You have a new connection request on Orbit.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject || "New Connection Request on Orbit",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (
  toAddress = "ajaybpanigrahi@gmail.com",
  subject,
  htmlBody,
  textBody,
) => {
  const fromAddress = process.env.SES_FROM_EMAIL || "no-reply@withorbit.tech";
  const sendEmailCommand = createSendEmailCommand(
    toAddress,
    fromAddress,
    subject,
    htmlBody,
    textBody,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

const sendConnectionRequestEmail = async (fromUser, toUser) => {
  try {
    const subject = `New Connection Request: ${fromUser.firstName} wants to connect on Orbit!`;
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">Orbit 🪐</span>
        </div>
        <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px;">
          ${fromUser.firstName} ${fromUser.lastName} wants to connect with you!
        </h2>
        <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
          Hi ${toUser.firstName},<br />
          <strong>${fromUser.firstName} ${fromUser.lastName}</strong> came across your profile and sent you a connection request on Orbit.
        </p>
        <div style="margin-bottom: 28px;">
          <a href="https://withorbit.tech/requests" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
            View Connection Request
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          You received this email because you have an account on <a href="https://withorbit.tech" style="color: #6b7280; text-decoration: underline;">Orbit</a>.
        </p>
      </div>
    `;
    const textBody = `Hi ${toUser.firstName},\n\n${fromUser.firstName} ${fromUser.lastName} sent you a connection request on Orbit.\n\nView it here: https://withorbit.tech/requests\n\n- Orbit Team`;

    const recipientEmail = toUser.email || "ajaybpanigrahi@gmail.com";
    const response = await run(recipientEmail, subject, htmlBody, textBody);
    console.log(
      "SES Email Sent Successfully:",
      response?.MessageId || response,
    );
    return response;
  } catch (emailErr) {
    console.error("SES Email Sending Error (non-blocking):", emailErr.message);
  }
};

module.exports = {
  run,
  sendConnectionRequestEmail,
};
