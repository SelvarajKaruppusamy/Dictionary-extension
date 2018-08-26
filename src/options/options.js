(function() {
    /* global browser, $*/
    var dictionarySettings = {
        source: {
            selectedPreset: "wordnik",
            useCustom: false,
            customUrl: "",
        },
    };

    function logError(err) {
        console.error(err);
    }

    function updateUi(data) {
        dictionarySettings = $.extend(true, dictionarySettings, data);

        // update dictionary source
        $('[name="dictionarySource"]').removeAttr("checked");
        if (dictionarySettings.source.useCustom) {
            $("input[name=dictionarySource][value=custom]").prop(
                "checked",
                true
            );
            $("input[name=dictionaryCustomUrl").val(
                dictionarySettings.source.customUrl
            );
            $(".dictionary-source-textbox").removeClass("hidden");
        } else {
            switch (dictionarySettings.source.selectedPreset) {
            case "wordnik":
                $("input[name=dictionarySource][value=wordnik]").prop(
                    "checked",
                    true
                );
                break;
            }
        }
    }

    function isCustomDictionarySelected() {
        if ($("input[name=dictionarySource][value=custom]").prop("checked")) {
            return true;
        }
        return false;
    }

    function saveOptions(event) {
        event.preventDefault;

        var settings = $.extend(true, {}, dictionarySettings);
        var useCustomDict = isCustomDictionarySelected();
        var customUrl = $("input[name=dictionaryCustomUrl]").val();

        if (useCustomDict && customUrl) {
            settings.source.customUrl = customUrl;
            settings.source.useCustom = true;
        } else {
            settings.source.useCustom = false;
        }

        browser.storage.sync.set(settings).catch(logError);
    }

    // show/hide text box to enter custom url
    $("input[type=radio][name=dictionarySource]").change(function() {
        if (this.value === "custom") {
            $(".dictionary-source-textbox").removeClass("hidden");
        } else {
            $(".dictionary-source-textbox").addClass("hidden");
        }
    });

    $("#dictionary-settings-save-btn").click(saveOptions);
    browser.storage.sync.get().then(updateUi, logError);
})();
