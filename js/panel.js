document.addEventListener('DOMContentLoaded', function() {
    var data = {request: {}};

    function printData() {
        document.querySelector('#json').innerText = JSON.stringify(data, null, 4);
        function tableCreate() {
            var tbl = document.querySelector('.table');
            tbl.innerText = "";

            for (var testname in data.tests) {
                if (data.tests.hasOwnProperty(testname)) {
                    var response = data.tests[testname];
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
                        details.innerText = chrome.i18n.getMessage(messageKey, response.substitutions);
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
                data.tests = message.data.results;
                data.info = message.data.info;
                var piwikNotFoundHeading = document.getElementById("piwikNotFoundHeading");
                var piwikNotFound = document.getElementById("piwikNotFound");
                if (!data.tests) {
                    piwikNotFoundHeading.innerText = chrome.i18n.getMessage("piwikNotFoundHeading");
                    piwikNotFound.innerText = chrome.i18n.getMessage("piwikNotFound");
                    piwikNotFound.style.display = "inline-block";
                    piwikNotFoundHeading.style.display = "inline-block";
                } else {
                    piwikNotFound.style.display = "none";
                    piwikNotFoundHeading.style.display = "none";
                    var urlElement = document.getElementById("piwikURL");
                    urlElement.innerText = data.info.piwikURL;
                    if (data.tests.noProtocolRelativeURL.success) {
                        urlElement.href = data.info.piwikURL.slice(0, -8); // remove "piwik.js" from link
                    } else {
                        urlElement.href = "https:" + data.info.piwikURL.slice(0, -8);
                    }
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
        chrome.devtools.inspectedWindow.reload();
        chrome.runtime.sendMessage({action: "inject", tabId: chrome.devtools.inspectedWindow.tabId});
    }, false);
});
