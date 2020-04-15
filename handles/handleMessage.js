import helpers from "../helpers";

const handle = (sender_psid, received_message) => {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      text: `Message bạn vừa nhập: "${received_message.text}"`,
    };
  }

  // Send the response message
  helpers.callSendAPI(sender_psid, response);
};

module.exports = { handle };
