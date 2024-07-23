class CommitteeSittings extends AbstractList {

    createChart(chartId, data) {
        super.createChart(chartId, data, 'bar', 'Liczba posiedzeń');

    }
    createList() {
        let list = $('<ul>').addClass('list-group list-group-light mb-3');

        this.data.forEach(sitting => {
            let printButtonsHTML = sitting.prints.map(print => `
        <a class="btn btn-sm btn-primary me-3" href="${print.pdf_url}" target="_blank">Druk ${print.number}</a>
    `).join('');
            let videoButtonHTML = `
        <a class="btn btn-sm btn-warning me-3" href="${sitting.video_url}" target="_blank">Nagranie</a>`
            let transcriptButtonHTML = `
        <a class="btn btn-sm btn-warning me-3" href="${sitting.pdf_transcript}" target="_blank">Transkrypt PDF</a>`

            let listItemHTML = `
        <li class="list-group-item">
            <h5 class="d-flex fw-bold  justify-content-between">Posiedzenie nr ${sitting.id}
            <span class="text-muted  fs-6">${sitting.date}</span>
            </h5>
            <p class="d-flex justify-content-between text-muted fw-bold">
                
                <span class="badge badge-primary" style="word-wrap: break-word;">${sitting.committee}</span>
            </p>
            <p>${sitting.agenda.replace(/\n/g, '<br>')}</p>
            <div >${printButtonsHTML} ${videoButtonHTML} ${transcriptButtonHTML}</div>
        </li>
    `;

            list.append(listItemHTML);
        });

        return list;
    }
}