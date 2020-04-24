const axios = require("axios");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const pageUrl = process.env.PAGE_URL;

const callerAPI = (url, method = "GET", data = {}) => {
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

  callerAPI(url, "POST", request_body);
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

const slugString = str => {
  if (str == "" || str == undefined) {
    return str;
  }
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Combining Diacritical Marks
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â (ê), mũ ă, mũ ơ (ư)
  str = str.replace(/ /g, "-");
  str = str.replace(/%20/g, "-");
  str = str.trim().toLowerCase();
  // str = str.toLowerCase();
  return str;
};

module.exports = { callerAPI, callSendAPI, fetchGeneric, slugString };
