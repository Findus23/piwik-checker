document.addEventListener('DOMContentLoaded', function() {

    (function createChannel() {
        //Create a port with background page for continous message communication
        var port = chrome.extension.connect({
            name: "Sample Communication" //Given a Name
        });

        // Listen to messages from the background page
        port.onMessage.addListener(function(message) {

            document.querySelector('#response').innerHTML = JSON.stringify(message, null, 4);
            // port.postMessage(message);
        });

    }());


    console.log(document.querySelector('#start'));
    document.querySelector('#start').addEventListener('click', function() {
        chrome.extension.sendMessage({action: "inject", tabId: chrome.devtools.inspectedWindow.tabId});
        chrome.extension.sendMessage({action: "request", tabId: chrome.devtools.inspectedWindow.tabId});
        console.log("sent message")
    }, false);
});
