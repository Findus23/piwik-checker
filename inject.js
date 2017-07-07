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
        a.href = 'https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=picture%20of%20a%20potato';
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
    /**
     * @return {string}
     */
    URLtoPiwikJS: function() {
        return this.scriptObject.getAttribute("src");
    },
    piwikUsesHTTPS: function() {
        return this.parseURL(this.URLtoPiwikJS())["protocol"] === "https:"
    },
    isURLprotocolRelative: function() {
        return this.URLtoPiwikJS().startsWith("//");
    },

    isScriptAsync: function() {
        return this.scriptObject.hasAttribute("async") && this.scriptObject.hasAttribute("defer")
    },
    main: function() {
        this.scriptObject = this.piwikJSScriptObject();
        if (!this.scriptObject) {
            console.warn("No piwik found");
            return false;
        }
        return {
            UrltoPiwikJs: this.URLtoPiwikJS(),
            piwikUsesHTTPS: this.piwikUsesHTTPS(),
            isURLprotocolRelative: this.isURLprotocolRelative(),
            isScriptAsync: this.isScriptAsync(),
        };
    }
};

willBeSendToBackgroundJs = tests.main();