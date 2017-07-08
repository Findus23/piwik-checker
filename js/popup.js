document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("text").innerHTML = chrome.i18n.getMessage("popup_text");
    document.getElementById("popupExplaination").innerHTML = chrome.i18n.getMessage("popupExplaination");
});