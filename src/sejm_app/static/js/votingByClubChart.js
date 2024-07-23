$(document).ready(function () {
    let clubs = $("#clubsChart").data("chart");
    console.log(clubs);
    let successC = $(':root').css('--mdb-success');
    let dangerC = $(':root').css('--mdb-danger');
    let textColor = $(':root').css('--mdb-surface-color');
    let warningC = $(':root').css('--mdb-warning');
    var seriesData = clubs.map(function (club) {
        return [
            club.yes > 0 ? {
                y: club.yes,
                color: successC,
                name: club.club + ' (za)'
            } : null,
            club.no > 0 ? {
                y: club.no,
                color: dangerC,
                name: club.club + ' (przeciw)'
            } : null,
            club.abstain > 0 ? {
                y: club.abstain,
                color: warningC,
                name: club.club + ' (wstrzymało się)'
            } : null
        ].filter(Boolean);
    }).flat();
    Highcharts.chart('container', {
        chart: {
            type: 'item',
            backgroundColor: $(':root').css('--mdb-bg-color'), // match the MDB background
            events: {
                load: function () {
                    var chart = this,
                        resizeEvent; // to prevent multiple resize events in short time period

                    $(window).on('resize', function (e) {
                        clearTimeout(resizeEvent);
                        resizeEvent = setTimeout(function () {
                            var width = $(window).width();
                            if (width < 600) {
                                chart.setSize(width - 20, chart.chartHeight, false);
                            } else {
                                chart.setSize(null, chart.chartHeight, false);
                            }
                        }, 200);
                    });
                }
            }
        },
        title: {
            // dont display
            text: '',

        },
        legend: {
            enabled: false
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 600
                },

            }]
        },
        series: [{
            name: 'Liczba posłów',
            keys: ['name', 'y', 'color'],
            data: seriesData,
            center: ['50%', '85%'],
            size: '160%',
            startAngle: -100,
            endAngle: 100
        }],
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false  // Hide labels
                }
            }
        },
        credits: {
            enabled: false
        }
    });
});
