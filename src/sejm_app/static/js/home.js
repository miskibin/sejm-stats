$(document).ready(function () {
  // Counter and other unrelated logic omitted for brevity

  $(".counter").each(function () {
    var counter = $(this);
    var target = +counter.text();
    counter.text(`${Math.max(target - 20, 0)}`); // adjust this value to set the starting count
    var interval = setInterval(function () {
      var current = +counter.text();
      if (current < target) {
        counter.text(current + 1);
      } else {
        clearInterval(interval);
      }
    }, 20); // adjust this value to change the speed of the animation
  });
  $("#search-button").on('click', function (e) {
    var searchValue = $('#search-focus').val(); // Get the value of the search input
    const url = `/search/?q=${searchValue}`; // Construct the URL with the search query
    window.location.href = url; // Redirect to the search page
    
  });


  function showToast(message, bgColor = 'bg-primary') {
    var toastHTML = `
        <div class="m-2 toast align-items-center text-white ${bgColor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-mdb-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    $("#toastContainer").append(toastHTML);
    var toastElement = $(".toast").last();
    let toast = new mdb.Toast(toastElement, {
      delay: 3000,
    });
    toast.show();
  }

  $.ajax({
    url: "/last-update/",
    success: function (response) {
      var message = response.last_updated
        ? `Ostatnia aktualizacja danych: ${response.last_updated}`
        : response.message;
      showToast(message);
    },
    error: function () {
      showToast('Failed to fetch last update time.', 'bg-warning');
    },
  });
  var quotes = [
    {
      text: "Demokracja nie jest darem od państwa. To prawa ludzi, którzy je tworzą.",
      author: "John F. Kennedy",
    },
    {
      text: "Wolność bez odpowiedzialności to anarchia; odpowiedzialność bez wolności to tyrania.",
      author: "Autor nieznany",
    },
    {
      text: "Każdy kraj ma rząd, na jaki zasługuje.",
      author: "Joseph de Maistre",
    },
    {
      text: "Demokracja to dyskusja. To prawo ludzi do zmiany swojego rządu.",
      author: "Winston Churchill",
    },
    {
      text: "Jednym z testów demokracji jest swoboda krytykowania rządu.",
      author: "Indira Gandhi",
    },
    {
      text: "Praktyka polityczna to stała walka o władzę, która jest wykonywana z pomocą prawa.",
      author: "Max Weber",
    },
  ];

  function displayQuote(index) {
    $("#quote, #author").fadeOut(1000, function () {
      $("#quote").text(quotes[index].text);
      $("#author").text(quotes[index].author);
      $(this).fadeIn(1000);
    });
  }

  var currentQuote = 0;

  // Only run on screens larger than 576px
  if (window.matchMedia("(min-width: 577px)").matches) {
    displayQuote(currentQuote);

    setInterval(function () {
      currentQuote = (currentQuote + 1) % quotes.length;
      displayQuote(currentQuote);
    }, 8000);
  }

  // Initial static toast for "Wspomóż mnie"
  var initialToastHTML = `
      <div class="m-2  toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            Wesprzyj projekt na <a href="https://patronite.pl/sejm-stats" class="text-white  fw-bold">Patronite</a>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-mdb-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
  // Append and show the initial toast
  $("#toastContainer").append(initialToastHTML);
  var initialToastElement = $(".toast").last();
  var initialToast = new mdb.Toast(initialToastElement,
    {
      delay: 3000,
    });
  initialToast.show();
});
