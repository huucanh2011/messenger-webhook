const apiUrl = process.env.PAGE_URL + "/api/v1";

const helpers = require("../helpers");

const handle = async (sender_psid, received_postback) => {
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
              title: "Tour mới nhất",
              payload: "get_tour_new_action",
            },
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

  // Get tour new
  if (payload === "get_tour_new_action") {
    const { data, status } = await helpers.callerAPI(`${apiUrl}/tours-new`);
    console.log(data);

    if (data && status === 200) {
      if (data.data.length > 0) {
        let elements = helpers.fetchGeneric(data.data);
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements,
            },
          },
        };
      } else {
        response = {
          text: "Không tìm thấy kết quả!",
        };
      }
    }
  }

  // Get tour featured
  if (payload === "get_tour_featured_action") {
    const { data, status } = await helpers.callerAPI(`${apiUrl}/tours-featured`);
    if (data && status === 200) {
      if (data.data.length > 0) {
        let elements = helpers.fetchGeneric(data.data);
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements,
            },
          },
        };
      } else {
        response = {
          text: "Không tìm thấy kết quả!",
        };
      }
    }
  }

  //Search tour
  if (payload === "search_tour_action") {
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Bạn tìm theo tiêu chí nào ạ?",
          buttons: [
            {
              type: "postback",
              title: "Địa điểm đến",
              payload: "search_tour_to_place_action",
            },
            {
              type: "postback",
              title: "Giá tiền",
              payload: "search_tour_price_action",
            },
          ],
        },
      },
    };
  }

  //search tour price action
  if (payload === "search_tour_price_action") {
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Giá tiền trở xuống",
          buttons: [
            {
              type: "postback",
              title: "1.000.000 VND/người",
              payload: "search_tour_1m_action",
            },
            {
              type: "postback",
              title: "3.000.000 VND/người",
              payload: "search_tour_3m_action",
            },
            {
              type: "postback",
              title: "5.000.000 VND/người",
              payload: "search_tour_5m_action",
            },
          ],
        },
      },
    };
  }

  //search tour 1m action
  if (payload === "search_tour_1m_action") {
    const minPrice = 0;
    const maxPrice = 1000000;
    const url = `${apiUrl}/chatbot/getTourByPrice?minPrice=${minPrice}&maxPrice=${maxPrice}`;
    const { data, status } = await helpers.callerAPI(url);
    if (data && status === 200) {
      if (data.data.length > 0) {
        let elements = helpers.fetchGeneric(data.data);
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements,
            },
          },
        };
      } else {
        response = {
          text: "Không tìm thấy kết quả!",
        };
      }
    }
  }

  //search tour 3m action
  if (payload === "search_tour_3m_action") {
    const minPrice = 1000000;
    const maxPrice = 3000000;
    const url = `${apiUrl}/chatbot/getTourByPrice?minPrice=${minPrice}&maxPrice=${maxPrice}`;
    const { data, status } = await helpers.callerAPI(url);
    if (data && status === 200) {
      if (data.data.length > 0) {
        let elements = helpers.fetchGeneric(data.data);
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements,
            },
          },
        };
      } else {
        response = {
          text: "Không tìm thấy kết quả!",
        };
      }
    }
  }

  //search tour 5m action
  if (payload === "search_tour_5m_action") {
    const minPrice = 3000000;
    const maxPrice = 5000000;
    const url = `${apiUrl}/chatbot/getTourByPrice?minPrice=${minPrice}&maxPrice=${maxPrice}`;
    const { data, status } = await helpers.callerAPI(url);
    if (data && status === 200) {
      if (data.data.length > 0) {
        let elements = helpers.fetchGeneric(data.data);
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements,
            },
          },
        };
      } else {
        response = {
          text: "Không tìm thấy kết quả!",
        };
      }
    }
  }

  // search tour to_place action
  if (payload === "search_tour_to_place_action") {
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Bạn đến địa điểm nào ạ?",
          buttons: [
            {
              type: "postback",
              title: "Ninh Bình",
              payload: "search_tour_to_place_nb_action",
            },
            {
              type: "postback",
              title: "Đà Nẵng",
              payload: "search_tour_to_place_dn_action",
            },
            {
              type: "postback",
              title: "Nha Trang",
              payload: "search_tour_to_place_nt_action",
            },
          ],
        },
      },
    };
  }

  // search_tour_to_place_nb_action
  if (payload === "search_tour_to_place_nb_action") {
    let toPlace = "04";
    const url = `${apiUrl}/chatbot/getTourByDestination?toPlace=${toPlace}`;
    const { data, status } = await helpers.callerAPI(url);
    if (data && status === 200) {
      if (data.data.length > 0) {
        let elements = helpers.fetchGeneric(data.data);
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements,
            },
          },
        };
      } else {
        response = {
          text: "Không tìm thấy kết quả!",
        };
      }
    }
  }

  // search_tour_to_place_dn_action
  if (payload === "search_tour_to_place_dn_action") {
    let toPlace = "07";
    const url = `${apiUrl}/chatbot/getTourByDestination?toPlace=${toPlace}`;
    const { data, status } = await helpers.callerAPI(url);
    if (data && status === 200) {
      if (data.data.length > 0) {
        let elements = helpers.fetchGeneric(data.data);
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements,
            },
          },
        };
      } else {
        response = {
          text: "Không tìm thấy kết quả!",
        };
      }
    }
  }

  // search_tour_to_place_nt_action
  if (payload === "search_tour_to_place_nt_action") {
    let toPlace = "13";
    const url = `${apiUrl}/chatbot/getTourByDestination?toPlace=${toPlace}`;
    const { data, status } = await helpers.callerAPI(url);
    if (data && status === 200) {
      if (data.data.length > 0) {
        let elements = helpers.fetchGeneric(data.data);
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements,
            },
          },
        };
      } else {
        response = {
          text: "Không tìm thấy kết quả!",
        };
      }
    }
  }

  // Send the message to acknowledge the postback
  helpers.callSendAPI(sender_psid, response);
};

module.exports = { handle };
