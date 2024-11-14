

jQuery(window).bind("load", function () {
    jQuery(document).on('change', '.change_org_data select', function (e) {
        e.preventDefault();
        var value = jQuery(this).children("option:selected").attr('data-name');
        update_orgChart(window[value]);
    });
    InitiateEasyPieChart.init();
    jQuery(document).find(".buyBarchart").each(function () {
        try {
            var obj = jQuery(this);
            var data = JSON.parse(obj.attr("data-source"));
            var unit = obj.attr('data-unit');
            var categories = data.Data.map(a => a.Category);
            var series = [];
            var colors = ["#95CEFF", "#5C5C61"];
            for (var i = 0; i < data.Series.length; i++) {
                var sr = data.Series[i];
                series.push({
                    name: sr,
                    data: data.Data.map(a => a.Values[i]),
                    color: i + 1 > colors.length ? "" : colors[i]
                });
            }
            Highcharts.chart(obj.attr('id'), {
                chart: {
                    type: 'column',
                    height: 800 + 'px'
                },
                title: {
                    text: obj.attr('title')
                },
                xAxis: {
                    categories: categories,
                    crosshair: true,

                },
                yAxis: {
                    min: 0,
                    title: {
                        text: unit,
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} ' + unit + '</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: series
            });
        } catch (e) {
            console.log('load chart failed');

        }
    });
    jQuery(document).find(".buyPiceChart").each(function () {
        try {
            var obj = jQuery(this);
            var data = JSON.parse(obj.attr("data-source"));
            var url = obj.attr('data-url');
            var target = obj.attr('data-target');
            var form = jQuery(obj.attr('data-form'));

            Highcharts.chart(obj.attr('id'), {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: obj.attr('title')
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: data.Brand,
                    colorByPoint: true,
                    data: data.Data,
                    point: {
                        events: {
                            click: function (event) {
                                if (url !== unescape()) {
                                    var dataPost = Utils.getSerialize(form);
                                    dataPost.ID = this.id;
                                    jQuery.ajax({
                                        type: "POST",
                                        async: true,
                                        url: url,
                                        data: dataPost,
                                        success: function (response) {
                                            Utils.sectionBuilder(response);
                                            if (response.hasOwnProperty("isCust")) {
                                                jQuery(target).html(response.htCust);
                                            }
                                            $("html, body").animate({ scrollTop: $(document).height() }, 500); //scroll to bottom
                                        },
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        }
                                    });
                                }
                            }
                        }
                    }
                }]
            });
        } catch (e) {
            console.log('load chart failed');
        }
    });
});

