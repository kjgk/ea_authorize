Ext.define('Ext.ux.DatePickerPlus', {
    extend:'Ext.DatePicker',
    alias: 'widget.datePickerPlus',
    noOfMonth:1,
    noOfMonthPerRow:3,
    fillupRows:true,
    eventDates:function (year) {
        return [];
    },

    styleDisabledDates:false,
    eventDatesSelectable:true,

    defaultEventDatesText:'',
    defaultEventDatesCls:'x-datepickerplus-eventdates',

    /**
     * @cfg {Boolean} eventDatesRE
     * To selected specific Days over a regular expression
     */
    eventDatesRE:false,

    /**
     * @cfg {String} eventDatesRECls
     * Specifies what CSS Class will be applied to the days found by "eventDatesRE"
     */
    eventDatesRECls:'',

    /**
     * @cfg {String} eventDatesRECls
     * Specifies what Quicktip will be displayed to the days found by "eventDatesRE"
     */
    eventDatesREText:'',

    /**
     * @cfg {String} selectWeekText
     * Text to display when hovering over the weekNumber and multiSelection is enabled
     */
    selectWeekText:"Click to select all days of this week",
    /**
     * @cfg {String} selectMonthText
     * Text to display when hovering over the MonthNumber and multiSelection is enabled
     * Whole Month selection is disabled when displaying only 1 Month (think twice..)
     */
    selectMonthText:"Click to select all weeks of this month",

    /**
     * @cfg {String} multiSelection
     * whether multiselection of dates is allowed. selection of weeks depends on displaying of weeknumbers
     */
    multiSelection:false,
    /**
     * @cfg {String} multiSelectByCTRL
     * whether multiselection is made by pressing CTRL (default behaviour, a single click without CTRL will set the selection list to the last selected day/week) or without (ever click a day is added/removed)
     */

    multiSelectByCTRL:true,

    /**
     * @cfg {Array of Dateobjects} selectedDates
     * List of Dates which have been selected when multiselection is set to true (this.value only sets the startmonth then)
     */
    selectedDates:[],


    /**
     * @cfg {String/Bool} prevNextDaysView
     * "mark" selected days will be marke in prev/next months also
     * "nomark" will not be marked and are not selectable
     * false: will hide them, thus are not selectable too
     */
    prevNextDaysView:"mark",

    /**
     * @cfg {Array of Dateobjects} preSelectedDates
     * contains the same at selection runtime (until "OK" is pressed)
     */
    preSelectedDates:[],

    /**
     * @cfg {Object} lastSelectedDate
     * contains the last selected Date or false right after initializing the object..
     */
    lastSelectedDate:false,

    /**
     * @cfg {Array} markNationalHolidays
     * trigger to add existing nationalHolidays to the eventdates list (nationalholidays can be changed in locale files, so these are independant from custom event Dates
     */
    markNationalHolidays:true,

    /**
     * @cfg {String} nationalHolidaysCls
     * CSS Class displayed to national Holidays if markNationalHolidays is set to true
     */
    nationalHolidaysCls:'x-datepickerplus-nationalholidays',

    /**
     * @cfg {Function} nationalHolidays
     * returns an Array-List of national Holiday Dates which could by marked with separate given CSS. Will be shown if markNationalHolidays is set to true
     * Change this in your local file to override it with you country's own national Holiday Dates
     *
     * if markNationalHolidays is set to true, a new instance of this array (and thus recalculation of holidays) will be generated at month update, if year has been changed from last drawn month.
     *
     */


    /**
     * @cfg {Boolean} markWeekends
     * whether weekends should be displayed differently
     */
    markWeekends:true,
    /**
     * @cfg {String} weekendCls
     * CSS class to use for styling Weekends
     */
    weekendCls:'x-datepickerplus-weekends',
    /**
     * @cfg {String} weekendText
     * Quicktip for Weekends
     */
    weekendText:'',
    /**
     * @cfg {Array} weekendDays
     * Array of Days (according to Days from dateobject thus Sunday=0,Monday=1,...Saturday=6)
     * Additionally to weekends, you could use this to display e.g. every Tuesday and Thursday with a separate CSS class
     */
    weekendDays:[6, 0],

    /**
     * @cfg {Boolean} useQuickTips
     * Wheter TIps should be displayed as Ext.quicktips or browsercontrolled title-attributes
     */
    useQuickTips:true,

    /**
     * @cfg {Number} pageKeyWarp
     * Amount of Months the picker will move forward/backward when pressing the pageUp/pageDown Keys
     */
    pageKeyWarp:1,

    /**
     * @cfg {Number} maxSelectionDays
     * Amount of Days that are selectable, set to false for unlimited selection
     */
    maxSelectionDays:false,

    maxSelectionDaysTitle:'Datepicker',
    maxSelectionDaysText:'You can only select a maximum amount of %0 days',
    undoText:"Undo",


    /**
     * @cfg {Boolean} stayInAllowedRange
     * used then mindate/maxdate is set to prevent changing to a month that does not contain allowed dates
     */
    stayInAllowedRange:true,

    /**
     * @cfg {Boolean} summarizeHeader
     * displays the from/to daterange on top of the datepicker
     */
    summarizeHeader:false,

    /**
     * @cfg {Boolean} resizable
     * Whether the calendar can be extended with more/less months by simply resizing it like window
     */
    resizable:false,

    /**
     * @cfg {Boolean} renderOkUndoButtons
     * If set to true, the OK- and Undo-Buttons will not be rendered on Multiselection Calendars
     */
    renderOkUndoButtons:true,

    /**
     * @cfg {Boolean} renderTodayButton
     * Whether the Today Button should be rendered
     */
    renderTodayButton:true,
    /**
     * @cfg {Boolean} disablePartialUnselect
     * When multiselecting whole months or weeks, already selected days within this week/month will _not_ get unselected anymore. Set this to false, if you want them to get unselected.
     * Note: When the _whole set_ of the month/week are already selected, they get _all_ unselected anyway.
     */
    disablePartialUnselect:true,

    allowedDates:false,
    allowedDatesText:'',

    strictRangeSelect:false,


    displayMask:3,

    displayMaskText:'Please wait...',

    renderPrevNextButtons:true,
    renderPrevNextYearButtons:false,
    disableMonthPicker:false,

    nextYearText:"Next Year (Control+Up)",
    prevYearText:"Previous Year (Control+Down)",

    showActiveDate:false,
    shiftSpaceSelect:true,
    disabledLetter:false,

    allowMouseWheel:true,

    focus:Ext.emptyFn,





// private
    onRender:function (container, position) {
        if (this.noOfMonthPerRow === 0) {
            this.noOfMonthPerRow = 1;
        }
        if (this.fillupRows && this.noOfMonthPerRow > 1 && this.noOfMonth % this.noOfMonthPerRow !== 0) {
            this.noOfMonth += (this.noOfMonthPerRow - (this.noOfMonth % this.noOfMonthPerRow));
        }
        var addIEClass = (Ext.isIE ? ' x-datepickerplus-ie' : '');
        var m = ['<table cellspacing="0"', (this.multiSelection ? ' class="x-date-multiselect' + addIEClass + '" ' : (addIEClass !== '' ? 'class="' + addIEClass + '" ' : '')), '>'];

        m.push("<tr>");

        var widfaker = (Ext.isIE ? '<img src="' + Ext.BLANK_IMAGE_URL + '" />' : '');
        var weekNumberQuickTip = (this.multiSelection ? (this.useQuickTips ? ' ext:qtip="' + this.selectWeekText + '" ' : ' title="' + this.selectWeekText + '" ') : '');
//as weekends (or defined weekly cycles) are displayed on every month at the same place, we can render the quicktips here to save time in update process
        var weekEndQuickTip = (this.markWeekends && this.weekendText !== '' ? (this.useQuickTips ? ' ext:qtip="' + this.weekendText + '" ' : ' title="' + this.weekendText + '" ') : '');


//calculate the HTML of one month at first to gain some speed when rendering many calendars
        var mpre = ['<thead><tr>'];


        var dn = this.dayNames, i = 0, d, k = 0, x = 0, xk = this.noOfMonth;
        for (; i < 7; ++i) {
            d = this.startDay + i;
            if (d > 6) {
                d = d - 7;
            }
            mpre.push('<th><span>', dn[d].substr(0, 1), '</span></th>');
        }
        mpre.push('</tr></thead><tbody><tr>');



        for (; k < 42; ++k) {
            if (k % 7 === 0 && k > 0) {

                    mpre.push('</tr><tr>');
            }
            mpre.push('<td class="x-date-date-cell"><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span ', (this.weekendDays.indexOf((k + this.startDay) % 7) != -1 ? weekEndQuickTip : ''), '></span></em></a></td>');
        }
        mpre.push('</tr></tbody></table></td></tr></table></td>');
        var prerenderedMonth = mpre.join("");

        if (this.summarizeHeader && this.noOfMonth > 1) {
            m.push('<td align="center" id="', this.id, '-summarize" colspan="', this.noOfMonthPerRow, '" class="x-date-middle x-date-pickerplus-middle"></td></tr>');
            m.push("<tr>");
        }

        for (; x < xk; ++x) {
            m.push('<td><table class="x-date-pickerplus', (x % this.noOfMonthPerRow === 0 ? '' : ' x-date-monthtable'), (!this.prevNextDaysView ? " x-date-pickerplus-prevnexthide" : ""), '" cellspacing="0"><tr>');
            if (x === 0) {
                m.push('<td class="x-date-left">');
                if (this.renderPrevNextButtons) {
                    m.push('<a class="npm" href="#" ', (this.useQuickTips ? ' ext:qtip="' + this.prevText + '" ' : ' title="' + this.prevText + '" '), '></a>');
                }
                if (this.renderPrevNextYearButtons) {
                    m.push('<a class="npy" href="#" ', (this.useQuickTips ? ' ext:qtip="' + this.prevYearText + '" ' : ' title="' + this.prevYearText + '" '), '></a>');
                }
                m.push('</td>');
            }
            else {
                m.push('<td class="x-date-dummy x-date-middle">', widfaker, '</td>');
            }
            m.push("<td class='x-date-middle x-date-pickerplus-middle", (x === 0 && !this.disableMonthPicker ? " x-date-firstMonth" : ""), "' align='center'>");
            if (x > 0 || this.disableMonthPicker) {
                m.push('<span id="', this.id, '-monthLabel', x, '"></span>');
            }
            m.push('</td>');
            if (x == this.noOfMonthPerRow - 1) {
                m.push('<td class="x-date-right">');
                if (this.renderPrevNextButtons) {
                    m.push('<a class="npm" href="#" ', (this.useQuickTips ? ' ext:qtip="' + this.nextText + '" ' : ' title="' + this.nextText + '" '), '></a>');
                }
                if (this.renderPrevNextYearButtons) {
                    m.push('<a class="npy" href="#" ', (this.useQuickTips ? ' ext:qtip="' + this.nextYearText + '" ' : ' title="' + this.nextYearText + '" '), '></a>');
                }
                m.push('</td>');
            }
            else {
                m.push('<td class="x-date-dummy x-date-middle">', widfaker, '</td>');
            }

            m.push('</tr><tr><td colspan="3"><table class="x-date-inner" id="', this.id, '-inner-date', x, '" cellspacing="0">');

            m.push(prerenderedMonth);

            if ((x + 1) % this.noOfMonthPerRow === 0) {
                m.push("</tr><tr>");
            }
        }
        m.push('</tr>');

        m.push('<tr><td', (this.noOfMonthPerRow > 1 ? ' colspan="' + this.noOfMonthPerRow + '"' : ''), ' class="x-date-bottom" align="center"><div><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="right" class="x-date-multiokbtn">', widfaker, '</td><td align="center" class="x-date-todaybtn">', widfaker, '</td><td align="left" class="x-date-multiundobtn">', widfaker, '</td></tr></table></div></td></tr>');

        m.push('</table><div class="x-date-mp"></div>');
        var el = document.createElement("div");
        el.className = "x-date-picker";
        el.innerHTML = m.join("");

        container.dom.insertBefore(el, position);

        this.el = Ext.get(el);
        this.eventEl = Ext.get(el.firstChild);

        if (this.renderPrevNextButtons) {
            this.leftClickRpt = new Ext.util.ClickRepeater(this.el.child("td.x-date-left a.npm"), {
                handler:this.showPrevMonth,
                scope:this,
                preventDefault:true,
                stopDefault:true
            });

            this.rightClickRpt = new Ext.util.ClickRepeater(this.el.child("td.x-date-right a.npm"), {
                handler:this.showNextMonth,
                scope:this,
                preventDefault:true,
                stopDefault:true
            });
        }

        if (this.renderPrevNextYearButtons) {
            this.leftYearClickRpt = new Ext.util.ClickRepeater(this.el.child("td.x-date-left a.npy"), {
                handler:this.showPrevYear,
                scope:this,
                preventDefault:true,
                stopDefault:true
            });

            this.rightYearClickRpt = new Ext.util.ClickRepeater(this.el.child("td.x-date-right a.npy"), {
                handler:this.showNextYear,
                scope:this,
                preventDefault:true,
                stopDefault:true
            });
        }
        if (this.allowMouseWheel) {
            this.eventEl.on("mousewheel", this.handleMouseWheel, this);
        }


        this.keyNav = new Ext.KeyNav(this.eventEl, {
            "left":function (e) {
                (!this.disabled && e.ctrlKey && (!this.disableMonthPicker || this.renderPrevNextButtons) ?
                    this.showPrevMonth() :
                    this.activeDateKeyNav(-1));
            },

            "right":function (e) {
                (!this.disabled && e.ctrlKey && (!this.disableMonthPicker || this.renderPrevNextButtons) ?
                    this.showNextMonth() :
                    this.activeDateKeyNav(1));
            },

            "up":function (e) {
                (!this.disabled && e.ctrlKey && (!this.disableMonthPicker || this.renderPrevNextYearButtons) ?
                    this.showNextYear() :
                    this.activeDateKeyNav(-7));
            },

            "down":function (e) {
                (!this.disabled && e.ctrlKey && (!this.disableMonthPicker || this.renderPrevNextYearButtons) ?
                    this.showPrevYear() :
                    this.activeDateKeyNav(7));
            },

            "pageUp":function (e) {
                if (!this.disabled) {
                    this.update(this.activeDate.add("mo", this.pageKeyWarp * (-1)));
                }
            },

            "pageDown":function (e) {
                if (!this.disabled) {
                    this.update(this.activeDate.add("mo", this.pageKeyWarp));
                }
            },

            "enter":function (e) {
                e.stopPropagation();
                if (!this.disabled) {
                    if (this.multiSelection) {
                        this.okClicked();
                    }
                    else {
                        this.finishDateSelection(this.activeDate);
                    }
                }
                return true;
            },
            scope:this
        });

        if (!this.disableSingleDateSelection) {
            this.eventEl.on("click", this.handleDateClick, this, {delegate:"a.x-date-date"});
        }
        if (this.multiSelection ) {
            this.eventEl.on("click", this.handleWeekClick, this, {delegate:"a.x-date-weeknumber"});
        }

        this.cellsArray = [];
        this.textNodesArray = [];


        var cells, textNodes, weekNumberCells, weekNumberTextEls, weekNumberHeaderCells, xx = 0, xxk = this.noOfMonth;
        for (; xx < xxk; ++xx) {
            cells = Ext.get(this.id + '-inner-date' + xx).select("tbody td.x-date-date-cell");
            textNodes = Ext.get(this.id + '-inner-date' + xx).query("tbody td.x-date-date-cell span");
            this.cellsArray[xx] = cells;
            this.textNodesArray[xx] = textNodes;

        }

        //set the original monthpicker again to the first month only to be able to quickly change the startmonth
        if (!this.disableMonthPicker) {
            this.monthPicker = this.el.down('div.x-date-mp');
            this.monthPicker.enableDisplayMode('block');

            this.mbtn = new Ext.Button({
                text:"&#160;",
                tooltip:this.monthYearText,
                renderTo:this.el.child("td.x-date-firstMonth", true)
            });

            this.mbtn.on('click', this.showMonthPickerPlus, this);
            this.mbtn.el.child('em').addClass('x-btn-arrow');
//			this.mbtn.el.child(this.mbtn.menuClassTarget).addClass("x-btn-with-menu");
        }


        if (Ext.isIE) {
            this.el.repaint();
        }
//preselect dates if given
        this.preSelectedDates = [];
        var sdc = 0, sdcl = this.selectedDates.length;
        for (; sdc < sdcl; ++sdc) {
            this.preSelectedDates.push(this.selectedDates[sdc].clearTime().getTime());
        }

        this.update(this.value);
    },








    // private
//forcerefresh option from ext 2.2 just included to be compatible	
    update:function (date, forceRefresh, masked) {
        if (typeof masked === "undefined") {
            masked = false;
        }
        if (typeof forceRefresh === "undefined") {
            forceRefresh = false;
        }

        if (forceRefresh) {
            var ad = this.activeDate;
            this.activeDate = null;
            date = ad;
        }

        var dMask = (this.displayMask && (isNaN(this.displayMask) || this.noOfMonth > this.displayMask) ? true : false);

        if (!masked && dMask) {
            this.el.mask(this.displayMaskText);
//set forcerefresh to false because new date (from old activedate) is already calculated
            this.update.defer(10, this, [date, false, true]);
            return false;
        }

        if (this.stayInAllowedRange && (this.minDate || this.maxDate)) {
            if (this.minDate && (this.minDate.getFullYear() > date.getFullYear() || (this.minDate.getMonth() > date.getMonth() && this.minDate.getFullYear() == date.getFullYear()))) {
                date = new Date(this.minDate.getTime());
            }
            else if (this.maxDate && (this.maxDate.getFullYear() < date.getFullYear() || (this.maxDate.getMonth() < date.getMonth() && this.maxDate.getFullYear() == date.getFullYear()))) {
                date = new Date(this.maxDate.getTime());
            }
        }

        var newStartMonth = date.getMonth();
        var oldStartMonth = (this.activeDate ? this.activeDate.getMonth() : newStartMonth);
        var newStartYear = date.getFullYear();
        var oldStartYear = (this.activeDate ? this.activeDate.getFullYear() : newStartYear);

        if (oldStartMonth != newStartMonth) {
            this.fireEvent("beforemonthchange", this, oldStartMonth, newStartMonth);
        }
        if (oldStartYear != newStartYear) {
            this.fireEvent("beforeyearchange", this, oldStartYear, newStartYear);
        }

        this.activeDate = date.clearTime();
        this.preSelectedCells = [];
        this.lastSelectedDateCell = '';
        this.activeDateCell = '';
        var lsd = (this.lastSelectedDate ? this.lastSelectedDate : 0);
        var today = new Date().clearTime().getTime();
        var min = this.minDate ? this.minDate.clearTime().getTime() : Number.NEGATIVE_INFINITY;
        var max = this.maxDate ? this.maxDate.clearTime().getTime() : Number.POSITIVE_INFINITY;
        var ddMatch = this.disabledDatesRE;
        var ddText = this.disabledDatesText;
        var ddays = this.disabledDays ? this.disabledDays.join("") : false;
        var ddaysText = this.disabledDaysText;

        var edMatch = this.eventDatesRE;
        var edCls = this.eventDatesRECls;
        var edText = this.eventDatesREText;

        var adText = this.allowedDatesText;

        var format = this.format;
        var adt = this.activeDate.getTime();

        this.todayMonthCell = false;
        this.todayDayCell = false;
        if (this.allowedDates) {
            this.allowedDatesT = [];
            var k = 0, kl = this.allowedDates.length;
            for (; k < kl; ++k) {
                this.allowedDatesT.push(this.allowedDates[k].clearTime().getTime());
            }
        }
        var setCellClass = function (cal, cell, textnode, d) {

            var foundday, eCell = Ext.get(cell), eTextNode = Ext.get(textnode), t = d.getTime(), tiptext = false, fvalue;
            cell.title = "";
            cell.firstChild.dateValue = t;

//check this per day, so holidays between years in the same week will be recognized (newyear in most cases),
//yearly eventdates are also possible then
            var dfY = d.getFullYear();
            if (cal.lastRenderedYear !== dfY) {
                cal.lastRenderedYear = dfY;
                if (cal.markNationalHolidays) {
//calculate new holiday list for current year
                    cal.nationalHolidaysNumbered = cal.convertCSSDatesToNumbers(cal.nationalHolidays(dfY));
                }
                cal.eventDatesNumbered = cal.convertCSSDatesToNumbers(cal.eventDates(dfY));
            }

            // disabling
            if (t < min) {
                cell.className = " x-date-disabled";
                tiptext = cal.minText;
            }
            if (t > max) {
                cell.className = " x-date-disabled";
                tiptext = cal.maxText;
            }
            if (ddays) {
                if (ddays.indexOf(d.getDay()) != -1) {
                    tiptext = ddaysText;
                    cell.className = " x-date-disabled";
                }
            }
            if (ddMatch && format) {
                fvalue = d.dateFormat(format);
                if (ddMatch.test(fvalue)) {
                    tiptext = ddText.replace("%0", fvalue);
                    cell.className = " x-date-disabled";
                }
            }

            if (cal.allowedDates && cal.allowedDatesT.indexOf(t) == -1) {
                cell.className = " x-date-disabled";
                tiptext = adText;
            }

            //mark weekends
            if (cal.markWeekends && cal.weekendDays.indexOf(d.getDay()) != -1 && !eCell.hasClass('x-date-disabled')) {
                eCell.addClass(cal.weekendCls);
            }


            if (!eCell.hasClass('x-date-disabled') || cal.styleDisabledDates) {
//mark dates with specific css (still selectable) (higher priority than weekends)
                if (cal.eventDatesNumbered[0].length > 0) {
                    foundday = cal.eventDatesNumbered[0].indexOf(t);
                    if (foundday != -1) {
                        if (cal.eventDatesNumbered[2][foundday] !== "") {
                            eCell.addClass(cal.eventDatesNumbered[2][foundday] + (cal.eventDatesSelectable ? "" : "-disabled"));
                            tiptext = (cal.eventDatesNumbered[1][foundday] !== "" ? cal.eventDatesNumbered[1][foundday] : false);
                        }
                    }
                }

//regular Expression custom CSS Dates
                if (edMatch && format) {
                    fvalue = d.dateFormat(format);
                    if (edMatch.test(fvalue)) {
                        tiptext = edText.replace("%0", fvalue);
                        cell.className = edCls;
                    }
                }
            }


            if (!eCell.hasClass('x-date-disabled')) {
//mark Holidays				
                if (cal.markNationalHolidays && cal.nationalHolidaysNumbered[0].length > 0) {
                    foundday = cal.nationalHolidaysNumbered[0].indexOf(t);
                    if (foundday != -1) {
                        eCell.addClass(cal.nationalHolidaysCls);
                        tiptext = (cal.nationalHolidaysNumbered[1][foundday] !== "" ? cal.nationalHolidaysNumbered[1][foundday] : false);
                    }
                }


//finally mark already selected items as selected
                if (cal.preSelectedDates.indexOf(t) != -1) {
                    eCell.addClass("x-date-selected");
                    cal.preSelectedCells.push(cell.firstChild.monthCell + "#" + cell.firstChild.dayCell);
                }

                if (t == lsd) {
                    cal.lastSelectedDateCell = cell.firstChild.monthCell + "#" + cell.firstChild.dayCell;
                }

            }
            else if (cal.disabledLetter) {
                textnode.innerHTML = cal.disabledLetter;
            }

//mark today afterwards to ensure today CSS has higher priority
            if (t == today) {
                eCell.addClass("x-date-today");
                tiptext = cal.todayText;
            }

//keynavigation?
            if (cal.showActiveDate && t == adt && cal.activeDateCell === '') {
                eCell.addClass("x-datepickerplus-activedate");
                cal.activeDateCell = cell.firstChild.monthCell + "#" + cell.firstChild.dayCell;
            }

//any quicktips necessary?
            if (tiptext) {
                if (cal.useQuickTips) {
                    Ext.QuickTips.register({
                        target:eTextNode,
                        text:tiptext
                    });
                }
                else {
                    cell.title = tiptext;
                }
            }


        };

        var cells, textEls, days, firstOfMonth, startingPos, pm, prevStart, d, sel, i, intDay, weekNumbers, weekNumbersTextEls, curWeekStart, weekNumbersHeader, monthLabel, main, w;
        var summarizeHTML = [], x = 0, xk = this.noOfMonth, e, el;
        for (; x < xk; ++x) {
            if (this.summarizeHeader && this.noOfMonth > 1 && (x === 0 || x == this.noOfMonth - 1)) {
                summarizeHTML.push(this.monthNames[date.getMonth()], " ", date.getFullYear());
                if (x === 0) {
                    summarizeHTML.push(" - ");
                }
            }
            cells = this.cellsArray[x].elements;
            textEls = this.textNodesArray[x];

            if ((this.markNationalHolidays || this.eventDates.length > 0) && this.useQuickTips) {
                for (e = 0, el = textEls.length; e < el; ++e) {
                    Ext.QuickTips.unregister(textEls[e]);
                }
            }

            days = date.getDaysInMonth();
            firstOfMonth = date.getFirstDateOfMonth();
            startingPos = firstOfMonth.getDay() - this.startDay;

            if (startingPos <= this.startDay) {
                startingPos += 7;
            }

            pm = date.add("mo", -1);
            prevStart = pm.getDaysInMonth() - startingPos;

            days += startingPos;

            d = new Date(pm.getFullYear(), pm.getMonth(), prevStart).clearTime();

            i = 0;


            for (; i < startingPos; ++i) {
                textEls[i].innerHTML = (++prevStart);
                cells[i].firstChild.monthCell = x;
                cells[i].firstChild.dayCell = i;

                d.setDate(d.getDate() + 1);
                cells[i].className = "x-date-prevday";
                setCellClass(this, cells[i], textEls[i], d);
            }

            for (; i < days; ++i) {
                intDay = i - startingPos + 1;
                textEls[i].innerHTML = (intDay);
                cells[i].firstChild.monthCell = x;
                cells[i].firstChild.dayCell = i;
                d.setDate(d.getDate() + 1);
                cells[i].className = "x-date-active";
                setCellClass(this, cells[i], textEls[i], d);
                if (d.getTime() == today) {
                    this.todayMonthCell = x;
                    this.todayDayCell = i;
                }
            }

            var extraDays = 0;
            for (; i < 42; ++i) {
                textEls[i].innerHTML = (++extraDays);
                cells[i].firstChild.monthCell = x;
                cells[i].firstChild.dayCell = i;
                d.setDate(d.getDate() + 1);
                cells[i].className = "x-date-nextday";
                setCellClass(this, cells[i], textEls[i], d);
            }

            if (x === 0 && !this.disableMonthPicker) {
                this.mbtn.setText(this.monthNames[date.getMonth()] + " " + date.getFullYear());
            }
            else {
                monthLabel = Ext.get(this.id + '-monthLabel' + x);
                monthLabel.update(this.monthNames[date.getMonth()] + " " + date.getFullYear());
            }
            date = date.add('mo', 1);


            if (!this.internalRender) {
                main = this.el.dom.firstChild;
                w = main.offsetWidth;
                this.el.setWidth(w + this.el.getBorderWidth("lr"));
                Ext.fly(main).setWidth(w);
                this.internalRender = true;
                // opera does not respect the auto grow header center column
                // then, after it gets a width opera refuses to recalculate
                // without a second pass
//Not needed anymore (tested with opera 9)
                /*
                 if(Ext.isOpera && !this.secondPass){
                 main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + "px";
                 this.secondPass = true;
                 this.update.defer(10, this, [date]);
                 }
                 */
            }
        }
        if (this.summarizeHeader && this.noOfMonth > 1) {
            var topHeader = Ext.get(this.id + '-summarize');
            topHeader.update(summarizeHTML.join(""));
        }
        this.el.unmask();
        if (oldStartMonth != newStartMonth) {
            this.fireEvent("aftermonthchange", this, oldStartMonth, newStartMonth);
        }
        if (oldStartYear != newStartYear) {
            this.fireEvent("afteryearchange", this, oldStartYear, newStartYear);
        }

    },




    markDateAsSelected:function (t, fakeCTRL, monthcell, daycell, enableUnselect) {
        var currentGetCell = Ext.get(this.cellsArray[monthcell].elements[daycell]);

        if ((currentGetCell.hasClass("x-date-prevday") || currentGetCell.hasClass("x-date-nextday") ) && this.prevNextDaysView !== "mark") {
            return false;
        }

        if (this.multiSelection && (Ext.EventObject.ctrlKey || fakeCTRL)) {
            var beforeDate = new Date(t).add(Date.DAY, -1).clearTime().getTime();
            var afterDate = new Date(t).add(Date.DAY, 1).clearTime().getTime();

            if (this.preSelectedDates.indexOf(t) == -1) {
                if (this.maxSelectionDays === this.preSelectedDates.length) {
                    if (!this.maxNotified) {
                        if (this.fireEvent("beforemaxdays", this) !== false) {
                            Ext.Msg.alert(this.maxSelectionDaysTitle, this.maxSelectionDaysText.replace(/%0/, this.maxSelectionDays));
                        }
                        this.maxNotified = true;
                    }
                    return false;
                }
                if (currentGetCell.hasClass("x-date-disabled")) {
                    return false;
                }

                if (this.strictRangeSelect && this.preSelectedDates.indexOf(afterDate) == -1 && this.preSelectedDates.indexOf(beforeDate) == -1 && this.preSelectedDates.length > 0) {
                    return false;
                }

                this.preSelectedDates.push(t);
                this.markSingleDays(monthcell, daycell, false);
                this.markGhostDatesAlso(monthcell, daycell, false);
                this.lastStateWasSelected = true;
            }
            else {
                if (enableUnselect && (!this.strictRangeSelect ||
                    (this.strictRangeSelect &&
                        (
                            (this.preSelectedDates.indexOf(afterDate) == -1 && this.preSelectedDates.indexOf(beforeDate) != -1 ) ||
                                (this.preSelectedDates.indexOf(afterDate) != -1 && this.preSelectedDates.indexOf(beforeDate) == -1 )
                            )
                        )
                    )
                    ) {
                    this.preSelectedDates.remove(t);
                    this.markSingleDays(monthcell, daycell, true);
                    this.markGhostDatesAlso(monthcell, daycell, true);
                    this.lastStateWasSelected = false;
                }
            }
        }
        else {
//calling update in any case would get too slow on huge multiselect calendars, so set the class for the selected cells manually	 (MUCH faster if not calling update() every time!)
            this.removeAllPreselectedClasses();
            this.preSelectedDates = [t];
            this.preSelectedCells = [];
            this.markSingleDays(monthcell, daycell, false);
            this.markGhostDatesAlso(monthcell, daycell, false);
            this.lastStateWasSelected = true;
        }
        this.lastSelectedDate = t;
        this.lastSelectedDateCell = monthcell + "#" + daycell;
        if (this.multiSelection && !this.renderOkUndoButtons) {
            this.copyPreToSelectedDays();
        }
        return this.lastStateWasSelected;
    },

    markSingleDays:function (monthcell, daycell, remove) {
        if (!remove) {
            Ext.get(this.cellsArray[monthcell].elements[daycell]).addClass("x-date-selected");
            this.preSelectedCells.push((monthcell) + "#" + (daycell));
        }
        else {
            Ext.get(this.cellsArray[monthcell].elements[daycell]).removeClass("x-date-selected");
            this.preSelectedCells.remove((monthcell) + "#" + (daycell));
        }
    },

    markGhostDatesAlso:function (monthcell, daycell, remove) {
        if (this.prevNextDaysView == "mark") {
            var currentGetCell = Ext.get(this.cellsArray[monthcell].elements[daycell]), dayCellDiff;
            if (currentGetCell.hasClass("x-date-prevday") && monthcell > 0) {
                dayCellDiff = (5 - Math.floor(daycell / 7)) * 7;
                if (Ext.get(this.cellsArray[monthcell - 1].elements[daycell + dayCellDiff]).hasClass("x-date-nextday")) {
                    dayCellDiff -= 7;
                }
                this.markSingleDays(monthcell - 1, daycell + dayCellDiff, remove);
            }
            else if (currentGetCell.hasClass("x-date-nextday") && monthcell < this.cellsArray.length - 1) {
                dayCellDiff = 28;
                if (this.cellsArray[monthcell].elements[daycell].firstChild.firstChild.firstChild.innerHTML != this.cellsArray[monthcell + 1].elements[daycell - dayCellDiff].firstChild.firstChild.firstChild.innerHTML) {
                    dayCellDiff = 35;
                }
                this.markSingleDays(monthcell + 1, daycell - dayCellDiff, remove);
            }
            else if (currentGetCell.hasClass("x-date-active") && ((daycell < 14 && monthcell > 0) || (daycell > 27 && monthcell < this.cellsArray.length - 1))) {
                if (daycell < 14) {
                    dayCellDiff = 28;
                    if (!Ext.get(this.cellsArray[monthcell - 1].elements[daycell + dayCellDiff]).hasClass("x-date-nextday")) {
                        dayCellDiff = 35;
                    }
                    if (daycell + dayCellDiff < 42 && this.cellsArray[monthcell].elements[daycell].firstChild.firstChild.firstChild.innerHTML == this.cellsArray[monthcell - 1].elements[daycell + dayCellDiff].firstChild.firstChild.firstChild.innerHTML) {
                        this.markSingleDays(monthcell - 1, daycell + dayCellDiff, remove);
                    }
                }
                else {
                    dayCellDiff = 28;
                    if (!Ext.get(this.cellsArray[monthcell + 1].elements[daycell - dayCellDiff]).hasClass("x-date-prevday")) {
                        dayCellDiff = 35;
                    }
                    if (daycell - dayCellDiff >= 0 && this.cellsArray[monthcell].elements[daycell].firstChild.firstChild.firstChild.innerHTML == this.cellsArray[monthcell + 1].elements[daycell - dayCellDiff].firstChild.firstChild.firstChild.innerHTML) {
                        this.markSingleDays(monthcell + 1, daycell - dayCellDiff, remove);
                    }
                }
            }
        }
    },




    handleDateClick:function (e, t) {

        e.stopEvent();
        var tp = Ext.fly(t.parentNode);

        if (!this.disabled && t.dateValue && !tp.hasClass("x-date-disabled") && !tp.hasClass("x-datepickerplus-eventdates-disabled") && this.fireEvent("beforedateclick", this, t) !== false) {
            if (( !tp.hasClass("x-date-prevday") && !tp.hasClass("x-date-nextday") ) || this.prevNextDaysView == "mark") {
                var eO = Ext.EventObject;
                if ((!eO.ctrlKey && this.multiSelectByCTRL) || eO.shiftKey || !this.multiSelection) {
                    this.removeAllPreselectedClasses();
                }
                var ctrlfaker = (((!eO.ctrlKey && !this.multiSelectByCTRL) || eO.shiftKey) && this.multiSelection ? true : false);


                if (eO.shiftKey && this.multiSelection && this.lastSelectedDate) {
                    var startdate = this.lastSelectedDate;
                    var targetdate = t.dateValue;
                    var dayDiff = (startdate < targetdate ? 1 : -1);
                    var lsdCell = this.lastSelectedDateCell.split("#");
                    var tmpMonthCell = parseInt(lsdCell[0], 10);
                    var tmpDayCell = parseInt(lsdCell[1], 10);
                    var testCell, ghostCounter = 0, ghostplus = 0;

                    this.maxNotified = false;


                    //startdate lies in nonvisible month ?
                    var firstVisibleDate = this.activeDate.getFirstDateOfMonth().clearTime().getTime();
                    var lastVisibleDate = this.activeDate.add(Date.MONTH, this.noOfMonth - 1).getLastDateOfMonth().clearTime().getTime();

                    if (startdate < firstVisibleDate ||
                        startdate > lastVisibleDate) {

                        //prepare for disabledCheck
                        var min = this.minDate ? this.minDate.clearTime().getTime() : Number.NEGATIVE_INFINITY;
                        var max = this.maxDate ? this.maxDate.clearTime().getTime() : Number.POSITIVE_INFINITY;
                        var ddays = this.disabledDays ? this.disabledDays.join("") : "";
                        var ddMatch = this.disabledDatesRE;
                        var format = this.format;
                        var allowedDatesT = this.allowedDates ? this.allowedDatesT : false;
                        var d, ddMatchResult, fvalue;
                        //check, if the days would be disabled
                        while (startdate < firstVisibleDate || startdate > lastVisibleDate) {
                            d = new Date(startdate);

                            ddMatchResult = false;
                            if (ddMatch) {
                                fvalue = d.dateFormat(format);
                                ddMatchResult = ddMatch.test(fvalue);
                            }
                            //don't use >= and <= here for datecomparison, because the dates can differ in timezone
                            if (!(startdate < min) &&
                                !(startdate > max) &&
                                ddays.indexOf(d.getDay()) == -1 &&
                                !ddMatchResult &&
                                ( !allowedDatesT || allowedDatesT.indexOf(startdate) != -1 )
                                ) {
                                //is not disabled and can be processed

                                if (this.maxSelectionDays === this.preSelectedDates.length) {
                                    if (this.fireEvent("beforemaxdays", this) !== false) {
                                        Ext.Msg.alert(this.maxSelectionDaysTitle, this.maxSelectionDaysText.replace(/%0/, this.maxSelectionDays));
                                    }
                                    break;
                                }
                                this.preSelectedDates.push(startdate);

                            }
                            startdate = new Date(startdate).add(Date.DAY, dayDiff).clearTime().getTime();
                        }

                        tmpMonthCell = (dayDiff > 0 ? 0 : this.cellsArray.length - 1);
                        tmpDayCell = (dayDiff > 0 ? 0 : 41);

                        //mark left ghostdates aswell
                        testCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);
                        while (testCell.hasClass("x-date-prevday") || testCell.hasClass("x-date-nextday")) {
                            testCell.addClass("x-date-selected");
                            this.preSelectedCells.push((tmpMonthCell) + "#" + (tmpDayCell));
                            tmpDayCell += dayDiff;
                            testCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);
                        }
                    }

                    //mark range of visible dates
                    while ((targetdate - startdate) * dayDiff > 0 && tmpMonthCell >= 0 && tmpMonthCell < this.cellsArray.length) {
                        this.markDateAsSelected(startdate, ctrlfaker, tmpMonthCell, tmpDayCell, true);

                        //take care of summertime changing (would return different milliseconds)
                        startdate = new Date(startdate).add(Date.DAY, dayDiff).clearTime().getTime();

                        testCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);

                        if (testCell.hasClass("x-date-active")) {
                            ghostCounter = 0;
                        }
                        else {
                            ghostCounter++;
                        }
                        tmpDayCell += dayDiff;
                        if (tmpDayCell == 42) {
                            tmpMonthCell++;
                            tmpDayCell = (ghostCounter >= 7 ? 14 : 7);
                        }
                        else if (tmpDayCell < 0) {
                            tmpMonthCell--;
                            tmpDayCell = 34;

                            testCell = Ext.get(this.cellsArray[tmpMonthCell].elements[tmpDayCell]);
                            if (testCell.hasClass("x-date-nextday") || ghostCounter == 7) {
                                tmpDayCell = 27;
                            }
                        }
                    }

                }

                if (this.markDateAsSelected(t.dateValue, ctrlfaker, t.monthCell, t.dayCell, true)) {
                    this.finishDateSelection(new Date(t.dateValue));
                }
            }
        }
    },








    /* this is needed to get it displayed in a panel correctly, it is called several times...*/
    setSize:Ext.emptyFn

});
