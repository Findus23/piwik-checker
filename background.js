// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

chrome.extension.onConnect.addListener(function(port) {

    function extensionListener(message, sender, sendResponse) {
        if (message.tabId) {
            if (message.action === 'inject') {
                //Evaluate script in inspectedPage
                chrome.tabs.executeScript(message.tabId, {file: "inject.js"}, function(result) {
                    port.postMessage({action: "injectResponse", data: result[0]});
                });
                console.log("inject")
            } else if (message.action === "request") {
                console.log("request");
                chrome.webRequest.onCompleted.addListener(
                    function(details) {
                        console.log(details);
                        port.postMessage({
                            action: "requestResponse",
                            file: (details.url.indexOf("piwik.js") !== -1) ? "piwik.js" : "piwik.php",
                            data: details
                        });

                    },
                    {urls: ["*://*/piwik.js", "*://*/piwik.php*"], tabId: message.tabId} // only look for request in open tab
                );
            }

            // This accepts messages from the inspectedPage and
            // sends them to the panel
        } else {
            port.postMessage(message);
        }
        sendResponse(message);
    }

    // Listens to messages sent from the panel
    chrome.extension.onMessage.addListener(extensionListener);
    console.log("connected to extention");

    port.onDisconnect.addListener(function(port) {
        chrome.extension.onMessage.removeListener(extensionListener);
    });


});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    return true;
});

