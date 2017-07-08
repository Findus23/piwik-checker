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
                    chrome.tabs.executeScript({
                        code: 'tests.main();'
                    }, function(result) {
                        port.postMessage({action: "injectResponse", data: result[0]});
                    });

                    console.log("inject")
                } else if (message.action === "request") {
                    console.log("request");
                    handleWebRequest = function(details, test) {
                        console.log(details);
                        console.log(test);
                        var file;
                        if (details.url.indexOf("piwik.js") !== -1) {
                            file = "piwik.js";
                        } else if (details.url.indexOf("action_name") !== -1) {
                            file = "piwik.php";
                        }
                        port.postMessage({
                            action: "requestResponse",
                            file: file,
                            data: details
                        });
                    };

                    chrome.webRequest.onCompleted.addListener(handleWebRequest,
                        {urls: ["*://*/piwik.js", "*://*/piwik.php*"], tabId: message.tabId} // only look for request in open tab
                    );
                    chrome.webRequest.onErrorOccurred.addListener(handleWebRequest,
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


    }
);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "test") {
        if (message.usesPiwik) {
            chrome.pageAction.show(sender.tab.id);
        } else {
            chrome.pageAction.hide(sender.tab.id);
        }
    }
});

