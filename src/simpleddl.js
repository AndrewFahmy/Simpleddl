/*
    Created by:     Andrew M Fahmy 
    Email:          andrew_fahmy@outlook.com
    Version:        1.0
*/

if (typeof (jQuery) == 'undefined')
    throw "Please add JQuery library to your application";


(function () {
    $.fn.Simpleddl = function (options) {
        let defaultOptions = {
            multiple: false,
            emptyResultText: "There are no items to select from",
            defaultOptionText: "--Please Select--",
            defaultOptionValue: "",
            search: true,
            rightToLeft: false
        }

        let settings = $.extend({}, defaultOptions, options);

        this.each(function () {
            let self = this;
            let listData = [];
            let selectedText = settings.defaultOptionText;
            let selectedValue = settings.defaultOptionValue;

            $(self).find("option").each(function () {
                let currentItem = this;
                let itemText = $(currentItem).text();
                let itemValue = $(currentItem).val();

                if ($(currentItem).attr("data-ddl-selected") !== undefined) {
                    selectedText = itemText;
                    selectedValue = itemValue === undefined ? "" : itemValue;
                }

                listData[itemText] = itemValue === undefined ? "" : itemValue;
            });

            $(self).hide(0);

            $(self).wrap(`<div class="ddl-wrapper${settings.rightToLeft ? " ddl-rtl" : ""}"></div>`);

            let wrapper = $(self).parent(".ddl-wrapper");

            wrapper.append(`<div class="ddl-main" title="${selectedText}">
                <span class="ddl-selected-text" data-selected-value="${selectedValue}">${selectedText}</span>
                <span class="ddl-arrow${settings.rightToLeft ? " ddl-arrow-rtl" : ""}"><b/></span>
            </span></div>
            <div class="ddl-menu">
                ${settings.search ? "<input type='text' />" : ""}
                <div class="ddl-items-container${!settings.search ? " ddl-no-search" : ""}">
                    ${concatListData(listData, selectedText, settings)}
                </div>
            </div>`);

            $(".ddl-main").click(function () {
                let wrapperDiv = $(this).parent(".ddl-wrapper");
                let selectCtl = wrapperDiv.find("select");

                if (wrapperDiv.hasClass("ddl-open"))
                    selectCtl.trigger("ddl:close");
                else {
                    selectCtl.trigger("ddl:ddl-open");

                    if (listData.length <= 0)
                        wrapperDiv.find("input").hide(0);
                    else
                        wrapperDiv.find("input").show(0);
                }

                wrapperDiv.toggleClass("ddl-open");
            });

            $(".ddl-menu-item").click(function (evt) {
                let selectedItem = $(this);

                if (selectedItem.hasClass("ddl-empty")) {
                    evt.stopPropagation();
                    return;
                }


                changeSelection(selectedItem, settings);
            });


            $(self).change(function () {
                let ddlValue = $(self).val();
                let menuItem = $(self).parent().find(`.ddl-menu-item[data-item-value="${ddlValue}"]`);
                changeSelection(menuItem, settings);
            });

            if (settings.search) {
                $(".ddl-menu input").keyup(function () {
                    let searchValue = String($(this).val());
                    let menuContainer = $(this).parent();

                    if (searchValue === undefined || searchValue.length <= 0) {
                        menuContainer.find(".ddl-menu-item").removeClass("ddl-hidden");
                    }

                    menuContainer.find(".ddl-menu-item").each(function (idx, elem) {
                        if (!$(elem).text().toLowerCase().includes(searchValue.toLowerCase())) {
                            $(elem).addClass("ddl-hidden");
                        }
                    });
                });
            }
            $(document).click(function (evt) {
                if ($(evt.target).hasClass("ddl-wrapper") ||
                    $(evt.target).closest(".ddl-wrapper").length) return;

                $(".ddl-wrapper").removeClass("ddl-open")
                    .find("select").trigger("ddl:close");
            });
        });


        function concatListData(data, selectedText, settings) {
            if (data.length <= 0)
                return `<div class="ddl-menu-item ddl-empty">${settings.emptyResultText}</div>`;


            let finalString = `<div class="ddl-menu-item ddl-default${settings.defaultOptionText === selectedText ? " active" : ""}" 
            data-item-value="${settings.defaultOptionValue}">${settings.defaultOptionText}</div>`;

            for (var k in data) {
                finalString += `<div class="ddl-menu-item${k === selectedText ? " active" : ""}" data-item-value="${data[k]}">
                ${settings.multiple ? `<input id="ddl_chk_${data[k]}" type="checkbox"/><label for="ddl_chk_${data[k]}">${k}</label>` :
                        `${k}`}
                </div>`;
            }

            return finalString;
        }


        function changeSelection(item, settings) {
            let wrapperContainer = item.parents(".ddl-wrapper");
            let itemText = item.text();
            let itemValue = item.data("item-value");
            let selectCtl = wrapperContainer.find("select");
            let selectedValues = [];
            let selectedItemsText = [];

            wrapperContainer.find(".ddl-menu-item.ddl-default").removeClass("active");

            if (item.hasClass("ddl-default")) {
                wrapperContainer.find(".ddl-menu-item").removeClass("active")
                    .find("input").prop("checked", false);

                selectCtl.val(itemValue);
                item.addClass("active");

                wrapperContainer.find(".ddl-main").attr("title", itemValue);

                wrapperContainer.find(".ddl-selected-text")
                    .attr("data-selected-value", itemValue)
                    .text(itemText);

                $(self).trigger("ddl:select");

                return;
            }
            if (!settings.multiple) {
                wrapperContainer.removeClass("ddl-open");

                wrapperContainer.find(".ddl-menu-item").removeClass("active");
                item.addClass("active");

                selectCtl.val(itemValue);
            }
            else {
                $(item).toggleClass("active");
                $(item).find("input").prop("checked", !$(item).find("input").prop("checked"));

                wrapperContainer.find(".ddl-menu-item.active").each(function (indx, elem) {
                    selectedValues.push(String($(elem).data("item-value")));
                    selectedItemsText.push(String($(elem).text()));
                });

                if (selectedValues.length <= 0)
                    wrapperContainer.find(".ddl-default").addClass("active");

                selectCtl.val(selectedValues);
            }

            wrapperContainer.find(".ddl-main").attr("title", settings.multiple ? selectedValues : itemValue);

            wrapperContainer.find(".ddl-selected-text")
                .attr("data-selected-value", settings.multiple ? selectedValues.length <= 0 ? settings.defaultOptionValue : selectedValues : itemValue)
                .text(settings.multiple ? selectedItemsText.length <= 0 ? settings.defaultOptionText : selectedItemsText : itemText);

            $(self).trigger("ddl:select");
        }

        return {}
    }
})();
