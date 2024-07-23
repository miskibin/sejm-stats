$(document).ready(function () {
  let clubs_str = $("#clubsChart").attr("data-clubs-json");
  var clubs = JSON.parse(clubs_str);
  let textColor = $(':root').css('--mdb-surface-color');
  var data = clubs.map(function (club) {
    return {
      name: club.id,
      y: club.envoys_count,
      color: $(':root').css('--' + club.id + '-color')
    };
  });

  Highcharts.chart('container', {
    chart: {
      type: 'item',
      backgroundColor: $(':root').css('--mdb-bg-color'), // match the MDB background
    },
    title: {
      // dont display
      text: '',

    },
    legend: {
      itemStyle: {
        color: textColor // MDB text color for legend
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 600
        },
        chartOptions: {
          series: [{
            dataLabels: {
              distance: -30,
              style: {
                color: textColor // Ensure data labels are also styled
              }
            }
          }]
        }
      }]
    },
    series: [{
      name: 'Liczba posłów',
      keys: ['name', 'y', 'color'],
      data: data,
      dataLabels: {
        useHTML: true,
        enabled: true,
        format: '<p class="bg-light rounded text-dark p-1">{point.name}: {point.y}</p>',
      },
      center: ['45%', '90%'],
      size: '160%',
      startAngle: -100,
      endAngle: 100
    }],
    credits: {
      enabled: false
    }
  });
});
