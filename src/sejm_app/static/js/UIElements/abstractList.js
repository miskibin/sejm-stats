class AbstractList {
    constructor(data, containerId) {
        if (new.target === AbstractList) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.data = data;
        this.containerId = containerId;
    }


    createChart(chartId, data, chartType, title) {
        let labels = Object.keys(data);
        let values = Object.values(data);
        const ctx = document.getElementById(chartId);
        let primaryC = $(':root').css('--mdb-primary');
        let textC = $(':root').css('--mdb-surface-color');
        let scales = {};


        new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    tension: 0.4,
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    title: {
                        text: title,
                    },
                },
            }
        });
    }
    createList() {
        throw new Error("You have to implement the method createList!");
    }

    appendToList() {
        let container = $(`#${this.containerId}`);
        let list = this.createList();
        container.html(list);
    }
}