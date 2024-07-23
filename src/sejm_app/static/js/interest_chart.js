$(document).ready(function () {
  // Extract data from the 'data-interest' attribute
  var data = $("#interestChart").data("interest");
  // If the data is a string, uncomment the next line to parse it as JSON
  // data = JSON.parse(data);

  // Prepare datasets
  var datasets = [];
  console.log(data);
  if (data.interpellations) {
    datasets.push({
      label: "Interpelacje",
      data: Object.values(data.interpellations),

      tension: 0.4,
    });
  }

  if (data.processes) {
    datasets.push({
      label: "Procesy",
      data: Object.values(data.processes),

      tension: 0.4,
    });
  }

  if (data.prints) {
    datasets.push({
      label: "Druki",
      data: Object.values(data.prints),

      tension: 0.4,
    });
  }

  // Assuming weeks are consistent across all data parts
  var weeks = Object.keys(data.interpellations || data.processes || data.prints);

  // Create the chart
  var ctx = $("#interestChart").get(0).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: weeks,
      datasets: datasets,
    },
    options: {
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Zainteresowanie tematem w ujęciu czasowym",
          font: {
            size: 20,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
