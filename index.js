"use strict";
// Imports dependencies and set up http server
const express = require("express"),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json()); // creates express http server

//handles
const handleMessage = require("./handles/handleMessage");
const handlePostback = require("./handles/handlePostback");

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

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

      // Handle event message - don't use
      // if (webhook_event.message) {
      //   handleMessage.handle(sender_psid, webhook_event.message);
      // }
      if (webhook_event.postback) {
        handlePostback.handle(sender_psid, webhook_event.postback);
      }
    });
    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});
