function loadDataTable(tableId, columns, callback = null) {
    let params = new URLSearchParams(window.location.search);
    url = `${window.location.origin}/api${window.location.pathname}?${params.toString()}`;
    $(document).ready(function () {
        var urls = [];
        const table = document.getElementById(tableId);
        const asyncTable = new mdb.Datatable(
            table,
            { columns },
            {
                loading: true,
                ofText: 'z',
                fullPagination: true,
                rowsText: 'wierszy',
                allText: 'Wszystko',
                noFoundMessage: "Brak wyników"
            }

        );

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                urls = data.urls
                if (data.columns) {
                    console.log(data.columns)
                    asyncTable.update({
                        columns: data.columns
                    })
                }
                if (callback) {
                    callback(data);
                }
                data = data.data ? data.data : data;
                asyncTable.update({
                    rows: data,
                },
                    { loading: false }
                );
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
        document.getElementById(`datatable-search-input`).addEventListener('input', (e) => {
            asyncTable.search(e.target.value);
        });
        document.addEventListener('rowClicked.mdb.datatable', (e) => {
            const { index } = e;
            window.location.href = urls[index];
        });

    });

}

function updateDataTable(tableId, url, callback) {
    const table = document.getElementById(tableId);
    const asyncTable = mdb.Datatable.getInstance(table);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            asyncTable.update({
                rows: data.data,
            },
                { loading: false }
            );
            if (data.columns) {
                asyncTable.update({
                    columns: data.columns
                })
            }
            if (callback) {
                callback(data);
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}