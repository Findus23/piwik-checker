document.addEventListener('DOMContentLoaded', function() {
    var data = {request: {}};

    function printData() {
        document.querySelector('#response').innerHTML = JSON.stringify(data, null, 4);

    }

    (function createChannel() {
        //Create a port with background page for continous message communication
        var port = chrome.runtime.connect({
            name: "Sample Communication" //Given a Name
        });

        // Listen to messages from the background page
        port.onMessage.addListener(function(message) {
            if (message.action === 'injectResponse') {
                data.inject = message.data;
                // port.postMessage(message);
            } else if (message.action === "requestResponse" && message.file) {
                data.request[message.file] = message.data;
            }
            printData()
        });

    }());


    document.querySelector('#start').addEventListener('click', function() {
        chrome.runtime.sendMessage({action: "inject", tabId: chrome.devtools.inspectedWindow.tabId});
        chrome.runtime.sendMessage({action: "request", tabId: chrome.devtools.inspectedWindow.tabId});
        // chrome.tabs.reload(chrome.devtools.inspectedWindow.tabId);
        console.log("sent message")
    }, false);
});
