class Prints extends AbstractList {

    createChart(chartId, data) {
        super.createChart(chartId, data, 'line',  'Liczba druków');
    }

    createList() {
        let list = $('<ul>').addClass('list-group list-group-light mb-3');

        this.data.forEach(print => {
            let printButtonHTML = `
                <a class="btn btn-sm btn-primary me-3" href="${print.pdf_url}" target="_blank">Treść</a>
            `;

            let listItemHTML = `
                <li class="list-group-item">
                    <h5 class="d-flex fw-bold  justify-content-between">Druk nr:  ${print.number}
                    <span class="text-muted  fs-6">${print.deliveryDate}</span>
                    </h5>
                    <p class="d-flex justify-content-between text-muted fw-bold">
                        <p class="mb-0">${print.title}</p>
                    </p>
                    <div>${printButtonHTML}</div>
                </li>
            `;

            list.append(listItemHTML);
        });

        return list;
    }
}