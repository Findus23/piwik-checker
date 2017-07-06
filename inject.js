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
    /**
     * @return {string}
     */
    URLtoPiwikJS: function() {
        return this.scriptObject.getAttribute("src");
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
            isScriptAsync: this.isScriptAsync()
        };
    }
};

willBeSendToBackgroundJs = tests.main();