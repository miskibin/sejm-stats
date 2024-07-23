$(document).ready(function () {
  // Extract data from the 'data-interest' attribute
  var data = $("#processesChart").data("interest");
  // If the data is a string, uncomment the next line to parse it as JSON
  // data = JSON.parse(data);
  var clubs = Object.keys(data);
  var projectCounts = Object.values(data);

  // Create the chart
  var ctx = $("#processesChart").get(0).getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: clubs,
      datasets: [
        {
          label: "Liczba projektów",
          data: projectCounts,
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
          text: "Liczba interpelacji",

          font: {
            size: 20,
          },
        },
      },
    },
  });
});
