$(function () {
  let getAuth = async () => {
    let token = `264c77f740cc1f02cac8f0a7e30ccdcd2f20dcf5`;
    let auth = "";

    let url = "https://api.arenaracingcompany.co.uk/auth";
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
    let body = {};
    return (authKey = await fetch(url, {
      method: "POST",
      headers: headers,
      body: {},
    })
      .then((response) => {
        //   console.log(response);
        return response.text();
      })
      .then((key) => {
        return key;
      })
      .catch((err) => {
        console.log("error:", err);
      }));
  };

  const getData = (token, searchMonth) => {
    let monthNumber = Number(searchMonth) || 1;
    let url = `https://api.arenaracingcompany.co.uk/event/month/1318/${monthNumber}`;
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
    return fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (response.status === "401") {
          getAuth();
        }
        return response.text();
      })
      .then((data) => {
        return JSON.parse(data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };

  const getAll = async (searchMonth) => {
    let key = await getAuth();
    let data = await getData(key, searchMonth);

    getRenderCard(data);
  };

  const getRwdImg = (img) => {
    let windowWidth = $(window).innerWidth();
    let windowHeight = $(window).innerHeight();
    if (windowWidth > 1366) {
      return img.desktop;
    } else if (windowWidth < 768) {
      return img.mobile;
    } else if (windowWidth < windowHeight) {
      // Landscape
      return img.tablet_land;
    } else if (windowWidth > windowHeight) {
      return img.tablet_port;
    } else {
      return undefined;
    }
  };
  const getRenderCard = async (data) => {
    let cardWrapper = $("#card-wrapper");
    console.log("資料", data);
    cardWrapper.empty();

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        // console.log(description, "description");
        var encodedStr = data[i].description;
        var decoded = $("<div/>").html(encodedStr).text();
        var rwdImg = getRwdImg(data[i].images);
        cardWrapper.append(`<div class="card"><div class='title'>${
          data[i].title
        }</div>
        <div class="img">${
          rwdImg ? `<img src="${rwdImg}"/>` : `<div class="errorImg"></div>`
        } </div>
        <div class="time">${data[i].date.slice(0, 10)}</div>
        <div class='description'>${decoded}</div></div>`);
      }
    } else {
      cardWrapper.append(
        `<div class="notice"> There is no event this month</div>`
      );
    }
  };

  const searchFliter = () => {
    let text = document.getElementById("mothText");
    let searchMonth = text.value;
    if (
      isNaN(searchMonth) ||
      Number(searchMonth) > 12 ||
      Number(searchMonth) < 1
    ) {
      alert("Please Input Month's Number");
    } else {
      let month = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      $(".bigTitle").html(`<h1>${month[searchMonth - 1]} EVENT LIST</h1>`);
      getAll(searchMonth);
    }
  };

  $("#search").on("click", searchFliter);
});
