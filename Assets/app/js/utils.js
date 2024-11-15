﻿var Utils = {
    SaveFileAs: function (uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;
            //Firefox requires the link to be in the body
            document.body.appendChild(link);
            //simulate click
            link.click();
            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    },
    setError: function (error) {
        var str = '<div class="row flash flash-error">' +
            '<ul>' +
            '<li>' +
            error +
            '</li>' +
            '</ul>' +
            '<i class="ui-icon ui-icon-closethick close-flash"></i>' +
            '</div>';

        jQuery("#Section").prepend(str);
    },
    setSuccess: function (sucess) {
        var str = '<div class="row flash flash-success">' +
            '<ul>' +
            '<li>' +
            sucess +
            '</li>' +
            '</ul>' +
            '<i class="ui-icon ui-icon-closethick close-flash"></i>' +
            '</div>';

        jQuery("#Section").prepend(str);
    },
    rmSpace: function (val) {
        try {
            while (val.indexOf(" ") !== -1) {
                val = val.replace(" ", "");
            }
        } catch (e) { }
        return val;
    },

    notEmpty: function (val) {
        return !Utils.isEmpty(val);
    },
    isGet: function (form) {
        return form.attr("method").toLowerCase() == "get";
    },
    isPost: function (form) {
        return form.attr("method").toLowerCase() == "post";
    },
    isEmpty: function (val) {

        if (typeof val == "object")
            return false;
        if (typeof val == "function")
            return false;

        return val === undefined || jQuery.trim(val).length === 0;
    },
    isInteger: function (val) {

        return !isNaN(val) && !Utils.isEmpty(val);
    },

    isChrome: function () {
        return navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    },
    IsImage: function (extension) {
        try {
            var args = extension.toLowerCase().split('.');
            var ext = args[args.length - 1];
            switch (ext) {
                case "ico":
                    return true;
                case "bmp":
                    return true;
                case "gif":
                    return true;
                case "jpe":
                    return true;
                case "jpeg":
                    return true;
                case "jpg":
                    return true;
                case "png":
                    return true;
            }
        } catch (e) {

        }
        return false;
    },
    IsPdfOrOffice: function (extension) {
        return Utils.IsPdf(extension) || Utils.IsOffice(extension);
    },
    IsPdf: function (extension) {
        try {
            var args = extension.toLowerCase().split('.');
            var ext = args[args.length - 1];
            return ext == "pdf";
        } catch (e) {
            return false;
        }
    },
    IsOffice: function (extension) {
        try {
            var args = extension.toLowerCase().split('.');
            var ext = args[args.length - 1];
            switch (ext) {
                case "rtf":
                    return true;
                case "odt":
                    return true;
                case "doc":
                    return true;
                case "dot":
                    return true;
                case "docx":
                    return true;
                case "dotx":
                    return true;
                case "docm":
                    return true;
                case "dotm":
                    return true;
                case "csv":
                    return true;
                case "odc":
                    return true;
                case "xls":
                    return true;
                case "xlsx":
                    return true;
                case "xlsm":
                    return true;
                case "odp":
                    return true;
                case "ppt":
                    return true;
                case "pptx":
                    return true;
                case "pptm":
                    return true;
                case "pot":
                    return true;
                case "potm":
                    return true;
                case "potx":
                    return true;
                case "pps":
                    return true;
                case "ppsx":
                    return true;
                case "ppsm":
                    return true;
            }
        } catch (e) { }
        return false;
    },
    updateIsNumber: function (container) {
        container.find(".isNumberFormat").each(function () {
            $(this).keyup(function () {
                this.value = Utils.formatMoney(this.value);
            });
        });

        $('.isNumberInteger').keypress(function (e) {
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                return false;
            }
        });
        //container.on("keyup change paste", ".isNumber", function (e) {
        //    var charCode = (event.which) ? event.which : event.keyCode;
        //    console.log(charCode);
        //    if (charCode == 45)
        //        return false;
        //    if (
        //        (charCode != 45 && charCode != 8 || $(this).val().indexOf('-') != -1) && // “-” CHECK MINUS, AND ONLY ONE.
        //        (charCode != 46 || $(this).val().indexOf('.') != -1) // “.” CHECK DOT, AND ONLY ONE.
        //        && (charCode < 48 || charCode > 57))
        //        return false;
        //    return true;
        //});

        $('.isNumber').keypress(function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            console.log(charCode);
            if (charCode == 45)
                return false;
            if (
                (charCode != 45 && charCode != 8 || $(this).val().indexOf('-') != -1) && // “-” CHECK MINUS, AND ONLY ONE.
                (charCode != 46 || $(this).val().indexOf('.') != -1) // “.” CHECK DOT, AND ONLY ONE.
                //($(this).val().indexOf('.') != -1) // “.” CHECK DOT, AND ONLY ONE.
                && (charCode < 48 || charCode > 57))
                return false;
            return true;
        });


        //$('.isNumber').keydown(function (event) {
        //    var charCode = (event.which) ? event.which : event.keyCode;
        //    if (charCode == 45)
        //        return false;
        //    if (
        //        (charCode != 45 && charCode != 8 || $(this).val().indexOf('-') != -1) && // “-” CHECK MINUS, AND ONLY ONE.
        //        //(charCode != 46 || $(this).val().indexOf('.') != -1) // “.” CHECK DOT, AND ONLY ONE.
        //        ($(this).val().indexOf('.') != -1) // “.” CHECK DOT, AND ONLY ONE.
        //        && (charCode < 48 || charCode > 57))
        //        return false;
        //    return true;
        //});
    },
    updateInputMoney: function (container) {
        container.find(".useMoney").each(function () {
            jQuery(this).simpleMoneyFormat();
        });
    },
    IsVideo: function (extension) {
        try {
            var args = extension.toLowerCase().split('.');
            var ext = args[args.length - 1];
            switch (ext) {
                case "3g2":
                    return true;
                case "3gp":
                    return true;
                case "3gp2":
                    return true;
                case "3gpp":
                    return true;
                case "avi":
                    return true;
                case "asf":
                    return true;
                case "asr":
                    return true;
                case "asx":
                    return true;
                case "dif":
                    return true;
                case "dv":
                    return true;
                case "ivf":
                    return true;
                case "flv":
                    return true;
                case "m4v":
                    return true;
                case "lsf":
                    return true;
                case "lsx":
                    return true;
                case "m1v":
                    return true;
                case "m2t":
                    return true;
                case "m2ts":
                    return true;
                case "m2v":
                    return true;
                case "mod":
                    return true;
                case "mov":
                    return true;
                case "movie":
                    return true;
                case "mp2":
                    return true;
                case "mp2v":
                    return true;
                case "mp4":
                    return true;
                case "mp4v":
                    return true;
                case "mpeg":
                    return true;
                case "mpe":
                    return true;
                case "mpa":
                    return true;
                case "mpg":
                    return true;
                case "mpv2":
                    return true;
                case "mqv":
                    return true;
                case "mts":
                    return true;
                case "nsc":
                    return true;
                case "qt":
                    return true;
                case "ts":
                    return true;
                case "tts":
                    return true;
                case "vbk":
                    return true;
                case "wm":
                    return true;
                case "wmp":
                    return true;
                case "wmv":
                    return true;
                case "wmx":
                    return true;
                case "wvx":
                    return true;
            }
        } catch (e) { }
        return false;
    },
    IsAudio: function (extension) {
        try {
            var args = extension.toLowerCase().split('.');
            var ext = args[args.length - 1];
            switch (ext) {
                case "aa":
                    return true;
                case "aac":
                    return true;
                case "aax":
                    return true;
                case "ac3":
                    return true;
                case "adt":
                    return true;
                case "adts":
                    return true;
                case "aif":
                    return true;
                case "aifc":
                    return true;
                case "aiff":
                    return true;
                case "au":
                    return true;
                case "caf":
                    return true;
                case "cdda":
                    return true;
                case "gsm":
                    return true;
                case "m3u":
                    return true;
                case "m3u8":
                    return true;
                case "m4a":
                    return true;
                case "m4b":
                    return true;
                case "m4p":
                    return true;
                case "m4r":
                    return true;
                case "mid":
                    return true;
                case "midi":
                    return true;
                case "mp3":
                    return true;
                case "pls":
                    return true;
                case "ra":
                    return true;
                case "ram":
                    return true;
                case "rmi":
                    return true;
                case "sd2":
                    return true;
                case "smd":
                    return true;
                case "smx":
                    return true;
                case "smz":
                    return true;
                case "snd":
                    return true;
                case "wav":
                    return true;
                case "wave":
                    return true;
                case "wax":
                    return true;
                case "wma":
                    return true;
            }
        } catch (e) { }

        return false;
    },
    getSerialize: function (form, event) {
        var keys = {};
        var buttons = {};
        var checkboxs = {};
        form.find("input, select, textarea,button").each(function () {
            var el = jQuery(this);
            var name = el.prop("name");
            if (!Utils.isEmpty(name)) {
                var tagName = el.prop("tagName").toLowerCase();
                if (tagName == "input") {
                    var type = el.prop("type").toLowerCase();
                    if (type == "text" || type == "password" || type == "hidden") {
                        if (!keys.hasOwnProperty(name)) {
                            keys[name] = [];
                        }
                        keys[name].push(el.val());
                    } else if (type == "checkbox" || type == "radio") {
                        if (el.prop("checked")) {
                            if (!keys.hasOwnProperty(name)) {
                                keys[name] = [];
                            }
                            keys[name].push(el.val());
                        }
                        if (!checkboxs.hasOwnProperty(name)) {
                            checkboxs[name] = 0;
                        }
                        checkboxs[name]++;
                    }
                } else if (tagName != "button") {
                    if (!keys.hasOwnProperty(name)) {
                        keys[name] = [];
                    }
                    keys[name].push(el.val());
                }
            }
        });

        for (var k in keys) {
            var vals = keys[k];
            if (vals.length == 1 || buttons.hasOwnProperty(k)) { //|| !checkboxs.hasOwnProperty(k)
                keys[k] = vals.join(",");
            } else {
                keys[k] = JSON.stringify(vals);
            }
        }
        return keys;
    },
    builderQString: function (data) {
        var queries = [];
        for (var i in data) {
            if (i == "RedirectPath")
                continue;

            if (!Utils.isEmpty(data[i])) {
                queries.push(i + "=" + data[i]);
            }
        }
        return ("?" + queries.join("&"));
    },
    b64toBlob: function (b64Data, contentType, sliceSize) {

        contentType = contentType || "";
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteLength = byteCharacters.length;
        var byteArrays = [];

        for (var offset = 0; offset < byteLength; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType, encoding: "utf-8" });
    },
    sendB64AsFile: function (settings, file) {

        var fileReader = new FileReader();
        fileReader.onabort = function (e) {
            if (settings.onClientAbort) {
                settings.onClientAbort(e);
            }
        };
        fileReader.onerror = function (e) {
            if (settings.onClientError) {
                settings.onClientError(e);
            }
        };
        fileReader.onload = function (e) {
            if (settings.onClientLoad) {
                settings.onClientLoad(e);
            }
        };
        fileReader.onloadend = function (e) {
            if (settings.onClientLoadEnd) {
                settings.onClientLoadEnd(e);
            }
        };
        fileReader.onloadstart = function (e) {
            if (settings.onClientLoadStart) {
                settings.onClientLoadStart(e);
            }
        };
        fileReader.onprogress = function (e) {
            if (settings.onClientProgress) {
                settings.onClientProgress(e);
            }
        };
        fileReader.readAsDataURL(file);
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.upload.onabort = function (e) {
            if (settings.onServerAbort) {
                settings.onServerAbort(e);
            }
        };
        xmlHttpRequest.upload.onerror = function (e) {
            if (settings.onServerError) {
                settings.onServerError(e);
            }
        };
        xmlHttpRequest.upload.onload = function (e) {
            if (settings.onServerLoad) {
                settings.onServerLoad(e);
            }
        };
        xmlHttpRequest.upload.onloadstart = function (e) {
            if (settings.onServerLoadStart) {
                settings.onServerLoadStart(e);
            }
        };
        xmlHttpRequest.upload.onprogress = function (e) {
            if (settings.onServerProgress) {
                settings.onServerProgress(e);
            }
        };
        xmlHttpRequest.onreadystatechange = function (e) {
            if (settings.onServerReadyStateChange) {
                settings.onServerReadyStateChange(e, xmlHttpRequest.readyState);
            }
            if (settings.onSuccess && xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
                try {
                    settings.onSuccess(e, JSON.parse(xmlHttpRequest.responseText));
                } catch (e) {
                    settings.onClientError(e);
                    var message = jQuery(xmlHttpRequest.responseText).find("#MessageError");
                    if (message.length > 0) {
                        alert(message.text());
                    }
                }
            }
        };

        xmlHttpRequest.open("POST", settings.postUrl, true);
        if (file.getAsBinary) {
            var data = window.dashes + boundary + window.crlf
                + "Content-Disposition: form-data; name=\""
                + settings.name + "\";" + "filename=\""
                + unescape(encodeURIComponent(file.name)) + "\"" + window.crlf
                + "Content-Type: application/octet-stream" + window.crlf
                + window.crlf + file.getAsBinary() + window.crlf + window.dashes + boundary
                + window.dashes;
            xmlHttpRequest.setRequestHeader("Content-Type", "multipart/form-data;boundary=" + boundary);
            xmlHttpRequest.sendAsBinary(data);
        } else if (window.FormData) {
            var formData = new FormData();
            formData.append(settings.name, file, file.name);
            xmlHttpRequest.send(formData);
        }
    },
    reloadPage: function () {

        window.location.href = Utils.getRedirect();
    },
    resetSelectChild: function (obj) {
        try {
            var data = obj.getData();
            if (typeof data != 'undefined') {
                if (typeof data.targetChild != 'undefined') {
                    jQuery(data.targetChild).val("");
                    jQuery(data.targetChild).html("");
                    jQuery(data.targetChild).selectpicker('refresh');

                    Utils.resetSelectChild(jQuery(data.targetChild));
                }
            }
        } catch (e) {

        }
    },
    getRedirect: function () {

        var href = window.location.href;
        if (href.indexOf("#") != -1) {
            href = href.substring(0, href.indexOf("#"));
        }
        if (href.indexOf("rand=") != -1) {
            href = href.replace(/(rand=)[a-z|0-9]+/ig, '$1' + (new Date()).getTime());
        }
        else if (href.indexOf("?") != -1) {
            href += "&rand=" + (new Date()).getTime();
        }
        else {
            href += "?rand=" + (new Date()).getTime();
        }

        return href;
    },
    getDomain: function () {

        var domain = window.location.protocol
        domain += "//";
        domain += window.location.hostname;
        if (window.location.port !== "") {
            domain += ":";
            domain += window.location.port;
        }
        return domain;
    },
    popover: function (container) {
        container.find('[data-toggle=\"popover\"]').popover({ html: true });
    },
    toggleMultiTicks: function (table) {

        var flag = false;
        var wrapper = table.closest(".dataTables_wrapper");
        var actions = wrapper.find(".actMultiTicks");
        var grouper = wrapper.find(".group-checkable");
        table.find(".checkboxes").each(function () {
            if (jQuery(this).prop("checked")) {
                actions.removeClass("hidden");
                flag = true;
                return false;
            }
        });
        if (!flag) {
            actions.addClass("hidden");
            if (grouper.prop("checked"))
                grouper.prop("checked", false);
        }
    },

    toggleOnlyTick: function (table) {
        var flag = false;
        var wrapper = table.closest(".dataTables_wrapper");
        var actions = wrapper.find(".actMultiTicks");
        var grouper = wrapper.find(".group-checkable");
        table.find(".check").each(function () {
            if (jQuery(this).prop("checked")) {
                actions.removeClass("hidden");
                flag = true;
                return false;
            }
        });
        if (!flag) {
            actions.addClass("hidden");
            if (grouper.prop("checked"))
                grouper.prop("checked", false);
        }
    },

    updateTab: function (container) {
        if (container.hasClass("useTabs")) {
            container.tabs();
        }
        container.find(".useTabs").tabs();
    },
    bootstrapValidator: function (obj) {
        if (!obj.hasClass("bootstrapValidator")) {
            obj.addClass("bootstrapValidator").bootstrapValidator();
        }
    },
    updateFormState: function (container) {

        try {
            if (container.hasClass("validateForm")) {
                Utils.bootstrapValidator(container);
            }
            container.find(".validateForm").each(function () {
                Utils.bootstrapValidator(jQuery(this));
            });
            //container.find(".form-control textarea:visible, .form-control input[type='text']:visible").each(function () {
            //    if (Utils.isEmpty(jQuery(this).val())) {
            //        jQuery(this).focus();
            //        return false;
            //    }
            //});
            container.find("select").unbind("mousewheel")
                .bind("mousewheel", "select", function (e) {
                    e.stopPropagation();
                });

            var redirectPath = Utils.getRedirect();
            if (container.prop("tagName") === "FORM") {
                if (!container.hasClass("noredirect")) {
                    var redirects = container.find("input[name='RedirectPath']");
                    if (redirects.length == 0) {
                        var inputRedirect = jQuery("<input type='hidden' class='redirectauto' />");
                        inputRedirect.attr("name", "RedirectPath");
                        inputRedirect.val(redirectPath);
                        container.append(inputRedirect);
                    } else if (redirects.hasClass("redirectauto")) {
                        redirects.val(redirectPath);
                    }
                }
            } else {
                container.find("form").each(function () {
                    if (!jQuery(this).hasClass("noredirect")) {
                        var redirects = jQuery(this).find("input[name='RedirectPath']");
                        if (redirects.length == 0) {
                            var inputRedirect = jQuery("<input type='hidden' class='redirectauto'/>");
                            inputRedirect.attr("name", "RedirectPath");
                            inputRedirect.val(redirectPath);
                            jQuery(this).append(inputRedirect);
                        } else if (redirects.hasClass("redirectauto")) {
                            redirects.val(redirectPath);
                        }
                    }
                });
            }
            jQuery(".slChangeFT").trigger("change");
        } catch (e) {
            console.log(e);
        }
    },
    updateSelectbox: function (container) {

        container.find(".selectbox").selectbox({
            effect: "slide",
            classHolder: "sbHolder form-control"
        });
        container.find(".inputchoises").each(function () {
            var choises = [];
            var data = jQuery.parseJSON(jQuery(this).attr("data-choises"));
            for (var i in data) {
                var choise = data[i];
                choises.push({
                    value: choise.Name,
                    label: choise.Name,
                });
            }
            var id = jQuery(this).attr("id");
            if (Utils.isEmpty(id)) {
                id = "IChoise" + (new Date()).getTime();
                jQuery(this).attr("id", id);
            }
            jQuery("#" + id).autocomplete({
                source: choises,
                minLength: 0,
                select: function (event, ui) {

                }
            }).click(function () {
                jQuery(this).autocomplete("search", "");
            }).focus(function () {
                jQuery(this).autocomplete("search", "");
            });
        });
    },
    updateInputDate: function (container) {
      
        container.find(".date").each(function () {
            var id = jQuery(this).attr("id");
            if (Utils.isEmpty(id)) {
                id = "IDate" + (new Date()).getTime();
                jQuery(this).attr("id", id);
            }
            jQuery("#" + id).datetimepicker({
                timepicker: false,
                format: "d-m-Y",
                lang: "vi",
                onSelectDate: function (dateText, inst) {
                    //alert(inst.val());
                    // Nghĩa viết . . . .
                    var thisInput = $(inst);
                    var data = thisInput.getDataUppername();
                    var form = thisInput.closest('form');
                    if (!Utils.isEmpty(data.Target)) {
                        var tagets = data.Target.split(',');
                        var operators = data.Operator.split(',');
                        var errMessages = data.ErrMessage.split(',');
                        var isErr = false;
                        var errMessageShows = [];
                        for (let i = 0; i < tagets.length; i++) {
                            try {
                                var target = $(tagets[i]);
                                var thisVal = thisInput.val();
                                var targetVal = target.val();
                                if (!Utils.isEmpty(thisVal) || !Utils.isEmpty(targetVal)) {
                                    var thisDate = Date.parse(thisVal.split("-").reverse().join("-"));
                                    var targetDate = Date.parse(targetVal.split("-").reverse().join("-"));
                                    var operator = operators[i];
                                    var errMessage = errMessages[i];
                                    if (operator == "<") {
                                        if (thisDate < targetDate) {
                                            errMessageShows.push(errMessage);
                                        }
                                    }
                                    else if (operator == ">") {
                                        if (thisDate > targetDate) {
                                            errMessageShows.push(errMessage);
                                        }
                                    }
                                };
                            } catch (e) {
                                console.log(e);
                            }

                        }
                        if (errMessageShows.length > 0) {
                            Utils.autoCloseAllFlash();
                            for (let i = 0; i < errMessageShows.length; i++) {
                                Utils.setError(errMessageShows[i]);
                            }
                            CUtils.closeSubmit(form);
                        } else {
                            CUtils.openSubmit(form);
                            Utils.autoCloseAllFlash();
                        }
                        //var target = $(data.Target);
                        //var thisVal = thisInput.val();
                        //var targetVal = target.val();
                        //var thisDate = Date.parse(thisVal.split("-").reverse().join("-"));
                        //var targetDate = Date.parse(targetVal.split("-").reverse().join("-"));
                        //var isErr = false;
                        //if (data.Operator == "<") {
                        //    if (thisDate < targetDate) {
                        //        isErr = true;
                        //        CUtils.closeSubmit(form);
                        //    }
                        //}
                        //else if (data.Operator == ">") {
                        //    if (thisDate > targetDate) {
                        //        isErr = true;
                        //        CUtils.closeSubmit(form);
                        //    }
                        //};
                        //if (isErr) {
                        //    Utils.setError(data.ErrMessage);
                        //    Utils.autoCloseAllFlash();

                        //} else {
                        //    CUtils.openSubmit(form);
                        //}
                    }

                },
                onChangeDateTime: function (dp, input) {
                    try {
                        var thisInput = jQuery(input);
                        var name = thisInput.attr("name");
                        var form = thisInput.closest("form");
                        if (thisInput.attr("data-bv-field") != undefined && form.hasClass("bootstrapValidator")) {
                            form.bootstrapValidator('revalidateField', name);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                },

                scrollMonth: false,
                scrollInput: false
            });
        });
        container.find(".day").each(function () {
            var id = jQuery(this).attr("id");
            var today = new Date();
            var startDate = new Date(today.getFullYear(), 2, 1);
            var endDate = new Date(today.getFullYear(), 2, 28);
            if (Utils.isEmpty(id)) {
                id = "IDate" + (new Date()).getTime();
                jQuery(this).attr("id", id);
            }
            jQuery("#" + id).datetimepicker({
                timepicker: false,
                format: "d",
               // format: "d",
                lang: "vi",
                minViewMode: 1,
                autoclose: true,
                startDate: startDate,
                endDate: endDate,
                scrollInput: false,
                onChangeDateTime: function (dp, input) {
                    try {
                        var thisInput = jQuery(input);
                        var name = thisInput.attr("name");
                        var form = thisInput.closest("form");
                        if (thisInput.attr("data-bv-field") != undefined && form.hasClass("bootstrapValidator")) {
                            form.bootstrapValidator('revalidateField', name);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }

            });
        });
        container.find(".datetime").each(function () {

            var id = jQuery(this).attr("id");
            if (Utils.isEmpty(id)) {
                id = "IDatetime" + (new Date()).getTime();
                jQuery(this).attr("id", id);
            }
            jQuery("#" + id).datetimepicker({
                format: "d-m-Y H:i",
                lang: "vi",
                scrollInput: false,
                onChangeDateTime: function (dp, input) {
                    var name = jQuery(input).attr("name");
                    var form = jQuery(input).closest("form");
                    if (form.hasClass("bootstrapValidator")) {
                        form.bootstrapValidator('revalidateField', name);
                    }
                }
            });
        });
        container.find(".rangepicker").each(function () {
            var id = jQuery(this).attr("id");
            if (Utils.isEmpty(id)) {
                id = "IDatetime" + (new Date()).getTime();
                jQuery(this).attr("id", id);
            }
            jQuery("#" + id).daterangepicker();
        });
        jQuery(".timepicker").datetimepicker({
            timepicker: true,
            datepicker: false,
            format: "H:i",
            lang: "vi",
            scrollInput: false,
            step: 15
        });
    },
    updateScrollBar: function (container) {
        if (container.hasClass("ps-container")) {
            container.perfectScrollbar("destroy");
            container.perfectScrollbar({
                useBothWheelAxes: false, wheelPropagation: true
            });
        }
        if (container.hasClass("useScrollBar")) {
            container.perfectScrollbar({
                useBothWheelAxes: false, wheelPropagation: true
            });
        }
        container.find(".useScrollBar").perfectScrollbar({
            useBothWheelAxes: false, wheelPropagation: true
        });
    },
    updateChart: function (container) {
        container.find(".chartViewer").each(function () {
            try {
                var dataChart = jQuery(this).find(".dataChart").val();
                if (typeof dataChart != "undefined") {
                    dataChart = jQuery.parseJSON(dataChart);
                    jQuery(this).fadeIn("200", function () {
                        jQuery(this).highcharts(dataChart);
                        try {
                            var step = 5;
                            var max = dataChart.chart.columns;
                            var chartViewer = jQuery(this);
                            chartViewer.attr("data-max", max);
                            chartViewer.attr("data-from", 0);
                            chartViewer.attr("data-to", step);
                            chartViewer.attr("data-step", step);
                            if (max > step) {
                                chartViewer.append(jQuery("<button type='button'>")
                                    .addClass("btn btn-xs btn-info prevChart")
                                    .append(jQuery("<i class='glyphicon glyphicon-arrow-left'></i>")))
                                chartViewer.append(jQuery("<button type='button'>")
                                    .addClass("btn btn-xs btn-info nextChart")
                                    .append(jQuery("<i class='glyphicon glyphicon-arrow-right'></i>")))
                            }

                            var chart = jQuery(this).highcharts();
                            chart.xAxis[0].setExtremes(0, step);
                        } catch (e) { }
                    });
                }
            } catch (e) {
                console.log(e);
            }
        });
        container.find(".chartBeyondPlot").each(function () {
            if (!jQuery(this).hasClass("builded")) {
                jQuery(this).addClass("builded");

                try {
                    var dataChart = jQuery(this).find(".dataChart").val();
                    if (typeof dataChart != "undefined") {
                        dataChart = jQuery.parseJSON(dataChart);
                        jQuery.plot(jQuery(this), dataChart, {
                            series: {
                                pie: {
                                    innerRadius: 0.45,
                                    show: true,
                                    stroke: {
                                        width: 4
                                    }
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
    },
    updatePlayer: function (container) {
        container.find(".media-player").each(function () {
            var url = jQuery(this).attr("data-value");
            var video = jQuery(this).attr("data-video");
            jwplayer(jQuery(this).attr("id")).setup({
                flashplayer: "/stg/plugins/player.swf",
                controlbar: "bottom",
                width: 400,
                height: video == "1" ? 280 : 24,
                background: "#fff",
                autostart: "false",
                plugins: {
                    'timeslidertooltipplugin-1': {},
                    'captions': {
                        color: "#ffff80",
                        fontFamily: "Tahoma, Geneva, sans-serif",
                        fontSize: "17",
                        fontWeight: "normal"
                    }
                },
                //'proxy.file': "",
                'file': Cdata.Storage.domain + "/" + url
            });
            jQuery(this).addClass("player");
        });
    },
    updateImageViewer: function () {
        try {
            var thumbUrl = jQuery("#ViewerIMG").attr("src");
            var thumbMapUrl = jQuery("#PathThumbMap").val();
            var settings = {
                'viewportWidth': '100%',
                'viewportHeight': '100%',
                'fitToViewportShortSide': true,
                'contentSizeOver100': true,
                'loadingBgColor': '#ffffff',
                'startScale': .2,
                'startX': 0,
                'startY': 0,
                'animTime': 500,
                'draggInertia': 10,
                'zoomLevel': 1,
                'zoomStep': 0.1,
                'contentUrl': thumbUrl,
                'intNavEnable': true,
                'intNavPos': 'TR',
                'intNavAutoHide': true,
                'intNavMoveDownBtt': true,
                'intNavMoveUpBtt': true,
                'intNavMoveRightBtt': true,
                'intNavMoveLeftBtt': true,
                'intNavZoomBtt': true,
                'intNavUnzoomBtt': true,
                'intNavFitToViewportBtt': true,
                'intNavFullSizeBtt': true,
                'intNavBttSizeRation': 1,
                'mapEnable': false,
                'mapThumb': thumbMapUrl,
                'mapPos': 'BL',
                'popupShowAction': 'click',
                'testMode': false
            };
            jQuery('#DocProIMGMap').lhpMegaImgViewer(settings, 'DocProHotspots');
        }
        catch (e) {
            console.log(e);
        }
    },

    updatePDFViewer: function (response) {
        try {
            OCR.reset();
        }
        catch (e) { }

        try {
            window.webViewerLoad(true);
        } catch (e) {
            console.log(e);
        }
    },
    openOverlay: function (overide) {

        if (overide != undefined || jQuery("#Overlay").is(":visible") == false) {
            jQuery("#Overlay").addClass("loadingc").fadeIn("fast");
            Utils.autoResize();
        }
    },
    closeOverlay: function (overide) {
        try {
            if (overide != undefined || jQuery(".ui-dialog:visible").length < 1) {

                //var abv = jQuery(".ui-dialog").find(".removeHide");
                //if (abv.length > 0)
                //    abv.each(function () {
                //        $(this).remove();
                //    });

                jQuery("#Overlay").removeClass("loadingc").fadeOut("fast");
                jQuery(".ui-dialog-content:visible").dialog("close");
                jQuery(".hiddenDialog").removeClass("hiddenDialog");
                jQuery("body").removeClass("noscroll");
            }
        } catch (e) {
            console.log(e);
        }

    },
    closeCDialog: function (dialoger, invoker) {
        dialoger.closest(".ui-dialog").removeClass("hiddenDialog");
        var hiddenDialogs = jQuery(document).find(".hiddenDialog");
        if (hiddenDialogs.length > 0) {
            hiddenDialogs.last().removeClass("hidden");
        } else {
            Utils.closeOverlay();
        }
        if (dialoger.closest(".ui-dialog").hasClass("refresh")) {
            window.location.href = Utils.getRedirect();
        }
        if (invoker) {
            dialoger.closest(".ui-dialog").find(".ui-dialog-content:visible").dialog("close");
        }

    },
    autoOpenDialog: function (dialoger) {

        var width = dialoger.getData().width || 600;
        var idDialoger = dialoger.attr("id");
        var maxH = jQuery(window).height();
        if (Utils.notEmpty(idDialoger)) {
            jQuery('.ui-dialog:visible').addClass("hidden hiddenDialog");
            jQuery('div[aria-describedby="' + idDialoger + '"]').detach();
            dialoger.dialog({
                width: width,
                resizable: false,
                open: function () {
                    if (maxH < dialoger.height()) {
                        dialoger.css("height", maxH - 150);
                    }
                    Utils.openOverlay();
                    Utils.autoResize();
                    jQuery("#Overlay").removeClass("loading")
                },
                close: function () {

                    Utils.closeCDialog(jQuery(this));
                }
            });
        }

    },
    flash_position: function () {
        var bottom = 0;
        var length = jQuery("#Section").children('[class*="flash-"]').length;
        for (i = 0; i < length; i++) {
            jQuery("#Section").children('[class*="flash-"]').eq(i).css('bottom', bottom + 20);
            var height = jQuery("#Section").children('[class*="flash-"]').eq(i).outerHeight(true);
            bottom = bottom + height + 20;

        }

    },
    autoCloseFlash: function () {
        var flashCount = 0;
        jQuery(".flash-success").each(function () {
            flashCount++;
            jQuery(this).delay(flashCount * 1000).fadeOut("fast");
        });
    },
    autoCloseAllFlash: function () {
        var flashCount = 0;
        jQuery(".flash").each(function () {
            flashCount++;
            jQuery(this).delay(flashCount * 500).fadeOut("fast");
        });
    },
    autoResize: function () {
        try {
            jQuery(".ui-dialog-content:visible").each(function () {
                jQuery(this).dialog("option", "position", jQuery(this).dialog("option", "position"));
            });

        } catch (e) {
        }
    },

    validateDataForm: function (form) {
        form.find("input[type='text'], input[type='password'], textarea, select").each(function () {

            var num = jQuery(this).removeClass("error").val();
            num = Utils.rmSpace(num);

            if (jQuery(this).hasClass('checkngay')) {
                if (!Utils.isEmpty(num)) {
                    if (!jQuery.isNumeric(num) || parseInt(num) > 31 || parseInt(num) < 1) {
                        jQuery(this).addClass("error");
                    } else {
                        if (num.length == 1) {
                            num = "0" + num;
                        }
                        jQuery(this).val(num);
                    }
                }
            }
            else if (jQuery(this).hasClass('checkthang')) {
                if (!Utils.isEmpty(num)) {
                    if (!jQuery.isNumeric(num) || parseInt(num) > 12 || parseInt(num) < 1) {
                        jQuery(this).addClass("error");
                    } else {
                        if (num.length == 1) {
                            num = "0" + num;
                        }
                        jQuery(this).val(num);
                    }
                }
            }
            else if (jQuery(this).hasClass('checknam')) {
                if (!Utils.isEmpty(num)) {
                    if (!jQuery.isNumeric(num) || parseInt(num) < 1900 || parseInt(num) > 2015) {
                        jQuery(this).addClass("error");
                    } else {
                        jQuery(this).val(num);
                    }
                }
            }
            else if (jQuery(this).hasClass('checkint')) {
                if (!Utils.isEmpty(num)) {
                    if (!jQuery.isNumeric(num) || num.indexOf(".") != -1 || num.indexOf(",") != -1) {
                        jQuery(this).addClass("error");
                    } else {
                        jQuery(this).val(num);
                    }
                }
            }

            if (jQuery(this).hasClass('checkrequired')) {
                if (Utils.isEmpty(num)) {
                    jQuery(this).addClass("error");
                }
                else if (jQuery(this).prop("tagName") == "SELECT" && num == "0") {
                    jQuery(this).addClass("error");
                }
            }

            if (jQuery(this).hasClass('checkcompare')) {

                var comparator = jQuery(jQuery(this).attr("data-compare"));
                var valCompare = comparator.val();
                if (valCompare != num) {
                    jQuery(this).addClass("error");
                    comparator.addClass("error");
                }
            }
        });

        var elErrors = form.find(".error");
        if (elErrors.length > 0) {
            var messages = [];
            elErrors.each(function () {
                var data = jQuery(this).getDataUppername();
                if (!Utils.isEmpty(data.MessageNotEmpty))
                    messages.push(data.MessageNotEmpty);
            });
            if (messages.length > 0) {
                alert(messages.join("\n"));
            }
            var elError = elErrors.first().focus();
            if (!elError.is(":visible")) {
                elError.closest(".group-tab").find(".tab-data").addClass("hidden");
                var idTab = elError.closest(".tab-data").removeClass("hidden").attr("id");

                elError.closest(".group-tab").find(".tabitem").removeClass("active");
                elError.closest(".group-tab").find(".tabitem[data-tab='#" + idTab + "']").addClass("active");
            }
            return false;
        }
        return true;
    },
    firstFocus: function (container) {
        breakFocus = false;
        container.find("input, textarea").each(function () {
            if (!breakFocus) {
                if (jQuery(this).is(":visible")) {
                    jQuery(this).focus();
                    breakFocus = true;
                }
            }
        });
    },
    summernoteValidator: function (target) {
        target.find('form').validate({
            errorElement: "div",
            errorClass: 'is-invalid',
            validClass: 'is-valid',
            ignore: ':hidden:not(.summernote),.note-editable.card-block',
            errorPlacement: function (error, element) {
                // Add the `help-block` class to the error element
                error.addClass("invalid-feedback");
                console.log(element);
                if (element.prop("type") === "checkbox") {
                    error.insertAfter(element.siblings("label"));
                } else if (element.hasClass("summernote")) {
                    error.insertAfter(element.siblings(".note-editor"));
                } else {
                    error.insertAfter(element);
                }
            }
        });
    },
    sectionBuilder: function (response, options) {

        try {
            jQuery(".flash-success").remove();
            jQuery(".flash-error, .flash-warn").each(function () {
                if (jQuery(this).is(":visible") == false) {
                    jQuery(this).remove();
                }
            });
            if (response.hasOwnProperty("isTle")) {
                jQuery(document).prop("title", response.pgTle);
            }
            if (response.hasOwnProperty("isMsg")) {
                //Xóa các thông báo cũ
                $(".flash-error").remove();
                //if (options != true)
                jQuery("#Section").prepend(response.htMsg);
                if (!response.isErr)
                    Utils.closeCurrentDialog(true);
                Utils.autoCloseFlash();
            }
            if (response.hasOwnProperty("isLogout")) {
                jQuery("<div>").delay(1000).fadeOut("100",
                    function () {
                        window.location.href = jQuery("#bcrumdLogout").find("a").attr("href");
                    });
                return;
            }
            if (response.hasOwnProperty("isDL")) {
                var dialoger = jQuery(response.htDL);
                var idDialoger = dialoger.attr("id");
                if (Utils.notEmpty(idDialoger)) {
                    dialoger.find('.ui-dialog-title').first().text(response.title);
                    jQuery('.ui-dialog:visible').addClass("hidden hiddenDialog");
                    jQuery('div[aria-describedby="' + idDialoger + '"]').detach();
                    dialoger.dialog({
                        width: response.wDL,
                        resizable: false,
                        open: function () {
                            if (dialoger.hasClass("useScrollBar"))
                                jQuery(this).parent(".ui-dialog").addClass("hf50d");
                            Utils.openOverlay();
                            Utils.autoResize();
                            //
                            jQuery("#Overlay").removeClass("loading");
                        },
                        close: function () {

                            Utils.closeCDialog(jQuery(this));
                        }
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }

    },  

    ins2pos: function (insString, selector) {

        var val = jQuery(selector).val();
        try {
            var st = jQuery(selector).getSelectionStart();
            var ed = jQuery(selector).getSelectionEnd();
            var before = val.substring(0, st);
            var after = val.substring(ed, val.length);
            jQuery(selector).val(before + insString + after);
            jQuery(selector).setSelection(st + insString.length, st + insString.length);
        } catch (e) {
            jQuery(selector).val(val + insString);
        }
    },

    wordCount: function (string) {
        string = string.replace(/(<([^>]+)>)/ig, " ");
        string = string.replace(/&nbsp;/ig, " ");
        string = string.replace(/\s{2,}/g, ' ');
        string = jQuery.trim(string);
        var args = string.split(' ');
        return args.length;
    },

    getSumary: function (string, limit) {

        string = string.replace(/(<([^>]+)>)/ig, " ");
        string = string.replace(/&nbsp;/ig, " ");
        string = string.replace(/\s{2,}/g, " ");
        string = jQuery.trim(string);
        return string.substring(0, limit);
    },

    convertDate: function (strDate, format) {
        var date = new Date(strDate);
        return date.toDateFormat(format);
    },
    convertSize: function (size) {
        var mb = parseInt(size) / 1024 / 1024;
        if (mb < 1) {
            var kb = parseInt(size) / 1024;
            if (kb < 1) {
                return size + " B";
            } else {
                return kb.toFixed(2) + " KB";
            }
        } else {
            return mb.toFixed(2) + " MB";
        }

    },
    setPageViewrPdf: function () {
        try {
            var fileViewer = jQuery("#FileViewer");
            if (fileViewer.length > 0) {
                fileViewer = fileViewer.first();
                setTimeout(function () {
                    PDFViewerApplication.page = fileViewer.attr('data-page');
                }, 500);

            }
        } catch (e) { }
    },
    destroyValidator: function (container) {
        try {
            if (container.hasClass("bootstrapValidator")) {
                container.removeClass("bootstrapValidator").bootstrapValidator('destroy');
            }
        }
        catch (e) {
        }
    },
    resetValidator: function (container) {
        try {
            if (container.hasClass("bootstrapValidator")) {
                container.removeClass("bootstrapValidator").bootstrapValidator('destroy');
            }
        } catch (e) {
        }
        Utils.bootstrapValidator(container);
    },
    resetTableFix: function (container) {
        try {
            var left = container.attr("data-fix-left");
            var right = container.attr("data-fix-right");
            container.tableHeadFixer({
                "left": left,
                "right": right
            });
        }
        catch (e) {
        }
    },
    mergeFilter: function (obj, data) {

        if (Utils.isEmpty(data))
            data = {};

        var dataFilter = obj.getDataUppername();
        if (!Utils.isEmpty(dataFilter.FilterName) && !Utils.isEmpty(dataFilter.FilterSelector)) {
            var filterNames = dataFilter.FilterName.split(',');
            var filterSelectors = dataFilter.FilterSelector.split(',');
            for (var i in filterNames) {
                var key = filterNames[i];
                data[key] = jQuery(filterSelectors[i]).val()
            }
        }
        return data;
    },
};

var Smile = {

    smileurl: '',
    smileitems: {},
    init: function () {
        Smile.smileurl = typeof Cdata.Storage != 'undefined'
            ? Cdata.Storage.urlSmile
            : '';
        Smile.smilelist();
    },

    smiles: function (str) {

        try {
            for (var i in Smile.smileitems) {
                if (Smile.smileitems.hasOwnProperty(i)) {
                    while (str.indexOf(i) !== -1) {
                        str = str.replace(i, Smile.smileitems[i]);
                    }
                }
            }
        } catch (e) {
        }
        return str;
    },

    smilelist: function () {
        Smile.smileitems = {};
        Smile.smileitems[":-)"] = "smile.png";
        Smile.smileitems[":)"] = "smile.png";
        Smile.smileitems[":]"] = "smile.png";
        Smile.smileitems["=)"] = "smile.png";
        Smile.smileitems[":-("] = "frown.png";
        Smile.smileitems[":("] = "frown.png";
        Smile.smileitems[":["] = "frown.png";
        Smile.smileitems["=("] = "frown.png";
        Smile.smileitems[":-O"] = "gasp.png";
        Smile.smileitems[":O"] = "gasp.png";
        Smile.smileitems[":-D"] = "grin.png";
        Smile.smileitems[":D"] = "grin.png";
        Smile.smileitems["=D"] = "grin.png";
        Smile.smileitems[":-p"] = "tongue.png";
        Smile.smileitems[":p"] = "tongue.png";
        Smile.smileitems["=P"] = "tongue.png";
        Smile.smileitems[";-)"] = "wink.png";
        Smile.smileitems[";)"] = "wink.png";
        Smile.smileitems[":3"] = "curlylips.png";
        Smile.smileitems[":-*"] = "kiss.png";
        Smile.smileitems[":*"] = "kiss.png";
        Smile.smileitems[">:-("] = "grumpy.png";
        Smile.smileitems[">:("] = "grumpy.png";
        Smile.smileitems["8)"] = "glasses.png";
        Smile.smileitems["B-)"] = "glasses.png";
        Smile.smileitems["B)"] = "glasses.png";
        Smile.smileitems["8-|"] = "sunglasses.png";
        Smile.smileitems["8|"] = "sunglasses.png";
        Smile.smileitems["B|-"] = "sunglasses.png";
        Smile.smileitems["B|"] = "sunglasses.png";
        Smile.smileitems[">:O"] = "upset.png";
        Smile.smileitems[">:-O"] = "upset.png";
        Smile.smileitems[">:o"] = "upset.png";
        Smile.smileitems[">:-o"] = "upset.png";
        Smile.smileitems["o.O"] = "confused.png";
        Smile.smileitems["O.o"] = "confused.png";
        Smile.smileitems["(^^^)"] = "shark.gif";
        Smile.smileitems[":v"] = "pacman.png";
        Smile.smileitems["O:)"] = "angel.png";
        Smile.smileitems["O:-)"] = "angel.png";
        Smile.smileitems["3:)"] = "devil.png";
        Smile.smileitems["3:-)"] = "devil.png";
        Smile.smileitems[":-/"] = "unsure.png";
        Smile.smileitems[":\\"] = "unsure.png";
        Smile.smileitems[":-\\"] = "unsure.png";
        Smile.smileitems[":'("] = "cry.png";
        Smile.smileitems[":putnam:"] = "putnam.gif";
        Smile.smileitems[":|]"] = "robot.gif";
        Smile.smileitems["<3"] = "heart.png";
        Smile.smileitems["<(“)"] = "penguin.gif";
        Smile.smileitems[":poop:"] = "poop-smiley.png";

        var html = "";
        for (var i in Smile.smileitems) {
            if (Smile.smileitems.hasOwnProperty(i)) {
                var filename = Smile.smileitems[i];
                var title = filename.split(".");
                html += "<img src=\"" + Smile.smileurl + "/" + Smile.smileitems[i] + "\" data-value=\"" + i + "\" title=\"" + title[0] + "\" />";;
                Smile.smileitems[i] = "<img src=\"" + Smile.smileurl + "/" + Smile.smileitems[i] + "\" title=\"" + title[0] + "\" />";
            }
        }
        jQuery(".showsmiles").bind("click", function () {
            if (!jQuery(this).hasClass("hasboxsmiles")) {
                jQuery(".showsmiles").addClass("hasboxsmiles");
                jQuery(".boxsmiles").append(html);
                jQuery(".boxsmiles").find("img").bind("click", function () {
                    var selector = jQuery(this).closest(".boxsmiles").attr("data-selector");
                    Utils.ins2pos(jQuery(this).attr("data-value"), selector);
                    return false;
                });
                jQuery(".boxsmiles").hover(function () {
                    jQuery(this).show();
                }, function () {
                    jQuery(this).hide();
                });
            }
            jQuery(this).find(".boxsmiles").show();
        });
        jQuery(".replace-smiles").each(function () {
            var html = jQuery(this).html();
            jQuery(this).html(Smile.smiles(html));
        });
    }
};
var Cdata = {
    init: function () {
        try {
            var data = jQuery("#CDATA").val();
            var dataJson = jQuery.parseJSON(data);
            for (var k in dataJson) {
                if (dataJson.hasOwnProperty(k)) {
                    Cdata[k] = dataJson[k];
                }
            }


        } catch (e) {
        }
    },
    SrcPath: function (path) {
        return Cdata.Storage.urlFile + "/" + path; //Cdata.Storage.domain +
    }
};
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
Date.prototype.toDateFormat = function (format) {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var h = this.getHours().toString();
    var m = this.getMinutes().toString();

    mm = (mm[1] ? mm : "0" + mm[0]);
    dd = (dd[1] ? dd : "0" + dd[0]);
    h = (h[1] ? h : "0" + h[0]);
    m = (m[1] ? m : "0" + m[0]);

    var value = "";
    switch (format) {
        case "dd-MM-yyyy HH:mm":
            value = dd + "-" + mm + "-" + yyyy + " " + h + ":" + m;
            break;
        default:
            value = dd + "-" + mm + "-" + yyyy;
            break;
    }
    return value;
};
String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
};
jQuery.fn.extend({
    reset: function () {
        try {
            this.each(function () {
                this.reset();
            });
            jQuery(jQuery(this).attr("data-html-reset")).html("");
        } catch (e) {
        }
    },
    getData: function () {
        var data = {};
        try {
            this.each(function () {
                jQuery.each(this.attributes, function () {
                    var name = this.name.toLowerCase();
                    if (name.indexOf("data-") === 0) {
                        var k = "";
                        var args = name.split("-");
                        for (var n = 0; n < args.length; n++) {
                            if (n == 0) continue;
                            if (n == 1) {
                                k += args[n];
                            }
                            else {
                                k += args[n].capitalize()
                            }
                        }
                        data[k] = this.value;
                    }
                });
            });
        } catch (e) {
        }
        return data;
    },
    getDataUppername: function () {
        var data = {};
        try {
            this.each(function () {
                jQuery.each(this.attributes, function () {
                    var name = this.name.toLowerCase();
                    if (name.indexOf("data-") === 0) {
                        var k = "";
                        var args = name.split("-");
                        for (var n = 0; n < args.length; n++) {
                            if (n == 0) continue;
                            var v = args[n];
                            if (v == "id") {
                                k += v.toUpperCase();
                            }
                            else {
                                k += v.capitalize()
                            }
                        }
                        data[k] = this.value;
                    }
                });
            });
        } catch (e) {
        }
        return data;
    }
});
var CustomValidator = {

    ServiceFormFiles: function (value, validator) {
        return jQuery(validator.$form).find(".ServiceFormFiles").find(".fileitem").length > 0;
    },
    SelectorRequired: function (value, validator, field) {
        var data = field.getData();
        var isValid = field.find(data.selector).length > 0;
        if (!isValid && typeof data.triggerClick != "undefined") {
            jQuery(data.triggerClick).trigger("click");
        }
        return isValid;
    }
}
var Callbacks = {

    ServiceFormFiles: function (value, validator) {
        return jQuery(validator.$form).find(".ServiceFormFiles").find(".fileitem").length > 0;
    },
    JobExecutors: function (value, validator) {
        var rs = jQuery(validator.$form).find(".JobExecutors").find(".scrollItem").length > 0;
        if (!rs) {
            jQuery("#tabJobCrExecutors").trigger("click");
        }
        return rs;
    },
    WorkflowStepExecutors: function (value, validator, field) {
        return field.prevObject.find(".tickItem").length > 0;
    },

}

var CUtils = {
    refreshCountTable: function (tbody) {
        var childs = tbody.children();
        for (var i = 0; i <= childs.length; i++) {
            tbody.find("tr:nth-child(" + i + ") td:first-child").html((i));
        }
    },
    closeSubmit: function (form) {
        var btnSubmit = form.find("button[type='submit']");
        form.addClass('submiting');
        btnSubmit.attr("disabled", "disabled");
    },
    openSubmit: function (form) {
        var btnSubmit = form.find("button[type='submit']");
        form.removeClass('submiting');
        btnSubmit.removeAttr("disabled");
    }
};



