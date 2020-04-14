"use strict";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const axios = require("axios"),
  express = require("express"),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender ID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint
app.get("/webhook", (req, res) => {
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "verify_token_bot_canh";

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
    };
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Tour hội an...",
              subtitle: "Giá...",
              image_url: "https://www.saigontourist.net/uploads/destination/TrongNuoc/Nhatrang/beach-Bai-Dai_111948560.jpg",
              default_action: {
                type: "web_url",
                url: "https://travel-bot-dtu.herokuapp.com/tours",
                webview_height_ratio: "tall",
              },
              buttons: [
                {
                  type: "web_url",
                  url: "https://travel-bot-dtu.herokuapp.com/",
                  title: "Xem chi tiết",
                },
                {
                  type: "postback",
                  title: "Chat ngay",
                  payload: "DEVELOPER_DEFINED_PAYLOAD",
                },
              ],
            },
          ],
        },
      },
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

async function handlePostback(sender_psid, received_postback) {
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  // Get started
  if (payload === "get_started_action") {
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "TravelBot xin chào bạn. Bạn cần gì?",
          buttons: [
            {
              type: "postback",
              title: "Tour nổi bật",
              payload: "get_tour_featured_action",
            },
            {
              type: "postback",
              title: "Tìm kiếm tour",
              payload: "search_tour_action",
            },
          ],
        },
      },
    };
  }

  // Get tour featured
  if (payload === "get_tour_featured_action") {
    const { data, status } = await callerAPI("https://travel-bot-dtu.herokuapp.com/api/v1/tours-featured");
    console.log(data.data, status);

    if (data && status === 200) {
      let el = fetchGenericTour(data.data);
      response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: el,
          },
        },
      };
    }
  }

  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function fetchGenericTour(data = []) {
  let output = [];
  let len = data.length;

  for (let i = 0; i < len; i++) {
    output.push({
      title: data[i].name,
      subtitle: data[i].price_defautl,
      image_url: data[i].image,
      buttons: [
        {
          type: "web_url",
          url: `https://travel-bot-dtu.herokuapp.com/tour/${data[i].slug}`,
          title: "Xem chi tiết",
        },
        {
          type: "postback",
          title: "Tìm kiếm khác",
          payload: "search_tour_action",
        },
      ],
    });
  }

  return output;
}

function callSendAPI(sender_psid, response) {
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
}

function callerAPI(url, method = "GET", data = {}) {
  return new Promise((reslove, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      responseType: "json",
    })
      .then((res) => {
        console.log("Call api success");
        reslove(res);
      })
      .catch((err) => {
        console.error("Error:" + err);
        reject(err);
      });
  });
}
