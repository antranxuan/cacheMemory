var Main = {
    init: function () {

        Main.onEvent();
        Main.upEvent();
        Main.backLink();
    },
    upEvent: function (container) {
        if (Utils.isEmpty(container))
            container = jQuery(document);
        container.find(".useSlider").each(function () {
            var obj = $(this);
            if (!obj.hasClass("initedSlider")) {
                obj.addClass("initedSlider");
                var sliderBar = obj.find(".slider-bar");
                var progress = sliderBar.attr("data-progress");
                sliderBar.noUiSlider({
                    range: [0, 100],
                    start: progress,
                    step: 1,
                    handles: 1,
                    connect: "lower",
                    serialization: {
                        resolution: 1,
                        to: [$("#low"), 'html']
                    }
                });


            }

            //useSlider_percent.show();
        }).on("change", function () {
            var percent = $(this).find("[data-style='left']").attr("style").split(" ")[1].replace("%;", "");
            $(this).find("[Name='Progress']").attr("value", percent);
            $(this).find(".SliderPercentCount").html(percent);
        });

        container.find(".useDragable").draggable({
            cursorAt: { left: 5 }
        });

        container.find(".secrtc2").resizable({
            handles: "w",
            maxWidth: 700,
            minWidth: 7,
            resize: function (event, ui) {
                jQuery(this).find(".clsr").removeClass("awl");
                jQuery(this).removeClass("closed").css("left", "0");
                jQuery(this).parent().find(".secrtc1").removeClass("frt").css("width", "calc((100%) - " + ui.size.width + "px)");
            }
        });
        container.find(".selectpicker").each(function () {
            jQuery('.selectpicker').selectpicker();
        });

        Cust.dataTables_filter_col();
        container.find('.dataTables_wrapper .table:not(.useTreegrid)').each(function () {
            if (!$(this).hasClass("stacktable_inited") && !$(this).hasClass("not_js_responsive")) {
                $(this).addClass("stacktable_inited");
                $(this).stacktable();
            }
        });
        container.find(".selectpicker").selectpicker();
        container.find(".useTableFix").each(function () {
            try {
                var left = $(this).attr("data-fix-left");
                var right = $(this).attr("data-fix-right");

                if (!$(this).hasClass("table_fix_inited")) {
                    $(this).tableHeadFixer({
                        "left": left,
                        "right": right
                    });
                    $(this).addClass("table_fix_inited");
                }
            } catch (e) {

            }
        });
        container.find(".editorSummernote").each(function () {
            if (!jQuery(this).hasClass("setSummernote")) {
                var summer = jQuery(this);
                summer.addClass("setSummernote").summernote({
                    height: '200px'
                });
                var x = summer.next()
                console.log(x)
                x.on("change", function (e) {
                    alert(e)
                })
                if (summer.hasOwnProperty("data-bv-notempty") && summer.attr("data-bv-notempty") == true) {
                }
            }
        });
        container.find(".useMoney").each(function () {
            jQuery(this).simpleMoneyFormat();

        }); ///main.js > upEvent()
        container.find(".nestable").each(function () {
            if (!jQuery(this).hasClass("setNestabled")) {
                var obj = jQuery(this);
                var maxDepth = obj.attr("data-max-depth") || 0;
                obj.addClass("setNestabled").nestable({
                    maxDepth: maxDepth
                }).on('change', function (e) {

                    var ids = [];
                    var idTheme = obj.attr("data-theme-id");
                    var idRegion = obj.attr("data-region-id");
                    var idDoctype = obj.attr("data-doctype-id");
                    var idPage = obj.attr("data-page-id");
                    var url = obj.attr("data-url");
                    var data = obj.nestable('serialize');

                    for (var i in data) {
                        var item = data[i];
                        ids.push(item.id);
                    }
                    if (!Utils.isEmpty(url)) {
                        var dataPost = {};
                        if (obj.hasClass("regions")) {
                            dataPost = {
                                IDTheme: idTheme,
                                IDPage: idPage || 0,
                                IDRegions: JSON.stringify(ids)
                            };
                        }
                        else if (obj.hasClass("doctypes")) {
                            dataPost = {
                                IDDoctype: idDoctype,
                                IDFieldSettings: JSON.stringify(ids)
                            };
                        }
                        else {
                            dataPost = {
                                IDTheme: idTheme,
                                IDRegion: idRegion,
                                IDPage: idPage || 0,
                                IDBlocks: JSON.stringify(ids)
                            };
                        }
                        if (obj.hasClass("withTicks")) {
                            var ticks = [];
                            obj.find(".checkboxes").each(function () {
                                if (jQuery(this).prop("checked")) {
                                    ticks.push(jQuery(this).attr("data-id"));
                                }
                            });;
                            dataPost.Ticks = JSON.stringify(ticks);
                        }

                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            url: url,
                            data: dataPost,
                            success: function (response) {
                                obj.closest(".ui-dialog").addClass("refresh");
                            }
                        });
                    }
                });
            }
        });
        container.find(".useSortable").each(function () {
            if (jQuery(this).hasClass("inited")) {
                jQuery(this).sortable("destroy");
            }
            jQuery(this).sortable({
                items: ".sortitem"
            });
        });
        container.find("select.autoSelect2").each(function () {

            if (!jQuery(this).hasClass("inited")) {
                try {
                    $(this).select2("destroy");
                } catch (e) {
                }
                $(this).addClass("inited").select2();
            }
        });
    },
    onEvent: function () {

        jQuery(document).on("click", ".copyHtml", function () {

            var randId = new Date().getTime();
            var data = jQuery(this).getDataUppername();
            var template = jQuery(data.Template).clone();
            template.find("input[type='textbox'],textarea").val("");
            template.find(".rand-id").each(function () {
                var id = jQuery(this).attr("id");
                var rel = jQuery(this).attr("data-rel");
                if (id) {
                    jQuery(this).attr("id", id.replace("Rand_ID", randId));
                }
                if (rel) {
                    jQuery(this).attr("data-rel", rel.replace("Rand_ID", randId));
                }
            });

            if (data.Type == "prepend") {
                jQuery(data.Target).prepend(template);
            }
            else if (data.Type == "replaceWith") {
                jQuery(data.Target).replaceWith(template);
            }
            else {
                jQuery(data.Target).append(template);
            }
        });

        jQuery(document).on("change",
            ".useMoney",
            function () {
                if (jQuery(this).val().charAt(0) == "0" && jQuery(this).val().length > 1) {
                    jQuery(this).val(jQuery(this).val().slice(1));
                }
            });
        jQuery(document).on('change', '.select_change_view', function (e) {
            var select = jQuery(this);
            var id = select.val();
            var id_target = select.attr("data-id-target");
            var url = select.attr('data-url');
            if (!url) {
                return;
            }
            var target = select.attr('data-target');
            jQuery.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                async: true,
                url: url,
                data: JSON.stringify({
                    'id': id,
                    'idtarget': id_target
                }),
                beforeSend: function () {
                    jQuery(target).html("");
                    jQuery(target).addClass("loading");
                },
                complete: function () {
                    jQuery(target).removeClass("loading");
                },
                error: function () {
                    jQuery(target).removeClass("loading");
                },
                dataType: "json",
                success: function (data) {
                    //Utils.sectionBuilder(data);

                    jQuery(target).removeClass("loading");
                    if (data.hasOwnProperty("isCust")) {
                        jQuery(target).html(data.htCust);
                        Cust.Scroll_table();
                        Utils.updateTab(jQuery(target));
                        Utils.updateInputDate(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Utils.updateIsNumber(jQuery(target));
                        Utils.resetValidator(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Cust.ImgBg_Scrollable(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent(jQuery(target));
                        Utils.popover(jQuery(target));
                        Cust.check_required_input();
                        Utils.autoResize();
                        //form.find(".selectpicker").not(".inited").selectpicker();
                        Main.upEvent();

                    }
                    select.closest('form').find("button[type='submit']").attr("disabled", false);
                    return false;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        });
        jQuery(document).on('change', '.autoFillData', function () {
            //idCTarget, idChangeField
            var valCTarget = $($(this).attr("data-idCTarget")).val();
            valCTarget = valCTarget.replaceAll(',', '').replaceAll('.', '');
            var valRatio = $('#ProjectCostRatio').attr('value');
            valCTarget = valCTarget * valRatio / 100;
            var idChangeField = $($(this).attr("data-idChangeField")).html(valCTarget);
            $($(this).attr("data-idChangeField")).attr("value", valCTarget);
            $($(this).attr("data-idChangeField")).trigger("change");
        });
        jQuery(document).on('change', '.autoCaculate', function () {
            //idCTarget, idChangeField
            var target = $($(this).attr("data-target"));
            var ProjectCostRatio = $(target.attr("data-idProjectCostRatio"));
            var TotalRewardFund = $(target.attr("data-idTotalRewardFund"));
            var Suggestion = $(target.attr("data-idSuggestion"));
            var ExecutiveRatio = $(target.attr("data-idExecutiveRatio"));
            var ExecutiveFund = $(target.attr("data-idExecutiveFund"));
            var TeamRatio = $(target.attr("data-idTeamRatio"));
            var TeamFund = $(target.attr("data-idTeamFund"));
            var TeamPMRatio = $(target.attr("data-idTeamPMRatio"));
            var TeamPMFund = $(target.attr("data-idTeamPMFund"));
            var TeamBARatio = $(target.attr("data-idTeamBARatio"));
            var TeamBAFund = $(target.attr("data-idTeamBAFund"));
            var TeamDevLeadRatio = $(target.attr("data-idTeamDevLeadRatio"));
            var TeamDevLeadFund = $(target.attr("data-idTeamDevLeadFund"));
            var TeamDevFund = $(target.attr("data-idTeamDevFund"));
            var TeamDevRatio = $(target.attr("data-idTeamDevRatio"));
            var TeamTestRatio = $(target.attr("data-idTeamTestRatio"));
            var TeamTestFund = $(target.attr("data-idTeamTestFund"));
            var TeamDeployRatio = $(target.attr("data-idTeamDeployRatio"));
            var TeamDeployFund = $(target.attr("data-idTeamDeployFund"));

            //
            var soExecutiveRatio = parseFloat(Utils.isEmpty(ExecutiveRatio.val()) ? 0 : ExecutiveRatio.val());
            var soSuggestion = parseFloat(Utils.isEmpty(Suggestion.val()) ? 0 : Suggestion.val());
            var soTotalRewardFund = parseFloat(Utils.isEmpty(TotalRewardFund.val()) ? 0 : TotalRewardFund.val());
            var soTeamRatio = parseFloat(Utils.isEmpty(TeamRatio.val()) ? 0 : TeamRatio.val());

            if (Utils.notEmpty(soSuggestion) && soSuggestion > 0) {
                ExecutiveFund.val(soExecutiveRatio * soSuggestion / 100);
                TeamFund.val(soTeamRatio * soSuggestion / 100);
            } else {
                ExecutiveFund.val(soExecutiveRatio * soTotalRewardFund / 100);
                TeamFund.val(soTeamRatio * soTotalRewardFund / 100);
            }

            var soTeamPMRatio = parseFloat(Utils.isEmpty(TeamPMRatio.val()) ? 0 : TeamPMRatio.val());
            var soTeamFund = parseFloat(Utils.isEmpty(TeamFund.val()) ? 0 : TeamFund.val());
            var soTeamBARatio = parseFloat(Utils.isEmpty(TeamBARatio.val()) ? 0 : TeamBARatio.val());
            var soTeamDevLeadRatio = parseFloat(Utils.isEmpty(TeamDevLeadRatio.val()) ? 0 : TeamDevLeadRatio.val());
            var soTeamDevRatio = parseFloat(Utils.isEmpty(TeamDevRatio.val()) ? 0 : TeamDevRatio.val());
            var soTeamTestRatio = parseFloat(Utils.isEmpty(TeamTestRatio.val()) ? 0 : TeamTestRatio.val());
            var soTeamDeployRatio = parseFloat(Utils.isEmpty(TeamDeployRatio.val()) ? 0 : TeamDeployRatio.val());

            TeamPMFund.val(soTeamPMRatio * soTeamFund / 100);
            TeamBAFund.val(soTeamBARatio * soTeamFund / 100);
            TeamDevLeadFund.val(soTeamDevLeadRatio * soTeamFund / 100);
            TeamDevFund.val(soTeamDevRatio * soTeamFund / 100);
            TeamTestFund.val(soTeamTestRatio * soTeamFund / 100);
            TeamDeployFund.val(soTeamDeployRatio * soTeamFund / 100);

        });
        jQuery(document).on("click", ".close-flash", function () {
            jQuery(this).closest(".flash").fadeOut("fast");
            jQuery(this).closest(".flash").remove();
            Utils.flash_position();
        });
        jQuery(document).on("click", ".closeDialog", function () {
            Utils.closeCDialog($(this).closest('form'), true);
        });
        jQuery(document).on("click", ".closePopover", function () {

            var id = jQuery(this).attr("id-word");
            if (jQuery("#" + id).attr("check-boiden")) {
                var idpover = jQuery("#" + id).attr("aria-describedby");
                jQuery("#" + id).before(jQuery("#" + id).html());
                jQuery("#" + id).remove();
                jQuery("#" + idpover).remove();
            }
            jQuery(this).closest('.popover').popover('hide');
        });

        jQuery(document).on("click", ".closeForm", function () {
            jQuery(this).closest("form").slideUp("fast");
        });
        jQuery(document).on("click", ".deleteItem", function () {
            jQuery(this).closest(".item").remove();
            var data = jQuery(this).getDataUppername();
            if (data.TargetRefreshTable) {
                CUtils.refreshCountTable($(data.TargetRefreshTable));
            }
        });
        jQuery(document).on("click", ".openEditor", function () {
            jQuery(".gEditor").removeClass("gEditorActive");

            var title = jQuery(this).attr("title");
            var text = jQuery(this).closest(".gEditor").addClass("gEditorActive").find(".fEditor").val();
            jQuery("#dialogEditor").find("textarea").val(text);
            jQuery("#dialogEditor").dialog({
                dialogClass: "dialogEditor",
                title: title,
                resizable: false,
                height: "auto",
                width: 800,
                open: function () {
                    Utils.openOverlay();
                },
                buttons: {
                    "Ok": function () {
                        jQuery(this).dialog("close");
                        jQuery(".gEditorActive").find(".fEditor").val(jQuery("#dialogEditor").find("textarea").val());
                    },
                    Cancel: function () {
                        jQuery(this).dialog("close");
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
        });
        jQuery(document).find(".autoOpenDialog").each(function () {
            Utils.autoOpenDialog(jQuery(this));
        });
        jQuery(document).on("click", ".openEditor", function () {
            jQuery(".gEditor").removeClass("gEditorActive");

            var title = jQuery(this).attr("title");
            var editor = jQuery(this).closest(".gEditor").addClass("gEditorActive").find(".fEditor");
            var text = editor.val();
            var placeholder = editor.attr("placeholder");

            jQuery("#dialogEditor").find("textarea").val(text);
            jQuery("#dialogEditor").find("textarea").attr("placeholder", placeholder || '');
            jQuery("#dialogEditor").dialog({
                dialogClass: "dialogEditor",
                title: title,
                resizable: false,
                height: "auto",
                width: 800,
                open: function () {
                    Utils.openOverlay();
                },
                buttons: {
                    "Lưu": function () {
                        jQuery(this).dialog("close");
                        jQuery(".gEditorActive").find(".fEditor").val(jQuery("#dialogEditor").find("textarea").val())
                    },
                    "Hủy": function () {
                        jQuery(this).dialog("close");
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
        });
        jQuery(document).on("click", ".openEditorNote", function () {
            jQuery(".gEditor").removeClass("gEditorActive");

            var title = jQuery(this).attr("title");
            var editor = jQuery(this).closest("td").find(".gEditor").addClass("gEditorActive").find("a.aNote");
            var text = editor.attr('data-original-title');
            var placeholder = editor.attr("placeholder");
            var noteType = jQuery(this).attr("data-type");
            var idreport = jQuery(this).attr("data-idreport");
            var idmissiondetail = jQuery(this).attr("data-idmissiondetail");

            jQuery("#dialogEditor").find("textarea").val(text);
            jQuery("#dialogEditor").find("textarea").attr("placeholder", placeholder || '');
            jQuery("#dialogEditor").dialog({
                dialogClass: "dialogEditor",
                title: title,
                resizable: false,
                height: "auto",
                width: 800,
                open: function () {
                    Utils.openOverlay();
                },
                buttons: {
                    "Lưu": function () {
                        var note = jQuery("#dialogEditor").find("textarea").val();
                        var dialog = jQuery(this);
                        jQuery.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            async: true,
                            url: '/khtt/personal-rp-manage/save-note.html',
                            data: JSON.stringify({
                                'idreport': idreport,
                                'idmissiondetail': idmissiondetail,
                                'noteType': noteType,
                                'note': note,
                            }),
                            beforeSend: function () {
                            },
                            complete: function () {

                            },
                            error: function () {
                            },
                            dataType: "json",
                            success: function (data) {
                                dialog.dialog("close");
                                if (data.success) {
                                    editor.attr('data-original-title', note);
                                    if (note == '') editor.addClass('hidden');
                                    else editor.removeClass('hidden');
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                            }
                        });
                    },
                    "Hủy": function () {
                        jQuery(this).dialog("close");
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
        });
        jQuery(document).on("click", ".openEditorCust", function () {
            jQuery(".gEditor").removeClass("gEditorActive");

            var title = jQuery(this).attr("title");
            var editor = jQuery(this).closest(".gEditor").addClass("gEditorActive").find(".fEditor");
            var text = editor.val();
            var placeholder = editor.attr("placeholder");

            jQuery("#dialogEditor").find("textarea").val(text);
            jQuery("#dialogEditor").find("textarea").attr("placeholder", placeholder || '');
            jQuery("#dialogEditor").dialog({
                dialogClass: "dialogEditor",
                title: title,
                resizable: false,
                height: "auto",
                width: 800,
                open: function () {
                    Utils.openOverlay();
                },
                buttons: {
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
        });
        jQuery(document).on("click", ".openDialog", function () {

            var data = jQuery(this).getData();
            var dialoger = jQuery(data.target);
            var maxH = jQuery(window).height();
            if (!dialoger.hasClass("ui-dialog-content")) {
                jQuery(".ui-dialog[aria-describedby='" + dialoger.attr("id") + "']").remove();
            }
            var data_with = 600;
            if (data.width != null && data.width != "") {
                data_with = data.width;
            }
            dialoger.dialog({
                width: data.width,
                resizable: false,
                open: function () {
                    if (maxH < dialoger.height()) {
                        dialoger.css("height", (maxH - 50));
                    }
                    if (typeof data.formTarget != 'undefined') {
                        dialoger.attr("data-target", data.formTarget);
                    }
                    if (typeof data.formInsertType != 'undefined') {
                        dialoger.attr("data-insert-type", data.formInsertType);
                    }
                    if (typeof data.formClass != 'undefined') {
                        dialoger.addClass(data.formClass);
                    }
                    if (dialoger.hasClass("uhf50d")) {
                        dialoger.closest(".ui-dialog").addClass("hf50d");
                    }
                    if (dialoger.hasClass("bootstrapValidator")) {
                        dialoger
                            .bootstrapValidator('disableSubmitButtons', false)
                            .bootstrapValidator('resetForm', true);
                        dialoger.reset();

                        if (dialoger.hasClass("quickSubmit") && dialoger.hasClass("bootstrapValidator")) {
                            dialoger.removeClass("bootstrapValidator").bootstrapValidator('destroy');
                            dialoger.unbind();
                        }
                    }
                    Utils.openOverlay();
                    Utils.updateScrollBar(dialoger);
                    Utils.updateFormState(dialoger);
                    Autocomplete.init(dialoger);

                    if (typeof data.id != 'undefined') {
                        dialoger.find("input[name='ID']").val(data.id);
                    }
                    if (typeof data.parentId != 'undefined') {
                        dialoger.find("input[name='Parent']").val(data.parentId);
                    }
                    if (typeof data.parentName != 'undefined') {
                        dialoger.find("input[name='ParentName']").val(data.parentName);
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
            return false;
        });
        jQuery(document).on("click", ".openDialogCus", function () {

            var data = jQuery(this).getData();
            var dialoger = jQuery(data.target);
            var maxH = jQuery(window).height();
            if (!dialoger.hasClass("ui-dialog-content")) {
                jQuery(".ui-dialog[aria-describedby='" + dialoger.attr("id") + "']").remove();
            }
            var data_with = 600;
            if (data.width != null && data.width != "") {
                data_with = data.width;
            }
            dialoger.dialog({
                width: data.width,
                resizable: false,
                open: function () {
                    if (maxH < dialoger.height()) {
                        dialoger.css("height", (maxH - 50));
                    }
                    if (typeof data.formTarget != 'undefined') {
                        dialoger.attr("data-target", data.formTarget);
                    }
                    if (typeof data.formInsertType != 'undefined') {
                        dialoger.attr("data-insert-type", data.formInsertType);
                    }
                    if (typeof data.formClass != 'undefined') {
                        dialoger.addClass(data.formClass);
                    }
                    if (dialoger.hasClass("uhf50d")) {
                        dialoger.closest(".ui-dialog").addClass("hf50d");
                    }
                    if (dialoger.hasClass("bootstrapValidator")) {
                        dialoger
                            .bootstrapValidator('disableSubmitButtons', false)
                            .bootstrapValidator('resetForm', true);
                        dialoger.reset();

                        if (dialoger.hasClass("quickSubmit") && dialoger.hasClass("bootstrapValidator")) {
                            dialoger.removeClass("bootstrapValidator").bootstrapValidator('destroy');
                            dialoger.unbind();
                        }
                    }
                    Utils.openOverlay();
                    Utils.updateScrollBar(dialoger);
                    Utils.updateFormState(dialoger);
                    Autocomplete.init(dialoger);

                    if (typeof data.id != 'undefined') {
                        dialoger.find("input[name='ID']").val(data.id);
                    }
                    if (typeof data.parentId != 'undefined') {
                        dialoger.find("input[name='Parent']").val(data.parentId);
                    }
                    if (typeof data.parentName != 'undefined') {
                        dialoger.find("input[name='ParentName']").val(data.parentName);
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
            return false;
        });
        jQuery(document).on("click", ".quickTree", function () {
            try {
                var obj = jQuery(this);
                var data = obj.getDataUppername();
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: data.Url,
                    data: data,
                    beforeSend: function () {
                        obj.addClass("loading-btn");
                    },
                    complete: function () {
                        obj.removeClass("loading-btn");
                    },
                    error: function () {
                        obj.removeClass("loading-btn");
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        Utils.updateScrollBar(jQuery(".ui-dialog:visible"));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".clickViewer", function () {
            var data = jQuery(this).getDataUppername();
            if (jQuery(this).hasClass("tabOpen")) {
                jQuery("[href='" + data.TabOpen + "']").trigger("click");
            }

            Utils.viewer(data);
            return false;
        });
        jQuery(document).on("click", ".tabitem", function () {
            var tab = jQuery(this).attr("data-tab");
            jQuery(this).parent().find(".tabitem").removeClass("active");
            var container = jQuery(this).addClass("active").closest(".group-tab");
            container.children(".tab-data").addClass("hidden");
            container.find(tab).removeClass("hidden");
        });
        jQuery(document).on('change', '.tickAllFormGroup', function () {
            var checked = jQuery(this).is(":checked");
            jQuery(this).closest(".form-group").find(".tickItem").each(function () {
                if (!jQuery(this).prop("disabled"))
                    jQuery(this).prop("checked", checked);
            });
        });
        jQuery(document).on('change', '.tickAll', function () {
            var checked = jQuery(this).is(":checked");
            jQuery(this).closest(".tickGroup").find(".tickItem, .tickKey").each(function () {
                if (!jQuery(this).prop("disabled"))
                    jQuery(this).prop("checked", checked);
            });
        });
        jQuery(document).on('change', '.tickKey', function () {

            if (jQuery(this).prop("checked")) {
                var checkeds = jQuery(this).closest(".tickGroup").find(".tickItem").filter(":checked");
                if (checkeds.length == 0) {
                    jQuery(this).closest(".form-group").find(".tickItem").first().prop("checked", true);
                }
            } else {
                jQuery(this).closest(".form-group").find(".tickItem").prop("checked", false);
            }
        });
        jQuery(document).on('change', '.tickItem', function () {

            if (jQuery(this).prop("checked")) {
                jQuery(this).closest(".tickGroup").find(".tickKey").prop("checked", true);
            } else {
                var checkeds = jQuery(this).closest(".tickGroup").find(".tickItem").filter(":checked");
                jQuery(this).closest(".form-group").find(".tickKey").first().prop("checked", checkeds.length != 0);
            }
        });
        jQuery(document).on('change', '.group-checkable', function () {

            var table = jQuery(this).closest("table");
            var set = table.find(".checkboxes");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (!jQuery(this).prop("disabled")) {
                    if (checked) {
                        jQuery(this).prop("checked", true);
                        jQuery(this).closest('tr').addClass("active");
                    } else {
                        jQuery(this).prop("checked", false);
                        jQuery(this).closest('tr').removeClass("active");
                    }
                }
            });
            Utils.toggleMultiTicks(table);
        });
        jQuery(document).on('change', '.checkboxes', function () {
            jQuery(this).closest('tr').toggleClass("active");
            Utils.toggleMultiTicks(jQuery(this).closest('table'));
        });
        jQuery(document).on('change', '.check', function () {
            if ($(this).is(":checked")) {
                $(".check").not($(this)).each(function () {
                    $(this).removeAttr("checked");
                })
            }
            jQuery(this).closest('tr').toggleClass("active");
            Utils.toggleOnlyTick(jQuery(this).closest('table'));
        });
        jQuery(document).on("change", ".changeRel", function () {
            var v = jQuery(this).prop("checked") ? 1 : 0;
            var data = jQuery(this).getDataUppername();
            jQuery(data.Rel).val(v);
            if (typeof data.RelVisible != 'undefined') {
                var dataOptions = jQuery(this).find("option:selected").getDataUppername();
                if (dataOptions.IsVisible.toLowerCase() == "true") {
                    jQuery(data.RelVisible).removeClass("hidden")
                } else {
                    jQuery(data.RelVisible).addClass("hidden")
                }
            }
        });
        jQuery(".changeRel").trigger("change");
        jQuery(document).on("click", ".trigerEvent", function () {
            var target = jQuery(this).attr("data-target");
            var event = jQuery(this).attr("data-event");
            var action = jQuery(this).attr("data-action");
            if (action) {
                jQuery(target).attr("action", action);
            }
            jQuery(target).trigger(event);
        });
        jQuery(document).on("change", ".fieldRadio", function () {
            var obj = jQuery(this);
            if (obj.prop("checked")) {
                var data = obj.getDataUppername();
                obj.closest("form").find(".fieldRadio").each(function () {
                    if (obj.attr("name") != jQuery(this).attr("name")) {
                        if (data.Label == jQuery(this).attr("data-label")) {
                            jQuery(this).prop("checked", false);
                        }
                    }
                });
            }
        });
        jQuery(document).on('change', '.checkone', function () {
            var checked = jQuery(this).prop("checked");
            jQuery(this).closest('.checkone-group').find(".checkone").prop("checked", false);
            jQuery(this).prop("checked", checked);
        });
        jQuery(document).on("keydown", ".pressSubmit", function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key === 13) {
                try {
                    jQuery(this).closest("form").trigger("submit");
                } catch (ex) {
                }
                return false;
            }
            return true;
        });
        jQuery(document).on("click", "form .quickExportExcel", function () {
            try {
                var form = jQuery(this).closest("form");
                var url = jQuery(this).attr("data-href");
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(url)) {
                    return false;
                }

                window.location.href = url + Utils.builderQString(data);
            }
            catch (e) {
                console.log(e);
            }
            return false;
        });
        jQuery(document).on("click", ".quickExport", function () {
            try {
                var obj = jQuery(jQuery(this));
                var form = jQuery(jQuery(this).attr("data-form"));
                var url = jQuery(this).attr("data-href");
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(url)) {
                    return;
                }
                {
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: url,
                        data: data,
                        success: function (rs) {
                            if (rs.success) {
                                Utils.SaveFileAs(rs.urlFile, rs.filename);
                            }
                            else {
                                Utils.setError(rs.message);
                            }
                        }
                    });
                }


            } catch (e) {
                console.log(e);
            }
            return false;
        });
        jQuery(document).on("submit", ".quickSearch", function (event) {
            try {
                var form = jQuery(this);
                var url = form.attr("action");
                var target = form.attr("data-target");
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(url)) {
                    return;
                }
                if (form.hasClass("onRedirect")) {
                    window.history.pushState(null, "", url + Utils.builderQString(data));
                    window.location.href = Utils.getRedirect();
                    return;
                }
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        jQuery(target).addClass("loading").html("")
                    },
                    complete: function () {
                        jQuery(target).removeClass("loading");
                    },
                    error: function () {
                        jQuery(target).removeClass("loading");
                    },
                    success: function (response) {
                        try {
                            if (!form.hasClass('no-push-state')) {
                                window.history.pushState(null, response.title, url + Utils.builderQString(data));
                                jQuery(document).prop("title", response.title);
                            }
                        } catch (e) {
                            console.log(e);
                        }

                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            jQuery(target).html(response.htCust);
                        }

                        Utils.updateInputDate(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent();
                        Utils.popover(jQuery(target));

                        form.find("[type='submit']").prop("disabled", false); InitiateEasyPieChart.init();
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("submit", ".quickSubmitAjax", function (e) {
            e.preventDefault();
            try {
                var form = jQuery(this);
                if (!$(form).hasClass('submiting')) {
                    $(form).addClass('submiting');
                    var url = form.attr("action");
                    var target = form.attr("data-target");
                    var targetLoad = $(form.attr("data-target-load"));
                    //var targetLoad = $("#divTheHeCon");
                    var containmes = form.find('#messeage_err');
                    var targetDelete = form.attr("data-target-delete");
                    var type = form.attr("data-insert-type");
                    var data = Utils.getSerialize(form);
                    if (Utils.isEmpty(url)) {
                        $(form).removeClass('submiting');
                        return false;
                    }
                    if (!Utils.validateDataForm(form)) {
                        $(form).removeClass('submiting');
                        return false;
                    }
                    if (!form.hasClass("bootstrapValidator")) {
                        form.addClass("bootstrapValidator").bootstrapValidator();
                    }
                    var bootstrapValidator = form.data('bootstrapValidator');
                    bootstrapValidator.validate(true);
                    if (!bootstrapValidator.isValid()) {
                        $(form).removeClass('submiting');
                        return false;
                    }
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: url,
                        data: data,
                        beforeSend: function () {
                        },
                        complete: function () {
                        },
                        error: function () {
                        },
                        success: function (response) {
                            Utils.sectionBuilder(response, response.isErr);
                            if (response.hasOwnProperty("isCust")) {
                                if (type == "append") {
                                    targetLoad.append(response.htCust);
                                } else if (type == "prepend") {
                                    targetLoad.prepend(response.htCust);
                                } else if (type == "replaceWith") {
                                    targetLoad.replaceWith(response.htCust);
                                } else {
                                    targetLoad.html(response.htCust);
                                }
                            }
                            if (containmes.length > 0)
                                containmes.text(response.ctMeg);
                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            Utils.resetValidator(form);
                            form.reset();
                            //form.find("input").not(".idCaThe").val("");
                            Autocomplete.init(jQuery(target));
                            Main.upEvent();
                            if (!Utils.isEmpty(targetDelete)) {
                                jQuery(targetDelete).fadeOut("fast",
                                    function () {
                                        jQuery(this).remove();
                                    });
                            }
                            if (!response.hasOwnProperty("isErr") && form.hasClass("closeOnSubmit")) {
                                Utils.closeOverlay(true);
                            }
                            form.find("[type='submit']").prop("disabled", false);
                            $(form).removeClass('submiting');
                        }
                    });
                }
            } catch (e) {

            }
            return false;
        });
   
        jQuery(document).on("click", ".btnSubmitTables, .btnSubmitWarnTables", function (event) {
            event.preventDefault();
            event.stopPropagation();
            try {
                var btnInfo = jQuery(this).prop("disabled", true).getDataUppername();
                var isRefreshTarget = jQuery(this).hasClass('refreshTarget');
                var target = jQuery(this).attr('data-target');
                var url = btnInfo.Href;
                var tableInfos = Utils.getSerialize(jQuery(btnInfo.Rel));

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: tableInfos,
                    beforeSend: function () {
                    },
                    complete: function () {
                    },
                    error: function () {
                    },
                    success: function (response) {
                        if (isRefreshTarget) {
                            jQuery(target).html(response.htCust);
                            Cust.ImgBg_Scrollable(jQuery(target));
                            Cust.hover_docTable(jQuery(target));

                            Utils.sectionBuilder(response);
                            Utils.popover(jQuery(target));
                            Utils.firstFocus(jQuery(target));
                            Autocomplete.init(jQuery(target));
                        }
                        else {
                            Utils.sectionBuilder(response);
                            Utils.firstFocus(jQuery(target));
                            Autocomplete.init(jQuery(target));
                        }
                    }
                });
            } catch (e) {

            }
            return false;
        });

        jQuery(document).on("click", ".quickExport", function () {
            try {
                var obj = jQuery(jQuery(this));
                if (!obj.hasClass('exporting')) {
                    obj.addClass('exporting');
                    var form = jQuery(jQuery(this).attr("data-form"));
                    var url = jQuery(this).attr("href");
                    var data = Utils.getSerialize(form);
                    if (Utils.isEmpty(url)) {
                        return;
                    }
                    if (Utils.validateDataForm(jQuery(this)) === true) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            url: url,
                            data: data,
                            error: function () {
                                obj.removeClass('exporting');
                            },
                            complete: function () {
                                obj.removeClass('exporting');
                            },
                            success: function (rs) {
                                if (rs.success) {
                                    Utils.SaveFileAs(rs.urlFile, rs.filename);
                                }
                                else {
                                    Utils.setError(rs.message);
                                }
                                obj.removeClass('exporting');
                            }
                        });
                    }
                }

            } catch (e) {
                console.log(e);
            }
            return false;
        });
        jQuery(document).on("click", ".virtualForm", function (event) {
            event.preventDefault();
            try {
                var link = jQuery(this);
                var url = link.attr("href");
                var method = link.attr("data-method");
                if (Utils.isEmpty(url)) {
                    return false;
                }
                var formData = jQuery("#formSearch");
                var data = Utils.getSerialize(formData);
                var rand = Date.now();
                var form = document.createElement("form");
                form.setAttribute("method", method);
                form.setAttribute("id", "form" + rand);
                form.setAttribute("action", url);

                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var hiddenField = document.createElement("input");
                        hiddenField.setAttribute("type", "hidden");
                        hiddenField.setAttribute("name", key);
                        hiddenField.setAttribute("value", data[key]);
                        form.appendChild(hiddenField);
                    }
                }
                document.body.appendChild(form);
                form.submit();
                jQuery("form" + rand).remove();
            } catch (e) {
                console.log(e);
            }
            return false;
        });

        jQuery(document).on("click", ".virtualFormExcel", function (event) {
            event.preventDefault();
            try {
                var form = jQuery(this).closest("form");
                var dataFrom = jQuery(this).attr("data-form");
                if (typeof dataFrom !== "undefined") {
                    form = jQuery(dataFrom);
                }
                var url = jQuery(this).attr("href");
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(url)) {
                    return false;
                }
                url = url + Utils.builderQString(data);
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.closeOverlay();
                    },
                    error: function () {
                        Utils.closeOverlay();
                    },
                    success: function (response) {

                    }
                });
            } catch (e) {
                console.log(e);
            }
            return false;
        });
        jQuery(document).on("click", ".openDialogCate", function () {
            var data = jQuery(this).getData();
            var dialoger = jQuery(data.target);
            var maxH = jQuery(window).height();
            if (!dialoger.hasClass("ui-dialog-content")) {
                jQuery(".ui-dialog[aria-describedby='" + dialoger.attr("id") + "']").remove();
            }
            var data_with = 600;
            if (data.width != null && data.width != "") {
                data_with = data.width;
            }
            dialoger.dialog({
                width: data_with,
                resizable: false,
                open: function () {
                    if (maxH < dialoger.height()) {
                        dialoger.css("height", maxH - 50);
                    }
                    if (typeof data.formTarget != 'undefined') {
                        dialoger.attr("data-target", data.formTarget);
                    }
                    if (typeof data.formInsertType != 'undefined') {
                        dialoger.attr("data-insert-type", data.formInsertType);
                    }
                    if (typeof data.formClass != 'undefined') {
                        dialoger.addClass(data.formClass);
                    }
                    if (dialoger.hasClass("uhf50d")) {
                        dialoger.closest(".ui-dialog").addClass("hf50d");
                    }
                    if (dialoger.hasClass("bootstrapValidator")) {
                        dialoger
                            .bootstrapValidator('disableSubmitButtons', false)
                            .bootstrapValidator('resetForm', true);
                        dialoger.reset();

                        if (dialoger.hasClass("quickSubmit") && dialoger.hasClass("bootstrapValidator")) {
                            dialoger.removeClass("bootstrapValidator").bootstrapValidator('destroy');
                            dialoger.unbind();
                        }
                    }

                    Utils.openOverlay();
                    Utils.updateFormState(dialoger);
                    Utils.updateScrollBar(dialoger);
                    Autocomplete.init(dialoger);

                    if (typeof data.id != 'undefined') {
                        dialoger.find("input[name='ID']").val(data.id);
                    }
                    if (typeof data.parentId != 'undefined') {
                        dialoger.find("input[name='Parent']").val(data.parentId);
                    }
                    if (typeof data.parentName != 'undefined') {
                        dialoger.find("input[name='ParentName']").val(data.parentName);
                    }
                    if (typeof data.code != 'undefined') {
                        dialoger.find("[name='Code']").val(data.code);
                    }
                    if (typeof data.json != 'undefined') {
                        try {
                            var dataJson = jQuery.parseJSON(data.json);
                            for (var i in dataJson) {
                                dialoger.find("[name='" + i + "']").val(dataJson[i]);
                            }
                        }
                        catch (e) { }
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
            return false;
        });
        jQuery(document).on("submit", ".quickSubmit", function (e) {
            e.preventDefault();
            try {
                var form = jQuery(this);
                if (!form.hasClass('submiting')) {
                    form.addClass('submiting');
                    var url = form.attr("action");
                    var target = form.attr("data-target");
                    var areaCmtBody = form.attr("data-empty-body");
                    //  var containmes = form.find('#messeage_err');
                    var targetDelete = form.attr("data-target-delete");
                    var type = form.attr("data-target-isremove");
                    var removeTargetOld = jQuery(this).attr('data-project-disable');
                    var data = Utils.getSerialize(form);
                    if (Utils.isEmpty(url)) {
                        form.removeClass('submiting');
                        return false;
                    }
                    if (!Utils.validateDataForm(form)) {
                        form.removeClass('submiting');
                        return false;
                    }
                    if (!form.hasClass("bootstrapValidator")) {
                        form.addClass("bootstrapValidator").bootstrapValidator();
                    }
                    var bootstrapValidator = form.data('bootstrapValidator');
                    bootstrapValidator.validate(true);
                    if (!bootstrapValidator.isValid()) {
                        form.removeClass('submiting');
                        return false;
                    }
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: url,
                        data: data,
                        beforeSend: function () {
                            if (form.hasClass("loading-form"))
                                form.addClass('loading');
                        },
                        complete: function () {

                        },
                        error: function () {
                            form.removeClass('loading');
                        },
                        success: function (response) {
                            if (response.data.hasOwnProperty("Url")) {
                                window.location.href = response.data.Url;
                            }
                            Utils.sectionBuilder(response, response.isErr);
                            if (response.hasOwnProperty("isCust")) {
                                if (type == "append") {
                                    if (removeTargetOld) {
                                        jQuery(target).html();
                                    }
                                    jQuery(target).append(response.htCust);
                                    jQuery(areaCmtBody).val(null);
                                } else if (type == "prepend") {
                                    jQuery(target).prepend(response.htCust);
                                } else if (type == "replaceWith") {
                                    jQuery(target).replaceWith(response.htCust);
                                }
                                else if (type == "tableAppend") {
                                    jQuery(target + ' tbody:visible').append(response.htCust);
                                    //comment
                                    form.find("textarea[name='Body']").val('');
                                }

                                else {
                                    jQuery(target).html(response.htCust);
                                }
                            }

                           
                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            Autocomplete.init(jQuery(target));
                            Main.upEvent();

                            if (!Utils.isEmpty(targetDelete)) {
                                jQuery(targetDelete).fadeOut("fast",
                                    function () {
                                        jQuery(this).remove();
                                    });
                            }
                            if (form.hasClass("closeOnSubmit")) {
                                Utils.closeOverlay(true);
                            }

                            form.find("[type='submit']").prop("disabled", false);
                            form.removeClass('submiting');
                            form.removeClass('loading');


                            if (form.hasClass("success-on-refresh") && (typeof response.isErr == 'undefined' || !response.isErr) && !response.isDL) {
                                if (Utils.isEmpty(response.data))
                                    window.location.reload();
                                else
                                    window.location.href = response.data;
                            }

                        }
                    });
                }
            } catch (e) {
                console.log(e);
            }
            return false;
        });
        jQuery(document).on("click", ".quickMore", function () {
            try {
                var node = jQuery(this);
                var data = jQuery(this).getDataUppername();
                if (typeof data.Skip == 'undefined') {
                    data.Skip = 0;
                }
                if (typeof data.Take == 'undefined') {
                    data.Take = 10;
                }
                data.Skip = parseInt(data.Skip) + parseInt(data.Take);

                var target = data.Target;
                var type = data.InsertType;
                var url = node.attr("href").replace("#", "");
                if (Utils.isEmpty(url)) {
                    return;
                }
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        node.addClass("loading");
                    },
                    complete: function () {
                        node.removeClass("loading");
                    },
                    error: function () {
                        node.removeClass("loading");
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            if (type == "prepend") {
                                jQuery(target).prepend(response.htCust);
                            }
                            else {
                                jQuery(target).append(response.htCust);
                            }
                        }
                        node.attr("data-skip", data.Skip);
                        node.attr("data-take", data.Take);
                        if (response.htCust == "" || jQuery(response.htCust).find(".itemMore").length < data.Take) {
                            node.addClass("hidden")
                        }
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickLike", function () {
            try {
                var node = jQuery(this);
                var data = jQuery(this).getDataUppername();
                var target = data.Target;
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: node.attr("href"),
                    data: data,
                    beforeSend: function () {
                        node.addClass("loading");
                    },
                    complete: function () {
                        node.removeClass("loading");
                    },
                    error: function () {
                        node.removeClass("loading");
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        node.toggleClass("active");
                        if (response.hasOwnProperty("isCust")) {
                            jQuery(target).html(response.htCust);
                        }
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickViewCate", function () {
            try {
                var node = jQuery(this);
                var url = node.attr("href").replace("#", "");
                var target = node.attr("data-target");
                if (Utils.isEmpty(url)) {
                    return;
                }
                if (window.history.pushState) {
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: url,
                        data: { RedirectPath: Utils.getRedirect() },
                        beforeSend: function () {
                            jQuery(target).addClass("loading").html("")
                        },
                        complete: function () {
                            jQuery(target).removeClass("loading");
                        },
                        error: function () {
                            jQuery(target).removeClass("loading");
                        },
                        success: function (response) {
                            window.history.pushState(null, response.title, url);
                            jQuery(document).prop("title", response.title);

                            Utils.sectionBuilder(response);
                            if (response.hasOwnProperty("isCust")) {
                                jQuery(target).html(response.htCust);
                            }

                            Utils.updatePDFViewer(response);
                            Utils.updateChart(jQuery(target));
                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            Autocomplete.init(jQuery(target));
                            Main.upEvent();
                            Main.backLink();

                            //window.webViewerLoad(true);
                            //jQuery("#viewerContainer").scrollTop(0);
                            Cust.fileViewer_height_fn();
                            //Cust.prev_next_group_button();
                            Cust.Scroll_table();
                            Cust.Scroll_tab_group();
                            Cust.Table_sort();
                            Cust.dataTables_filter_col(); //Responsive dataTables_filter Col
                        }
                    });
                } else {
                    window.location.href = url;
                }
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickView", function () {
            try {
                var node = jQuery(this);
                var url = node.attr("href").replace("#", "");
                var preventRewrite = $(this).attr("data-prevent-rewrite");
                var preventRewriteFromPagination = jQuery("input[name='prenvetRewriteUrl']");
                // fix phân trang
                var basePath = window.location.href.split("?")[1];

                var countNp = url.replace("?", "").split("np=").length;
                var countPage = url.replace("?", "").split("page=").length;
                if (typeof basePath !== "undefined") {
                    url = url + "&" + basePath;
                }
                var urlarray = url.substring(url.indexOf("?") + 1).split("&");
                for (var i = 0; i < urlarray.length; i++) {
                    for (var j = 0; j < i; j++) {
                        if (urlarray[i].split("=")[0] == urlarray[j].split("=")[0]) {
                            url = url.replace("&" + urlarray[i], "");
                        }
                    }
                    if (countNp > 0 && countPage < 2) {
                        if (urlarray[i].split("=")[0] == "page") {
                            url = url.replace(urlarray[i], "page=1");
                        }
                    }
                }
                //

                var divFooter = node.parents("div.DTTTFooter");
                var addUrl = divFooter.attr("data-url");
                var id = divFooter.attr("data-id");

                if (!Utils.isEmpty(addUrl)) {
                    var baseUrl = addUrl + url;
                    var params = "&ID=" + id;
                    url = baseUrl.includes(params) ? baseUrl.replaceAll(params, "") + params : baseUrl + params;
                }
                var target = node.attr("data-target");
                if (Utils.isEmpty(url)) {
                    return;
                }
                if (window.history.pushState) {
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: url,
                        data: { RedirectPath: Utils.getRedirect() },
                        beforeSend: function () {
                            jQuery(target).addClass("loading").html("");
                        },
                        complete: function () {
                            jQuery(target).removeClass("loading");
                        },
                        error: function () {
                            jQuery(target).removeClass("loading");
                        },
                        success: function (response) {
                            if (Utils.isEmpty(addUrl)) {
                                //linhht
                                if (!(!Utils.isEmpty(preventRewrite) && preventRewrite == "1")) {
                                    if (!(preventRewriteFromPagination.length > 0 && preventRewriteFromPagination.val() == '1')) {
                                        window.history.pushState(null, response.title, url);
                                    }
                                }
                                jQuery(document).prop("title", response.title);
                            }


                            Utils.sectionBuilder(response);
                            if (response.hasOwnProperty("isCust")) {
                                jQuery(target).html(response.htCust);
                            }

                            Utils.updatePDFViewer(response);
                            Utils.updateChart(jQuery(target));
                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            Autocomplete.init(jQuery(target));
                            Main.upEvent();
                            Main.backLink();

                            //window.webViewerLoad(true);
                            //jQuery("#viewerContainer").scrollTop(0);
                            Cust.fileViewer_height_fn();
                            //Cust.prev_next_group_button();
                            Cust.Scroll_table();
                            Cust.Scroll_tab_group();
                            Cust.Table_sort();
                            Cust.dataTables_filter_col(); //Responsive dataTables_filter Col
                            InitiateEasyPieChart.init();
                        }
                    });
                } else {
                    if (Utils.isEmpty(addUrl)) {
                        window.location.href = url;
                    }

                }
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("keydown", ".txtNumberOfPageCustom", function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key === 13) {
                var np = jQuery(this).val();
                if (!Utils.isInteger(np) || parseInt(np) < 1) {
                    return false;
                }
                else {
                    var href = (jQuery(this).attr("data-href") + "&page=" + jQuery(this).val()).replace('&&', '&').replace('?&', '?');
                    var preventRewriteFromPagination = jQuery("input[name='prenvetRewriteUrl']");
                    if (preventRewriteFromPagination.length > 0 && preventRewriteFromPagination.val() == "1") {
                        Cust.callAjax({
                            page: jQuery(this).val()
                        },
                            href,
                            jQuery(this),
                            function (res) {
                                var targetData = jQuery('.pagination').children().first().children().attr("data-target");
                                var target = jQuery(targetData);
                                console.log(target);
                                target.html(res);
                                target.html(res.htCust);
                                Utils.closeOverlay(true);
                            },
                            true
                        );
                    }
                    else {
                        window.location.href = href;
                    }

                }
            }
        });

        if (window.history.pushState) {
            $(window).on("popstate", function (event) {
                //window.location = document.location;
            });
        }
        jQuery(document).on("click", ".quickAppend", function () {
            try {
                var obj = jQuery(this);
                var target = jQuery(this)
                    .attr("data-target");
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    beforeSend: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    complete: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    error: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).append(response.htCust);
                        }
                        Utils.updateTab(jQuery(target));
                        Utils.updateInputDate(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent(jQuery(target));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickUpdate", function () {
            try {
                var obj = jQuery(this);
                var target = obj.attr("data-target");
                var url = jQuery(this).attr("href");
                if (url === "")
                    url = jQuery(this).attr("data-url");
                var data = jQuery(this).getDataUppername();
                data.RedirectPath = Utils.getRedirect();

                if (obj.hasClass("postForm")) {
                    var dataForm = Utils.getSerialize(jQuery(this).closest("form"));
                    data = Object.assign({}, dataForm, data);
                }
                var dialogWidth = jQuery(this).attr("data-width");
                delete data.Target;

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.closeOverlay();
                    },
                    error: function () {
                        Utils.closeOverlay();
                    },
                    success: function (response) {
                        if (dialogWidth) {
                            response.wDL = dialogWidth;
                        }
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).html(response.htCust);
                        }
                        Utils.updatePDFViewer(response);
                        Utils.updateImageViewer();
                        Utils.updatePlayer(jQuery(target));
                        Utils.updateTab(jQuery(target));
                        Utils.updateInputDate(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(".useScrollBar"));
                        Utils.updateIsNumber(jQuery(target));
                        Cust.ImgBg_Scrollable(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent();
                        Utils.popover(jQuery(target));
                        Cust.check_required_input();
                        Cust.registerAssignPmEvents(jQuery(target));
                        Utils.autoResize();

                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickDelete", function () {
            try {
                var data = jQuery(this).getDataUppername();
                if (typeof data.RedirectPath == "undefined")
                    data.RedirectPath = Utils.getRedirect();
                //if (jQuery(this).hasClass("immediate")) {
                //    jQuery(data.TargetDelete).remove();
                //}
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    data: data,
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.openOverlay();
                    },
                    error: function () {
                        Utils.openOverlay();
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust") || response.hasOwnProperty("isErr")) {
                            Utils.closeOverlay();
                            jQuery(data.Target).html(response.htCust);
                        }
                        if (!Utils.isEmpty(data.TargetDelete)) {
                            jQuery(data.TargetDelete).fadeOut("fast", function () {
                                jQuery(this).remove();
                            });
                        }
                        Utils.updateFormState(jQuery(data.Target));
                        Utils.updateScrollBar(jQuery(data.Target));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickDeletes, .quickConfirms, .quickMoves", function () {
            try {
                var data = jQuery(this).getDataUppername();
                var table = jQuery(this)
                    .closest(".dataTables_wrapper")
                    .find("table");

                var ids = [];
                var idFiles = [];
                table.find(".checkboxes").each(function () {
                    if (jQuery(this).prop("checked")) {
                        var id = jQuery(this).attr("data-id");
                        var idFile = jQuery(this).attr("data-id-file");
                        if (Utils.isInteger(id))
                            ids.push(id);
                        if (!Utils.isEmpty(idFile))
                            idFiles.push(idFile);
                    }
                });
                data.ID = ids;
                data.IDFile = idFiles;
                data.RedirectPath = Utils.getRedirect();

                var target = data.Target;
                if (jQuery(this).hasClass("quickMoves")) {
                    delete data.Target;
                }

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: data.Href,
                    data: data,
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.openOverlay();
                    },
                    error: function () {
                        Utils.openOverlay();
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(data.Target).html(response.htCust);
                        }
                        jQuery(data.Target).find('.selectpicker').selectpicker();
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".jsConfirm", function () {

            try {
                var data = jQuery(this).getDataUppername();
                if (data.ConfirmMessage == undefined) {
                    return confirm("Bạn thực sự muốn thực hiện hành động " + jQuery(this).text().toLowerCase())
                }
                else {
                    return confirm(data.ConfirmMessage);
                }
            }
            catch (e) {
                console.log(e);
            }
            return false;

        });

        jQuery(document).on("click", ".toogleClass", function () {
            try {
                var data = jQuery(this).getData();
                jQuery(data.target).toggleClass(data.toogleClass);
            } catch (e) { }
            return false;
        });
        jQuery(document).on("click", ".nextChart", function () {

            var chartViewer = jQuery(this).closest(".chartViewer");
            var chart = chartViewer.highcharts();
            var data = chartViewer.getData();
            var from = parseInt(data.from);
            var to = parseInt(data.to);
            var max = parseInt(data.max);
            var step = parseInt(data.step);

            chart.xAxis[0].setExtremes(from + step, to + step);
            chartViewer.attr("data-from", from + step);
            chartViewer.attr("data-to", to + step);

            if (to + step >= max) {
                chartViewer.find(".nextChart").addClass("hidden");
            } else {
                chartViewer.find(".nextChart").removeClass("hidden");
            }
        });

        jQuery(document).on("click", ".prevChart", function () {
            var chartViewer = jQuery(this).closest(".chartViewer");
            var chart = chartViewer.highcharts();
            var data = chartViewer.getData();
            var from = parseInt(data.from);
            var to = parseInt(data.to);
            var max = parseInt(data.max);
            var step = parseInt(data.step);

            chart.xAxis[0].setExtremes(from - step, to - step);
            chartViewer.attr("data-from", from - step);
            chartViewer.attr("data-to", to - step);

            if (to - step >= max) {
                chartViewer.find(".nextChart").addClass("hidden");
            } else {
                chartViewer.find(".nextChart").removeClass("hidden");
            }
        });

        jQuery(document).on("click", ".quickAppendBoxes", function () {
            try {
                var data = jQuery(this).getDataUppername();
                var table = jQuery(this)
                    .closest(".dataTables_wrapper")
                    .find("table");
                var target = $(data.Target);
                table.find(".checkboxes").each(function () {
                    if (jQuery(this).prop("checked")) {
                        var row = $(this).closest('tr');
                        var rowChilds = table.find('tr[data-row="' + row.data('row') + '"]');
                        row.find("td:first").remove();
                        row.find("td:last").show();
                        target.append(row);
                        target.append(rowChilds);
                    }
                });
                var index = 1;
                target.find("td.autoIndex").each(function () {
                    $(this).find('span#idDoc').html(index);
                    index++;
                });
            } catch (e) {

            }
            return false;
        });

        jQuery(document).on("click", ".deleteTableRow", function () {
            try {
                var row = $(this).closest('tr');
                var table = $(this).closest('table');
                var rowChilds = table.find('tr[data-row="' + row.data('row') + '"]');
                row.remove();
                rowChilds.remove();
                var index = 1;
                table.find("td.autoIndex").each(function () {
                    $(this).find('span#idDoc').html(index);
                    index++;
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickUpdateByData", function () {
            try {
                var obj = jQuery(this);
                var target = obj.attr("data-target");
                var form = $(this).closest("form");
                var data = Utils.getSerialize(form);
                data.RedirectPath = Utils.getRedirect();
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    data: data,
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.closeOverlay();
                    },
                    error: function () {
                        Utils.closeOverlay();
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).html(response.htCust);
                        }
                        Utils.updateImageViewer();
                        Utils.updatePlayer(jQuery(target));
                        Utils.updateTab(jQuery(target));
                        Utils.updateInputDate(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Cust.ImgBg_Scrollable(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent();
                        Utils.popover(jQuery(target));
                        Cust.check_required_input();
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".tabClick", function () {
            var tab = jQuery(this);
            var dataTab = tab.attr("data-tab-name");
            var currentUrl = window.location.href;
            currentUrl = updateQueryStringParameter(currentUrl, "tab", dataTab);
            window.history.pushState(null, null, currentUrl);
        });
        function updateQueryStringParameter(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        }
        $(document).on("click", ".clickBoxCell", function () {
            var cb = $(this).find('input:checkbox');
            var val = cb.data("id");
            if (cb.is(':checked')) {
                //Disable other selected
                var table = $(this).closest('table');
                table.find('td.clickBoxCell').each(function () {
                    $(this).css('background-color', ''); //Unset bg
                    $(this).find('input:checkbox').prop('checked', false); //Uncheck all
                });
                $(this).css('background-color', 'red'); //set bg td clicked
                cb.prop('checked', true); //check checkbox clicked
            } else {
                //Unset bg
                $(this).css('background-color', '');
                val = 0;
            }

            //Set value for controls here
            $("#IdBox").attr('value', val);
            $("#FrmUpfileParent").attr('value', val);

        });
        $(document).on("change", ".checkboxes", function () {
            var chk = $(this);
            var table = chk.closest("table");
            var chkAll = table.find(".group-checkable");
            var checkedAll = true;
            if (chk.prop("checked")) {
                table.find(".checkboxes").each(function () {
                    if (!$(this).prop("checked") && !$(this).prop('disabled')) {
                        checkedAll = false;
                        return;
                    }
                });
                if (checkedAll)
                    chkAll.prop("checked", true);
            } else {
                chkAll.prop("checked", false);
            }
        });
        jQuery(document).on('change', '.select_change', function (e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                var select = jQuery(this);
                var id = select.val();
                if (Utils.isEmpty(id)) {
                    id = 0;
                }
                var url = select.attr('data-change-url');
                var target = select.attr('data-change-target');
                jQuery.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    async: true,
                    url: url,
                    data: JSON.stringify({
                        'id': id
                    }),
                    beforeSend: function () {
                        jQuery(target).addClass("loading").html("")
                    },
                    complete: function () {
                        jQuery(target).removeClass("loading");

                    },
                    error: function () {
                        jQuery(target).removeClass("loading");
                    },
                    dataType: "json",
                    success: function (data) {
                        Utils.sectionBuilder(data);
                        if (data.hasOwnProperty("isCust")) {
                            jQuery(target).html(data.htCust);
                            if (jQuery(target).hasClass("selectpicker")) {
                                jQuery(target).selectpicker("refresh");
                            }
                        }
                        Utils.updateTab(jQuery(target));
                        Utils.updateInputDate(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Cust.ImgBg_Scrollable(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent(jQuery(target));
                        Utils.popover(jQuery(target));
                        Cust.check_required_input();
                        Utils.autoResize();
                        jQuery(this).closest("form").find(".selectpicker").not(".inited").selectpicker();
                    }
                });
            } catch (e) {
                console.log(e);
                return;
            }
        });
        jQuery(document).on("change", ".useMoney ", function () {
            var val = $(this).val();
            if (val === "")
                val = "";
            val = parseFloat(val.replace(/,/g, ''));
            if (isNaN(val)) {
                val = "";
            }
            $(this).val(val);
            $(this).simpleMoneyFormat();
        });
    },

    backLink: function () {
        try {
            var bcItems = jQuery(".breadcrumb").find("li");
            var len = bcItems.length;
            if (len > 2) {

                var a = jQuery(bcItems[len - 2]).find("a");
                var attr_href = a.attr("href");
                var data_target = a.attr("data-target");
                jQuery(".widget_back_btn")
                    .removeClass("hidden")
                    .attr("href", attr_href)
                    .attr("data-target", data_target);
                if (a.hasClass("quickView")) {
                    jQuery(".widget_back_btn").addClass("quickView");
                }
                else {
                    jQuery(".widget_back_btn").removeClass("quickView");
                }
            } else {
                jQuery(".widget_back_btn").addClass("hidden");
            }
        } catch (e) { }
    }
};
jQuery(document).ready(function () {
    Cdata.init();
    Smile.init();
    Main.init();
    Utils.autoCloseFlash();
    Utils.updateImageViewer();
    Utils.updateTab(jQuery(document));
    Utils.updatePlayer(jQuery(document));
    Utils.updateChart(jQuery(document));
    Utils.updateFormState(jQuery(document));
    Utils.updateInputDate(jQuery(document));
    Utils.updateScrollBar(jQuery(document));
    Utils.updateIsNumber(jQuery(document));
    Autocomplete.init(jQuery(document));

});

