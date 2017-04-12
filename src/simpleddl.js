/*
    Created by:     Andrew M Fahmy
    Email:              andrew_fahmy@outlook.com
    Version:            2.0.0
*/

(function ($) {

    var defaultOptions = {
        multiple: false,
        emptyResultText: "There are no items to select from",
        defaultOptionText: "--Please Select--",
        defaultOptionValue: "",
        search: true,
        rightToLeft: false
    }


    var publicMethods = {
        change: function (newValue) {
            $(this).val(newValue).change();
        }
    }

    function init(item, options) {
        let currentItem = $(item).hide(0);

        createTemplate(currentItem, options);

        InitializeEvents(currentItem, options);
    }

    function createTemplate(currentItem, options) {
        let wrapper = currentItem.wrap(`<div class="ddl-wrapper${options.rightToLeft ? " ddl-rtl" : ""}"></div>`).parent();

        var template = `
            <div class="ddl-main" title="${options.defaultOptionText}">
                <span class="ddl-selected-text" data-slected-value="${options.defaultOptionValue}">${options.defaultOptionText}</span>
                <span class="ddl-arrow"><b/></span>
            </div>
            <div class="ddl-menu${!options.search ? " ddl-no-search" : ""}">
                ${options.search ? "<input type='text' />" : ""}
                <div class="ddl-items-container">
                    ${createItemsTemplate(currentItem, options)}
                </div>
            </div>`;

        wrapper.append(template);
    }

    function createItemsTemplate(currentItem, options) {
        var returnString = ``;

        if (currentItem.find("option").length <= 0)
            return `<div class="ddl-menu-item ddl-empty">${options.emptyResultText}</div>`;

        returnString += `<div class="ddl-menu-item ddl-default ddl-active" data-item-value="${options.defaultOptionValue}">${options.defaultOptionText}</div>`;

        returnString += createGroupsHtml(currentItem, options);

        returnString += createItemsHtml(currentItem.find("> option"), options);

        return returnString;
    }

    function createGroupsHtml(currentItem, options) {
        var groupsHtml = ``;

        currentItem.find("optgroup").each(function (idx, elem) {
            let grpLabel = $(elem).attr("label");
            let itemsHtml = createItemsHtml($(elem).find("option"), options);

            groupsHtml += `<div class="ddl-group"><p class="">${grpLabel}</p>${itemsHtml}</div>`;
        });

        return groupsHtml;
    }

    function createItemsHtml(itemsList, options) {
        var itemsHtml = ``;
        itemsList.each(function (idx, elem) {
            let optionText = $(elem).text();
            let optionValue = $(elem).val();

            itemsHtml += `<div class="ddl-menu-item" data-item-value="${optionValue}">
                                            ${options.multiple ? `<input type="checkbox" /><label>${optionText}</label>` : `${optionText}`}
                                        </div>`;
        });

        return itemsHtml;
    }

    function InitializeEvents(selectItem, options) {
        var wrapper = selectItem.parent();

        wrapper.find(".ddl-main").click(function () {
            if (wrapper.hasClass("ddl-open"))
                selectItem.trigger("ddl:close");
            else
                selectItem.trigger("ddl:open");

            wrapper.toggleClass("ddl-open");
        });

        $(document).click(function (evt) {
            let target = $(evt.target);

            if (target.hasClass("ddl-wrapper") ||
                target.closest(".ddl-wrapper").length) return;

            $(".ddl-wrapper").removeClass("ddl-open");

            selectItem.trigger("ddl:close");
        });

        $(".ddl-menu-item").click(function (evt) {
            let selectedItem = $(this);

            if (selectedItem.hasClass("ddl-empty")) return;


            changeSelection(selectedItem, wrapper, options);
        });

        $(self).change(function () {
            let ddlValue = $(self).val();
            let menuItem = $(self).parent().find(`.ddl-menu-item[data-item-value="${ddlValue}"]`);
            changeSelection(menuItem, wrapper, options);
        });

        if (options.search)
            initializeSearch(wrapper);
    }

    function initializeSearch(wrapper) {
        wrapper.find("input[type='text']").keyup(function () {
            let searchVal = String($(this).val()).toLowerCase();
            let menuDiv = $(this).parent();

            if (!searchVal) {
                menuDiv.find(".ddl-menu-item").removeClass("ddl-hidden");
                return;
            }

            menuDiv.find(".ddl-menu-item").each(function (idx, elem) {
                if (!$(elem).text().toLowerCase().includes(searchVal))
                    $(elem).addClass("ddl-hidden");
                else
                    $(elem).removeClass("ddl-hidden");
            });
        });
    }

    function changeSelection(selectedItem, wrapper, options) {
        let itemText = selectedItem.text();
        let itemVal = selectedItem.data("item-value");
        let selectCtl = wrapper.find("select");
        let checkboxCtl = selectedItem.find("input[type='checkbox']");
        let ddlMain = wrapper.find(".ddl-main");
        let ddlText = wrapper.find(".ddl-selected-text");

        if (!options.multiple) {
            if (!selectedItem.hasClass("ddl-default"))
                wrapper.removeClass("ddl-open");

            wrapper.find(".ddl-menu-item").removeClass("ddl-active").find("input[type='checkbox']").prop("checked", false);
            selectedItem.toggleClass("ddl-active");
            selectCtl.val(itemVal);
            ddlMain.attr("title", itemText);
            ddlText.data("selected-value", itemVal).text(itemText);
        }
        else {
            selectedItem.toggleClass("ddl-active");

            if (!selectedItem.hasClass("ddl-default")) {
                checkboxCtl.prop("checked", !checkboxCtl.prop("checked"));
                wrapper.find(".ddl-default").removeClass("ddl-active");
            }

            var selectedValues = [];
            var selectedText = [];

            wrapper.find(".ddl-menu-item.ddl-active").each(function (idx, elem) {
                selectedValues.push($(elem).data("item-value"));
                selectedText.push(String($(elem).text()).trim());
            });

            if (selectedValues.length <= 0)
                wrapper.find(".ddl-default").addClass("ddl-active");

            selectCtl.val(selectedValues);
            ddlMain.attr("title", selectedText);
            ddlText.data("selected-value", selectedValues.length ? selectedValues : options.defaultOptionValue)
                .text(selectedText.length ? selectedText : options.defaultOptionText);
        }

        selectCtl.trigger("ddl:select");
    }

    $.fn.Simpleddl = function (methodOrOptions, parameter) {

        return this.each(function () {
            if (publicMethods[methodOrOptions]) {
                publicMethods[methodOrOptions].apply(this, [parameter]);
            }
            else {
                let settings = $.extend({}, defaultOptions, methodOrOptions);
                init(this, settings);
            }
        });
    }
})(jQuery);
