import axios from "axios";

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

module.exports = { callerAPI };
