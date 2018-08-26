(function() {
    /* global $, browser */

    var allApiUrls = {
        wordnik: {
            baseUrl: "http://api.wordnik.com:80/v4/word.json/",
            query: {
                definition: "/definitions",
                pronounciation: "/pronunciations",
            },
            suffix:
                "?limit=5&includeRelated=true&useCanonical=true&includeTags=false&api_key=bcd982311d2626ed980040462970e1996105e37a799092b7c",
        },
    };

    function getDefinition(searchText, api, callback) {
        var result = {
            searchText: searchText,
            definitions: [],
            pronounciation: "",
            status: "",
        };

        $.when($.getJSON(api.definition), $.getJSON(api.pronounciation))
            .then(function(result1, result2) {
                result1 = result1[0];
                result2 = result2[0];
                result.status = "success";
                result.definitions = result1.map(function(ele) {
                    return ele.text;
                });
                if (Array.isArray(result2) && typeof result2[0] === "object") {
                    result.pronounciation = result2.shift().raw;
                }
                // atleast one def should be present
                if (result.definitions.length === 0) {
                    result.status = "fail";
                }
            })
            .fail(function(err) {
                logError(err);
                result.status = "fail";
            })
            .always(function() {
                callback(result);
            });
    }

    function constructApi(searchText, source) {
        var wordnik = allApiUrls.wordnik;
        // TODO: pronounciation always uses wordnik API
        var api = {
            pronounciation:
                wordnik.baseUrl +
                searchText +
                wordnik.query.pronounciation +
                wordnik.suffix,
            definition: "",
        };

        if (source.useCustom) {
            api.definition = source.customUrl + searchText;
        } else {
            switch (source.selectedPreset) {
            case "wordnik":
                api.definition =
                    wordnik.baseUrl +
                    searchText +
                    wordnik.query.definition +
                    wordnik.suffix;
                break;
            }
        }
        return api;
    }

    browser.runtime.onMessage.addListener(function(msg) {
        localStorage.setItem("recentSearchText", msg.searchText);

        browser.storage.sync
            .get()
            .then(function(settings) {
                var api = constructApi(msg.searchText, settings.source);
                getDefinition(msg.searchText, api, sendResponse);
            })
            .catch(logError);
    });

    function sendResponse(result) {
        browser.tabs
            .query({
                currentWindow: true,
                active: true,
            })
            .then(function(tabs) {
                browser.tabs.sendMessage(tabs[0].id, result);
            });
    }

    function logError(err) {
        console.error("Error in background.js: ", err);
    }
})();
