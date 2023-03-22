$(function () {
  let currentEventData = [];
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
    currentEventData = data;
    getRenderCard(data, searchMonth);
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

  const getRenderDialog = function () {
    const currentDialogItem = $(this).data("set");

    let currentEvent = currentEventData.find(
      (item) => new Date(item.date).getDate() === currentDialogItem
    );
    $(".dialog-body").empty();
    if (currentEvent) {
      $("html,body").css("overflow", "hidden");
      $(".dialog-bg").fadeIn();
      var encodedStr = currentEvent.description;
      var decoded = $("<div/>").html(encodedStr).text();
      currentEventHTML = ` <div class="card">

      <img src="${getRwdImg(currentEvent.images)}" class="card-img-top" alt="${
        currentEvent.title
      }">
      <div class="card-body">
        <h5 class="card-title">${currentEvent.title}</h5>
        <p class="date">${currentEvent.date.slice(0, 10)}</p>
        <p class="card-text">${decoded}</p>
      </div>
    </div>`;
      $(".dialog-body").append(currentEventHTML);
    } else {
      return false;
    }

    console.log("getRenderDialog", currentEvent);
  };

  const getRenderCard = async (data, searchMonth) => {
    console.log(searchMonth, data, "searchMonth");
    const getCurrentMonthDays = getCurrentMonth(searchMonth);
    $(".calendar").empty();
    for (let i = 0; i < getCurrentMonthDays; i++) {
      let currentEvent = data.find(
        (item) => new Date(item.date).getDate() === i + 1
      );
      let currentEventHTML = `<div></div>`;
      if (currentEvent) {
        var encodedStr = currentEvent.description;
        var decoded = $("<div/>").html(encodedStr).text();
        currentEventHTML = ` <div class="card dialogOpen" data-set="${i + 1}">
        
        <img src="${getRwdImg(
          currentEvent.images
        )}" class="card-img-top" alt="${currentEvent.title}">
        <div class="card-body">
          <h5 class="card-title">${currentEvent.title}</h5>
        </div>
      </div>`;
      }
      $(".calendar").append(`<div class='calendar-item'>
          <div class="calendar-title">${i + 1}</div>
          ${currentEventHTML}
        </div>`);
    }

    loadingStatus(false);
    $(".calendar").slideDown();
  };
  const loadingStatus = function (status) {
    if (status) {
      $(".loading").show();
    } else {
      $(".loading").hide();
    }
  };
  const searchFliter = function () {
    let text = document.getElementById("mothText");
    let currentMonthNumber = $(this).data("set") || 1;
    $(".mouthOption .searchButton")
      .removeClass("active")
      .eq(currentMonthNumber - 1)
      .addClass("active");
    let searchMonth = currentMonthNumber;
    loadingStatus(true);
    $(".calendar").slideUp();
    if (
      isNaN(searchMonth) ||
      Number(searchMonth) > 12 ||
      Number(searchMonth) < 1
    ) {
      alert("Please Input Month's Number");
    } else {
      $(".bigTitle").html(
        `<h1>2023 ARENA RACING ${month[searchMonth - 1]} EVENT</h1>`
      );

      getAll(searchMonth);
    }
  };
  const getRenderMonthButton = function () {
    for (let i = 0; i < month.length; i++) {
      $(".mouthOption").append(
        `<div class="searchButton" data-set="${i + 1}">${month[i]}</div>`
      );
    }
  };

  const getCurrentMonth = (searchMonth) => {
    function getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = searchMonth; // 👈️ months are 0-based

    // 👇️ Current Month
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    console.log(daysInCurrentMonth); // 👉️ 31
    return daysInCurrentMonth;
  };
  getRenderMonthButton();
  // addEventListner
  $(".calendar").on("click", ".dialogOpen", getRenderDialog);
  $(".mouthOption").on("click", ".searchButton", searchFliter);
  $(".close").on("click", function () {
    $(".dialog-bg").fadeOut();
    $("html,body").css("overflow", "auto");
  });

  $("#search").on("click", searchFliter);
  searchFliter();
});
