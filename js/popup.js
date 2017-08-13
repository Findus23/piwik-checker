document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("text").innerText = chrome.i18n.getMessage("popup_text");
    document.getElementById("popupExplaination").innerText = chrome.i18n.getMessage("popupExplaination");
});