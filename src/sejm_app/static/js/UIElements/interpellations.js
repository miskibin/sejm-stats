class Interpellations extends AbstractList {

    createChart(chartId, data) {
        super.createChart(chartId, data, 'bar', 'Liczba interpelacji');
    }

    createList() {
        let list = $('<div>');
        this.data.forEach(interpellation => {
            let interpellationItem = $(`
            <div class="d-flex flex-start mt-4 ms-3">
                
                <div class="flex-grow-1 flex-shrink-1">
                    <h5 class="d-flex fw-bold justify-content-between">
                    <span><img src="${interpellation.fromMember.photoUrl}"
                    class="card-img-left rounded me-3"
                    style="width: 44px; height: 44px" /> ${interpellation.fromMember.name}</span>
                        <span class="text-muted fs-6">${interpellation.lastModified}</span>
                    </h5>
                    <a href="${interpellation.bodyLink}" class="text-decoration-none mb-0">${interpellation.title}</a>
                </div>
            </div>
        `);
            list.append(interpellationItem);

            interpellation.replies.forEach(reply => {
                let replyItem = $(`
                <div class="d-flex flex-start mt-4 ms-5">
                    <i class="fas fa-reply fa-xl me-3"></i>
                    <div class="flex-grow-1 flex-shrink-1">
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="mb-1 fst-italic">${reply.author} ${reply.receiptDate}</p>
                        </div>
                        <a href="${reply.bodyLink}" class="mb-0">Treść odpowiedzi <i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
            `);
                list.append(replyItem);
            });

            list.append($('<hr>').addClass('my-4'));
        });

        return list;
    }


}