var Cust = {
    callAjax: function (data, url, obj, callback, isOverLay = true) {
        jQuery.ajax({
            type: "POST",
            async: true,
            url: url,
            data: data,
            beforeSend: function () {
                if (!obj.hasClass("not-overlay") && isOverLay) {
                    Utils.openOverlay();
                }

            },
            complete: function () {
                if (!obj.hasClass("not-overlay") && isOverLay) {
                    Utils.openOverlay();
                }
            },
            error: function () {
                if (!obj.hasClass("not-overlay") && isOverLay) {
                    Utils.openOverlay();
                }
            },
            success: function (response) {

                callback(response);
            }
        });




    },
    registerAssignPmEvents: function (target) {
        var link = jQuery(target).find("#linkWf");
        if (link) {
            link.on("click", function () {
                window.open(link.attr("href"), '_blank');
            })
        }
        if (target) {
            target.find("#Describe").on("change", function () {
                var describe = jQuery(this);
                var targetBtn = jQuery(describe.attr("data-target"));
                targetBtn.attr("data-describe", describe.val());
            });
            target.find("select").on("changed.bs.select", function () {
                var selected = jQuery(this);
                var targetBtn = jQuery(selected.attr("data-target"));
                if (selected.hasClass("selectSourcePMTeam")) {
                    console.log(selected.val());
                    var stepEx = targetBtn.attr("data-step-executor")
                    targetBtn.attr("data-id-user" + stepEx, selected.val());
                }
                else if (selected.hasClass("selectPhase")) {
                    targetBtn.attr("data-id-implement-model", selected.val())
                }

            });

            var checkBoxes = target.find(".checkboxAssign");
            if (checkBoxes.length > 0) {
                checkBoxes.each(function () {

                    var check = jQuery(this);
                    check.on("change", function () {
                        if (jQuery(this).prop('checked') == true) {
                            var url = jQuery(this).attr("data-url");
                            var executor = jQuery(this).attr("data-executor");
                            var selectPmTeam = jQuery(jQuery(this).attr("data-target"));
                            selectPmTeam.empty();
                            jQuery.ajax({
                                type: "POST",
                                url: url,
                                beforeSend: function () {
                                    selectPmTeam.closest(".container-fluid").addClass("loading")
                                },
                                complete: function () {
                                    selectPmTeam.closest(".container-fluid").removeClass("loading")

                                },
                                error: function () {
                                    selectPmTeam.closest(".container-fluid").removeClass("loading")
                                },
                                success: function (response) {

                                    if (response.isCust) {
                                        var newSelect = jQuery(response.htCust);
                                        var name = newSelect.attr("data-name");
                                        newSelect.attr("data-name", name + executor);
                                        newSelect.attr("data-target", "#btnSendMail");
                                        selectPmTeam.html(newSelect);
                                        selectPmTeam.find("select").selectpicker();

                                        selectPmTeam.find("select").on("changed.bs.select", function () {

                                            var selected = jQuery(this);
                                            var target = jQuery(selected.attr("data-target"));
                                            var stepEx = target.attr("data-step-executor")
                                            if (selected && selected.val()) {
                                                target.attr("data-id-user" + stepEx, selected.val());
                                            }

                                        });


                                    }
                                    else {
                                        return;
                                    }

                                }
                            });

                        }

                    });

                });
            }
        }
    },
    ImgBg_Scrollable_scan: function () {
        jQuery(".ImgBg_Scrollable").find("span").each(function () {
            var og_bgX = $(this).css("background-position-x");
            var og_bgY = $(this).css("background-position-y");
            $(this).next(".return_og").attr("og_bgX", og_bgX);
            $(this).next(".return_og").attr("og_bgY", og_bgY);
        });
    },
    ImgBg_Scrollable: function (container) {
        if (!container) {
            container = $(document);
        }
        var isDragging = false;
        var first_pageX;
        var first_pageY;
        var first_bgX;
        var first_bgY;
        var current_pageX;
        var current_pageY;
        var change_pageX;
        var change_pageY;
        var bg_size;
        var bg_sizeX;
        var bg_sizeY;
        var mw_replace_pageX = 0;
        var mw_replace_pageY = 0;
        container.find(".ImgBg_Scrollable").find("span").each(function () {
            // get background size y
            bg_size = $(this).css("background-size");

            var arrSize = bg_size.split(' ')[1];
            var arrReplace = arrSize.replace("px", " ");
            bg_sizeY = 0 - parseInt(arrReplace);
            // End.get background size y
            var arrSizeX = bg_size.split(' ')[0];
            var arrReplaceX = arrSizeX.replace("px", " ");
            bg_sizeX = 0 - parseInt(arrReplaceX);
            // End.get background size x
            $(this).attr("bg_sizeY", bg_sizeY);
            $(this).attr("bg_sizeX", bg_sizeX);
        });
        container.find(".ImgBg_Scrollable").find(".return_og").click(function (e) {
            //jQuery(document).on('click', '.ImgBg_Scrollable > .return_og', function(e){
            e.preventDefault();
            var return_bgX = $(this).attr("og_bgX");
            var return_bgY = $(this).attr("og_bgY");
            $(this).prev().css("background-position-y", return_bgY);
            $(this).prev().css("background-position-x", return_bgX);
            $(this).removeClass("active");
        });

        container.find(".ImgBg_Scrollable").find("span").mousedown(function (event) {
            isDragging = true;
            first_pageX = event.pageX;
            first_pageY = event.pageY;
            //bg_sizeY here before
            first_bgX = $(this).css("background-position-x");
            first_bgY = $(this).css("background-position-y");
            $(this).css("background-repeat", "no-repeat");
        });
        container.find(".ImgBg_Scrollable").find("span").mousemove(function (event) {
            var span_w = $(this).width();
            var span_h = $(this).height();
            if (isDragging === true) {
                current_pageX = event.pageX;
                current_pageY = event.pageY;
                change_pageX = current_pageX - first_pageX;
                change_pageY = current_pageY - first_pageY;

                bg_sizeX = $(this).attr("bg_sizeX");
                bg_sizeY = $(this).attr("bg_sizeY");
                var replace_pageX = 0;
                var replace_pageY = 0;

                // UP - DOWN
                if (parseInt(change_pageY) > 0) { //Down
                    replace_pageY = parseInt(first_bgY) + parseInt(change_pageY);
                    if (parseInt(replace_pageY - span_h) > parseInt(bg_sizeY) && parseInt(replace_pageY) < 0) {
                        $(this).css("background-position-y", replace_pageY);
                        if (!$(this).next(".return_og").hasClass("active")) {
                            $(this).next(".return_og").addClass("active");
                        }
                    }
                } else if (parseInt(change_pageY) < 0) { //Up
                    replace_pageY = parseInt(first_bgY) + parseInt(change_pageY);
                    if (parseInt(replace_pageY - span_h) > parseInt(bg_sizeY) && parseInt(replace_pageY) < 0) {
                        $(this).css("background-position-y", replace_pageY);
                        if (!$(this).next(".return_og").hasClass("active")) {
                            $(this).next(".return_og").addClass("active");
                        }
                    }
                }
                else {
                    $(this).css("background-position-y", first_bgY);
                    if ($(this).next(".return_og").hasClass("active")) {
                        $(this).next(".return_og").removeClass("active");
                    }
                }

                // LEFT - RIGHT
                if (parseInt(change_pageX) > 0) { //left
                    replace_pageX = parseInt(first_bgX) + parseInt(change_pageX);
                    if (parseInt(replace_pageX - span_w) > parseInt(bg_sizeX) && parseInt(replace_pageX) < 0) {
                        $(this).css("background-position-x", replace_pageX);
                        if (!$(this).next(".return_og").hasClass("active")) {
                            $(this).next(".return_og").addClass("active");
                        }
                    }
                } else if (parseInt(change_pageX) < 0) { //right
                    replace_pageX = parseInt(first_bgX) + parseInt(change_pageX);
                    if (parseInt(replace_pageX - span_w) > parseInt(bg_sizeX) && parseInt(replace_pageX) < 0) {
                        $(this).css("background-position-x", replace_pageX);
                        if (!$(this).next(".return_og").hasClass("active")) {
                            $(this).next(".return_og").addClass("active");
                        }
                    }
                }
                else {
                    $(this).css("background-position-x", first_bgX);
                    if ($(this).next(".return_og").hasClass("active")) {
                        $(this).next(".return_og").removeClass("active");
                    }
                }

            }
        });
        if (navigator.userAgent.search("Firefox") >= 0) {
            //Firefox
            container.find(".ImgBg_Scrollable").find("span").bind('DOMMouseScroll', function (e) {
                var mw_span_h = $(this).height();
                var mw_bgY = $(this).css("background-position-y");
                bg_sizeY = $(this).attr("bg_sizeY");
                if (e.originalEvent.detail < 0) { // up
                    mw_replace_pageY = parseInt(mw_bgY) + 8;
                    if (parseInt(mw_replace_pageY - mw_span_h) > parseInt(bg_sizeY) && parseInt(mw_replace_pageY) < 0) {
                        $(this).css("background-position-y", mw_replace_pageY);
                        if (!$(this).next(".return_og").hasClass("active")) {
                            $(this).next(".return_og").addClass("active");
                        }
                    }
                }
                else {
                    mw_replace_pageY = parseInt(mw_bgY) - 8;
                    if (parseInt(mw_replace_pageY - mw_span_h) > parseInt(bg_sizeY) && parseInt(mw_replace_pageY) < 0) {
                        $(this).css("background-position-y", mw_replace_pageY);
                        if (!$(this).next(".return_og").hasClass("active")) {
                            $(this).next(".return_og").addClass("active");
                        }
                    }
                }
                //prevent page fom scrolling
                return false;
            });
        }
        else {
            //IE, Opera, Safari
            container.find(".ImgBg_Scrollable").find("span").bind('mousewheel', function (e) {
                var mw_span_h = $(this).height();
                var mw_bgY = $(this).css("background-position-y");
                bg_sizeY = $(this).attr("bg_sizeY");
                if (e.originalEvent.wheelDelta > 0) { // up
                    mw_replace_pageY = parseInt(mw_bgY) + 8;
                    if (parseInt(mw_replace_pageY - mw_span_h) > parseInt(bg_sizeY) && parseInt(mw_replace_pageY) < 0) {
                        $(this).css("background-position-y", mw_replace_pageY);
                        if (!$(this).next(".return_og").hasClass("active")) {
                            $(this).next(".return_og").addClass("active");
                        }
                    }
                }
                else {
                    mw_replace_pageY = parseInt(mw_bgY) - 8;
                    if (parseInt(mw_replace_pageY - mw_span_h) > parseInt(bg_sizeY) && parseInt(mw_replace_pageY) < 0) {
                        $(this).css("background-position-y", mw_replace_pageY);
                        if (!$(this).next(".return_og").hasClass("active")) {
                            $(this).next(".return_og").addClass("active");
                        }
                    }
                }
                //prevent page fom scrolling
                return false;
            });
        }
        container.find(".ImgBg_Scrollable").find("span").mouseup(function (event) {
            isDragging = false;
        });
        container.find(".ImgBg_Scrollable").find("span").mouseout(function (event) {
            isDragging = false;
            mousewheel_count = 0; // Reset scroll count
        });
    },
    ImgBg_Scrollable_action: function () {
        // Disable & enable browswe scroll when hover element

        jQuery(document).on("click", ".ImgBg_Scrollable > .zoom_og", function (e) {
            e.preventDefault();
            var html = $(this).parents(".ImgBg_Scrollable").clone();
            var idtr = $(this).parents("tr").attr('id');
            var popupWidth = 640;
            var popupHeight = 360;
            if (!$(this).hasClass("zoom_center")) {
                jQuery(document).find(".ImgBg_Scrollable_popup").toggleClass("active");
                popupWidth = $(this).parents(".ImgBg_Scrollable").find(".thietDoFull").css("width");
                popupHeight = $(this).parents(".ImgBg_Scrollable").find(".thietDoFull").css("height");
                console.log(popupWidth);
                GetItemInputup(jQuery(document).find(".ImgBg_Scrollable_popup"), html, idtr);
                jQuery(document).find(".ImgBg_Scrollable_popup").find(".isp_content").css("max-width", popupWidth);
                //jQuery(document).find(".ImgBg_Scrollable_popup").find(".isp_content").css("height",parseInt(popupHeight)+65);
            } else {
                $(document).find(".ImgBg_Scrollable").find(".ImgBg_Scrollable_popup").remove();
                var popupClone = jQuery(document).find(".ImgBg_Scrollable_popup").clone();
                $(this).parents(".ImgBg_Scrollable").append(popupClone);
                $(this).parents(".ImgBg_Scrollable").find(".ImgBg_Scrollable_popup").addClass("active");
                $(this).parents(".ImgBg_Scrollable").find(".ImgBg_Scrollable_popup").find(".isp_close").addClass("zoom_center");
                GetItemInputup($(this).parents(".ImgBg_Scrollable").find(".ImgBg_Scrollable_popup"), html, idtr);
                jQuery(document).find(".ImgBg_Scrollable").removeClass("over");
                $(this).parents(".ImgBg_Scrollable").addClass("over");
                $("html").css("overflow", "auto");
                $("html").css("padding-right", 0);


                var target = $(this).parents(".ImgBg_Scrollable").find(".ImgBg_Scrollable_popup").find(".ImgBg_Scrollable").find("span");
                var target_w = parseInt(target.width() / 2);
                var target_h = parseInt(target.height() / 2);
                var target_bg_Position = target.css("background-position");
                var target_arrPosition_x = target_bg_Position.split(' ')[0];
                var arrReplace_x = target_arrPosition_x.replace("px", " ");
                var target_bg_PositionX = parseInt(arrReplace_x);
                var target_arrPosition_y = target_bg_Position.split(' ')[1];
                var arrReplace_y = target_arrPosition_y.replace("px", " ");
                var target_bg_PositionY = parseInt(arrReplace_y);
                var target_bg_Size = target.css("background-Size");
                var target_arrSize_x = target_bg_Size.split(' ')[0];
                var arr_x = target_arrSize_x.replace("px", " ");
                var target_bg_SizeX = parseInt(arr_x);
                var target_arrSize_y = target_bg_Size.split(' ')[1];
                var arr_y = target_arrSize_y.replace("px", " ");
                var target_bg_SizeY = parseInt(arr_y);
                var target_X;
                var target_Y;

                var prTarget = $(this).parents(".ImgBg_Scrollable").find("span").first();
                var prTarget_w = parseInt(prTarget.width() / 3);

                if (target_bg_PositionX + target_w > 0) {
                    target_X = 0 - prTarget_w;
                } else if (target_bg_PositionX + target_w < 0 - (target_bg_SizeX - (target_w * 2))) {
                    target_X = target_bg_SizeX - (target_w * 2) - prTarget_w;
                } else {
                    target_X = target_bg_PositionX + target_w - prTarget_w;
                }
                if (target_bg_PositionY + target_h > 0) {
                    target_Y = 0;
                } else if (target_bg_PositionY + target_h < 0 - (target_bg_SizeY - (target_h * 2))) {
                    target_Y = target_bg_SizeY - (target_h * 2);
                } else {
                    target_Y = target_bg_PositionY + target_h - 25;
                }
                target.css("background-position-x", target_X);
                target.css("background-position-y", target_Y);
                target.next(".return_og").attr("og_bgx", target_X + "px");
                target.next(".return_og").attr("og_bgy", target_Y + "px");


            }


        });
        jQuery(document).on('click', '.addCart', function () {
            jQuery(this).addClass('hidden');
        })
        jQuery(document).on('click', '.isp_close', function (e) {
            e.preventDefault();
            if (!$(this).hasClass("zoom_center")) {
                jQuery(document).find(".ImgBg_Scrollable_popup").removeClass("active");
                jQuery(document).find(".ImgBg_Scrollable_popup").find(".isp_content_html").html("");
            } else {
                $(this).parents(".ImgBg_Scrollable").removeClass("over");
                jQuery(this).parents(".ImgBg_Scrollable_popup").remove();
            }

            $("html").css("overflow", "auto");
            $("html").css("padding-right", 0);
        });
        jQuery(document).on('click', '.btnthietdo', function (e) {
            e.preventDefault();
            var txtthietdo = jQuery(this).siblings('.txtthietdo').val();
            SetValueThietDo($(this).parents('.ImgBg_Scrollable_popup').attr('data-tr-id'), txtthietdo);
            jQuery(this).parents('.ImgBg_Scrollable_popup').find('.isp_close').trigger('click');
        });
        // next prev thiết đồ
        jQuery(document).on('click', '.thietdo-prev , .thietdo-next', function (e) {
            e.preventDefault();
            var tr = jQuery(document).find('#' + $(this).parents('.ImgBg_Scrollable_popup').attr('data-tr-id'));
            if (jQuery(this).hasClass('thietdo-prev')) {
                var prev = tr.prev();
                if (!Utils.isEmpty(prev) && prev.length > 0) {
                    GetItemInputup(jQuery(document).find(".ImgBg_Scrollable_popup"), prev.find('.ImgBg_Scrollable').clone(), prev.attr('id'));
                    var value = jQuery(this).parents('.ImgBg_Scrollable_popup').find('.txtthietdo').val();
                    SetValueThietDo($(this).parents('.ImgBg_Scrollable_popup').attr('data-tr-id'), value);
                }
            }
            else {
                var next = tr.next();
                if (!Utils.isEmpty(next) && next.length > 0) {
                    GetItemInputup(jQuery(document).find(".ImgBg_Scrollable_popup").first(), next.find('.ImgBg_Scrollable').clone(), next.attr('id'));
                    var value = jQuery(this).parents('.ImgBg_Scrollable_popup').find('.txtthietdo').val();
                    SetValueThietDo($(this).parents('.ImgBg_Scrollable_popup').attr('data-tr-id'), value);
                }
            }
        });
        // enter thiết đồ
        jQuery(document).on('keydown', '.thietdo', function (e) {
            if (event.which == 13 || event.which == 9) {
                e.preventDefault();
                var tr = jQuery(this).closest('tr').next();
                if (!Utils.isEmpty(tr)) {
                    tr.find('.thietdo').focus();
                }
            }
        });
        function GetItemInputup(container, html, idtr) {
            container.attr('data-tr-id', idtr);
            container.find(".isp_content_html").html(html);
            if ($("body").height() > $(window).height()) {
                $("html").css("overflow", "hidden");
                $("html").css("padding-right", 16.5); // Default scrollbar width: 17px
            }

            Cust.ImgBg_Scrollable(jQuery(".ImgBg_Scrollable_popup"));
        }
        function SetValueThietDo(idtr, value) {
            var tr = jQuery(document).find('#' + idtr);
            tr.find('.thietdo').val(value);
        }
    },
    hover_docTable: function (container) {
        if (Utils.isEmpty(container))
            container = jQuery(document);
        //jQuery(document).find(".useAddTableRow").each(function () {
        container.find(".useAddTableRow tbody tr").hover(
            function () {
                $(this).addClass("is_active");
                $(this).addClass("tr_item");
                $(this).find("td:first-child").addClass("addrowBtns");
                var html = '<a class="addrowBtns_item addRow_top" title="Thêm một hàng lên trên" href="#"><i class="ion-android-add"></i></a><a class="addrowBtns_item addRow_bottom" title="Thêm một hàng xuống dưới" href="#"><i class="ion-android-add"></i></a>';
                if ($(this).find("td:first-child").find(".addRow_top").length == 0) {
                    $(this).find(".addrowBtns").append(html);
                }

            }, function () {
                $(this).removeClass("is_active");
                $(this).find("td:first-child").removeClass("addrowBtns");
                $(this).find(".addrowBtns_item").remove();
            }
        );
        //});
    },
    hover_docTable_action: function () {
        jQuery(document).on('click', '.addrowBtns_item', function (e) {
            e.preventDefault();
            var tick = (new Date()).getTime();
            $("body").append('<div class="hidden temp_clone"></div>');
            var clone_code = $(this).parents("tr.is_active").clone();
            var idrefer = clone_code.attr('data-refer');
            clone_code.attr('data-refer', idrefer);
            clone_code.find('.referthietdo').val(idrefer + '_' + tick + '_' + ($(this).hasClass("addRow_top") ? 'top' : 'bottom'));
            clone_code.find('.field').each(function () {
                var field = jQuery(this);
                var name = field.attr('data-name');
                field.attr('name', name + '_' + tick);
            });
            clone_code = clone_code.attr('id', tick);
            jQuery(document).find(".temp_clone").html(clone_code);
            jQuery(document).find(".temp_clone").find("tr.is_active").removeClass("is_active");
            jQuery(document).find(".temp_clone").find(".addrowBtns_item").remove();
            jQuery(document).find(".temp_clone").find(".addrowBtns").append('<a class="delrowBtns_item" data-target=".tr_item" title="Xóa hàng này" href="#"><i class="ion-android-close"></i></a>');
            var code_done = jQuery(document).find(".temp_clone").html();

            if ($(this).hasClass("addRow_top")) {
                $(this).parents("tr.is_active").before(code_done);
                jQuery(document).find(".temp_clone").remove();
            } else {
                $(this).parents("tr.is_active").after(code_done);
                jQuery(document).find(".temp_clone").remove();
            }
            Cust.ImgBg_Scrollable_scan();
            Cust.ImgBg_Scrollable();
            Cust.hover_docTable();

            Utils.popover(jQuery("#" + tick));
        });
        jQuery(document).on('click', '.delrowBtns_item', function (e) {
            e.preventDefault();
            var target = jQuery(this).attr("data-target");
            jQuery(this).closest(target).remove();
        });

    },
    AddNewTableCell: function () {
        jQuery(document).on('click', '.ActionBtns_add', function (e) {
            e.preventDefault();
            var tick = (new Date()).getTime();
            $("body").append('<div class="hidden AddNewTableCell_temp"></div>');
            var clone_code = $(this).parents("tr").clone();
            var tableindex = clone_code.attr('data-refer');
            var rowindex = clone_code.attr('data-row');
            clone_code.find('input').each(function () {
                var fieldname = jQuery(this).attr('data-table-field-name');
                //var tableindex = clone_code.attr('data-table-index');
                if (jQuery(this).attr('id') != 'refercolyda')
                    jQuery(this).attr('name', 'colyda_' + tick + '_' + tableindex + '_' + fieldname);
            });
            clone_code.find('#refercolyda').val('colyda_' + tick + '_' + rowindex + '_' + tableindex);
            jQuery(document).find(".AddNewTableCell_temp").html(clone_code);
            jQuery(document).find(".AddNewTableCell_temp").find("tr").addClass("tr_item");
            jQuery(document).find(".AddNewTableCell_temp").find("tr").find("td:first-child").append('<a class="delrowBtns_item" data-target=".tr_item" title="Xóa hàng này" href="#"><i class="ion-android-close"></i></a>');
            var code_done = jQuery(document).find(".AddNewTableCell_temp").html();

            if ($(this).hasClass("addRow_top")) {
                $(this).parents("tr").before(code_done);
                jQuery(document).find(".AddNewTableCell_temp").remove();
                Utils.popover($(this).parents("tr").prev());
            } else {
                $(this).parents("tr").after(code_done);
                jQuery(document).find(".AddNewTableCell_temp").remove();
                Utils.popover($(this).parents("tr").next());
            }

        });
    },
    AddCell_Colyda: function () {
        jQuery(document).on('click', '.ActionBtns_colyda', function (e) {
            e.preventDefault();
            var tick = (new Date()).getTime();
            $(this).parents("table.useActionBtns").addClass("tick_" + tick);
            $("body").append('<div class="hidden AddCell_Colyda_temp"></div>');
            var clone_code = $(this).parents("tr").clone();
            var tableindex = clone_code.attr('data-refer');
            var rowindex = clone_code.attr('data-row');
            clone_code.find('input').each(function () {
                var fieldname = jQuery(this).attr('data-table-field-name');
                //var tableindex = clone_code.attr('data-table-index');
                if (jQuery(this).attr('id') != 'refercolyda')
                    jQuery(this).attr('name', 'colyda_' + tick + '_' + tableindex + '_' + fieldname);
            });
            clone_code.find('#refercolyda').val('colyda_' + tick + '_' + rowindex + '_' + tableindex);
            jQuery(document).find(".AddCell_Colyda_temp").html(clone_code);
            jQuery(document).find(".AddCell_Colyda_temp").find("tr").addClass("tr_item");
            jQuery(document).find(".AddCell_Colyda_temp").find("tr").find("td:first-child").append('<a class="delrowBtns_colyda" data-target=".tr_item" title="Xóa hàng này" href="#"><i class="ion-android-close"></i></a>');
            var code_done = jQuery(document).find(".AddCell_Colyda_temp").html();

            if ($(this).hasClass("addRow_top")) {
                $(this).parents("tr").before(code_done);
                jQuery(document).find(".AddCell_Colyda_temp").remove();
                Utils.popover($(this).parents("tr").prev());
            } else {
                $(this).parents("tr").after(code_done);
                jQuery(document).find(".AddCell_Colyda_temp").remove();
                Utils.popover($(this).parents("tr").next());
            }
            var rowspan = $(this).parents("tbody").find("tr:first-child").find("td:first-child").attr("rowspan");
            $(this).parents("tbody").find("tr:first-child").find("td:first-child").attr("rowspan", parseInt(rowspan) + 1);


            var check_attr = jQuery(document).find("table.useActionBtns.tick_" + tick).find("tbody").find("tr:first-child + tr").find("td:first-child").attr("rowspan");
            if (typeof check_attr !== typeof undefined && check_attr !== 0) {
                if ($(this).hasClass("addRow_top")) {
                    jQuery(document).find("table.useActionBtns.tick_" + tick).find("tbody").find("tr:first-child").find("td:first-child").find(".delrowBtns_colyda").remove();
                    jQuery(document).find("table.useActionBtns.tick_" + tick).find("tbody").find("tr:first-child + tr").find("td:first-child").remove();
                    jQuery(document).find("table.useActionBtns.tick_" + tick).find("tbody").find("tr:first-child").find("td:first-child + td").append('<a class="delrowBtns_colyda" data-target=".tr_item" title="Xóa hàng này" href="#"><i class="ion-android-close"></i></a>');
                } else {
                    jQuery(document).find("table.useActionBtns.tick_" + tick).find("tbody").find("tr:first-child + td").find("td:first-child").find(".delrowBtns_colyda").remove();
                    jQuery(document).find("table.useActionBtns.tick_" + tick).find("tbody").find("tr:first-child + tr").find("td:first-child").remove();
                    jQuery(document).find("table.useActionBtns.tick_" + tick).find("tbody").find("tr:first-child + tr").find("td:first-child").append('<a class="delrowBtns_colyda" data-target=".tr_item" title="Xóa hàng này" href="#"><i class="ion-android-close"></i></a>');
                }

            }

            jQuery(document).find("table.useActionBtns.tick_" + tick).removeClass("tick_" + tick);


        });
        jQuery(document).on('click', '.delrowBtns_colyda', function (e) {
            e.preventDefault();
            var target = jQuery(this).attr("data-target");
            var rowspan = $(this).parents("tbody").find("tr:first-child").find("td:first-child").attr("rowspan");
            $(this).parents("tbody").find("tr:first-child").find("td:first-child").attr("rowspan", parseInt(rowspan) - 1);

            var index = $(this).closest(target).index();
            console.log(index);
            if (index === 0) {
                var rowspan_col = $(this).closest(target).find("td:first-child").clone();
                jQuery(this).closest(target).next().find("td:first-child").before(rowspan_col);
                jQuery(this).closest(target).remove();

            }
            else {
                jQuery(this).closest(target).remove();
            }
        });

    },
    dataTables_filter_col: function () {
        //Fix col sm as col md
        if ($(document).find('.dataTables_filter > .quickSearch > div[class*="col"]').is(":visible")) {
            jQuery(document).find('.dataTables_filter > .quickSearch div[class*="col"]').each(function () {
                var obj = $(this);
                var arr = obj.attr('class').split(' ');
                for (var i = 0; i < arr.length; i++) {
                    var class_sm = arr[i];
                    var col_sm = 'col-sm-';
                    if (class_sm.indexOf(col_sm) !== -1) {
                        obj.removeClass(class_sm);
                    }
                }
                for (var j = 0; j < arr.length; j++) {
                    var class_md = arr[j];
                    var col_md = 'col-md-';
                    if (class_md.indexOf(col_md) !== -1) {
                        var res = class_md.replace("md", "sm");
                        obj.addClass(res);
                    }
                }

            });
        }
    },
    check_required_input: function () {
        jQuery(document).find(".form-control").each(function () {
            var attr = $(this).attr('data-bv-notempty');
            if (typeof attr !== typeof undefined && attr !== false && attr === 'true') {
                if (jQuery(this).parent().prev("label").is(":visible") && (jQuery(this).parent().prev("label").find(".red").size() === 0)) {
                    var label_text = jQuery(this).parent().prev("label").html();
                    jQuery(this).parent().prev("label").html(label_text + ' <span class="red">*</span>');
                }
            }
        });
    },
    //if button group is long > show prev next
    prev_next_group_button: function () {
        var group_button_parent_lenght = 0;
        group_button_parent_lenght = $(".fileviewer .file_button_action").outerWidth(true);
        var group_button_lenght = 0;
        $(".fileviewer .important_action_btn>li:not(.hidden)").each(function () {
            var li_width = $(this).outerWidth(true);
            $(this).addClass("li_show");
            group_button_lenght = group_button_lenght + li_width;
        });
        $(".file_button_action").css("height", "auto");
        //$("#FileViewer #outerContainer").css("height", "auto");
        jQuery(".fileviewer .important_action_btn>.li_show").css("width", "auto");
        if (group_button_lenght > group_button_parent_lenght) {
            var li_width_itemts = 0;
            jQuery(".fileviewer .important_action_btn>.li_show").each(function () {
                var li_width_item = jQuery(this).outerWidth(true);
                if (parseInt(li_width_item) > parseInt(li_width_itemts)) {
                    li_width_itemts = li_width_item;
                }
            });
            jQuery(".fileviewer .important_action_btn>.li_show").css("width", li_width_itemts);
            var file_button_action_h = $(".file_button_action").outerHeight(true);
            var window_h = $(".secrtc1").outerHeight(true);
            var fix_h = window_h - file_button_action_h;
            $("#FileViewer #outerContainer").css("height", fix_h);
        }
    },
    fileViewer_height_fn: function () {
        if ($("#FileViewer").is(":visible")) {
            if ($(window).width() > 991) {
                //fix FileViewer height
                $("#FileViewer").css("height", "auto");
                $("#FileViewer #outerContainer").css("height", "auto");
                $("#FileViewer .group-tab .tab-data").css("height", "auto");
                var window_height = $(window).outerHeight(true);
                var navbar_height = 0;
                if ($(".header_banner").is(":visible")) {
                    navbar_height = $(".navbar").outerHeight(true) + $(".header_banner").outerHeight(true);
                } else {
                    navbar_height = $(".navbar").outerHeight(true);
                }
                var breadcrumbs_height = $(".page-breadcrumbs").outerHeight(true);
                var file_button_action_height = $("#FileViewer .file_button_action").outerHeight(true);
                var toolbarViewer_Scanfile_height = $("#FileViewer .toolbarViewer_Scanfile").outerHeight(true);
                var label_group_tab_custom_height = $("#FileViewer .label_group_tab_custom").outerHeight(true);
                var fileViewer_height = window_height - (navbar_height + breadcrumbs_height + 2);
                var outerContainer_height = fileViewer_height - (file_button_action_height + 2);
                var items_Scan_height = fileViewer_height - (toolbarViewer_Scanfile_height + 2);
                var tab_data_height = fileViewer_height - (label_group_tab_custom_height + 2);
                var sidebar_menu_height = window_height - (navbar_height + 2);
                var outerContainer_height_i = "height: " + outerContainer_height + "px !important";
                $("#FileViewer").css("height", fileViewer_height);
                $("#FileViewer .secrtc2 .widget").css("height", fileViewer_height);
                $("#FileViewer .secrtc1 .ScanResult").css("height", fileViewer_height);
                $("#FileViewer .secrtc1 .ScanResult .items_Scan").css("height", items_Scan_height);
                $("#FileViewer #outerContainer").css("height", outerContainer_height);
                $("#FileViewer #DocProIMGMap").attr('style', outerContainer_height_i);
                $("#FileViewer .doc-viewer").attr('style', outerContainer_height_i);
                $("#FileViewer .group-tab .tab-data").css("height", tab_data_height);
                $(".page-sidebar .sidebar-menu").css("height", sidebar_menu_height);
            } else {
                $("#FileViewer").css("height", "auto");
                $("#FileViewer .secrtc2 .widget").css("height", fileViewer_height);
                $("#FileViewer .secrtc1 .ScanResult").css("height", fileViewer_height);
                $("#FileViewer .secrtc1 .ScanResult .items_Scan").css("height", items_Scan_height);
                $("#FileViewer #outerContainer").css("height", outerContainer_height);
                $("#FileViewer #DocProIMGMap").attr('style', outerContainer_height_i);
                $("#FileViewer .doc-viewer").attr('style', outerContainer_height_i);
                $("#FileViewer .group-tab .tab-data").css("height", "auto");
                $(".page-sidebar .sidebar-menu").css("height", "auto");
            }
        }
    },
    newsfeedimg: function () {
        // NewsFeed image grid
        $(".timeline-body").each(function () {
            if ($(this).find(".card-image").is(":visible")) {
                var NewsFeed_Image_Count = $(this).find(".card-image").length;
                //alert(NewsFeed_Image_Count);
                if (parseInt(NewsFeed_Image_Count) > 2) {
                    $(this).find(".card-image").addClass("multi_card_img");
                    $(this).find(".card-image").addClass("hidden");
                    $(this).find(".card-image:eq(0)").removeClass("hidden");
                    $(this).find(".card-image:eq(1)").removeClass("hidden").addClass("equal_height");
                    $(this).find(".card-image:eq(2)").removeClass("hidden").addClass("equal_height");
                    var temp_img_heights = 0;
                    $(this).find(".card-image.equal_height img").each(function () {
                        var temp_img_height = jQuery(this).height();
                        if (parseInt(temp_img_height) > parseInt(temp_img_heights)) {
                            temp_img_heights = temp_img_height;
                        }
                    });
                    $(this).find(".card-image.equal_height").css("height", temp_img_heights);
                    $(this).find(".card-image.equal_height img").css("height", temp_img_heights);
                    $(this).find(".card-image.equal_height").addClass("fit_thumbnail");
                    if (parseInt(NewsFeed_Image_Count - 3) > 0) {
                        var other_img_count_msg = "<div class='other_img_count'>" + (NewsFeed_Image_Count - 3) + "<i class='ion-plus-round'></i></div>";
                        $(this).find(".card-image.equal_height:eq(1) img").after(other_img_count_msg);
                        var other_img_count = $(this).find(".other_img_count").width();
                        $(this).find(".other_img_count").css("margin-left", -(other_img_count / 2));
                    }
                } else if (parseInt(NewsFeed_Image_Count) == 2) {
                    $(this).find(".card-image").addClass("two_card_img");
                } else {
                    $(this).find(".card-image").addClass("one_card_img");
                }
            }

        });
    },
    Scroll_table: function () {
        if ($("table.table").is(":visible")) {
            jQuery("table.table").each(function () {
                var obj = jQuery(this);
                if (!obj.parent().hasClass("over_auto")) {
                    obj.wrapAll('<div class="over_auto"></div>');
                }
                obj.find("tbody tr").each(function () {
                    $(this).find("td").each(function (index) {
                        var data_title = $(this).parents("tbody").prev("thead").find("tr").find("th").eq(index).clone().children().remove().end().text();
                        if (data_title.trim()) {
                            //$(this).attr("data-title",data_title);
                        }
                    });
                });
            });
        }
    },
    Scroll_tab_group: function () {
        if ($(".group_tab_scroll").is(":visible")) {
            var group_tab_scroll_w = 0;
            group_tab_scroll_w = $(".group_tab_scroll").outerWidth(true);

            var group_tab_w = 0;
            $(".group_tab_scroll .tabitem:not(.hidden)").each(function () {
                var group_tab_item_w = $(this).outerWidth(true) + 2;
                $(this).addClass("tab_show");
                group_tab_w = group_tab_w + group_tab_item_w;
            });
            if (group_tab_w > group_tab_scroll_w) {
                jQuery(".group_tab_scroll_next").removeClass("hidden");
                var tab_each_itemt = 0;
                jQuery(".group_tab_scroll > .tab_show").each(function () {
                    var tab_show_w = jQuery(this).outerWidth(true);
                    if (parseInt(tab_show_w) > parseInt(tab_each_itemt)) {
                        tab_each_itemt = tab_show_w;
                    }
                });
                jQuery(".group_tab_scroll > .tab_show").css("width", tab_each_itemt);
                var tab_length = jQuery(".group_tab_scroll > .tab_show").length;
                $(".group_tab_scroll").css("width", tab_each_itemt * tab_length);
                var translate_css_px = 0;
                var tem_w = tab_each_itemt * tab_length;

                $(".group_tab_scroll_next").click(function () {
                    jQuery(".group_tab_scroll_prev").removeClass("hidden");
                    translate_css_px = translate_css_px - tab_each_itemt;
                    var translate_css = 'translateX(' + translate_css_px + 'px)';
                    $(".group_tab_scroll").css({ "transform": translate_css });
                    tem_w = tem_w - tab_each_itemt;
                    $(".group_tab_scroll_prev").show();
                    if (tem_w <= group_tab_scroll_w) {
                        $(this).hide();
                    }
                });
                $(".group_tab_scroll_prev").click(function () {
                    translate_css_px = translate_css_px + tab_each_itemt;
                    var translate_css = 'translateX(' + translate_css_px + 'px)';
                    $(".group_tab_scroll").css({ "transform": translate_css });
                    tem_w = tem_w + tab_each_itemt;
                    $(".group_tab_scroll_next").show();
                    if (tem_w >= (tab_each_itemt * tab_length)) {
                        $(this).hide();
                    }
                });
            }
        }
    },
    Table_sort: function () {
        if ($("table .sortitem").is(":visible")) {
            $(document).find(".sortitem").parents("th").addClass("sortitem_th");
        }
    },
    Textarea_height_auto: function(){
        $('.tb_textarea-auto-height').on('change keyup keydown paste cut input', 'textarea',    function () { 
      $(this).height(0).height(this.scrollHeight);
      console.log(this)
    }
);
    }

};
function ScanFile_Page() {
    if ($(".items_Scan").is(":visible")) {
        var total_page = jQuery(".items_Scan .itemScan").length;
        jQuery("#num_Pages b").text(total_page);
        jQuery("#page_Number").attr("max", total_page);
        jQuery(".items_Scan .itemScan").each(function () {
            var page_index = jQuery(this).index() + 1;
            jQuery(this).attr("page_index", page_index);
            if (page_index == 1) {
                jQuery(this).addClass("over_top");
                jQuery(this).addClass("first_over_top");
            }
        });
        var current_page = 1;
        $(".ScanResult .items_Scan").scroll(function () {
            jQuery(".items_Scan .itemScan:not(.first_over_top)").each(function () {
                var pos = jQuery(this).position();
                var PosScroll = jQuery(this).scrollTop();
                if ((parseInt(PosScroll) + 10) > parseInt(pos.top)) {
                    jQuery(this).addClass("over_top");
                } else {
                    jQuery(this).removeClass("over_top");
                }
            });
            current_page = jQuery(".items_Scan .itemScan.over_top").length;
            jQuery("#page_Number").val(current_page);
        });
        $('#page_Number').on('change', function () {
            goto_page = $('#page_Number').val();
            var container = $('.ScanResult .items_Scan'),
                scrollTo = $('.ScanResult .items_Scan .itemScan[page_index=' + goto_page + ']');
            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        });
        $('.other_tools .goto_firstpage ').on('click', function () {
            var container = $('.ScanResult .items_Scan'),
                scrollTo = $('.ScanResult .items_Scan .itemScan[page_index="1"]');
            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        });
        $('.other_tools .goto_lastpage ').on('click', function () {
            var container = $('.ScanResult .items_Scan'),
                scrollTo = $('.ScanResult .items_Scan .itemScan[page_index=' + total_page + ']');
            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        });
        $('.prev_next_page  .prev_page').on('click', function () {
            var tem_page = current_page;
            if (tem_page > 1) {
                tem_page = parseInt(tem_page) - 1;
                current_page = tem_page;
            }
            var container = $('.ScanResult .items_Scan'),
                scrollTo = $('.ScanResult .items_Scan .itemScan[page_index=' + current_page + ']');
            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        });
        $('.prev_next_page  .next_page').on('click', function () {
            var tem_page = current_page;
            if (tem_page < total_page) {
                tem_page = parseInt(tem_page) + 1;
                current_page = tem_page;
            }
            var container = $('.ScanResult .items_Scan'),
                scrollTo = $('.ScanResult .items_Scan .itemScan[page_index=' + current_page + ']');
            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        });
    }
};
function ScanFile_Atc() {
    //Xóa ảnh
    if ($(".items_Scan").is(":visible")) {
        jQuery(".items_Scan .itemScan").each(function () {
            var obj = jQuery(this);
            obj.find("img").wrapAll('<div class="itemScan_img"></div>');
            obj.find(".itemScan_img").append('<a href="#" title="Xóa ảnh" class="Del_itemScan"><i class="ion-ios-close-empty"></i></a>');
            obj.find('.Del_itemScan').on('click', function () {
                if (confirm('Bạn có muốn xóa ảnh này không ?')) {
                    //var img_id = jQuery(this).parents('.itemScan').attr("data-value");
                    jQuery(this).parents('.itemScan').remove();
                    //console.log("Remove img id " +img_id+ " done");
                    ScanFile_Page();
                }
            });
        });
    }
};
var szoom_stt = 1;
function ScanFile_FixWH() {
    jQuery(".items_Scan .itemScan").each(function () {
        var obj = jQuery(this);
        var sf_w = 0;
        var sf_h = 0;
        if (szoom_stt == 1) { //Auto zoom
            sf_w = 680;
        } else if (szoom_stt == 2) { //Full width
            sf_w = obj.width();
        } else if (szoom_stt == 3) { //50%
            sf_w = 340;
        } else if (szoom_stt == 4) { //75%
            sf_w = 510;
        } else if (szoom_stt == 5) { //100%
            sf_w = 680;
        } else if (szoom_stt == 6) { //125%
            sf_w = 850;
        } else if (szoom_stt == 7) { //150%
            sf_w = 1020;
        } else if (szoom_stt == 8) { //175%
            sf_w = 1190;
        } else if (szoom_stt == 9) { //200%
            sf_w = 1360;
        }
        else {
            sf_w = 680;
        }
        obj.find(".itemScan_img").css("width", sf_w);
        obj.find(".itemScan_img img").css("width", sf_w);
        sf_h = obj.find(".itemScan_img img").height();
        var ratio = 0;
        if (parseFloat(sf_w) > parseFloat(sf_h)) {
            ratio = parseFloat(sf_w) / parseFloat(sf_h);
        } else if (parseFloat(sf_w) < parseFloat(sf_h)) {
            ratio = parseFloat(sf_h) / parseFloat(sf_w);
        } else { //auto zoom
            ratio = 1;
        }
        obj.find(".itemScan_img").css("width", 0);
        obj.find(".itemScan_img").css("height", 0);
        obj.find(".itemScan_img").css({ "padding-top": sf_h / 2, "padding-right": sf_w / 2, "padding-bottom": sf_h / 2, "padding-left": sf_w / 2 });
        obj.find(".itemScan_img").attr("padding-lr", sf_w / 2);
        obj.find(".itemScan_img").attr("padding-bt", sf_h / 2);
        obj.find(".itemScan_img").attr("ratio", ratio);
        obj.find(".itemScan_img img").css({ "position": "absolute", "top": "0", "left": "0", "max-width": "none" });
    });
};
var rorated = false;
var rorate_deg = 0;
function ScanFile_Rorate() {
    jQuery(".other_tools .rorate_left").on('click', function () {
        if (!rorated) {
            rorated = true;
        } else {
            rorated = false;
        }
        rorate_deg = rorate_deg - 90;
        rorate_css = 'rotate(' + rorate_deg + 'deg)';
        if ($(".items_Scan .itemScan").is(":visible")) {
            jQuery(".items_Scan .itemScan").each(function () {
                var obj = jQuery(this);
                obj.find("img").css({ "transform": rorate_css });
                var padding_lr = obj.find(".itemScan_img").attr("padding-lr");
                var padding_bt = obj.find(".itemScan_img").attr("padding-bt");
                var img_ratio = obj.find(".itemScan_img").attr("ratio");
                if (rorated) {
                    if (szoom_stt == 2) {
                        if (parseFloat(padding_lr) > parseFloat(padding_bt)) {
                            obj.find(".itemScan_img").css({ "padding": (padding_lr * img_ratio) + "px " + padding_lr + "px" });
                            obj.find(".itemScan_img img").css("width", (padding_lr * 2) * img_ratio);
                            obj.find(".itemScan_img img").css("margin-left", -((padding_lr * img_ratio) - padding_lr));
                            obj.find(".itemScan_img img").css("margin-top", (padding_lr * img_ratio) - padding_lr);
                        } else {
                            obj.find(".itemScan_img").css({ "padding": (padding_lr / img_ratio) + "px " + padding_lr + "px" });
                            obj.find(".itemScan_img img").css("width", (padding_lr * 2) / img_ratio);
                            obj.find(".itemScan_img img").css("margin-left", (padding_lr - (padding_lr / img_ratio)));
                            obj.find(".itemScan_img img").css("margin-top", -(padding_lr - (padding_lr / img_ratio)));
                        };
                    } else {
                        obj.find(".itemScan_img").css({ "padding": padding_lr + "px " + padding_bt + "px" });
                        obj.find(".itemScan_img img").css("width", padding_lr * 2);
                        if (parseFloat(padding_lr) > parseFloat(padding_bt)) {
                            obj.find(".itemScan_img img").css("margin-left", -(padding_lr - padding_bt));
                            obj.find(".itemScan_img img").css("margin-top", padding_lr - padding_bt);
                        } else {
                            obj.find(".itemScan_img img").css("margin-left", -(padding_lr - padding_bt));
                            obj.find(".itemScan_img img").css("margin-top", padding_lr - padding_bt);
                        };
                    }
                } else {
                    if (szoom_stt == 2) {
                        if (parseFloat(padding_lr) > parseFloat(padding_bt)) {
                            obj.find(".itemScan_img").css({ "padding": padding_bt + "px " + padding_lr + "px" });
                            obj.find(".itemScan_img img").css("width", (padding_lr * 2));
                            obj.find(".itemScan_img img").css("margin-left", 0);
                            obj.find(".itemScan_img img").css("margin-top", 0);
                        } else {
                            obj.find(".itemScan_img").css({ "padding": padding_bt + "px " + padding_lr + "px" });
                            obj.find(".itemScan_img img").css("width", (padding_lr * 2));
                            obj.find(".itemScan_img img").css("margin-left", 0);
                            obj.find(".itemScan_img img").css("margin-top", 0);
                        };
                    } else {
                        obj.find(".itemScan_img").css({ "padding": padding_bt + "px " + padding_lr + "px" });
                        obj.find(".itemScan_img img").css("width", padding_lr * 2);
                        if (parseFloat(padding_lr) > parseFloat(padding_bt)) {
                            obj.find(".itemScan_img img").css("margin-left", 0);
                            obj.find(".itemScan_img img").css("margin-top", 0);
                        }
                        else {
                            obj.find(".itemScan_img img").css("margin-left", 0);
                            obj.find(".itemScan_img img").css("margin-top", 0);
                        }
                    }
                }
            });
        } else {
            alert("Không có ảnh để hiển thị");
        }
    });
    jQuery(".other_tools .rorate_right").on('click', function () {
        if (!rorated) {
            rorated = true;
        } else {
            rorated = false;
        }
        rorate_deg = rorate_deg + 90;
        rorate_css = 'rotate(' + rorate_deg + 'deg)';
        if ($(".items_Scan .itemScan").is(":visible")) {
            jQuery(".items_Scan .itemScan").each(function () {
                var obj = jQuery(this);
                obj.find("img").css({ "transform": rorate_css });
                var padding_lr = obj.find(".itemScan_img").attr("padding-lr");
                var padding_bt = obj.find(".itemScan_img").attr("padding-bt");
                var img_ratio = obj.find(".itemScan_img").attr("ratio");
                if (rorated) {
                    if (szoom_stt == 2) {
                        if (parseFloat(padding_lr) > parseFloat(padding_bt)) {
                            obj.find(".itemScan_img").css({ "padding": (padding_lr * img_ratio) + "px " + padding_lr + "px" });
                            obj.find(".itemScan_img img").css("width", (padding_lr * 2) * img_ratio);
                            obj.find(".itemScan_img img").css("margin-left", -((padding_lr * img_ratio) - padding_lr));
                            obj.find(".itemScan_img img").css("margin-top", (padding_lr * img_ratio) - padding_lr);
                        } else {
                            obj.find(".itemScan_img").css({ "padding": (padding_lr / img_ratio) + "px " + padding_lr + "px" });
                            obj.find(".itemScan_img img").css("width", (padding_lr * 2) / img_ratio);
                            obj.find(".itemScan_img img").css("margin-left", (padding_lr - (padding_lr / img_ratio)));
                            obj.find(".itemScan_img img").css("margin-top", -(padding_lr - (padding_lr / img_ratio)));
                        };
                    } else {
                        obj.find(".itemScan_img").css({ "padding": padding_lr + "px " + padding_bt + "px" });
                        obj.find(".itemScan_img img").css("width", padding_lr * 2);
                        if (parseFloat(padding_lr) > parseFloat(padding_bt)) {
                            obj.find(".itemScan_img img").css("margin-left", -(padding_lr - padding_bt));
                            obj.find(".itemScan_img img").css("margin-top", padding_lr - padding_bt);
                        } else {
                            obj.find(".itemScan_img img").css("margin-left", -(padding_lr - padding_bt));
                            obj.find(".itemScan_img img").css("margin-top", padding_lr - padding_bt);
                        };
                    }
                } else {
                    if (szoom_stt == 2) {
                        if (parseFloat(padding_lr) > parseFloat(padding_bt)) {
                            obj.find(".itemScan_img").css({ "padding": padding_bt + "px " + padding_lr + "px" });
                            obj.find(".itemScan_img img").css("width", (padding_lr * 2));
                            obj.find(".itemScan_img img").css("margin-left", 0);
                            obj.find(".itemScan_img img").css("margin-top", 0);
                        } else {
                            obj.find(".itemScan_img").css({ "padding": padding_bt + "px " + padding_lr + "px" });
                            obj.find(".itemScan_img img").css("width", (padding_lr * 2));
                            obj.find(".itemScan_img img").css("margin-left", 0);
                            obj.find(".itemScan_img img").css("margin-top", 0);
                        };
                    } else {
                        obj.find(".itemScan_img").css({ "padding": padding_bt + "px " + padding_lr + "px" });
                        obj.find(".itemScan_img img").css("width", padding_lr * 2);
                        if (parseFloat(padding_lr) > parseFloat(padding_bt)) {
                            obj.find(".itemScan_img img").css("margin-left", 0);
                            obj.find(".itemScan_img img").css("margin-top", 0);
                        }
                        else {
                            obj.find(".itemScan_img img").css("margin-left", 0);
                            obj.find(".itemScan_img img").css("margin-top", 0);
                        }
                    }
                }
            });
        } else {
            alert("Không có ảnh để hiển thị");
        }
    });
};

