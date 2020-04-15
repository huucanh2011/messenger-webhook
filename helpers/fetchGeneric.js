const apiUrl = process.env.API_URL;

module.exports = function fetchGeneric(data = []) {
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
          url: `${apiUrl}/tour/${data[i].slug}`,
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
