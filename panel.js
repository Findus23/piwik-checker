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
            } else if (message.action === "requestResponse") {
                data.request[message.file] = message.data;
            }
            printData()
        });

    }());


    console.log(document.querySelector('#start'));
    document.querySelector('#start').addEventListener('click', function() {
        chrome.extension.sendMessage({action: "inject", tabId: chrome.devtools.inspectedWindow.tabId});
        chrome.extension.sendMessage({action: "request", tabId: chrome.devtools.inspectedWindow.tabId});
        console.log("sent message")
    }, false);
});
