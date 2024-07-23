var theme = localStorage.getItem("theme");
if (theme) {
  $("html").attr("data-mdb-theme", theme);
}

// Toggle theme logic
$(document).ready(function () {
  $("#theme-toggle").click(function () {
    var theme = $("html").attr("data-mdb-theme");
    var newTheme = theme === "dark" ? "light" : "dark";
    $("html").attr("data-mdb-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
  // Apply the theme at document ready

  // Update button logic
  $("#updateButton").click(function () {
    var url = $(this).data("href");
    var csrfToken = $(this).data("csrf");
    $.ajax({
      url: url,
      type: "GET",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      success: function (response) {
        showNotification(response.message);
      },
      error: function (xhr, status, error) {
        showNotification("Update failed: " + error);
      },
    });
  });

  // Initialize Google Analytics based on cookie consent
  if (localStorage.getItem("cookieConsent") === "true") {
    $(".cookie-consent-banner").remove();
    initializeAnalytics();
  } else {
    $(document).on('click', '#acceptCookies', function () {
      localStorage.setItem("cookieConsent", "true");
      $(".cookie-consent-banner").fadeOut();
      initializeAnalytics(); // Initialize Analytics on consent
    });
  }
  $(document).on('click', '#rejectCookies', function () {
    localStorage.setItem("cookieConsent", "false");
    $(".cookie-consent-banner").fadeOut();
    // You might want to handle analytics differently when cookies are rejected
  });
});

// Function to initialize Google Analytics
function initializeAnalytics() {
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l !== "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtag/js?id=" + i;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "G-X22MX943V4");
  window.dataLayer.push({
    event: "cookie-consent-accepted",
  });
}

// Function to show notification
function showNotification(message) {
  alert(message);
}
