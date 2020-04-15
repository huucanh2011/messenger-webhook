import { callerAPI } from "./callerApi";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  callerAPI(url, "POST", request_body);
};
