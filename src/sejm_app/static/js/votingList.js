$(document).ready(function () {
    loadDataTable('votingTable', ["Data", "Temat", "wynik"], callback);
    const onlyImportantSwitch = $('#onlyImportant');
    onlyImportantSwitch.on('change', function () {
        const baseUrl = `${window.location.origin}/api/votings/`;
        const currentParams = new URLSearchParams(window.location.search);
        let url = new URL(baseUrl);
        let params = new URLSearchParams(currentParams.toString());
        if (onlyImportantSwitch.is(':checked')) {
            params.set('category', 'WHOLE_PROJECT');
        } else {
            params.delete('category');
        }
        url.search = params.toString();
        console.log("Updated URL for data table:", url.href);
        updateDataTable('votingTable', url.href, callback);
    });
});

function callback(data) {
    console.log(data);
    $('#succeed').text(data.stats.succeed);
    $('#failed').text(data.stats.failed);
    $('#yes-votes').text(data.stats.yes);
    $('#no-votes').text(data.stats.no);
    $('#abstain-votes').text(data.stats.abstain);
    $('#absent-votes').text(data.stats.absent);
    $('#valid-votes').text(data.stats.vote_valid);



}