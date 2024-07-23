let sidenavInstance = mdb.Sidenav.getInstance($("#main-sidenav")[0]);
let innerWidth = null;
const setMode = () => {
    // Check necessary for Android devices
    if ($(window).innerWidth() === innerWidth) {
        return;
    }

    innerWidth = $(window).innerWidth();

    let sidebarIsOpen;
    if ($(window).innerWidth() < 1400) {
        sidenavInstance.changeMode("over");
        sidenavInstance.hide();
        $('#sidebarToggleBtn').show(); // show the button
        sidebarIsOpen = false;
    } else {
        sidenavInstance.changeMode("side");
        sidenavInstance.show();
        $('#sidebarToggleBtn').hide(); // hide the button
        sidebarIsOpen = true;
    }

    // Save sidebarIsOpen in local storage
    localStorage.setItem('sidebarIsOpen', sidebarIsOpen);
};

setMode();
// Event listeners
$(window).on("resize", setMode);