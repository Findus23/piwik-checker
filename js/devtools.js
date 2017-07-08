var port = chrome.runtime.connect({
    name: "devtool-comunication" //Given a Name
});

chrome.devtools.panels.create("Piwik Checker", "images/devtoolicon.png", "views/panel.html", function(panel) {
    console.log("panel loaded");
});
