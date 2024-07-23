$(document).ready(function () {
  var data = $("#interpellationChart").data("interpellations");
  //   data = JSON.parse(data);
  var names = Object.keys(data);
  var values = Object.values(data);
  // Create the chart
  var ctx = $("#interpellationChart").get(0).getContext("2d");
  console.log(ctx);
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: names,
      datasets: [
        {
          data: values,
          label: "Liczba interpelacji",
          backgroundColor: "#224099",
          borderColor: "rgba(54, 162, 235, 1)",
        },
      ],
    },
    options: {
      tension: 0.2,
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Najbardziej zaaangażowani posłowie ",
          font: {
            size: 20,
          },
        },
      },
    },
  });
});
