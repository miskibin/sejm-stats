var successC, dangerC, warningC, textC;

$(document).ready(function () {
    primaryC = $(':root').css('--mdb-primary');
    successC = $(':root').css('--mdb-success');
    dangerC = $(':root').css('--mdb-danger');
    warningC = $(':root').css('--mdb-warning');
    textC = $(':root').css('--mdb-surface-color');

    var clubData = $("#votingByClubChart").data("chart");
    prepareClubChart(clubData);

    prepareSexChart();
});

function prepareClubChart(clubData) {
    var ctx = document.getElementById('votingByClubChart').getContext('2d');
    var filteredClubData = clubData.filter(item => item.yes + item.no + item.abstain >= 5);

    var labels = filteredClubData.map(item => item.club);
    var yesVotes = filteredClubData.map(item => item.yes);
    var noVotes = filteredClubData.map(item => item.no);
    var abstainVotes = filteredClubData.map(item => item.abstain);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Za',
                data: yesVotes,
                backgroundColor: successC,
                borderRadius: 4
            },
            {
                label: 'Przeciw',
                data: noVotes,
                backgroundColor: dangerC,
                borderRadius: 4
            },
            {
                label: 'Wstrzymano się',
                data: abstainVotes,
                backgroundColor: warningC,
                borderRadius: 4
            },
            ],
        },
        options: chartOptions()
    });
}

function prepareSexChart() {
    var ctx = $("#sexChart").get(0).getContext("2d");
    let totalData = $("#sexChart").data("chart");
    console.log(totalData);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Kobiety', 'Mężczyzni'],
            datasets: [
                {
                    label: 'Za',
                    data: [totalData.female.yes, totalData.male.yes],
                    backgroundColor: successC,
                },
                {
                    label: 'Przeciw',
                    data: [totalData.female.no, totalData.male.no],
                    backgroundColor: dangerC,
                },
                {
                    label: 'Wstrzymano się',
                    data: [totalData.female.abstain, totalData.male.abstain],
                    backgroundColor: warningC,
                }
            ]
        },
        options: chartOptions(.85)
    });
}

function chartOptions(aspectRatio = 0.7) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: aspectRatio,
        plugins: {
            legend: {

                labels: {
                    color: textC
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: textC
                }
            },
            y: {
                beginAtZero: true,
                stacked: true,
                ticks: {
                    color: textC
                }
            }
        }
    };
}