$(document).on('DOMNodeInserted', function (e) {
    if ($(e.target).hasClass('flash')) {
        Utils.flash_position();
    }
});
$(document).on("click", '.close-popup', function (e) {
    jQuery(".ui-dialog-titlebar-close").trigger("click");
});
$(document).on("click", ".scrollItem_item_title", function () {
    if ($(this).parents(".scrollItem_item").find('.scrollItem_content').is(":visible")) {
        $(this).parents(".scrollItem_item").find('.scrollItem_content').slideUp();
    } else {
        $(this).parents(".scrollItem_item").find('.scrollItem_content').slideDown();
    }
    $(this).parents(".scrollItem_item").toggleClass("open");
    $(this).find(".fa_left").toggleClass('fa-caret-right fa-caret-down');
    rule_check();
});

//--DOCUMENT READY FUNCTION BEGIN
$(document).ready(function () {


    Utils.flash_position();
    if ($(".fsi_group_tabs .nav-tabs").length != 0) {
        $(".fsi_group_tabs .nav-tabs").each(function () {
            var length = $(this).children("li:not(.hidden)").length;
            if (length > 1) {
                $(this).css("display", "block");
            }
        });
    }
    jQuery(document).on('click', '._borrow--searchStartDate #dropdownBorrows', function () {
        jQuery(this).parents().find(".Main_dropdown").toggleClass("open");
    });
    jQuery(document).on('click', '.Main--btn ._btn--delete', function () {
        jQuery(this).parents().find(".Main_dropdown").removeClass("open");
    });
    //linhht  
    jQuery(document).on('click', '.deleteAllItem', function () {
        //$("#docTbls tbody").html('');
        var table = jQuery(this)
            .closest(".dataTables_wrapper")
            .find("table");

        table.find(".checkboxes").each(function () {
            if (jQuery(this).prop("checked")) {
                jQuery(this).closest("tr").remove();
                $(".group-checkable").prop("checked", false);
                $(".actMultiTicks ").addClass("hidden");

            }
        });

    });
    //
    jQuery(document).on('click', ".append_template", function () {
        var obj = jQuery(this);
        var form = jQuery(this).closest("form");
        var table = form.find("table:first");
        var target = jQuery(obj.attr("data-target"));
        var temp = jQuery(obj.attr("data-temp"));
        var jobdetail = jQuery("input#JobDetail").val();
        var jobexcuter = jQuery("select#idJobDetailExcuter").val();
        var jobexcutername = jQuery("select#idJobDetailExcuter option:selected").text();
        var datejob = jQuery("input#DateJobDetail").val();
        var startdatejob = jQuery("input#StartDateJobDetail").val();
        var enddatejob = jQuery("input#EndDateJobDetail").val();
        var starttime = form.find("#JobCrStartDate").val();
        var enddate = form.find("#JobCrEndDate").val();
        if (!(Utils.isEmpty(jobdetail) || Utils.isEmpty(datejob) || Utils.isEmpty(startdatejob) || Utils.isEmpty(enddatejob) || Utils.isEmpty(jobexcuter))) {

            jQuery("#detailTemplate .IDJobDetail").attr("name", "IDJobDetail");
            jQuery("#detailTemplate .JobDetailName").attr("name", "JobDetailName");
            jQuery("#detailTemplate .JobDetailExcuter").attr("name", "JobDetailExcuter");
            jQuery("#detailTemplate .DateJobDetail").attr("name", "DateJobDetail");
            jQuery("#detailTemplate .StartDateJobDetail").attr("name", "StartDateJobDetail");
            jQuery("#detailTemplate .EndDateJobDetail").attr("name", "EndDateJobDetail");
            jQuery("#detailTemplate .idJobDetail").html(jobdetail);
            jQuery("#detailTemplate .jobDetailDatetime").html("(Từ: " + datejob + " : " + startdatejob + " -  Đến: " + datejob + " : " + enddatejob + ") -  " + "Người thực hiện: " + jobexcutername);
            jQuery("#detailTemplate .JobDetailName").val(jobdetail);
            jQuery("#detailTemplate .JobDetailExcuter").val(jobexcuter);
            jQuery("#detailTemplate .DateJobDetail").val(datejob);
            jQuery("#detailTemplate .StartDateJobDetail").val(startdatejob);
            jQuery("#detailTemplate .EndDateJobDetail").val(enddatejob);
            jQuery("input#JobDetail").val('');
            Utils.destroyValidator(table);
            target.append(temp.html());
            //  Utils.updateInputDate(form);
            Utils.bootstrapValidator(table);
            Utils.autoResize();
            Utils.resetTableFix(table);
            // Utils.updateIsNumber(form);
            Autocomplete.init(jQuery(target));
            jQuery("#detailTemplate .IDJobDetail").removeAttr("name", "IDJobDetail");
            jQuery("#detailTemplate .JobDetailName").removeAttr("name", "JobDetailName");
            jQuery("#detailTemplate .DateJobDetail").removeAttr("name", "DateJobDetail");
            jQuery("#detailTemplate .JobDetailExcuter").removeAttr("name", "JobDetailExcuter");
            jQuery("#detailTemplate .StartDateJobDetail").removeAttr("name", "StartDateJobDetail");
            jQuery("#detailTemplate .EndDateJobDetail").removeAttr("name", "EndDateJobDetail");
            form.find('#messeageadd_err').html("");
        }
        else if (Utils.isEmpty(jobdetail)) {
            form.find('#messeage_err').html("");
            form.find('#messeageadd_err').html("Việc cần làm không được để trống");
        }
        else if (Utils.isEmpty(jobexcuter)) {
            form.find('#messeage_err').html("");
            form.find('#messeageadd_err').html("Bạn chưa chọn người thực hiện việc cần làm");
        }
        else if (Utils.isEmpty(datejob)) {
            form.find('#messeage_err').html("");
            form.find('#messeageadd_err').html("Bạn chưa chọn ngày thực hiện việc cần làm");
        }
        else {
            form.find('#messeage_err').html("");
            form.find('#messeageadd_err').html("Bạn chưa chọn giờ thực hiện việc cần làm");
        }
        // var el1 = table.find("tbody tr:last td:eq(1)").
    });

    jQuery(document).on('click', '.selectNew li', function () {
        var value = parseInt(jQuery(this).attr("data-original-index"));

        var name = jQuery("select.selectNew option:eq(" + value + ")").attr("name").split(',');
        var datavalue = jQuery("select.selectNew option:eq(" + value + ")").attr("data-value").split(',');
        for (var j = 0; j < name.length; j++) {
            var text = "." + name[j];
            jQuery(text).val(datavalue[j]);
        }
    });

    jQuery(document).on('click', '._Dropdown_close', function () {
        var url = jQuery(this).attr('data-url');
        var parent = jQuery(this).closest('._list');
        var idcount = jQuery(this).attr('data-idcount');
        var target = jQuery(jQuery(this).attr('data-id'));
        jQuery.ajax({
            type: "POST",
            async: true,
            url: url,
            beforeSend: function () {

            },
            complete: function () {
            },
            error: function () {
            },
            success: function (response) {
                parent.remove();
                target.removeClass('hidden');
                var count = jQuery(idcount).html();
                jQuery(idcount).html(count - 1);

            }
        });
    });

    //jQuery(document).on("change", ".replaceNumber", function () {
    //    var number = Intl.NumberFormat().format(jQuery(this).val());
    //    jQuery(this).value=number;
    //});


    jQuery('.widget-buttons > [data-toggle="maximize"]').on("click", function () {
        jQuery("body").toggleClass("maximize");
    });

    Cust.check_required_input();
    $(document).on("dialogopen", function (event, ui) {


        if (jQuery(document).find(".useWizard").length != 0) {
            jQuery(document).find(".useWizard").each(function () {
                var id = $(this).attr("id");
                $('#' + id).wizard();
            });
        }
        if (jQuery(document).find(".date").is(":visible")) {
            jQuery('.date').datetimepicker({
                format: 'd-m-Y',
                timepicker: false
            });
        }
        if (jQuery(document).find('[data-toggle="popover"]').is(":visible")) {
            jQuery(document).find('[data-toggle="popover"]').popover();
        }
        if (jQuery(document).find(".selectpicker").is(":visible")) {
            $('.selectpicker').selectpicker();
        }
        if (jQuery(document).find(".autoSelect2").is(":visible")) {
            $("select.autoSelect2").select2();
        }
        // lock scroll position, but retain settings for later
        // var scrollPosition = [
        //   self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        //   self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
        // ];
        // var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
        // html.data('scroll-position', scrollPosition);
        // html.data('previous-overflow', html.css('overflow'));
        // html.css('overflow', 'hidden');
        // window.scrollTo(scrollPosition[0], scrollPosition[1]);
        if ((jQuery(document).find("#Overlay").is(":visible")) && (jQuery(document).find("#Overlay").hasClass("loadingc"))) {
            jQuery(document).find("#Overlay").removeClass("loadingc");
        }
        Cust.check_required_input();
        //container.find(".useTableFix").each(function () {
        //    try {
        //        var left = $(this).attr("data-fix-left");
        //        var right = $(this).attr("data-fix-right");

        //        if (!$(this).hasClass("table_fix_inited")) {
        //            $(this).tableHeadFixer({
        //                "left": left,
        //                "right": right
        //            });
        //            $(this).addClass("table_fix_inited");
        //        }
        //    } catch (e) {

        //    }
        //});

    });
    $(document).on('click', '.FileNotification_btn', function () {
        $(this).parents('.FileNotification').toggleClass('is-opened');
    });
    $(document).on('click', '.FileNotiClose', function () {
        $(this).parents('.FileNotification').toggleClass('is-opened');
    });

    function display_dock() {
        //dock
        var dock = $(".dock #dockWrapper");
        dock.css("margin-top", "0px");
        dock.css("opacity", "1");
        //toggle_dock
        var toggle_dock = $(".toggle_dock");
        toggle_dock.css("opacity", "0");
        $(".dock").css("visibility", "visible");
        jQuery(".toggle_dock").addClass("is_hidden");
        jQuery(".toggle_dock").removeClass("is_show");
        localStorage.setItem('toggle_dock_stt', 'dock_is_show');
    }
    function hide_dock() {
        //dock
        var dock = $(".dock #dockWrapper");
        dock.css("margin-top", "100px");
        dock.css("opacity", "0");
        //toggle_dock
        var toggle_dock = $(".toggle_dock");
        toggle_dock.css("opacity", "1");

        $(".dock").css("visibility", "hidden");
        jQuery(".toggle_dock").removeClass("is_hidden");
        jQuery(".toggle_dock").addClass("is_show");
        localStorage.setItem('toggle_dock_stt', 'dock_is_hide');
    }
    jQuery(".btn_show_dock").click(function (e) {
        e.preventDefault();
        //dock
        var dock = $(".dock #dockWrapper");
        dock.animate({ "opacity": "1", "margin-top": "0px" }, 300);

        //toggle_dock
        var toggle_dock = $(".toggle_dock");
        toggle_dock.animate({ "opacity": "0" }, 300);
        toggle_dock.css({
            'transition': 'all .3s',
            'transform': 'scale(0)',
        });

        jQuery(".toggle_dock").addClass("is_hidden");
        jQuery(".toggle_dock").removeClass("is_show");
        $(".dock").css("visibility", "visible");
        localStorage.setItem('toggle_dock_stt', 'dock_is_show');
    });
    jQuery(".btn_hide_dock").click(function (e) {
        e.preventDefault();
        //dock
        var dock = $(".dock #dockWrapper");
        dock.animate({ "margin-top": "100px", "opacity": "0" }, 300);

        //toggle_dock
        var toggle_dock = $(".toggle_dock");
        toggle_dock.animate({ "opacity": "1" }, 300);


        toggle_dock.css({
            'transition': 'all .3s',
            'transform': 'scale(1)',
        });

        jQuery(".toggle_dock").removeClass("is_hidden");
        jQuery(".toggle_dock").addClass("is_show");
        $(".dock").css("visibility", "hidden");
        localStorage.setItem('toggle_dock_stt', 'dock_is_hide');
    });
    if (localStorage.getItem('toggle_dock_stt') == 'dock_is_show') {
        display_dock();
    } else {
        hide_dock();
    }
    $('.multi-action .action-button').on('click', function () {
        $(this).toggleClass('active');
        if ($(this).parents().attr("data-original-title") == "") {
            $(this).parents().attr("data-original-title", "Danh sách ghim");
            $(this).parents().next(".tooltip").show();
        } else {
            $(this).parents().attr("data-original-title", "");
            $(this).parents().next(".tooltip").hide();
        }
    });
    $(document).on("dialogclose", function (event, ui) {
        // un-lock scroll position
        // var html = jQuery('html');
        // var scrollPosition = html.data('scroll-position');
        // html.css('overflow', html.data('previous-overflow'));
        // window.scrollTo(scrollPosition[0], scrollPosition[1]);
    });
    $('.FileNotification_btn').click(function () {
        $(this).parents('.FileNotification').toggleClass('is-opened');
    });
    $('.FileNotiClose').click(function () {
        $(this).parents('.FileNotification').toggleClass('is-opened');
    });
    if (jQuery(".databox span.databox-text").is(":visible")) {
        jQuery(".databox span.databox-text").each(function () {
            var databox_text = jQuery(this).text();
            jQuery(this).attr("title", databox_text);
        });
    }
    if (jQuery(".sidebar-menu .menu-text").is(":visible")) {
        jQuery(".sidebar-menu .menu-text").each(function () {
            var menu_text = jQuery(this).text();
            jQuery(this).attr("title", menu_text);
        });
    }
    var temp_height = 0;
    jQuery(".contact-box").each(function () {
        var contact_box_height = jQuery(this).height();
        if (parseInt(contact_box_height) > parseInt(temp_height)) {
            temp_height = contact_box_height;
        }
    });
    jQuery(".contact-box").css("height", temp_height);


    $(".target_cmt_form").click(function () {
        if ($(this).parents(".timeline-panel").find(".timeline-comment.not_show").is(":visible")) {
            $(this).parents(".timeline-panel").find(".timeline-comment.not_show .p-text-area").focus();
        } else {
            $(this).parents(".timeline-panel").find(".timeline-comment.not_show").show();
            $(this).parents(".timeline-panel").find(".timeline-comment.not_show .p-text-area").focus();
        }
    });
    $('.file_button_action_list li .dropdown-menu .slOcrForm').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $(".reply-cmt-content a").click(function () {
        $(this).parents(".count_reply_cmt_item").hide();
        $(this).parents(".reply-cmt-content").find(".load_more_cmt").show();
    });
    $(".fileviewer .important_action_btn .enableOcr").click(function () {
        if ($(".fileviewer .important_action_btn .jbuttons").is(":visible")) {
            $(".fileviewer .important_action_btn .jbuttons").hide();
        } else {
            $(".fileviewer .important_action_btn .jbuttons").show();
        }
        Cust.prev_next_group_button();
    });
    $(".chat_w_item_content .box-chat-user-title .chat-name a").click(function (e) {
        e.preventDefault();
        var href = $(this).attr("href");
        location.href = href;
    });
    $(".chat_w_item_content .chat-close").click(function (e) {
        e.preventDefault();
        $(this).parents(".chat_w_item").hide();
    });
    $(".chat_w_item_content .box-chat-user-title").click(function () {
        if ($(this).parents(".chat_w_item").hasClass("slideDown")) {
            $(this).parents(".chat_w_item").removeClass("slideDown");
        } else {
            $(this).parents(".chat_w_item").addClass("slideDown");
        }
    });
    //advanced_search_bar
    $(".advanced_search_bar .show_form_btn").focus(function () {
        $(this).parents(".advanced_search_bar").addClass("active");
        $(this).parents(".advanced_search_bar").find(".option_search").fadeIn();
    });
    $(".advanced_search_bar .hide_form_btn").click(function () {
        $(this).parents(".advanced_search_bar").removeClass("active");
        $(this).parents(".option_search").fadeOut();
    });
    //notification
    $(".notifies-dropdown-toggle").click(function () {
        if ($(this).parents("li").hasClass("open")) {
            $(this).parents("li").removeClass("open");
        } else {
            $(this).parents("li").addClass("open");
        }
    });
    jQuery(document).mouseup(function (e) {
        var container = jQuery(".notifies-dropdown-toggle").parents("li");
        if (container.is(":visible")) {
            if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                $(".notifies-dropdown-toggle").parents("li").removeClass("open");
            }
        }
    });
    jQuery(".navbar .navbar-inner .navbar-header .navbar-account .account-area li.dropdown-hover a .dropdown-expand").click(function (event) {
        event.stopPropagation();
        event.preventDefault();
        jQuery(this).toggleClass("inited");
        jQuery(".navbar .navbar-inner .navbar-header .navbar-account .account-area li.dropdown-hover a .dropdown-expand:not('.inited')").removeClass("active");
        jQuery(this).toggleClass("active");
        jQuery(this).removeClass("inited");

        jQuery(this).parents(".dropdown-hover").toggleClass("inited");
        jQuery(".navbar .navbar-inner .navbar-header .navbar-account .account-area li.dropdown-hover:not('.inited')").find(".dropdown-menu").slideUp(300);
        jQuery(this).parents(".dropdown-hover").find(".dropdown-menu").slideToggle(300);
        jQuery(this).parents(".dropdown-hover").removeClass("inited");
    });
    $(".mgtitle").click(function (e) {
        e.preventDefault();
        return false;
    });
    //Sidebar Menu Handle
    $(".menu-expand").on('click', function (e) {
        e.preventDefault();
        if ($(this).parents(".has_mgtitle").hasClass("open")) {
            $(this).parents(".has_mgtitle").removeClass("open").nextUntil(".has_mgtitle", "li:not(.hidden)").slideUp();
        } else {
            $(this).parents(".has_mgtitle").addClass("open").nextUntil(".has_mgtitle", "li:not(.hidden)").slideDown();
        }
    });
    //End Sidebar Menu Handle
    $('[data-toggle="tooltip"]').tooltip();

    var dragTimer;
    $(window).on('dragenter', function () {
        $(this).preventDefault();
    });
    $(document).on('dragover', function (e) {
        var dt = e.originalEvent.dataTransfer;
        if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
            $("#drap_drop_fixed").addClass("active");
            $(".drap_drop_fixed_ov").addClass("active");
            window.clearTimeout(dragTimer);
        }
    });
    jQuery(document).on("click", ".close_drap_drop", function () {
        rule_check();
    });
    $(".close_drap_drop").on('click', function (e) {
        e.preventDefault();
        $("#drap_drop_fixed").removeClass("active");
        $(".drap_drop_fixed_ov").removeClass("active");
    });
    // =========== FIT IMAGE TO DIV ==========
    // Detect objectFit support
    if ($(".fit_thumbnail").is(":visible")) {
        if ('objectFit' in document.documentElement.style === false) {
            // assign HTMLCollection with parents of images with objectFit to variable
            var container = document.getElementsByClassName('fit_thumbnail');
            // Loop through HTMLCollection
            for (var i = 0; i < container.length; i++) {
                // Asign image source to variable
                var imageSource = container[i].querySelector('img').src;
                // Hide image
                container[i].querySelector('img').style.display = 'none';
                // Add background-size: cover
                container[i].style.backgroundSize = 'cover';
                // Add background-image: and put image source here
                container[i].style.backgroundImage = 'url(' + imageSource + ')';
                // Add background-position: center center
                container[i].style.backgroundPosition = 'center center';
            }
        }
        else {
            // You don't have to worry
            //console.log('No worries, your browser supports objectFit')
        }
    }

    jQuery(document).on('show.bs.tab', '#tabStgDoc a[data-toggle="tab"]', function () {
        //if(jQuery(document).find(".ImgBg_Scrollable").is(":visible")){
        Cust.ImgBg_Scrollable_scan();
        Cust.ImgBg_Scrollable();
        jQuery(document).find(".ImgBg_Scrollable").hover(
            function () {
                if ($("body").height() > $(window).height()) {
                    $("html").css("overflow", "hidden");
                    $("html").css("padding-right", 17); // Default scrollbar width: 17px
                }
            }, function () {
                if (!$(this).hasClass("over")) {
                    if (!jQuery(document).find(".ImgBg_Scrollable_popup").hasClass("active")) {
                        $("html").css("overflow", "auto");
                        $("html").css("padding-right", 0);
                    }
                } else {
                    $("html").css("overflow", "auto");
                    $("html").css("padding-right", 0);
                }
            }
        );
        Cust.hover_docTable();
        //}
    });
    // ========= End.ImgBg_Scrollable =========


    // JS click user
    $('.click_caret').click(function (event) {
        event.preventDefault();
        $('.drop_click_caret').toggleClass('open');
    });
    $(document).click(function (e) {
        var target = e.target;
        if (!$(target).is('.click_caret') && !$(target).is('.click_caret')) {
            $('.drop_click_caret').removeClass('open');
        }
    });

    // JS ADV SEARCH
    $(document).on("click", ".AdvSearchLink", function (e) {
        e.preventDefault();
        var url = $(this).attr("myhref");
        window.location = url;
    });

    $('.advanced_search_bar .btn-searchs .btn-group').on('shown.bs.dropdown', function () {
        $(this).find(".bootstrap-select > .dropdown-menu > .dropdown-menu.inner").addClass("useScrollbar");
        $(this).find(".bootstrap-select > .dropdown-menu > .dropdown-menu.inner.useScrollbar").perfectScrollbar();
    });

    //JS DATAFILLTER SEARCH
    jQuery(document).on('click', '.dataFilter_Dropdown .dropdown-toggle', function () {
        jQuery(this).parents(".dataFilter_Dropdown").toggleClass("open");
        jQuery(this).parents(".quickSearch ").find(".dataFilter_Dropdown_target").toggleClass("open");
    });
    jQuery(document).on('click', '.dataFilter_Dropdown_close', function (e) {
        e.preventDefault();
        jQuery(this).parents(".quickSearch").find(".dataFilter_Dropdown").toggleClass("open");
        jQuery(this).parents(".quickSearch").find(".dataFilter_Dropdown_target").toggleClass("open");
    });
    //jQuery(document).find(".useTreegrid").each(function () {
    //    jQuery(this).treegrid();
    //});
    // UITree.init();

    jQuery(document).find(".main-chart").each(function () {
        var target = $(this).attr("data-target");
        var data_cust = JSON.parse($(this).attr("data-json"));
        var title = $(this).attr("data-title");
        var subtitle = $(this).attr("data-subtitle");
        var data_test = [
            {
                "name": "Chrome",
                "y": 62.74,
                "drilldown": "Chrome"
            },
            {
                "name": "Firefox",
                "y": 10.57,
                "drilldown": "Firefox"
            },
            {
                "name": "Internet Explorer",
                "y": 7.23,
                "drilldown": "Internet Explorer"
            },
            {
                "name": "Safari",
                "y": 5.58,
                "drilldown": "Safari"
            },
            {
                "name": "Edge",
                "y": 4.02,
                "drilldown": "Edge"
            },
            {
                "name": "Opera",
                "y": 1.92,
                "drilldown": "Opera"
            },
            {
                "name": "Other",
                "y": 7.62,
                "drilldown": null
            }
        ];
        // Create the chart
        Highcharts.chart(target, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
            },
            "series": [
                {
                    "name": "Browsers",
                    "colorByPoint": true,
                    "data": data_cust
                }
            ],

        });
    });
    jQuery(document).on('click', '.click_dow', function (e) {
        jQuery(this).parent().toggleClass('dl_full')
    });

});
//--DOCUMENT READY FUNCTION END

