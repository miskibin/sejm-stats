
$(document).ready(function () {
  Chart.defaults.backgroundColor = $(':root').css('--mdb-primary');
  // Chart.defaults.borderColor = $(':root').css('--mdb-danger');
  Chart.defaults.color = $(':root').css('--mdb-surface-color');
  Chart.defaults.aspectRatio = 0.9;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.title.font.size = 20;
  Chart.defaults.plugins.title.display = true;

  function fetchData() {
    const searchParam = new URLSearchParams(window.location.search); // Extract current search parameters
    const queryString = searchParam.toString(); // Convert parameters to a query string

    $.get("/api/search/?" + queryString, function (response) {
      // Create instances of the classes and populate them with the response data
      let committeeSittings = new CommitteeSittings(response.committee_sittings, 'committee-sittings-list');
      let interpellations = new Interpellations(response.interpellations, 'interpellations-list');
      let prints = new Prints(response.prints, 'prints-list');
      let acts = new Acts(response.acts, 'acts-list');

      // Call the appendToList method to populate the lists
      committeeSittings.appendToList();
      committeeSittings.createChart('committee-sittings-chart', response.top_committees);
      interpellations.createChart('interpellations-chart', response.top_interpellations);
      prints.createChart('prints-chart', response.prints_per_month);
      acts.createChart('acts-chart', response.acts_per_month);
      interpellations.appendToList();
      prints.appendToList();
      acts.appendToList();
    });
  }

  fetchData(); // Call the function on page load
});