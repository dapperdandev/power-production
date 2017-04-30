(function ($) {
  var data;
  var vendorAnnualTotal;
  var spreadsheetId = "11SfUjhoXnDKTjXofiA3EWtT2sorrIdK8ZZxvGnumRQM";
  var sheetNum = 1;
  var imageFolder = "assets/img/";
  var i = 0;

  $.ajax({
    dataType: "json",
    type: "GET",
    url: "https://spreadsheets.google.com/feeds/list/" + spreadsheetId + "/" + sheetNum + "/public/values?alt=json",
    success: function (response) {
      data = response.feed.entry;
      vendorAnnualTotal = data.reduce(function(acc, val){
        return Math.ceil(
          Number(acc) + Number(val["gsx$day"]["$t"])
          );
      }, 0) * 365;

      updateData(i);

      setInterval(function () {
        i === data.length - 1 ? i = 0 : i++;
        updateData(i);
      }, 3000);
    }
  });

  var quarterlySeasonalAdjustment = function () {
    var adjustment;
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var d = new Date();
    var currentMonth = monthNames[d.getMonth()];

    switch (currentMonth) {
      case "January":
      case "February":
      case "March":
        adjustment = 0.76;
        break;
      case "April":
      case "May":
      case "June":
        adjustment = 1.26;
        break;
      case "July":
      case "August":
      case "September":
        adjustment = 1.25;
        break;
      case "October":
      case "November":
      case "December":
        adjustment = 0.7;
        break;
      default:
        adjustment = 1;
    }

    return adjustment;
  };

  function updateData(i) {
    var iceaMember = iceaMember = data[i]["gsx$iceamember"]["$t"];
    var day = (Number(data[i]["gsx$day"]["$t"]).toFixed(2));
    var qsaDay = day * quarterlySeasonalAdjustment();
    var nameplateCapacity = data[i]["gsx$nameplatecapacity"]["$t"];
    var capacityFactor = data[i]["gsx$capacityfactor"]["$t"];
    var memberLogo = data[i]["gsx$memberlogo"]["$t"]; // To be removed when implemented (use wordpress media)

    var month = Math.ceil(qsaDay * 30);
    var year = Math.ceil(day * 365);
    var homes = Math.ceil(year / 12);
    var carbon = Math.ceil(year * 2100);

    var homesTotal = Math.ceil(vendorAnnualTotal / 12);
    var carbonTotal = Math.ceil(vendorAnnualTotal * 2100);

    $('#member-logo').attr('src', imageFolder + memberLogo);
    $('#icea-member').text(iceaMember);
    $('#icea-day').text(qsaDay.toLocaleString());
    $('#icea-month').text(month.toLocaleString());
    $('#icea-year').text(year.toLocaleString());
    $('#homes').text(homes.toLocaleString());
    $('#carbon').text(carbon.toLocaleString());
    $('#carbon-total').text(carbonTotal.toLocaleString());
    $('#homes-total').text(homesTotal.toLocaleString());
  }

})(jQuery);