//--WINDOW LOADED FUNCTION BEGIN
$(window).bind("load", function () {
    //jQuery(document).find(".useTreegrid").each(function () {
    //    var number = $(this).attr("data-tree");
    //    jQuery(this).treegrid({
    //        treeColumn: number
    //    });
    //}); 
    // check ký tự bản dữ liệu chi tiết báo cáo
    if ($(document).find('.rp_dldg').length > 100) {
        $('.rp_dldg').find(".click_dow").addClass('xh');
    }
    if ($(document).find('.rp_dldg').length < 100) {
        $('.rp_dldg').find(".click_dow").addClass('hidden');
    }
    // end
    if ($(document).find('input[class*="autocomplete"]').length != 0) {
        $(document).find('input[class*="autocomplete"]').each(function () {
            jQuery(this).attr("autocomplete", "new-password");
        });
    }
    //jQuery(document).on('change', '.select_change', function (e) {

    //    var select = jQuery(this);
    //    var id = select.val();
    //    var url = select.attr('data-url');
    //    var target = select.attr('data-target');
    //    if (select.hasClass("bootstrap-select")) {
    //        return false;
    //    }
    //    jQuery.ajax({
    //        type: "POST",
    //        contentType: "application/json; charset=utf-8",
    //        async: true,
    //        url: url,
    //        data: JSON.stringify({
    //            'id': id,
    //        }),
    //        beforeSend: function () {
    //            jQuery(target).addClass("loading").html("")
    //        },
    //        complete: function () {
    //            jQuery(target).removeClass("loading");
    //        },
    //        error: function () {
    //            jQuery(target).removeClass("loading");
    //        },
    //        dataType: "json",
    //        success: function (data) {
    //            Utils.sectionBuilder(data);
    //            if (data.hasOwnProperty("isCust")) {
    //                jQuery(target).html(data.htCust);
    //            }
    //            $(target).find(".selectpicker").selectpicker({
    //                showTick: true,
    //            });
    //        },
    //        error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        }
    //    });
    //});
    if ($("[data-fancybox]").length != 0) {
        $("[data-fancybox]").fancybox({
            margin: [44, 0, 22, 0],
            loop: true,
            buttons: [
                "zoom",
                //"share",
                //"slideShow",
                "fullScreen",
                "download",
                //"thumbs",
                "close"
            ],
        });
    }
    $(".jobFile_Fancybox").click(function () {
        $(this).parents(".jobFile_Attach").find(".jobFile_Name").click();
    });
    $(document).find('.dataTables_wrapper .table:not(.useTreegrid)').each(function () {
        if (!$(this).hasClass("stacktable_inited") && !$(this).hasClass("not_js_responsive")) {
            $(this).addClass("stacktable_inited");
            $(this).stacktable();
        }
    });
    ScanFile_Page();
    ScanFile_Atc();
    ScanFile_FixWH();
    ScanFile_Rorate();
    $('#page_zoom_select').on('change', function () {
        szoom_stt = $('#page_zoom_select :selected').val();
        ScanFile_FixWH();
        if (rorated) {
            jQuery(".other_tools .rorate_left").click();

        }
    });
    $('.page_zoomer .minus_zoom').on('click', function () {
        var tem_val = szoom_stt;
        if (tem_val > 1) {
            tem_val = parseInt(tem_val) - 1;
            szoom_stt = tem_val;
        }
        $('#page_zoom_select').val(szoom_stt);
        ScanFile_FixWH();
        if (rorated) {
            jQuery(".other_tools .rorate_left").click();

        }
    });
    $('.page_zoomer .plus_zoom').on('click', function () {
        var tem_val = szoom_stt;
        if (tem_val < 9) {
            tem_val = parseInt(tem_val) + 1;
            szoom_stt = tem_val;
        }
        $('#page_zoom_select').val(szoom_stt);
        ScanFile_FixWH();
        if (rorated) {
            jQuery(".other_tools .rorate_left").click();

        }
    });



    Cust.newsfeedimg();
    Cust.prev_next_group_button();
    Cust.Scroll_table();
    Cust.Scroll_tab_group();
    Cust.Table_sort();

    Cust.ImgBg_Scrollable_scan();
    Cust.ImgBg_Scrollable();
    jQuery(document).find(".ImgBg_Scrollable").hover(
        function () {
            if ($("body").height() > $(window).height()) {
                $("html").css("overflow", "hidden");
                $("html").css("padding-right", 17); // Default scrollbar width: 17px
            }
        }, function () {
            if (!$(this).hasClass("over")) {
                if (!jQuery(document).find(".ImgBg_Scrollable_popup").hasClass("active")) {
                    $("html").css("overflow", "auto");
                    $("html").css("padding-right", 0);
                }
            } else {
                $("html").css("overflow", "auto");
                $("html").css("padding-right", 0);
            }

        }
    );
    Cust.dataTables_filter_col();
    Cust.ImgBg_Scrollable_action();
    Cust.hover_docTable_action();
    Cust.AddNewTableCell();
    Cust.AddCell_Colyda();
    // =========== fit_thumbnail img height ==========
    jQuery(".fit_thumbnail img").each(function () {
        var thum_div_height = jQuery(this).parents(".fit_thumbnail").innerHeight();
        jQuery(this).css("height", thum_div_height);
    });
    jQuery(".fit_thumbnail iframe").each(function () {
        var thum_div_height = jQuery(this).parents(".fit_thumbnail").innerHeight();
        jQuery(this).css("height", thum_div_height);
        // console.log(thum_div_height);
    });

    $('.toggle_notifications').on('click', function () {
        if (!$(this).hasClass("inited")) {
            $(this).addClass("inited");
            var Ntf_less_count = 0;
            jQuery(document).find("#NtfContainer").find(".user_item").each(function () {
                Ntf_less_count = Ntf_less_count + 1;
                var obj = $(this);
                obj.find(".user_item_info > em").attr("id", "Ntf_less_" + Ntf_less_count);
                var elm = document.getElementById("Ntf_less_" + Ntf_less_count);
                if (elm.offsetHeight < elm.scrollHeight) {
                    obj.find(".user_item_info > em").addClass("active");
                    obj.find(".user_item_info > em").append('<a class="icon_show_full_content" href="#" alt="Xem đầy đủ nội dung" title="Xem đầy đủ nội dung"><i class="fa fa-plus-square" aria-hidden="true"></i></a>');
                }
            });
        }
    });
    jQuery(document).on('click', '#NtfContainer .icon_show_full_content', function (e) {
        e.preventDefault();
        $(this).parent("em").toggleClass("open");
    });
    //Header right dropdown menu
    $('.header_mainMenu').on('show.bs.dropdown', function () {
        var length = $(this).find(".dropdown-notifications>li").length;
        if (!$(this).hasClass("inited") && length > 5) {
            $(this).addClass("inited");
            $(this).addClass("is_full");
            $(this).parents(".account-area").addClass("is_full");

        }
    });
    //Header left menu when sidebar is empty
    if (!$(".page-sidebar").size() == 0) {
        $("#sidebar-collapse").addClass("is_show");
    }
    jQuery(document).find("table.destroyGrid").treegrid().destroy();
});
//--WINDOW LOADED FUNCTION END    
//--WINDOW RESIZE FUNCTION BEGIN
$(window).resize(function () {
    Cust.prev_next_group_button();
    Cust.fileViewer_height_fn();
    Cust.Scroll_tab_group();
    // =========== fit_thumbnail img height ==========
    jQuery(".fit_thumbnail img").each(function () {
        var thum_div_height = jQuery(this).parents(".fit_thumbnail").innerHeight();
        jQuery(this).css("height", thum_div_height);
    });
    jQuery(".fit_thumbnail iframe").each(function () {
        var thum_div_height = jQuery(this).parents(".fit_thumbnail").innerHeight();
        jQuery(this).css("height", thum_div_height);
        // console.log(thum_div_height);
    });

});
//--WINDOW RESIZE FUNCTION END



