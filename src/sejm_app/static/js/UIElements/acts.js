class Acts extends AbstractList {


    createChart(chartId, data) {
        super.createChart(chartId, data, 'line', 'Liczba ustaw');
    }

    createList() {
        let list = $('<ul>').addClass('list-group list-group-light mb-3');

        this.data.forEach(act => {
            let actButtonHTML = `
                <a class="btn btn-sm btn-primary me-3" href="${act.url}" target="_blank">Treść</a>
            `;

            let listItemHTML = `
                <li class="list-group-item">
                </h5>
                    <h5 class="d-flex fw-bold  justify-content-between">ELI: ${act.ELI}
                    <span class="text-muted  fs-6">${act.announcementDate}</span>
                    </h5>
                    <p class="mb-0">${act.title}</p>
                    <div>${actButtonHTML}</div>
                </li>
            `;

            list.append(listItemHTML);
        });

        return list;
    }
}