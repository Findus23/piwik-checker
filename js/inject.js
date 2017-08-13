tests = {
    errors: [],
    piwikJSScriptObject: function() {
        var allElements = document.getElementsByTagName('script');
        for (var i = 0, n = allElements.length; i < n; i++) {
            if (allElements[i].hasAttribute("src") && allElements[i].getAttribute("src").endsWith("piwik.js")) {// TODO: support renamed piwik.js
                return allElements[i];
            }
        }
    },

    parseURL: function(url) {
        var a = document.createElement('a');
        a.href = url;
        // document.removeChild(a);
        return {
            protocol: a.protocol,
            host: a.host,
            hostname: a.hostname,
            port: a.port,
            pathname: a.pathname,
            search: a.search
        };

    },
    isPageHTTPS: function() {
        return location.protocol === "https:";
    },
    usesPiwik: function() {
        return !!this.piwikJSScriptObject();
    },
    // -------------
    /**
     * @return {string}
     */
    URLtoPiwikJS: function() {
        return this.scriptObject.getAttribute("src");
    },
    piwikUsesHTTPS: function() {
        return {
            success: this.parseURL(this.URLtoPiwikJS()).protocol === "https:"
        };
    },
    noProtocolRelativeURL: function() {
        return {
            success: !this.URLtoPiwikJS().startsWith("//")
        };
    },
    noMixedContent: function() {
        return {
            success: !(this.isPageHTTPS() && !this.piwikUsesHTTPS())
        };
    },

    isScriptAsync: function() {
        return {
            success: this.scriptObject.hasAttribute("async") && this.scriptObject.hasAttribute("defer")
        };
    },

    isPageUTF8: function() {
        return {
            success: document.characterSet.toLowerCase() === "utf-8",
            substitutions: [document.characterSet]
        };
    },
    main: function() {
        this.scriptObject = this.piwikJSScriptObject();
        if (!this.scriptObject) {
            console.warn("No piwik found");
            return false;
        }
        return {
            info: {
                piwikURL: this.URLtoPiwikJS()
            },
            results: {
                piwikUsesHTTPS: this.piwikUsesHTTPS(),
                noProtocolRelativeURL: this.noProtocolRelativeURL(),
                noMixedContent: this.noMixedContent(),
                isScriptAsync: this.isScriptAsync(),
                isPageUTF8: this.isPageUTF8()
            }
        };
    }
};
chrome.runtime.sendMessage({action: "test", usesPiwik: tests.usesPiwik()});
// willBeSendToBackgroundJs = tests.main();