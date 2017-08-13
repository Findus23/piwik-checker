var port = chrome.runtime.connect({
    name: "devtool-comunication" //Given a Name
});

chrome.devtools.panels.create("Piwik Checker", "images/icon48.png", "views/panel.html", function(panel) {
    console.log("panel loaded");
});
