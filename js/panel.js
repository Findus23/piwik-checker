document.addEventListener('DOMContentLoaded', function() {
    var data = {request: {}};

    function printData() {
        document.querySelector('#json').innerHTML = JSON.stringify(data, null, 4);
        function tableCreate() {
            var tbl = document.querySelector('.table');
            tbl.innerHTML = "";

            for (var testname in data.inject) {
                if (data.inject.hasOwnProperty(testname)) {
                    var response = data.inject[testname];
                    var tr = tbl.insertRow();
                    tr.title = testname;
                    var status = tr.insertCell(0), details = tr.insertCell(1);
                    var Result = true;
                    if (response.success === true) {
                        tr.classList.add("table-success");
                        status.innerText = "\u2714";
                    } else if (response.success === false) {
                        tr.classList.add("table-warning");
                        status.innerText = "\u2718";

                    } else {
                        Result = false;
                        tr.classList.add("table-active");
                        status.innerText = "?";
                    }
                    status.title = response.success;

                    if (Result) {
                        var messageKey = testname + "_" + response.success;
                        details.innerHTML = chrome.i18n.getMessage(messageKey, response.substitutions);
                    }
                }
            }
        }

        tableCreate();
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
                var piwikNotFoundHeading = document.getElementById("piwikNotFoundHeading");
                var piwikNotFound = document.getElementById("piwikNotFound");
                if (!data.inject) {
                    piwikNotFoundHeading.innerText = chrome.i18n.getMessage("piwikNotFoundHeading");
                    piwikNotFound.innerText = chrome.i18n.getMessage("piwikNotFound");
                    piwikNotFound.style.display = "inline-block";
                    piwikNotFoundHeading.style.display = "inline-block";
                } else {
                    piwikNotFound.style.display = "none";
                    piwikNotFoundHeading.style.display = "none";

                }
                // port.postMessage(message);
            } else if (message.action === "requestResponse" && message.file) {
                data.request[message.file] = message.data;
            }
            printData();
        });

    }());

    chrome.runtime.sendMessage({action: "inject", tabId: chrome.devtools.inspectedWindow.tabId});
    chrome.runtime.sendMessage({action: "request", tabId: chrome.devtools.inspectedWindow.tabId});
    document.querySelector('#start').addEventListener('click', function() {
        chrome.runtime.sendMessage({action: "inject", tabId: chrome.devtools.inspectedWindow.tabId});
        // chrome.runtime.sendMessage({action: "request", tabId: chrome.devtools.inspectedWindow.tabId});
    }, false);
});
