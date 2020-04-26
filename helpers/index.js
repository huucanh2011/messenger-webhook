const axios = require("axios");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const pageUrl = process.env.PAGE_URL;

const callerAPI = async (url, method = "GET", data = {}) => {
  return new Promise((reslove, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      responseType: "json",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        reslove(res);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

const callSendAPI = (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  axios.post(url, request_body);
};

const fetchGeneric = (data = []) => {
  let output = [];
  let len = data.length;

  for (let i = 0; i < len; i++) {
    output.push({
      title: data[i].name,
      subtitle: data[i].to_place_name + " | " + data[i].number_days + " ngày | " + data[i].price_default + " VND",
      image_url: data[i].image,
      buttons: [
        {
          type: "web_url",
          url: `${pageUrl}/tour/${data[i].slug}`,
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
};

module.exports = { callerAPI, callSendAPI, fetchGeneric };
