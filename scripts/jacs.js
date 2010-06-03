/* *****************************************************************************
     JavaScript Advanced Calendar Script (JACS) - Cross-Browser pop-up calendar.

     Copyright (C) 2007-2008  Anthony Garrett

     This library is free software; you can redistribute it and/or
     modify it under the terms of the GNU Lesser General Public
     License as published by the Free Software Foundation; either
     version 2.1 of the License, or (at your option) any later version.

     This library is distributed in the hope that it will be useful,
     but WITHOUT ANY WARRANTY; without even the implied warranty of
     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
     Lesser General Public License for more details.

     You should have received a copy of the GNU Lesser General Public
     License along with this library; if not, it is available at
     the GNU web site (http://www.gnu.org/) or by writing to the
     Free Software Foundation, Inc., 51 Franklin St, Fifth Floor,
     Boston, MA  02110-1301  USA

*///*****************************************************************************
/*
   Contact:   Sorry, I can't offer support for this but if you find a problem
              (or just want to tell me how useful you find it), please send
              me an email at jacsFeedback@tarrget.info (Note the two Rs in
              tarrget).  I will try to fix problems quickly but this is a
              spare time thing for me.

   Credits:   I wrote this based on my Simple Calendar Widget script which
              I wrote from scratch myself but I couldn't have done either
              without the superb "JavaScript The Definitive Guide" by David
              Flanagan (Pub. O'Reilly ISBN 0-596-00048-0) and Peter-Paul Koch's
              (PPK) brilliant Quirksmode site.

   Link back: Please give me credit and link back to my page if you can.  To
              ensure that search engines give my page a higher ranking you can
              add the following HTML to any indexed page on your web site:

              <A HREF="http://www.tarrget.info/calendar/jacs.htm">
                JavaScript Advanced Calendar Script (JACS) by Anthony Garrett
              </A>

              Your root directory of the web site should also contain an empty
              file called "jacsblank.html". For a full explanation see
              http://www.tarrget.info/calendar/IEnightmare.html.

   Features:  Easily customised (output date format, colours, language,
                                 year range and week start day)
              Accepts a date as input (see comments below for formats).
              Allows multiple calendars on a page and static calendar displays.

              Cross-browser code tested against;
                    Internet Explorer 6.0.28+    Mozilla  1.7.1
                    Opera             7.52+      Firefox  0.9.1+
                    Konqueror         4.0.1      Safari   3 (Beta for Windows)

   How to add the Calendar to your page:
              This script needs to be defined for your page so add the following
              line;
                    <script type='text/JavaScript' src='jacs.js'></script>

   How to use the Calendar once it is defined for your page:

        Dynamic calendar:

              Simply choose an event to trigger the calendar (like an onclick or an onmouseover)
              and an element to work on (for the calendar to take its initial date from and write
              its output date to) then write it like this;

                    onclick="JACS.show(document.getElementById('myElement'),event);"
                or
                    onfocus="JACS.show(this,event);"

              NOTE: If you wish to use the calendar with an Anchor tag, do not use the
                    href="javascript:JACS.show(...)" syntax.

                    Instead you should use the following;

                    <a href="#" onclick="JACS.show(<<element>>,event);return false;">
                        <<your text>>
                    </a>

              If you are using a text node then specify the text's parent node in the
              function call. The date should be the only text under that node;

                    <p onclick="JACS.show(this,event);"><<date>></p>

        Static calendar:

                    JACS.show(<<element>><<,optional calendar ID>><<,optional disabled days>>);

              A static calendar appears on screen when the page loads, cannot be dragged and
              remains on screen after it has been used to select a date. It returns the date
              into the value of a defined element (e.g. an INPUT element) but, of course,
              that can be hidden.

        Calendar with selected days:

              You can select days of the week by adding arguments to the
              call to JACS.show. These selected days can be the only ones
              enabled or the only ones disabled depending on the setting of
              the attribute valuesEnabled (see below). The values should be
              Sunday = 0 through to Saturday = 6. The parameters can be a
              series of single values or an array holding those values. A call
              to JACS.show with Friday and Monday selected could look something
              like this;

                        JACS.show(<<element>>,event,5,1);
              or this;
                        var myArray = [5,1];
                        JACS.show(<<element>>,event,myArray);

        Named calendar:

                    JACS.show(<<element>>,event<<,calendar ID>>);

              'jacs' is the default ID of the calendar but you can assign any ID
              you want.  You can call one name as many times as you like,
              but as it is one object, it can only appear on screen in one location
              at a time.  If you want more than that then you must give different IDs.

              [Note: in the above paragraph I use "name" and "id" interchangeably, not
                     in the sense of HTML tag attributes "name" and "id". ]

        No event? No problem!

              Normally the calendar will be triggered by an event but if you wish to
              control it in code and the event is not available to you, simply pass
              an element as the second parameter;

              E.G.  JACS.show(<<target element>>,<<source element>>);
                    as in: JACS.show(this,this);

        Calendar with post-processing:

              The following technique runs a function each time a dynamic calendar
              closes or a date is selected from a static calendar:

                    JACS.show(<<Dynamic or Static calendar argument list>>);
                    JACS.next(<<optional calendar ID,>><<function>><<,arguments>>);

              Where <<function>> is a function defined on the calling page
              and <<arguments>> is the list of arguments being passed to that
              function.

              The calendar ID defaults to 'jacs', if you are using a different
              calendar object (See calendar naming above), you must give its
              ID as the first argument.

              NOTES: These two calls are expected in this order (i.e. show before
                     next) because JACS.next expects the calendar object to exist.

                     If JACS.make has not been called for the object and JACS.show
                     is called after JACS.next then the calendar object may not
                     exist (if the object has not been created earlier in the
                     users path through the page) so a JavaScript error would
                     be generated.

              Every function that is triggered using JACS.next() acquires an
              attribute JACSid. This attribute holds the value of the
              calendar ID that JACS.next() has been called for. So, your
              function has access to all of the calendar instance's attributes.
              These include;
                dateReturned  Boolean TRUE if the calendar has been closed by
                              selection of a date, otherwise FALSE), and
                outputDate    The user-selected date in JavaScript date format.

                    E.G. document.getElementById(<<function>>.JACSid).dateReturned

        Disabling or enabling dates or date ranges;

              Setting enabled or disabled date ranges for a calendar object is
              achieved by setting the dates array attribute of the calendar object
              (see more information below).

              By default the calendar object is only created when it is first
              needed for display so you should make sure that it is explicitly
              created using;

                    JACS.make(<<calendar id>><<,dynamic (boolean, default TRUE)>>);

        Combining the techniques:

              A fully defined call to JACS.show, including all optional parameters
              should send parameters in the following order;

                            I/O      Trigger  Calendar  Selected
                            Element  Event    ID        days
              Dynamic         0        1        2         2/3
              Static          0                 1         1/2
              Type          Object   Object   String    Number(s)
              Required      Yes      Yes      No        No
              Default       None     None     'jacs'    None

              NOTE: The Trigger Event is ONLY relevant for dynamic calendars
                    and must be omitted for static calendars.

              Dynamic e.g.  JACS.show(document.getElementById('myElement1'),
                                      event,'jacs',0,1,2,3,4,5,6);

              Static  e.g.  JACS.show(document.getElementById('myElement2'),
                                           'myCal',0,6);

              A single calendar instance must not be called with both Dynamic
              and Static parameters (It is only one structure within the page
              so it cannot remain visible in one location while it is displayed
              in another).

----------------------------------------------------------------------------------
   See http://www.tarrget.info/calendar/scw.htm for a full version history
   up to version 3.60 and
       http://www.tarrget.info/calendar/jacs.htm for versions to date.

   Version   Date        By               Description
   =======   ====        ===============  ===========
     1.30    2008-05-05  Anthony Garrett  Added optional auto-positioning of the
                                           calendar when its normal position would
                                           go off the visible area.
                                           Thanks to Chandramouli Iyer for this
                                           suggestion.
                                          Added an optional "Clear" button for
                                           use when handling a read-only text
                                           input element. Thanks to Sanjay Gangwal
                                           for his suggestion.

     1.21    2008-04-11  Anthony Garrett  Corrected the input month name parsing
                                            so that it set the calendar to the
                                            right month when long month names used.
                                            Thanks to Ben Diamand for this bug report.

     1.20    2008-04-10  Anthony Garrett  Added attribute to allow calendar to
                                           appear in "display" mode only (i.e.
                                           dates not selectable.

                                          Added the option to highlight specified
                                           dates and date ranges.

                                          Thanks to Ben Diamand for both
                                           suggestions.

     1.11    2008-02-24  Anthony Garrett  Trapped calls to script with only a
                                           NAME attribute is set for the target
                                           element when the script really requires
                                           an ID attribute.  This is the most
                                           frequent mistake reported to me.

     1.10    2008-01-14  Anthony Garrett  Restored the ability to use an element
                                           as the second parameter when opening a
                                           dynamic calendar while retaining the
                                           option of passing an event. Thanks to
                                           Thierry Blind and Sergey Snovsky for
                                           the feedback.

                                          Added a calendar attribute that holds the
                                           returned date. This simplifies use of
                                           the calendar within JavaScript. Thanks
                                           to Juha Valvanne for the query that
                                           led to this enhancement.

                                          Fixed bug in the handling of focus events
                                           that caused calendar to fail to appear.
                                           Thanks to Steve Davis for reporting the
                                           problem.

     1.00    2007-09-21  Anthony Garrett  Fixed JACS.next parameters - thanks to
                                           Rogier Lankhorst for the feedback, also
                                           refined JACS.next processing.

                                          Updated the event trapping to make it
                                           less intrusive on the page body.  NOTE:
                                           This requires that a dynamic calendar's
                                           second parameter should be the calling
                                           event (not the calling object as in
                                           previous versions).  Thanks to Steve
                                           Davis for the bug report that led to
                                           this change.

                                          Replaced the date input sequence user
                                           configuration setting with parsing the
                                           sequence from the full format. New users
                                           are often confused by the sequence and
                                           in practice (to allow the calendar's date
                                           output to be used for input) the sequence
                                           must always match the full format element
                                           order.

                                          Fixed a bug that caused undelimited
                                           dates to be handled incorrectly. They
                                           are now parsed against the full date
                                           output format then checked for validity.
                                           Thanks to Dan Wood for raising this bug.

                                          Fixed Standards-based (non IE)
                                           calendar dragging which wasn't releasing
                                           the calendar onmouseup.

                                          Fixed problem where selected weekdays
                                           carried over from one call to another
                                           on the same calendar object.

                                          Corrected the Month and Year select box
                                           displays in Opera. They were not changing
                                           when the month was shifted using the
                                           calendar's left and right arrows.

                                          Extended IFRAME backing to all calendar objects
                                           in order to improve calendar display over
                                           some embedded applets and objects.  Thanks to
                                           Stanko Kupcevic for his feedback on this.
                                           NOTE: It is not possible to protect any
                                           JavaScript object displayed over an
                                           embedded DYNAMIC (and, therefore refreshed)
                                           object because browsers usually do not
                                           directly control the screen handling within
                                           the object.  The best advice therefore remains
                                           to design pages in such a way that the calendar
                                           does not overlap embedded objects.

                                         Added curly braces and semi-colons
                                           for best practice and for robustness
                                           when code is compacted/obfuscated.

     0.90    2007-04-04  Anthony Garrett  Major re-write of the script to allow
                                           multiple calendar objects visible on
                                           on the page, and to allow static
                                           calendars. Dropped the legacy
                                           "showCal" entry-point function.

                                          Added ability to select calendar
                                           position relative to return value
                                           element.  Thanks to Justin Lawrence
                                           for that request.

*///*****************************************************************************

// ********************************************************
// Start of Javascript Advanced Calendar Script (JACS) Code
// ********************************************************

/* *****************************************************************************

    EXPOSED CALENDAR OBJECTS (FUNCTIONS):

        JACS.make   Creates calendar objects;
                        is called as part of JACS.show (if needed) but can also
                        be called to create a calendar instance at any time.

        JACS.show   Entry point for display of a calendar: Called in main page.

        JACS.next   Sets up a function that runs when a date is selected on a
                    static calendar or a dynamic calendar moves or closes.

        JACS.cals   returns an array of all the calendar IDs that have been
                    used on the page.

                    NOTES: 1 "used" here means: Invoked with JACS.make or JACS.show.
                             Calls without a defined calendar ID invoke the default
                             ID, 'jacs'.

                           2 Each calendar structure is added to the page when it
                             is first used. So this array may not hold all dynamic
                             calendar IDs that are defined on the page.  If you
                             want to be sure that the array does show all of them,
                             explicitly invoke  JACs.make(<<ID>>); for each ID on
                             page load.

*///*****************************************************************************

//  Namespace JACS
//  --------------
//  This namespace encapsulates all the calendar script code eliminating
//  naming conflicts between the JavaScript in this script and your calling
//  page(s) [as long as you don't use JACS as a variable of course].  It is
//  still possible for CSS inheritance to cause problems but that is unavoidable.

var JACS = new function()
    {// This date is used throughout to determine today's date.
     var dateNow = new Date(Date.parse(new Date().toDateString()));

     // This array keeps track of the defined calendars for the page.
     var cals = new Array();

     // This function shortens the code replacing
     // document.getElementById('myID') with getEl('myId')
     // everywhere in the script. It also tries to handle a common
     // error when calling the script: when the developer has only
     // set a NAME attribute value, so no ID attribute is set.
     function getEl(id)
         {if (document.getElementById(id) || (!document.getElementById(id) && document.getElementsByName(id).length==0))
                                    // IF   An ID attribute is assigned
                                    // OR   No ID attribute is assigned but using IE and Opera
                                    //          (which will find the NAME attribute value using getElementById)
                                    // OR   No element has this ID or NAME attribute value
                                    //          (used internally by the script)
                                    // THEN Return the required element.
                {return document.getElementById(id);}
          else  {if (document.getElementsByName(id).length==1)
                                    // IF   No ID attribute is assigned
                                    // AND  Using a standards-based browser
                                    // AND  Only one element has the NAME attribute set to the value
                                    // THEN Return the required element (using the NAME attribute value).
                        {return document.getElementsByName(id)[0];}
                 else   {if (document.getElementsByName(id).length>1)
                                {   // IF   No ID attribute is assigned
                                    // AND  using a standards-based browser
                                    // AND  more than one element has the NAME attribute set to the value
                                    // THEN alert developer to fix the fault.
                                 alert( 'JACS' +
                                        ' \nCannot uniquely identify element named: ' + id +
                                        '.\nMore than one identical NAME attribute defined' +
                                        '.\nSolution: Assign the required element a unique ID attribute value.');
                                }
                        }
                }
         };


     // This DIV inside an IE-only conditional comments is a
     // reliable way of setting up object testing for IE.
     document.writeln("<!--[if IE]><div id='jacsIE'></div><![endif]-->");
     document.writeln("<!--[if lt IE 7]><div id='jacsIElt7'></div><![endif]-->");

//******************************************************************************
//------------------------------------------------------------------------------
// Customisation section
//------------------------------------------------------------------------------
//******************************************************************************

     // I have made every effort to isolate the pop-up script from any
     // CSS defined on the main page but if you have anything set that
     // affects the pop-up (or you may want to change the way it looks)
     // then you can address it in the following style sheets.

     document.writeln(
        '<style type="text/css">' +
            '.jacs, .jacsStatic {padding:1px;vertical-align:middle;}' +
            'iframe.jacs        {position:absolute;visibility:hidden;' +
                                'top:0px;left:0px;width:1px;height:1px;}' +
            'table.jacs, ' +
            'table.jacsStatic   {padding:0px;visibility:hidden;width:200px;' +
                                'cursor:default;text-align:center;}' +
            'table.jacs         {top:0px;left:0px;position:absolute;}' +
        '</style>'  );

    // This style sheet can be extracted from the script and edited into regular
     // CSS (by removing all occurrences of + and '). That can be used as the
     // basis for themes. Classes are described in comments within the style
     // sheet.

     document.writeln(
        '<style type="text/css">' +
            '/* IMPORTANT:  The JACS calendar script requires all ' +
            '               the classes defined here. */' +
            'table.jacs,' +
            'table.jacsStatic   {padding:       1px;' +
                                'vertical-align:middle;' +
                                'border:        ridge 2px;' +
                                'font-size:     10pt;' +
                                'font-family:   Arial,Helvetica,' +
                                               'Sans-Serif;' +
                                'font-weight:   bold;}' +
            'td.jacsDrag,' +
            'td.jacsHead                 {padding:       0px 0px;' +
                                         'text-align:    center;}' +
            'td.jacsDrag                 {font-size:     8pt;}' +
            'select.jacsHead             {margin:        3px 1px;}' +
            'input.jacsHead              {height:        22px;' +
                                         'width:         22px;' +
                                         'vertical-align:middle;' +
                                         'text-align:    center;' +
                                         'margin:        2px 1px;' +
                                         'font-weight:   bold;' +
                                         'font-size:     10pt;' +
                                         'font-family:   fixedSys;}' +
            'td.jacsWeekNumberHead,' +
            'td.jacsWeek                 {padding:       0px;' +
                                         'text-align:    center;' +
                                         'font-weight:   bold;}' +
            'td.jacsNow,' +
            'td.jacsNowHover,' +
            'td.jacsNow:hover,' +
            'td.jacsNowDisabled          {padding:       0px;' +
                                         'text-align:    center;' +
                                         'vertical-align:middle;' +
                                         'font-size:     8pt;' +
                                         'font-weight:   normal;}' +
            'table.jacsCells             {text-align:    right;' +
                                         'font-size:     8pt;' +
                                         'width:         96%;}' +
            'td.jacsCells,' +
            'td.jacsCellsHover,' +
            'td.jacsCells:hover,' +
            'td.jacsCellsDisabled,' +
            'td.jacsCellsExMonth,' +
            'td.jacsCellsExMonthHover,' +
            'td.jacsCellsExMonth:hover,' +
            'td.jacsCellsExMonthDisabled,' +
            'td.jacsCellsWeekend,' +
            'td.jacsCellsWeekendHover,' +
            'td.jacsCellsWeekend:hover,' +
            'td.jacsCellsWeekendDisabled,' +
            'td.jacsCellsHighlighted,' +
            'td.jacsCellsHighlightedHover,' +
            'td.jacsCellsHighlighted:hover,' +
            'td.jacsCellsHighlightedWeekend,' +
            'td.jacsCellsHighlightedWeekendHover,' +
            'td.jacsCellsHighlightedWeekend:hover,' +
            'td.jacsInputDate,' +
            'td.jacsInputDateHover,' +
            'td.jacsInputDate:hover,' +
            'td.jacsInputDateDisabled,' +
            'td.jacsWeekNo,' +
            'td.jacsWeeks                {padding:           3px;' +
                                         'width:             16px;' +
                                         'height:            16px;' +
                                         'border-width:      1px;' +
                                         'border-style:      solid;' +
                                         'font-weight:       bold;' +
                                         'vertical-align:    middle;}' +
            '/* Blend the colours into your page here...    */' +
            '/* Calendar background */' +
            'table.jacs,' +
            'table.jacsStatic            {background-color:  #6666CC;}' +
            '/* Drag Handle */' +
            'td.jacsDrag                 {background-color:  #9999CC;' +
                                         'color:             #CCCCFF;}' +
            '/* Week number heading */' +
            'td.jacsWeekNumberHead       {color:             #6666CC;}' +
            '/* Week day headings */' +
            'td.jacsWeek                 {color:             #CCCCCC;}' +
            '/* Week numbers */' +
            'td.jacsWeekNo               {background-color:  #776677;' +
                                         'color:             #CCCCCC;}' +
            '/* Enabled Days */' +
            '/* Week Day */' +
            'td.jacsCells                {background-color:  #CCCCCC;' +
                                         'color:             #000000;}' +
            '/* Day matching the input date */' +
            'td.jacsInputDate            {background-color:  #CC9999;' +
                                         'color:             #FF0000;}' +
            '/* Weekend Day */' +
            'td.jacsCellsWeekend         {background-color:  #CCCCCC;' +
                                         'color:             #CC6666;}' +
            '/* Day outside the current month */' +
            'td.jacsCellsExMonth         {background-color:  #CCCCCC;' +
                                         'color:             #666666;}' +
            '/* Today selector */' +
            'td.jacsNow                  {background-color:  #6666CC;' +
                                         'color:             #FFFFFF;}' +
            '/* MouseOver/Hover formatting ' +
            '       If you want to "turn off" any of the formatting ' +
            '       then just set to the same as the standard format' +
            '       above. ' +
            ' ' +
            '       Note: The reason that the following are' +
            '       implemented using both a class and a :hover' +
            '       pseudoclass is because Opera handles the rendering' +
            '       involved in the class-swap very poorly and IE6 ' +
            '       (and below) only implements pseudoclasses on the' +
            '       anchor tag.' +
            '*/' +
            '/* Highlighted Days */' +
            '/* Week Day */' +
            'td.jacsCellsHighlighted     {background-color:  #E0E0E0;' +
                                         'color:             #FF0000;}' +
            '/* Weekend Day */' +
            'td.jacsCellsHighlightedWeekend {background-color: #E0E0E0;' +
                                         'color:             #CC6666;}' +
            '/* Active cells */' +
            'td.jacsCells:hover,' +
            'td.jacsCellsHover,' +
            'td.jacsCellsHighlighted:hover,' +
            'td.jacsCellsHighlightedHover,' +
            'td.jacsCellsHighlightedWeekend:hover,' +
            'td.jacsCellsHighlightedWeekendHover ' +
                                        '{background-color:  #FFFF00;' +
                                         'cursor:            pointer;' +
                                         'color:             #000000;}' +
            '/* Day matching the input date */' +
            'td.jacsInputDate:hover,' +
            'td.jacsInputDateHover       {background-color:  #FFFF00;' +
                                         'cursor:            pointer;' +
                                         'color:             #000000;}' +
            '/* Weekend cells */' +
            'td.jacsCellsWeekend:hover,' +
            'td.jacsCellsWeekendHover    {background-color:  #FFFF00;' +
                                         'cursor:            pointer;' +
                                         'color:             #000000;}' +
            '/* Day outside the current month */' +
            'td.jacsCellsExMonth:hover,' +
            'td.jacsCellsExMonthHover    {background-color:  #FFFF00;' +
                                         'cursor:            pointer;' +
                                         'color:             #000000;}' +
            '/* Clear Button */'                                        +
            'td.Clear                    {padding:           0px;}'    +
            'input.Clear                 {padding:           0px;'     +
                                         'text-align:     center;'     +
                                         'font-size:         8pt;}'    +
            '/* Today selector */' +
            'td.jacsNow:hover,' +
            'td.jacsNowHover             {color:             #FFFF00;' +
                                         'cursor:            pointer;' +
                                         'font-weight:       bold;}' +
            '/* Disabled cells */' +
            '/* Week Day */' +
            '/* Day matching the input date */' +
            'td.jacsInputDateDisabled    {background-color:  #999999;' +
                                         'color:             #000000;}' +
            'td.jacsCellsDisabled        {background-color:  #999999;' +
                                         'color:             #000000;}' +
            '/* Weekend Day */' +
            'td.jacsCellsWeekendDisabled {background-color:  #999999;' +
                                         'color:             #CC6666;}' +
            '/* Day outside the current month */' +
            'td.jacsCellsExMonthDisabled {background-color:  #999999;' +
                                         'color:             #666666;}' +
            'td.jacsNowDisabled          {background-color:  #6666CC;' +
                                         'color:             #FFFFFF;}' +
        '</style>');

     function calAttributes(cal)
        {switch (cal.id)
            {case 'EnterYourIDHere':

                // If you want to vary the attributes for a specific instance
                // of the calendar, replace 'EnterYourIDHere' (above) with the
                // ID that you have defined for that calendar then amend and
                // uncomment the block-commented section below (which is just
                // a copy of the default section below with all the
                // documentation comments removed).

                /*

                cal.zIndex                   = 1;
                cal.baseYear                 = dateNow.getFullYear()-10;
                cal.dropDownYears            = 20;
                cal.weekStart                = 1;
                cal.weekNumberBaseDay        = 4;
                cal.weekNumberDisplay        = false;

                try   {jacsSetLanguage(cal);}
                catch (exception)
                    {cal.today               = 'Today:';
                     cal.clear               = 'Clear';
                     cal.drag                = 'click here to drag';
                     cal.monthNames          = ['Jan','Feb','Mar','Apr','May','Jun',
                                                'Jul','Aug','Sep','Oct','Nov','Dec'];
                     cal.weekInits           = ['S','M','T','W','T','F','S'];
                     cal.invalidDateMsg      = 'The entered date is invalid.\n';
                     cal.outOfRangeMsg       = 'The entered date is out of range.';
                     cal.doesNotExistMsg     = 'The entered date does not exist.';
                     cal.invalidAlert        = ['Invalid date (',') ignored.'];
                     cal.dateSettingError    = ['Error ',' is not a Date object.'];
                     cal.rangeSettingError   = ['Error ',' should consist of two elements.'];
                    }

                cal.showInvalidDateMsg       = true;
                cal.showOutOfRangeMsg        = true;
                cal.showDoesNotExistMsg      = true;
                cal.showInvalidAlert         = true;
                cal.showDateSettingError     = true;
                cal.showRangeSettingError    = true;
                cal.delimiters               = ['/','-','.',':',',',' '];
                cal.dateDisplayFormat        = 'dd-mm-yy';
                cal.dateFormat               = 'DD MMM, YYYY';
                cal.strict                   = false;
                cal.dates                    = new Array();
                cal.highlightDates           = new Array();
                cal.dayCells                 = [true, true, true, true, true, true, true,
                                                true, true, true, true, true, true, true,
                                                true, true, true, true, true, true, true,
                                                true, true, true, true, true, true, true,
                                                true, true, true, true, true, true, true,
                                                true, true, true, true, true, true, true];
                cal.outOfRangeDisable        = true;
                cal.outOfMonthDisable        = false;
                cal.outOfMonthHide           = false;
                cal.formatTodayCell          = true;
                cal.todayCellBorderColour    = 'red';
                cal.allowDrag                = false;
                cal.onBlurMoveNext           = false;
                cal.clickToHide              = false;
                cal.xBase                    = 'L';    // L Left, M Middle, R Right  or integer pixel offset from left
                cal.yBase                    = 'B';    // T Top,  M Middle, B Bottom or integer pixel offset from top
                cal.xPosition                = 'L';    // L Left, M Middle, R Right  or integer pixel offset from left
                cal.yPosition                = 'T';    // T Top,  M Middle, B Bottom or integer pixel offset from top
                cal.autoPosition             = true;
                */

                break;
             default:

                // cal.zIndex controls how the pop-up calendar interacts with
                // the rest of the page.  It is usually adequate to leave it
                // as 1 (One) but I have made it available here to help anyone
                // who needs to alter the level in order to ensure that the
                // calendar displays correctly in relation to all other elements
                // on the page.

                cal.zIndex = 1;

                // Set the bounds for the calendar here...
                // If you want the year to roll forward you can use something
                // like this...
                //      var baseYear = dateNow.getFullYear()-5;
                // alternatively, hard code a date like this...
                //      var baseYear = 1990;

                cal.baseYear = dateNow.getFullYear()-10;

                // How many years do want to be valid and to show in the
                // drop-down list?

                cal.dropDownYears = 20;

                // weekStart determines the start of the week in the display
                // Set it to: 0 (Zero) for Sunday, 1 (One) for Monday etc..

                // Note:  Always start the weekInits array with your
                //        string for Sunday whatever weekStart (below)
                //        is set to.

                cal.weekStart = 1;

                // Week numbering rules are generally based on a day in the week
                // that determines the first week of the year.  ISO 8601 uses
                // Thursday (day four when Sunday is day zero).  You can alter
                // the base day here.

                // See http://www.cl.cam.ac.uk/~mgk25/iso-time.html
                // for more information

                cal.weekNumberBaseDay = 4;

                // The week start day for the display is taken as the week start
                // for week numbering.  This ensures that only one week number
                // applies to one line of the calendar table.
                // [ISO 8601 begins the week with Day 1 = Monday.]

                // If you want to see week numbering on the calendar, set
                // this to true.  If not, false.

                cal.weekNumberDisplay = false;

                // If the calendar is given a date that it can't parse a month
                // from, it will use a default month.  If the following attribute
                // is FALSE then the default month is month 6 (June), if set to
                // TRUE then the default will be the current month.

                cal.defaultToCurrentMonth = false;

                // All language-dependent settings can be made here...

                // If you wish to work in a single language (other than English)
                // then just replace the English below with your own text.

                // Using multiple languages:
                // In order to keep this script to a resonable size I have not
                // included multiple languages here.  However, you can set the language
                // fields in a function that you should name  jacsSetLanguage.  The script
                // will then use your languages. I have included all the translations
                // that have been sent to me in such a function on my demonstration
                // site at http://www.tarrget.info/calendar/jacsLanguages.js.

                try   {jacsSetLanguage(cal);}
                catch (exception)
                    {// English
                     cal.language            = 'en';
                     cal.today               = 'Today:';
                     cal.clear               = 'Clear';
                     cal.drag                = 'click here to drag';
                     cal.monthNames          = ['Jan','Feb','Mar','Apr','May','Jun',
                                                'Jul','Aug','Sep','Oct','Nov','Dec'];
                     cal.weekInits           = ['S','M','T','W','T','F','S'];
                     cal.invalidDateMsg      = 'The entered date is invalid.\n';
                     cal.outOfRangeMsg       = 'The entered date is out of range.';
                     cal.doesNotExistMsg     = 'The entered date does not exist.';
                     cal.invalidAlert        = ['Invalid date (',') ignored.'];
                     cal.dateSettingError    = ['Error ',' is not a Date object.'];
                     cal.rangeSettingError   = ['Error ',' should consist of two elements.'];
                    }

                // Each of the calendar's alert message types can be disabled
                // independently here.

                cal.showInvalidDateMsg      = true;
                cal.showOutOfRangeMsg       = true;
                cal.showDoesNotExistMsg     = true;
                cal.showInvalidAlert        = true;
                cal.showDateSettingError    = true;
                cal.showRangeSettingError   = true;

                // Set the whole calendar as active (dates selectable)
                // or inactive (display only)

                cal.active = true;

                // Set the allowed input date delimiters here...
                // E.g. To set the rising slash, hyphen, full-stop (aka stop or
                //      point), colon, comma and space as delimiters use
                //              var cal.delimiters   = ['/','-','.',':',',',' '];

                cal.delimiters = ['/','-','.',':',',',' '];

                // Set the format for the displayed 'Today' date and for the
                // output date here.
                //
                // The format is described using delimiters of your choice (as
                // set in cal.delimiters above) and case insensitive letters
                // D, M and Y.
                //
                // NOTE: If no delimiters are input then the date output format is used
                //       to parse the value.  This allows less flexiblility in the input
                //       value than using delimiters but an accurately entered date
                //       remains parsable.

                // Displayed "Today" date format

                cal.dateDisplayFormat = 'dd/mm/yyyy';     // e.g. 'MMM-DD-YYYY' for the US

                // Output date format

                cal.dateFormat  = 'DD-MMM-YYYY'; // e.g. 'MMM-DD-YYYY' for the US
                // Note: The delimiters used should be in cal.delimiters.

                // Personally I like the fact that entering 31-Sep-2005 (a date
                // that doesn't exist) displays 1-Oct-2005, however you may want
                // that to be an error.  If so, set cal.strict = true.  That
                // will cause an error message to display and the selected month
                // is displayed without a selected day. Thanks to Brad Allan for
                // his feedback prompting this feature.

                cal.strict = false;

                // If you are using ReadOnly or diaabled fields to return the date
                // value into, it can be useful to show a button on the calendar
                // that allows  the value to be cleared.  If you want to do that,
                // set cal.clearButton = true;

                cal.clearButton = true;

                // Choose whether the dates and days you specify in cal.dates
                // and as parameters to the JACS.show call are enabled (with all
                // other dates disabled) or disabled (with all other dates enabled).

                cal.valuesEnabled = false;

                // If you wish to set any displayed day, e.g. Every Monday,
                // you can do it using the following array.  The array elements
                // match the displayed cells.
                //
                // With the valuesEnabled attribute FALSE you could put something
                // like the following in your calling page to disable all weekend
                // days;
                //
                //  for (var i=0;i<<<calendar object>>.dayCells.length;i++)
                //      {if (i%7%6==0) <<calendar object>>.dayCells[i] = false;}
                //
                // The above approach will allow you to select days of the week
                // for the whole of your page easily.  If you need to set different
                // selected days for a number of date input fields on your page
                // there is an easier way: You can pass optional arguments to
                // JACS.show. The syntax is described at the top of this script in
                // the section:
                //    "How to use the Calendar once it is defined for your page:"
                //
                // It is possible to use these two approaches in combination.

                cal.dayCells = [true, true, true, true, true, true, true,
                                true, true, true, true, true, true, true,
                                true, true, true, true, true, true, true,
                                true, true, true, true, true, true, true,
                                true, true, true, true, true, true, true,
                                true, true, true, true, true, true, true];

                // You can specify any date (e.g. 24-Jan-2006 or Today) by creating
                // an element of the array cal.dates as a date object with the
                // value you want to handle.  Date ranges can be handled by placing
                // an array of two values (Start and End) into an element of this array.
                //
                // Use cal.valuesEnabled to determine whether any specified dates
                // are treated as the only enabled ones or the only disabled ones.

                cal.dates = new Array();

                // e.g. To specify 10-Dec-2005:
                //          cal.dates[0] = new Date(2005,11,10);
                //
                //      Or a range from 2004-Dec-25 to 2005-Jan-01:
                //
                //          cal.dates[1] =
                //              [new Date(2004,11,25),new Date(2005,0,1)];
                //
                //      The following will specify all calendar dates up to
                //      yesterday:
                //
                //          cal.dates[2] =
                //              [new Date(cal.baseYear,0,1),
                //               new Date(dateNow.getFullYear(),
                //                        dateNow.getMonth(),
                //                        dateNow.getDate()-1)];
                //
                // Remember that Javascript months are zero-based.

                // Allow specified dates to be highlighted when they are enabled.
                // You can set individual dates or date ranges in the same way as
                // above.

                cal.highlightDates = new Array();

                // Dates that are out of the specified range can be displayed at
                // the start of the very first month and end of the very last.
                // Set outOfRangeDisable = true to disable these dates
                // (or false to allow their selection).

                cal.outOfRangeDisable = true;

                // Dates that are out of the displayed month are shown at the start
                // (unless the month starts on the first day of the week) and end of
                // each month. Set outOfMonthDisable = true to disable these dates
                // (or false to allow their selection). Set outOfMonthHide = true
                // to hide these dates (or false to make them visible).

                cal.outOfMonthDisable = false;
                cal.outOfMonthHide    = false;

                // If you want a special format for the cell that contains the current day
                // set this to true.  This sets a thin border around the cell in the colour
                // set by cal.todayCellBorderColour.

                cal.formatTodayCell = true;
                cal.todayCellBorderColour = '#f00'; // red

                // You can allow the calendar to be dragged around the screen by
                // using the setting allowDrag = true.
                // I can't say I recommend it because of the danger of the user
                // forgetting which date field the calendar will update when
                // there are multiple date fields on a page.

                cal.allowDrag = false;

                // It is not easy to code HTML events to make the focus move
                // automatically on to the next element in the tab order so
                // here is a parameter you can set that will tell the script
                // to do it for you.  NOTE: The script may have to build a list
                // of all the page's elements in tabIndex order to achieve this
                // so there can be an overhead to using this feature.

                cal.onBlurMoveNext = false;

                // You can allow a click on the calendar to close dynamic
                // calendars by setting clickToHide = true.  If set to false
                // the script will hide a dynamic calendar when a date is
                // selected or the main page is clicked.

                cal.clickToHide = false;

                // Dynamic calendar positioning is relative to the return value
                // element. The script is supplied with the parameters below
                // setting the calendar's top left corner to appear at the
                // return element's bottom left corner.

                cal.xBase     = 'L';
                cal.yBase     = 'B';
                cal.xPosition = 'L';
                cal.yPosition = 'T';

                // For the horizontal (X) parameters, xBase and xPosition,
                // the accepted values are;  L - Left
                //                           M - Middle
                //                           R - Right
                //                      or  nn - integer pixel offset from left +/-
                //
                // For the vertical (Y) parameters, yBase and yPosition,
                // the accepted values are;  T - Top
                //                           M - Middle
                //                           B - Bottom
                //                      or  nn - integer pixel offset from top +/-

                // The calendar will position itself aligned according to the
                // choices above.  If automatic positioning is turned
                // on  with  cal.autoPosition = true  then if the chosen position
                // would cause the calendar to display off the visible screen,
                // it is shifted to a position that is visible.

                cal.autoPosition = true;

            }

            // Do not set the value of this calendar attribute.  It is used
            // to tell you whether a date has been selected or not when
            // using the JACS.next feature to trigger a function after the
            // calendar is used.
            // dateReturned is False unless the user has clicked on an
            // active date cell or the value for "Today", in which case
            // it is True.

            cal.dateReturned  = false;

            // The most recent date output to the target element is stored
            // as an attribute of the calendar. Initialised to Midnight
            // on 1st January 1970 (UTC), a selected date can never
            // equal this because returned dates are always 12 Midday.

            cal.outputDate    = new Date(0);

            // Finally: The following attributes are used in calendar
            //          functions.  You need do nothing with them here.

            cal.seedDate      = new Date();
            cal.fullInputDate = false;
            cal.activeToday   = true;
            cal.monthSum      = 0;
            cal.days          = new Array();
            cal.arrOnNext     = new Array();
            cal.triggerEle;
            cal.targetEle;
        };

//******************************************************************************
//------------------------------------------------------------------------------
// End of customisation section
//------------------------------------------------------------------------------
//******************************************************************************

// *******************************************************
// Custom methods for Date, String and Function prototypes
// *******************************************************

     // Format a date into the required pattern

     Date.prototype.jacsFormat =
        function(format,monthNames)
            {var charCount = 0,
                 codeChar  = '',
                 result    = '';

             for (var i=0;i<=format.length;i++)
                {if (i<format.length && format.charAt(i)==codeChar)
                        {// If we haven't hit the end of the string and
                         // the format string character is the same as
                         // the previous one, just clock up one to the
                         // length of the current element definition
                         charCount++;
                        }
                 else   {switch (codeChar)
                            {case 'y': case 'Y':
                                result += (this.getFullYear()%Math.pow(10,charCount)).toString().jacsPadLeft(charCount);
                                break;
                             case 'm': case 'M':
                                // If we find an M, check the number of them to
                                // determine whether to get the month number or
                                // the month name.
                                result += (charCount<3)
                                            ?(this.getMonth()+1).toString().jacsPadLeft(charCount)
                                            :monthNames[this.getMonth()];
                                break;
                             case 'd': case 'D':
                                // If we find a D, get the date and format it
                                result += this.getDate().toString().jacsPadLeft(charCount);
                                break;
                             default:
                                // Copy any unrecognised characters across
                                while (charCount-->0) {result += codeChar;}
                            }

                         if (i<format.length)
                            {// Store the character we have just worked on
                             codeChar  = format.charAt(i);
                             charCount = 1;
                            }
                        }
                }
             return result;
            };

     // Left pad zeroes

     String.prototype.jacsPadLeft =
        function(padToLength)
            {var result = '';
             for (var i=0;i<(padToLength-this.length);i++) {result += '0'};
             return (result+this);
            };

     // Set up a closure so that any next function can be triggered after the calendar
     // has been closed AND that function can take arguments.

     Function.prototype.jacsRunNext =
        function()  {var func = this, args = arguments[0];
                     func.JACSid = arguments[1];
                     return function() {return func.apply(this, args);};
                    };

// **************************************
// Set up calendar events on calling page
// **************************************

     if (document.addEventListener)
          {window.addEventListener(  'load',jacsLoader,true);}
     else {window.attachEvent     ('onload',jacsLoader);}

     function jacsLoader()
        {// Define document level event to hide the calendar on click.

         if (document.addEventListener)
              {document.addEventListener('click',hide, false);}
         else {document.attachEvent('onclick',hide);}

         // Create an onBeforeUnload event to handle IE memory leaks.

         if (getEl('jacsIElt7')) {window.attachEvent('onbeforeunload',defeatLeaks);}

         function defeatLeaks()
            {for (var i=0;i<cals.length;i++)
                {// Display the week number column (header and row numbers).
                 getEl(cals[i]+'Week_').style.display='';

                 for (var j=0;j<6;j++) {getEl(cals[i]+'Week_'+j).style.display='';}

                 // Set events to null.

                 getEl(cals[i]+'Now').onclick         = null;
                 getEl(cals[i]+'Now').onmouseover     = null;
                 getEl(cals[i]+'Now').onmouseout      = null;
                 getEl(cals[i]+'ClearButton').onclick = null;

                 var cal    = getEl(cals[i]),
                     cells  = getEl(cals[i]+'Cells').childNodes;

                 for (var j=0;j<cells.length;j++)
                    {var rows = cells[j].childNodes;
                     for (var k=1;k<rows.length;k++)
                        {rows[k].onclick     = null;
                         rows[k].onmouseover = null;
                         rows[k].onmouseout  = null;
                        }
                    }

                 // Set calendar's leaky custom attributes to null.

                 cal.arrOnNext  = null;
                 cal.targetEle  = null;
                }
            };
        };

// ****************************************************************************
// Start of Main Private Function Library
// ****************************************************************************

     function showMonth(bias,calId)
        {// Set the selectable Month and Year
         // May be called: from the left and right arrows
         //                  (shift month -1 and +1 respectively)
         //                from the month selection list
         //                from the year selection list
         //                from the showCal routine
         //                  (which initiates the display).
         var cal       = getEl(calId),
             showDate  = new Date(Date.parse(new Date().toDateString())),
             startDate = new Date();

         // Set the time to the middle of the day so that the handful of
         // regions that have daylight saving shifts that change the day
         // of the month (i.e. turn the clock back at midnight or forward
         // at 23:00) do not mess up the date display in the calendar.

         showDate.setHours(12);

         selYears  = getEl(calId+'Years');
         selMonths = getEl(calId+'Months');

         if ( selYears.options.selectedIndex>-1) {cal.monthSum =12*(selYears.options.selectedIndex)+bias;}
         if (selMonths.options.selectedIndex>-1) {cal.monthSum+=selMonths.options.selectedIndex;}

         showDate.setFullYear(cal.baseYear+Math.floor(cal.monthSum/12),(cal.monthSum%12),1);

         // If the Week numbers are displayed, shift the week day names to the right.

         getEl(calId+'Week_').style.display = (cal.weekNumberDisplay)?'':'none';

         // Opera has a bug with setting the selected index.
         // It requires the following work-around to force SELECTs to display correctly.
         if (window.opera)
            {selMonths.style.display = 'inherit';
              selYears.style.display = 'inherit';
            }

         tmp = (12*parseInt((showDate.getFullYear()-cal.baseYear),10)) + parseInt(showDate.getMonth(),10);

         if (tmp > -1 && tmp < (12*cal.dropDownYears))
            {selYears.options.selectedIndex  = Math.floor(cal.monthSum/12);
             selMonths.options.selectedIndex = (cal.monthSum%12);

             curMonth = showDate.getMonth();

             showDate.setDate((((showDate.getDay()-cal.weekStart)<0)?-6:1)+cal.weekStart-showDate.getDay());

             var compareDateValue = new Date(showDate.getFullYear(),showDate.getMonth(),showDate.getDate()).valueOf();

             startDate = new Date(showDate);

             var now = getEl(calId+'Now');

             function nowOutput() {setOutput(dateNow,calId);};

             if (cal.dates.length==0)
                {if (cal.active && cal.activeToday)
                    {now.onclick   = nowOutput;
                     now.className = 'jacsNow';

                     if (getEl('jacsIE'))
                        {now.onmouseover = changeClass;
                         now.onmouseout  = changeClass;
                        }

                     if (document.removeEventListener)
                            {now.removeEventListener('click',stopPropagation,false);}
                     else   {now.detachEvent(      'onclick',stopPropagation);}
                    }
                 else
                    {now.onclick   = null;
                     now.className = 'jacsNowDisabled';

                     if (getEl('jacsIE'))
                        {now.onmouseover = null;
                         now.onmouseout  = null;
                        }

                     if (document.addEventListener)
                            {now.addEventListener('click',stopPropagation,false);}
                     else   {now.attachEvent(   'onclick',stopPropagation);}
                    }
                }
             else
                {for (var k=0;k<cal.dates.length;k++)
                    {if (!cal.activeToday ||
                         (typeof cal.dates[k]=='object' &&
                              ((cal.dates[k].constructor==Date  && dateNow.valueOf() == cal.dates[k].valueOf()) ||
                               (cal.dates[k].constructor==Array && dateNow.valueOf() >= cal.dates[k][0].valueOf() &&
                                                                   dateNow.valueOf() <= cal.dates[k][1].valueOf()
                               )
                              )
                         )
                        )
                        {now.onclick   = (cal.active && cal.valuesEnabled)?nowOutput:null;
                         now.className = (cal.active && cal.valuesEnabled)?'jacsNow':'jacsNowDisabled';

                         if (getEl('jacsIE'))
                            {now.onmouseover = (cal.active && cal.valuesEnabled)?changeClass:null;
                             now.onmouseout  = (cal.active && cal.valuesEnabled)?changeClass:null;
                            }

                         if (cal.active && cal.valuesEnabled)
                            {if (document.removeEventListener) {now.removeEventListener('click',stopPropagation,false);}
                             else                              {now.detachEvent(      'onclick',stopPropagation);}
                            }
                         else
                            {if (document.addEventListener) {now.addEventListener('click',stopPropagation,false);}
                             else                           {now.attachEvent(   'onclick',stopPropagation);}
                            }

                         break;
                        }
                     else
                        {now.onclick   = (cal.active && cal.valuesEnabled)?null:nowOutput;
                         now.className = (cal.active && cal.valuesEnabled)?'jacsNowDisabled':'jacsNow';

                         if (getEl('jacsIE'))
                            {now.onmouseover = (cal.active && cal.valuesEnabled)?null:changeClass;
                             now.onmouseout  = (cal.active && cal.valuesEnabled)?null:changeClass;
                            }

                         if (cal.active && cal.valuesEnabled)
                            {if (document.addEventListener) {now.addEventListener('click',stopPropagation,false);}
                             else                           {now.attachEvent(   'onclick',stopPropagation);}
                            }
                         else
                            {if (document.removeEventListener) {now.removeEventListener('click',stopPropagation,false);}
                             else                              {now.detachEvent(      'onclick',stopPropagation);}
                            }
                        }
                    }
                }

             function setOutput(outputDate,calId)
                {var cal = getEl(calId);

                 if (typeof cal.targetEle.value == 'undefined')
                        {cal.triggerEle.textNode.replaceData(0,cal.triggerEle.len,outputDate.jacsFormat(cal.dateFormat,cal.monthNames));}
                 else   {cal.ele.value = outputDate.jacsFormat(cal.dateFormat,cal.monthNames);}

                 cal.dateReturned = true;
                 cal.outputDate   = outputDate;

                 if (cal.dynamic) {hide(calId);}
                 else {if (typeof cal.onNext!='undefined' && cal.onNext!=null) {cal.onNext();}
                       JACS.show(cal.ele,cal.id,cal.days);
                      }

                 if (cal.onBlurMoveNext)
                    {// if the target element has a tabIndex look for tabIndex+1
                     // if that exists then set the focus to it

                     var tagsToFind = 'INPUT;A;SELECT;TEXTAREA;BUTTON;AREA;OBJECT',
                         found      = false;

                     if (cal.ele.tabIndex>0)
                        {var tags = tagsToFind.split(';');

                         tagsOuterLoop:
                         for (var i=0;tags.length;i++)
                            {elementsByTag = document.getElementsByTagName(tags[i]);

                             for (var j=0;j<elementsByTag.length;j++)
                                {if (elementsByTag[j].tabIndex==(cal.ele.tabIndex+1) && !elementsByTag[j].disabled &&
                                     elementsByTag[j].type!='hidden' && elementsByTag[j].style.display!='none' &&
                                     elementsByTag[j].style.visibility!='hidden')
                                    {elementsByTag[j].focus();
                                     found = true;
                                     break tagsOuterLoop;
                                    }
                                }
                            }
                        }

                     // else do the full search to find the next element

                     if (!found)
                        {// find element tabIndices
                         function orderElements()
                            {var tabOrder  = new Array,
                                 unordered = new Array;

                             function elementArrays(ele)
                                {for (var i=0;i<ele.childNodes.length;i++)
                                    {var tempEle = ele.childNodes[i];
                                     if (tempEle.nodeType==1 && tempEle.style.display!='none' &&
                                         !tempEle.disabled   && tempEle.type!='hidden' &&
                                         tempEle.style.visibility!='hidden')
                                        {if (tagsToFind.indexOf(tempEle.tagName)>-1)
                                            {if (tempEle.tabIndex>0) {tabOrder[tempEle.tabIndex]  = tempEle}
                                             else                    {unordered[unordered.length] = tempEle}
                                            }
                                         elementArrays(tempEle);
                                        }
                                    }
                                };

                             elementArrays(document.body);

                             while (tabOrder.length>0 && tabOrder[0]==null) {tabOrder.shift();}

                             return tabOrder.concat(unordered);
                            };

                         var tabSequenced = orderElements();

                         // find the current element in tabIndex ordered array
                         // and set focus to the next element (or the first if
                         // the current is the last)

                         for (var i=0;i<tabSequenced.length;i++)
                            {if (tabSequenced[i]==cal.targetEle)
                                {if (i<(tabSequenced.length-1)) {tabSequenced[i+1].focus()}
                                 else                           {tabSequenced[0].focus()}
                                 break;
                                }
                            }
                        }
                    }
                 else
                    {if (!cal.targetEle.disabled      && cal.targetEle.style.display!='none' &&
                         cal.targetEle.type!='hidden' && cal.targetEle.style.visibility!='hidden')
                        {cal.targetEle.focus();}
                    }
                };

             function changeClass(evt)
                {var ele = eventTrigger(evt);

                 if (ele.nodeType==3) {ele=ele.parentNode;}

                 if (((evt)?evt.type:event.type)=='mouseover')
                    {switch (ele.className)
                        {case 'jacsCells':
                            ele.className = 'jacsCellsHover';        break;
                         case 'jacsCellsHighlighted':
                            ele.className = 'jacsCellsHighlightedHover';        break;
                         case 'jacsCellsExMonth':
                            ele.className = 'jacsCellsExMonthHover'; break;
                         case 'jacsCellsWeekend':
                            ele.className = 'jacsCellsWeekendHover'; break;
                         case 'jacsCellsHighlightedWeekend':
                            ele.className = 'jacsCellsHighlightedWeekendHover'; break;
                         case 'jacsNow':
                            ele.className = 'jacsNowHover';         break;
                         case 'jacsInputDate':
                            ele.className = 'jacsInputDateHover';
                        }
                    }
                 else
                    {switch (ele.className)
                        {case 'jacsCellsHover':
                            ele.className = 'jacsCells';             break;
                         case 'jacsCellsHighlightedHover':
                            ele.className = 'jacsCellsHighlighted';  break;
                         case 'jacsCellsExMonthHover':
                            ele.className = 'jacsCellsExMonth';      break;
                         case 'jacsCellsWeekendHover':
                            ele.className = 'jacsCellsWeekend';      break;
                         case 'jacsCellsHighlightedWeekendHover':
                            ele.className = 'jacsCellsHighlightedWeekend';      break;
                         case 'jacsNowHover':
                            ele.className = 'jacsNow';              break;
                         case 'jacsInputDateHover':
                            ele.className = 'jacsInputDate';
                        }
                    }
                 return true;
                };

             function eventTrigger(evt)
                {if (!evt) {evt = event;}
                 return evt.target||evt.srcElement;
                };

             function weekNumber(inDate)
                {// The base day in the week of the input date
                 var inDateWeekBase = new Date(inDate);

                 inDateWeekBase.setDate(inDateWeekBase.getDate() - inDateWeekBase.getDay() + cal.weekNumberBaseDay +
                                            ((inDate.getDay() > cal.weekNumberBaseDay)?7:0));

                 // The first Base Day in the year
                 var firstBaseDay = new Date(inDateWeekBase.getFullYear(),0,1);

                 firstBaseDay.setDate(firstBaseDay.getDate() - firstBaseDay.getDay() + cal.weekNumberBaseDay);

                 if (firstBaseDay<new Date(inDateWeekBase.getFullYear(),0,1))
                    {firstBaseDay.setDate(firstBaseDay.getDate()+7);}

                 // Start of Week 01
                 var startWeekOne = new Date(firstBaseDay - cal.weekNumberBaseDay + inDate.getDay());

                 if (startWeekOne>firstBaseDay) {startWeekOne.setDate(startWeekOne.getDate()-7);}

                 // Subtract the date of the current week from the date of the first week of the year to
                 // get the number of weeks in milliseconds.  Divide by the number of milliseconds in a
                 // week then round to no decimals in order to remove the effect of daylight saving.  Add
                 // one to make the first week, week 1.  Place a string zero on the front so that week
                 // numbers are zero filled.

                 var weekNo = '0'+(Math.round((inDateWeekBase - firstBaseDay)/604800000,0)+1);

                 // Return the last two characters in the week number string

                 return weekNo.substring(weekNo.length-2,weekNo.length);
                };

             // walk the DOM to display the dates.

             var cells = getEl(calId+'Cells').childNodes;

             for (var i=0;i<cells.length;i++)
                {var rows = cells[i];
                 if (rows.nodeType==1 && rows.tagName=='TR')
                    {tmpEl = rows.childNodes[0];
                     if (cal.weekNumberDisplay)
                          {//Calculate the week number using showDate
                           tmpEl.innerHTML = weekNumber(showDate);
                           tmpEl.style.borderColor =
                               (tmpEl.currentStyle)
                                    ?tmpEl.currentStyle['backgroundColor']
                                    :(document.defaultView.getComputedStyle)
                                        ?document.defaultView.getComputedStyle(tmpEl,null).backgroundColor
                                        :'';
                           tmpEl.style.display = '';
                          }
                     else  {tmpEl.style.display='none';}

                     for (var j=1;j<rows.childNodes.length;j++)
                        {var cols = rows.childNodes[j];
                         if (cols.nodeType==1 && cols.tagName=='TD')
                            {rows.childNodes[j].innerHTML = showDate.getDate();

                             var cell = rows.childNodes[j];

                             cell.style.visibility = (cal.outOfMonthHide &&
                                                      (showDate < (new Date(showDate.getFullYear(),curMonth,1,showDate.getHours())) ||
                                                       showDate > (new Date(showDate.getFullYear(),curMonth+1,0,showDate.getHours()))
                                                      )
                                                     )?'hidden':'inherit';

                             // Disable if the outOfRangeDisable option has been set and the current date
                             // is out of range or the cal.valuesEnabled option is true.
                             var disabled = cal.valuesEnabled;

                             if ((cal.outOfRangeDisable && (showDate < (new Date(cal.baseYear,0,1,12)) ||
                                                            showDate > (new Date(cal.baseYear+cal.dropDownYears,0,0,12))
                                                           )
                                 ) ||
                                 (cal.outOfMonthDisable && (showDate < (new Date(showDate.getFullYear(),curMonth,1,showDate.getHours())) ||
                                                            showDate > (new Date(showDate.getFullYear(),curMonth+1,0,showDate.getHours()))
                                                           )
                                 )
                                ) {disabled = true;}
                             else
                                {if ((cal.days.join().search(((j-1+(7*(i*cells.length/6))+cal.weekStart)%7))>-1) ||
                                      !cal.dayCells[j-1+(7*((i*cells.length)/6))]
                                    )   {disabled = !cal.valuesEnabled;} // Set (Disable or Enable) if the day is passed as a parameter of JACS.show
                                 else   {for (var k=0;k<cal.dates.length;k++)
                                            {if (typeof cal.dates[k]=='object' &&
                                                 ((cal.dates[k].constructor==Date  && compareDateValue == cal.dates[k].valueOf()) ||
                                                  (cal.dates[k].constructor==Array && compareDateValue >= cal.dates[k][0].valueOf() &&
                                                                                      compareDateValue <= cal.dates[k][1].valueOf()
                                                  )
                                                 )
                                                )
                                                {disabled = !cal.valuesEnabled;
                                                 break;
                                                }
                                            }
                                        }
                                }

                             if (disabled)
                                {rows.childNodes[j].onclick = null;

                                 if (getEl('jacsIE'))
                                    {rows.childNodes[j].onmouseover = null;
                                     rows.childNodes[j].onmouseout  = null;
                                    }

                                 cell.className=
                                    (showDate.getMonth()!=curMonth)
                                        ?'jacsCellsExMonthDisabled'
                                        :(cal.fullInputDate &&
                                          compareDateValue==
                                          cal.seedDate.valueOf())
                                            ?'jacsInputDateDisabled'
                                            :(showDate.getDay()%6==0)
                                                ?'jacsCellsWeekendDisabled'
                                                :'jacsCellsDisabled';

                                 cell.style.borderColor =
                                     (cal.formatTodayCell && showDate.toDateString()==dateNow.toDateString())
                                        ?cal.todayCellBorderColour
                                        :(cell.currentStyle)
                                            ?cell.currentStyle['backgroundColor']
                                            :(document.defaultView.getComputedStyle)
                                                ?document.defaultView.getComputedStyle(cell,null).backgroundColor
                                                :'';
                                }
                             else
                                {function cellOutput(evt)
                                    {var ele = eventTrigger(evt),
                                         outputDate = new Date(startDate);

                                     if (ele.nodeType==3) ele=ele.parentNode;

                                     outputDate.setDate(startDate.getDate() +
                                        parseInt(ele.id.substr(calId.length+5),10));

                                     setOutput(outputDate,calId);
                                    };

                                 if (cal.active)
                                    {rows.childNodes[j].onclick=cellOutput;}

                                 if (getEl('jacsIE'))
                                    {rows.childNodes[j].onmouseover = changeClass;
                                     rows.childNodes[j].onmouseout  = changeClass;
                                    }

                                 var highlighted = false;

                                 for (var k=0;k<cal.highlightDates.length;k++)
                                    {if (typeof cal.highlightDates[k]=='object' &&
                                         ((cal.highlightDates[k].constructor==Date  &&
                                           compareDateValue == cal.highlightDates[k].valueOf()) ||
                                          (cal.highlightDates[k].constructor==Array &&
                                           compareDateValue >= cal.highlightDates[k][0].valueOf() &&
                                           compareDateValue <= cal.highlightDates[k][1].valueOf()
                                          )
                                         )
                                        )
                                        {highlighted = true;
                                         break;
                                        }
                                    }

                                 cell.className=
                                     (showDate.getMonth()!=curMonth)
                                        ?'jacsCellsExMonth'
                                        :(cal.fullInputDate &&
                                          compareDateValue==
                                          cal.seedDate.valueOf())
                                            ?'jacsInputDate'
                                            :(showDate.getDay()%6==0)
                                                ?(highlighted)?'jacsCellsHighlightedWeekend':'jacsCellsWeekend'
                                                :(highlighted)?'jacsCellsHighlighted':'jacsCells';

                                 cell.style.borderColor =
                                     (cal.formatTodayCell && showDate.toDateString()==dateNow.toDateString())
                                        ?cal.todayCellBorderColour
                                        :(cell.currentStyle)
                                            ?cell.currentStyle['backgroundColor']
                                            :(document.defaultView.getComputedStyle)
                                                ?document.defaultView.getComputedStyle(cell,null).backgroundColor
                                                :'';
                               }

                             showDate.setDate(showDate.getDate()+1);
                             compareDateValue = new Date(showDate.getFullYear(),
                                                         showDate.getMonth(),
                                                         showDate.getDate()).valueOf();
                            }
                        }
                    }
                }
            }

         // Opera has a bug with setting the selected index.
         // It requires the following work-around to force SELECTs to display correctly.
         // Also Opera's poor dynamic rendering prior to 9.5 requires
         // the visibility to be reset to prevent garbage in the calendar
         // when the displayed month is changed.
         if (window.opera)
            {selMonths.style.display = 'inline';
              selYears.style.display = 'inline';
             cal.style.visibility = 'hidden';
             cal.style.visibility = 'inherit';
            }
        };

     function hide(instanceID)
        {if (typeof instanceID=='object')
                {for (var i=0;i<cals.length;i++) {hideOne(cals[i]);}}
         else   {hideOne(instanceID);}

         function hideOne(id)
            {cal = getEl(id);

             if (cal.dynamic)
                {cal.style.visibility = 'hidden';
                 getEl(id+'Iframe').style.visibility='hidden';
                 doNext(cal);
                }
            };
        };

     function doNext(cal)
        {if (cal.arrOnNext)
            {if (cal.arrOnNext.length > 0)
                 {cal.onNext = cal.arrOnNext.shift();
                  cal.onNext();
                  // Explicit null set to prevent closure causing memory leak
                  cal.onNext = null;
                 }
            }
        };

     function stopPropagation(evt)
       {if (evt.stopPropagation)
             {if (evt.target!=evt.currentTarget) {evt.stopPropagation(); evt.preventDefault();}}
        else {evt.cancelBubble = true;}
       };

// *********************************
//   End of Private Function Library
// *********************************
// Start of Public  Function Library
// *********************************

     return {show: function(ele)
                {// Check the type of any additional parameters.
                 // The optional string parameter is a calendar ID,
                 // Take any remaining parameters as day numbers to be handled
                 // (enabled/disabled) according to the setting of the
                 // calendar's  valuesEnabled  attribute.
                 // 0 = Sunday through to 6 = Saturday.

                 if (typeof arguments[1]=='object')
                    {var dynamic = true;

                     if (typeof arguments[2]=='string')
                            {var calId = arguments[2], min = 3;}
                     else   {var calId = 'jacs',       min = 2;}

                     // Stop the click event that opens the calendar
                     // from bubbling up to the document-level event
                     // handler that hides it!

                     var source = arguments[1];
                     if (!source) {source = window.event;}

                     if (source.tagName)    // Second parameter isn't an event it's an element
                        {var sourceEle = source;
                         if (getEl('jacsIE'))  {window.event.cancelBubble = true;}
                         else {sourceEle.parentNode.addEventListener('click',stopPropagation,false);}
                        }
                     else   // Second parameter is an event
                        {var event = source;
                         // Stop the click event that opens the calendar from bubbling up to
                         // the document-level event handler that hides it!
                         var sourceEle = (event.target)?event.target:event.srcElement;
                         if (event.stopPropagation) {event.stopPropagation();}
                         else                       {event.cancelBubble = true;}
                        }
                    }
                 else
                    {var sourceEle = ele, dynamic = false;

                     if (typeof arguments[1]=='string')
                            {var calId = arguments[1], min = 2;}
                     else   {var calId = 'jacs',       min = 1;}
                    }

                 // Add event handlers to the return element and its parent.
                 // This helps the script to support tab sequences and focus events.

                 if (document.addEventListener)
                        {ele.addEventListener('keydown',hideOnTab,false);
                         ele.parentNode.addEventListener('click',stopPropagation,false);}
                 else   {ele.attachEvent('onkeydown',hideOnTab);
                         if (ele.parentNode!=document.body)
                            {ele.parentNode.attachEvent('onclick',stopPropagation);}
                        }

                 function hideOnTab(evt)
                    {if (!evt) {var evt = window.event;}
                     if ((evt.keyCode||evt.which)==9) {hide(calId);}
                    };

                 // Create the calendar structure. One is enough unless you want more
                 // than one calendar visible on the page at one time.  If you DO need
                 // more, you can create as many as you like but each must have a unique
                 // ID.

                 // The first parameter of JACS.make is the ID of the calendar. The
                 // second is a boolean that determines whether the calendar is to be
                 // static on the page (assigned to a single input field and always
                 // visible) or dynamic (shown and hidden on events and can be assigned
                 // to any number of input fields).

                 if (!getEl(calId)) {JACS.make(calId,dynamic);}

                 cal = getEl(calId);

                 // If the calendar has been triggered using an onfocus event,
                 // and the script actively returns the focus to the target
                 // element (i.e. when cal.onBlurMoveNext = false). We need
                 // to kill the event.

                 if (event)
                    {if (event.type == 'focus' && cal.dateReturned && !cal.onBlurMoveNext && cal.prevEventType == 'focus')
                        {stopPropagation(event); cal.prevEventType = ''; cal.dateReturned = false; return false;}
                     cal.prevEventType = event.type;
                    }

                 if (cal.style.visibility != 'hidden' &&
                     cal.style.visibility != 'inherit' &&
                     typeof doNext == 'function') {doNext(cal);}

                 cal.triggerEle = sourceEle;

                 cal.dateReturned = false;
                 cal.activeToday  = true;

                 // Set enabled/disabled days

                 if (arguments.length==min) {cal.days.length=0;}
                 else {selectedDays = (typeof arguments[min]=='object')?arguments[min]:arguments;
                       for (var i=(min|0);i<selectedDays.length;i++)
                         {if (cal.days.join().indexOf(selectedDays[i])==-1) {cal.days.push(selectedDays[i]);}}
                      }

                 for (var i=0;i<cal.days.length;i++)
                    {if (dateNow.getDay()==cal.days[i]%7) {cal.activeToday = false; break;}}

                 //   If no value is preset then the seed date is
                 //      Today (when today is in range) OR
                 //      The middle of the date range.

                 cal.seedDate = dateNow;

                 // Find the date and Strip space characters from start and
                 // end of date input.

                 var dateValue = '';

                 if (ele.value) {dateValue = ele.value.replace(/^\s+/,'').replace(/\s+$/,'');}
                 else   {if (typeof ele.value == 'undefined')
                            {var childNodes = ele.childNodes;
                             for (var i=0;i<childNodes.length;i++)
                                {if (childNodes[i].nodeType == 3)
                                    {dateValue = childNodes[i].nodeValue.replace(/^\s+/,'').replace(/\s+$/,'');
                                     if (dateValue.length > 0)
                                        {cal.triggerEle.textNode = childNodes[i];
                                         cal.triggerEle.len      = childNodes[i].nodeValue.length;
                                         break;
                                        }
                                    }
                                }
                            }
                        }

                 // Set the year range

                 var yearOptions = getEl(calId+'Years').options;

                 if (yearOptions.length==0 || yearOptions[0].value!=cal.baseYear)
                    {yearOptions.length = 0;
                     for (var i=0;i<cal.dropDownYears;i++) {yearOptions[i] = new Option((cal.baseYear+i),(cal.baseYear+i));}
                    }

                 if (dateValue.length==0)
                    {// If no value is entered and today is within the range,
                     // use today's date, otherwise use the middle of the valid range.

                     cal.fullInputDate=false;

                     if ((new Date(cal.baseYear+cal.dropDownYears,0,0))<cal.seedDate ||
                         (new Date(cal.baseYear,0,1))                  >cal.seedDate
                        )
                        {cal.seedDate = new Date(cal.baseYear+Math.floor(cal.dropDownYears / 2), 5, 1);}
                    }
                 else
                    {function inputFormat()
                        {var seed = new Array(),
                             input = dateValue.split(new RegExp('[\\'+cal.delimiters.join('\\')+']+','g'));

                         // "Escape" all the user defined date delimiters above -
                         // several delimiters will need it and it does no harm for
                         // the others.

                         // Strip any empty array elements (caused by delimiters)
                         // from the beginning or end of the array. They will
                         // still appear in the output string if in the output
                         // format.

                         if (input[0]!=null)
                            {if (input[0].length==0)              {input.splice(0,1);}
                             if (input[input.length-1].length==0) {input.splice(input.length-1,1);}
                            }

                         cal.fullInputDate = false;

                         cal.dateFormat = cal.dateFormat.toUpperCase();

                         // List all the allowed letters in the date format
                         var template = ['D','M','Y'];

                         // Prepare the sequence of date input elements
                         var result = new Array();

                         for (var i=0;i<template.length;i++)
                            {if (cal.dateFormat.search(template[i])>-1)
                                {result[cal.dateFormat.search(template[i])] = template[i];}
                            }

                         cal.dateSequence = result.join('');

                         // Separate the elements of the date input
                         switch (input.length)
                            {case 1:
                                {// Year only entry or undelimited date format

                                 if (cal.dateFormat.indexOf('Y')>-1 &&
                                     input[0].length>cal.dateFormat.lastIndexOf('Y'))
                                    {seed[0] = parseInt(input[0].substring(cal.dateFormat.indexOf('Y'),
                                                                           cal.dateFormat.lastIndexOf('Y')+1),10);
                                    }
                                 else   {seed[0] = parseInt(input[0],10);}

                                 if (cal.dateFormat.indexOf('M')>-1 &&
                                     input[0].length>cal.dateFormat.lastIndexOf('M'))
                                    {seed[1] = input[0].substring(cal.dateFormat.indexOf('M'),
                                                                  cal.dateFormat.lastIndexOf('M')+1);
                                    }
                                 else   {seed[1] = cal.defaultToCurrentMonth?(dateNow.getMonth()+1).toString():'6';}

                                 if (cal.dateFormat.indexOf('D')>-1 &&
                                     input[0].length>cal.dateFormat.lastIndexOf('D'))
                                    {seed[2] = parseInt(input[0].substring(cal.dateFormat.indexOf('D'),
                                                                           cal.dateFormat.lastIndexOf('D')+1),10);
                                    }
                                 else   {seed[2] = 1;}

                                 if (input[0].length==cal.dateFormat.length)    {cal.fullInputDate = true;}
                                 break;
                                }
                             case 2:
                                {// Year and Month entry
                                 seed[0] = parseInt(input[cal.dateSequence.replace(/D/i,'').search(/Y/i)],10);  // Year
                                 seed[1] = input[cal.dateSequence.replace(/D/i,'').search(/M/i)];               // Month
                                 seed[2] = 1;                                                                        // Day
                                 break;
                                }
                             case 3:
                                {// Day Month and Year entry
                                 seed[0] = parseInt(input[cal.dateSequence.search(/Y/i)],10);  // Year
                                 seed[1] = input[cal.dateSequence.search(/M/i)];               // Month
                                 seed[2] = parseInt(input[cal.dateSequence.search(/D/i)],10);  // Day
                                 cal.fullInputDate = true;
                                 break;
                                }
                             default:
                                {// A stuff-up has led to more than three elements in the date.
                                 seed[0] = 0;     // Year
                                 seed[1] = 0;     // Month
                                 seed[2] = 0;     // Day
                                }
                            }

                         // These regular expressions validate the input date format
                         // to the following rules;
                         //         Day   1-31 (optional zero on single digits)
                         //         Month 1-12 (optional zero on single digits)
                         //                     or case insensitive name
                         //         Year  One, Two or four digits

                         // Months names are as set in the language-dependent
                         // definitions and delimiters are set just below there

                         var expValDay    = new RegExp('^(0?[1-9]|[1-2][0-9]|3[0-1])$'),
                             expValMonth  = new RegExp('^(0?[1-9]|1[0-2]|'+cal.monthNames.join('|')+')$','i'),
                             expValYear   = new RegExp('^([0-9]{1,2}|[0-9]{4})$');

                         // Apply validation and report failures

                         if (expValYear.exec(seed[0]) ==null ||
                             expValMonth.exec(seed[1])==null ||
                             expValDay.exec(seed[2])  ==null
                            )
                            {if (cal.showInvalidDateMsg)
                                {alert(cal.invalidDateMsg + cal.invalidAlert[0] + dateValue + cal.invalidAlert[1]);}
                             seed[0] = cal.baseYear + Math.floor(cal.dropDownYears/2);                   // Year
                             seed[1] = cal.defaultToCurrentMonth?(dateNow.getMonth()+1).toString():'6';  // Month
                             seed[2] = 1;                                                                // Day
                             cal.fullInputDate = false;
                            }

                         // Return the Year  in seed[0]
                         //            Month in seed[1]
                         //            Day   in seed[2]

                         return seed;
                        };

                     // Parse the string into an array using the allowed delimiters

                     seedDate = inputFormat();

                     // So now we have the Year, Month and Day in an array.

                     //   If the year is one or two digits then the routine assumes a
                     //   year belongs in the 21st Century unless it is less than 50
                     //   in which case it assumes the 20th Century is intended.

                     if (seedDate[0]<100) {seedDate[0] += (seedDate[0]>50)?1900:2000;}

                     // Check whether the month is in digits or an abbreviation

                     if (seedDate[1].search(/\d+/)<0)
                        {for (i=0;i<cal.monthNames.length;i++)
                            {if (seedDate[1].toUpperCase()==cal.monthNames[i].toUpperCase())
                                {seedDate[1]=i+1;
                                 break;
                                }
                            }
                        }

                     cal.seedDate = new Date(seedDate[0],seedDate[1]-1,seedDate[2]);
                    }

                 // Test that we have arrived at a valid date

                 if (isNaN(cal.seedDate))
                    {if (cal.showInvalidDateMsg)
                        {alert(cal.invalidDateMsg + cal.invalidAlert[0] + dateValue + cal.invalidAlert[1]);}
                     cal.seedDate = new Date(cal.baseYear + Math.floor(cal.dropDownYears/2),5,1);
                     cal.fullInputDate = false;
                    }
                 else
                    {// Test that the date is within range,
                     // if not then set date to a sensible date in range.

                     if ((new Date(cal.baseYear,0,1))>cal.seedDate)
                        {if (cal.strict && cal.showOutOfRangeMsg) {alert(cal.outOfRangeMsg);}
                         cal.seedDate = new Date(cal.baseYear,0,1);
                         cal.fullInputDate=false;
                        }
                     else
                        {if ((new Date(cal.baseYear+cal.dropDownYears,0,0))<cal.seedDate)
                            {if (cal.strict && cal.showOutOfRangeMsg) {alert(cal.outOfRangeMsg);}
                             cal.seedDate = new Date(cal.baseYear + Math.floor(cal.dropDownYears),-1,1);
                             cal.fullInputDate=false;
                            }
                         else
                            {if (cal.strict && cal.fullInputDate &&
                                  (cal.seedDate.getDate()     !=seedDate[2] ||
                                   (cal.seedDate.getMonth()+1)!=seedDate[1] ||
                                   cal.seedDate.getFullYear() !=seedDate[0]
                                  )
                                )
                                {if (cal.showDoesNotExistMsg) {alert(cal.doesNotExistMsg);}
                                 cal.seedDate = new Date(cal.seedDate.getFullYear(),cal.seedDate.getMonth()-1,1);
                                 cal.fullInputDate=false;
                                }
                            }
                        }
                    }

                 // Test the chosen dates for validity
                 // Give error message if not valid

                 for (var i=0;i<cal.dates.length;i++)
                    {if (!((typeof cal.dates[i]=='object') && (cal.dates[i].constructor==Date)))
                        {if ((typeof cal.dates[i]=='object') && (cal.dates[i].constructor==Array))
                            {var pass = true;

                             if (cal.dates[i].length!=2)
                                {if (cal.showRangeSettingError)
                                    {alert(cal.rangeSettingError[0] + cal.dates[i] + cal.rangeSettingError[1]);}
                                 pass = false;
                                }
                             else
                                {for (var j=0;j<cal.dates[i].length;j++)
                                    if (!((typeof cal.dates[i][j]=='object') && (cal.dates[i][j].constructor==Date)))
                                        {if (cal.showRangeSettingError)
                                            {alert(cal.dateSettingError[0] + cal.dates[i][j] + cal.dateSettingError[1]);}
                                         pass = false;
                                        }
                                }

                             if (pass && (cal.dates[i][0]>cal.dates[i][1])) {cal.dates[i].reverse();}
                            }
                         else
                            {if (cal.showRangeSettingError)
                                {alert(cal.dateSettingError[0] + cal.dates[i] + cal.dateSettingError[1]);}
                            }
                        }
                    }

                 // Set language-dependent values

                 getEl(calId+'DragText').innerHTML = cal.drag;

                 var monthOptions = getEl(calId+'Months').options,  months = '';

                 if (monthOptions.length>0) {for (var i=0;i<monthOptions.length;i++) {months += monthOptions[i].value+',';}}

                 if (monthOptions.length==0 || (cal.monthNames.join()+',')!=months)
                    {monthOptions.length = 0;

                     if (cal.monthNames.length<monthOptions.length) {monthOptions.length = cal.monthNames.length;}

                     for (var i=0;i<cal.monthNames.length;i++)
                        {if (i>monthOptions.length-1)
                              {monthOptions[i] = new Option(cal.monthNames[i],cal.monthNames[i]);}
                         else {monthOptions[i].innerHTML = cal.monthNames[i];}
                        }
                    }

                 for (var i=0;i<cal.weekInits.length;i++)
                    {getEl(calId+'WeekInit'+i).innerHTML = cal.weekInits[(i+cal.weekStart)%cal.weekInits.length];}

                 if (((new Date(cal.baseYear + cal.dropDownYears, 0, 0)) > dateNow &&
                      (new Date(cal.baseYear, 0, 0))                     < dateNow) ||
                     (cal.clearButton && (ele.readOnly || ele.disabled))
                    )   {getEl(calId+'Now').innerHTML = cal.today+' '+dateNow.jacsFormat(cal.dateDisplayFormat,cal.monthNames);
                         getEl(calId+'ClearButton').value   = cal.clear;
                         getEl(calId+'Foot').style.display = '';

                         if ((new Date(cal.baseYear + cal.dropDownYears, 0, 0)) > dateNow &&
                             (new Date(cal.baseYear, 0, 0))                     < dateNow)
                                {getEl(calId+'Now').style.display = '';
                                 if (cal.clearButton && (ele.readOnly || ele.disabled))
                                        {getEl(calId+'Clear').style.display   = '';
                                         getEl(calId+'Clear').style.textAlign = 'left';
                                         getEl(calId+'Now'  ).style.textAlign = 'right';
                                        }
                                 else   {getEl(calId+'Clear').style.display   = 'none';
                                         getEl(calId+'Now'  ).style.textAlign = 'center';
                                        }
                                }
                         else   {getEl(calId+'Clear').style.textAlign = 'center';
                                 getEl(calId+'Clear').style.display   = '';
                                 getEl(calId+'Now'  ).style.display   = 'none';
                                }
                        }
                 else   {getEl(calId+'Foot').style.display = 'none';}

                 // Calculate the number of months that the entered (or
                 // defaulted) month is after the start of the allowed
                 // date range.
                 cal.monthSum =  12*(cal.seedDate.getFullYear() - cal.baseYear) + cal.seedDate.getMonth();

                 // Set the drop down boxes.
                 getEl(calId+'Years').options.selectedIndex  = Math.floor(cal.monthSum/12);
                 getEl(calId+'Months').options.selectedIndex = (cal.monthSum%12);

                 getEl(calId).ele = ele;

                 // Display the month
                 showMonth(0,calId);

                 // Remember the Element
                 cal.targetEle = ele;

                 // Position the calendar box.
                 if (dynamic)
                    {// Check whether or not dragging is allowed and display drag handle if necessary
                     getEl(calId+'Drag').style.display = (cal.allowDrag)?'':'none';

                     var offsetTop  = parseInt(ele.offsetTop ,10),
                         offsetLeft = parseInt(ele.offsetLeft,10);

                     // The object sniffing for Opera allows for the fact that Opera
                     // is the only major browser that correctly reports the position
                     // of an element in a scrollable DIV.  This is because IE and
                     // Firefox omit the DIV from the offsetParent tree.
                     if (!window.opera)
                         {while (ele.tagName!='BODY' && ele.tagName!='HTML')
                             {offsetTop  -= parseInt(ele.scrollTop, 10);
                              offsetLeft -= parseInt(ele.scrollLeft,10);
                              ele = ele.parentNode;
                             }
                          ele = cal.targetEle;
                         }

                     while (ele.tagName!='BODY' && ele.tagName!='HTML')
                        {ele = ele.offsetParent;
                         offsetTop  += parseInt(ele.offsetTop, 10);
                         offsetLeft += parseInt(ele.offsetLeft,10);
                        }

                     ele = cal.targetEle;

                     var eleOffsetTop  = offsetTop,
                         eleOffsetLeft = offsetLeft;

                     if (cal.xBase.length>0)
                            {if (isNaN(cal.xBase))
                                    {cal.xBase = cal.xBase.toUpperCase();
                                     offsetLeft += (cal.xBase=='R')
                                                        ?parseInt(ele.offsetWidth,10)
                                                        :(cal.xBase=='M')?Math.round(parseInt(ele.offsetWidth,10)/2):0;
                                    }
                             else   {offsetLeft += parseInt(cal.xBase,10);}
                            }

                     if (cal.yBase.length>0)
                            {if (isNaN(cal.yBase))
                                    {cal.yBase  = cal.yBase.toUpperCase();
                                     offsetTop += (cal.yBase=='B')
                                                    ?parseInt(ele.offsetHeight,10)
                                                    :(cal.yBase=='M')?Math.round(parseInt(ele.offsetHeight,10)/2):0;
                                    }
                             else   {offsetTop += parseInt(cal.yBase,10);}
                            }
                     else   {offsetTop += parseInt(ele.offsetHeight,10);}

                     if (cal.xPosition.length>0)
                            {if (isNaN(cal.xPosition))
                                    {cal.xPosition = cal.xPosition.toUpperCase();
                                     offsetLeft -= (cal.xPosition=='R')
                                                        ?parseInt(cal.offsetWidth,10)
                                                        :(cal.xPosition=='M')?Math.round(parseInt(cal.offsetWidth,10)/2):0;
                                    }
                             else   {offsetLeft += parseInt(cal.xPosition,10);}
                            }

                     if (cal.yPosition.length>0)
                            {if (isNaN(cal.yPosition))
                                    {cal.yPosition = cal.yPosition.toUpperCase();

                                     offsetTop -= (cal.yPosition=='B')
                                                        ?parseInt(cal.offsetHeight,10)
                                                        :(cal.yPosition=='M')?Math.round((parseInt(cal.offsetHeight,10))/2):0;
                                    }
                             else   {offsetTop += parseInt(cal.yPosition,10);}
                            }

                     if (cal.autoPosition)
                        {var width      = parseInt(cal.offsetWidth, 10),
                             height     = parseInt(cal.offsetHeight,10),
                             windowLeft =
                                 (document.body && document.body.scrollLeft)
                                      ?document.body.scrollLeft                  //DOM compliant
                                      :(document.documentElement && document.documentElement.scrollLeft)
                                          ?document.documentElement.scrollLeft   //IE6+ standards compliant
                                          :0,                                    //Failed
                             windowWidth =
                                  (typeof(innerWidth) == 'number')
                                      ?innerWidth                                //DOM compliant
                                      :(document.documentElement && document.documentElement.clientWidth)
                                          ?document.documentElement.clientWidth  //IE6+ standards compliant
                                          :(document.body && document.body.clientWidth)
                                              ?document.body.clientWidth         //IE non-compliant
                                              :0,                                //Failed
                             windowTop =
                                  (document.body && document.body.scrollTop)
                                      ?document.body.scrollTop                   //DOM compliant
                                      :(document.documentElement && document.documentElement.scrollTop)
                                          ?document.documentElement.scrollTop    //IE6+ standards compliant
                                          :0,                                    //Failed
                             windowHeight =
                                  (typeof(innerHeight) == 'number')
                                      ?innerHeight                               //DOM compliant
                                      :(document.documentElement && document.documentElement.clientHeight)
                                          ?document.documentElement.clientHeight //IE6+ standards compliant
                                          :(document.body && document.body.clientHeight)
                                              ?document.body.clientHeight        //IE non-compliant
                                              :0;                                //Failed

                         if (eleOffsetLeft + parseInt(ele.offsetWidth,10) - width >= windowLeft &&
                             offsetLeft + width > windowLeft + windowWidth
                            )       {offsetLeft = eleOffsetLeft + parseInt(ele.offsetWidth,10) - width;}
                         else if (eleOffsetLeft >= windowLeft && offsetLeft < windowLeft
                                 )  {offsetLeft = eleOffsetLeft;}

                         if (eleOffsetTop - height >= windowTop &&
                             offsetTop + height > windowTop + windowHeight
                            )       {offsetTop = eleOffsetTop - height;}
                         else if (offsetTop + height <= windowTop + windowHeight && offsetTop < windowTop)
                                    {offsetTop = eleOffsetTop + parseInt(ele.offsetHeight,10);}
                        }

                     cal.style.top  = offsetTop+'px';
                     cal.style.left = offsetLeft+'px';

                     getEl(calId+'Iframe').style.top    = offsetTop +'px';
                     getEl(calId+'Iframe').style.left   = offsetLeft+'px';

                     getEl(calId+'Iframe').style.width  = (cal.offsetWidth -(getEl('jacsIE')?2:4))+'px';
                     getEl(calId+'Iframe').style.height = (cal.offsetHeight-(getEl('jacsIE')?2:4))+'px';
                     getEl(calId+'Iframe').style.visibility = 'inherit';
                    }

                 // Show it on the page
                 cal.style.visibility = 'inherit';
                },

             make: function (calId)
                {cals.push(calId);

                 var dynamic = (typeof arguments[1]=='boolean')?arguments[1]:true;

                 TABLEjacs           = document.createElement('table');
                 TABLEjacs.id        = calId;
                 TABLEjacs.dynamic   = dynamic;
                 TABLEjacs.className = (dynamic)?'jacs':'jacsStatic';

                 calAttributes(TABLEjacs);

                 if (dynamic) {TABLEjacs.style.zIndex = TABLEjacs.zIndex+1;}

                 function cancel(evt)
                    {if (TABLEjacs.clickToHide) {hide(calId);}
                     stopPropagation(evt);
                    };

                 TBODYjacs                 = document.createElement('tbody');
                 TRjacs1                   = document.createElement('tr');
                 TRjacs1.className         = 'jacs';
                 TDjacs1                   = document.createElement('td');
                 TDjacs1.className         = 'jacs';
                 TABLEjacsHead             = document.createElement('table');
                 TABLEjacsHead.id          = calId+'Head';
                 TABLEjacsHead.cellSpacing = '0';
                 TABLEjacsHead.cellPadding = '0';
                 TABLEjacsHead.className   = 'jacsHead';
                 TABLEjacsHead.width       = '100%';

                 TBODYjacsHead             = document.createElement('tbody');

                 TRjacsDrag                = document.createElement('tr');
                 TRjacsDrag.id             = calId+'Drag';
                 TRjacsDrag.style.display  = 'none';

                 TDjacsDrag                = document.createElement('td');
                 TDjacsDrag.className      = 'jacsDrag';
                 TDjacsDrag.colSpan        = '4';

                 function beginDrag(evt)
                    {var elToDrag = getEl(calId);

                     var deltaX    = evt.clientX,
                         deltaY    = evt.clientY,
                         offsetEle = elToDrag;

                     while (offsetEle.tagName!='BODY' && offsetEle.tagName!='HTML')
                        {deltaX   -= parseInt(offsetEle.offsetLeft,10);
                         deltaY   -= parseInt(offsetEle.offsetTop ,10);
                         offsetEle = offsetEle.offsetParent;
                        }

                     if (document.addEventListener)
                            {elToDrag.addEventListener('mousemove',moveHandler,true);
                             elToDrag.addEventListener('mouseup',    upHandler,true);
                            }
                     else   {elToDrag.attachEvent('onmousemove', moveHandler);
                             elToDrag.attachEvent('onmouseup',     upHandler);
                             elToDrag.setCapture();
                            }

                     stopPropagation(evt);

                     function moveHandler(evt)
                        {if (!evt) {evt = window.event;}

                         elToDrag.style.left = (evt.clientX-deltaX)+'px';
                         elToDrag.style.top  = (evt.clientY-deltaY)+'px';

                         getEl(calId+'Iframe').style.left = (evt.clientX-deltaX)+'px';
                         getEl(calId+'Iframe').style.top  = (evt.clientY-deltaY)+'px';

                         stopPropagation(evt);
                        };

                     function upHandler(evt)
                        {if (!evt) {evt = window.event;}

                         if (document.removeEventListener)
                                {elToDrag.removeEventListener('mousemove',moveHandler,true);
                                 elToDrag.removeEventListener(  'mouseup',  upHandler,true);
                                }
                         else   {elToDrag.detachEvent('onmouseup',    upHandler);
                                 elToDrag.detachEvent('onmousemove',moveHandler);
                                 elToDrag.releaseCapture();
                                }

                         stopPropagation(evt);
                        };
                    };

                 DIVjacsDragText           = document.createElement('span');
                 DIVjacsDragText.id        = calId+'DragText';

                 TRjacsHead                = document.createElement('tr');
                 TRjacsHead.className      = 'jacsHead';

                 TDjacsHead1               = document.createElement('td');
                 TDjacsHead1.className     = 'jacsHead';

                 INPUTjacsHead1            = document.createElement('input');
                 INPUTjacsHead1.className  = 'jacsHead';
                 INPUTjacsHead1.id         = calId+'HeadLeft';
                 INPUTjacsHead1.type       = 'button';
                 INPUTjacsHead1.tabIndex   = '-1';
                 INPUTjacsHead1.value      = '<';
                 INPUTjacsHead1.onclick    = function() {showMonth(-1,calId);}

                 TDjacsHead2               = document.createElement('td');
                 TDjacsHead2.className     = 'jacsHead';

                 SELECTjacsHead2           = document.createElement('select');
                 SELECTjacsHead2.className = 'jacsHead';
                 SELECTjacsHead2.id        = calId+'Months';
                 SELECTjacsHead2.tabIndex  = '-1';
                 SELECTjacsHead2.onchange  = function() {showMonth(0,calId);}

                 TDjacsHead3               = document.createElement('td');
                 TDjacsHead3.className     = 'jacsHead';

                 SELECTjacsHead3           = document.createElement('select');
                 SELECTjacsHead3.className = 'jacsHead';
                 SELECTjacsHead3.id        = calId+'Years';
                 SELECTjacsHead3.tabIndex  = '-1';
                 SELECTjacsHead3.onchange  = function() {showMonth(0,calId);}

                 TDjacsHead4               = document.createElement('td');
                 TDjacsHead4.className     = 'jacsHead';

                 INPUTjacsHead4            = document.createElement('input');
                 INPUTjacsHead4.className  = 'jacsHead';
                 INPUTjacsHead4.id         = calId+'HeadRight';
                 INPUTjacsHead4.type       = 'button';
                 INPUTjacsHead4.tabIndex   = '-1';
                 INPUTjacsHead4.value      = '>';
                 INPUTjacsHead4.onclick    = function() {showMonth(1,calId);}

                 TRjacs2                   = document.createElement('tr');
                 TRjacs2.className         = 'jacs';

                 TDjacs2                   = document.createElement('td');
                 TDjacs2.className         = 'jacs';

                 TABLEjacsCells            = document.createElement('table');
                 TABLEjacsCells.className  = 'jacsCells';
                 TABLEjacsCells.align      = 'center';
                 TABLEjacsCells.width      = '100%';

                 THEADjacsCells            = document.createElement('thead');
                 TRjacsCells               = document.createElement('tr');
                 TDjacsCells               = document.createElement('td');
                 TDjacsCells.className     = 'jacsWeekNumberHead';
                 TDjacsCells.id            = calId+'Week_';

                 TABLEjacs.appendChild(TBODYjacs);
                 TBODYjacs.appendChild(TRjacs1);
                    TRjacs1.appendChild(TDjacs1);
                        TDjacs1.appendChild(TABLEjacsHead);
                            TABLEjacsHead.appendChild(TBODYjacsHead);
                                 TBODYjacsHead.appendChild(TRjacsDrag);
                                    TRjacsDrag.appendChild(TDjacsDrag);
                                        TDjacsDrag.appendChild(DIVjacsDragText);
                                 TBODYjacsHead.appendChild(TRjacsHead);
                                    TRjacsHead.appendChild(TDjacsHead1);
                                        TDjacsHead1.appendChild(INPUTjacsHead1);
                                    TRjacsHead.appendChild(TDjacsHead2);
                                        TDjacsHead2.appendChild(SELECTjacsHead2);
                                    TRjacsHead.appendChild(TDjacsHead3);
                                        TDjacsHead3.appendChild(SELECTjacsHead3);
                                    TRjacsHead.appendChild(TDjacsHead4);
                                        TDjacsHead4.appendChild(INPUTjacsHead4);
                 TBODYjacs.appendChild(TRjacs2);
                    TRjacs2.appendChild(TDjacs2);
                        TDjacs2.appendChild(TABLEjacsCells);
                            TABLEjacsCells.appendChild(THEADjacsCells);
                                THEADjacsCells.appendChild(TRjacsCells);
                                    TRjacsCells.appendChild(TDjacsCells);

                                    for (var i=0;i<7;i++)
                                        {TDjacsCells           = document.createElement('td');
                                         TDjacsCells.className = 'jacsWeek';
                                         TDjacsCells.id        = calId+'WeekInit'+i;
                                         TRjacsCells.appendChild(TDjacsCells);
                                        }

                            TBODYjacsCells    = document.createElement('tbody');
                            TBODYjacsCells.id = calId+'Cells';

                            TABLEjacsCells.appendChild(TBODYjacsCells);

                            for (var i=0;i<6;i++)
                                {TRjacsCells              = document.createElement('tr');
                                 TBODYjacsCells.appendChild(TRjacsCells);

                                    TDjacsCells           = document.createElement('td');
                                    TDjacsCells.className = 'jacsWeekNo';
                                    TDjacsCells.id        = calId+'Week_'+i;
                                    TRjacsCells.appendChild(TDjacsCells);

                                    for (var j=0;j<7;j++)
                                        {TDjacsCells           = document.createElement('td');
                                         TDjacsCells.className = 'jacsCells';
                                         TDjacsCells.id        = calId+'Cell_'+(j+(i*7));
                                         TRjacsCells.appendChild(TDjacsCells);
                                        }
                                }

                 TFOOTjacsFoot           = document.createElement('tfoot');
                 TABLEjacsCells.appendChild(TFOOTjacsFoot);

                    TRjacsFoot              = document.createElement('tr');
                    TRjacsFoot.id           = calId+'Foot';
                    TFOOTjacsFoot.appendChild(TRjacsFoot);

                    TDjacsFoot               = document.createElement('td');
                    TDjacsFoot.colSpan       = '8';
                    TDjacsFoot.style.padding = '0px';
                    TRjacsFoot.appendChild(TDjacsFoot);

                        TABLEjacsFootDetail = document.createElement('table');
                        TABLEjacsFootDetail.style.width = '100%';
                        TABLEjacsFootDetail.cellSpacing = '0';
                        TABLEjacsFootDetail.cellPadding = '0';
                        TDjacsFoot.appendChild(TABLEjacsFootDetail);

                            TBODYjacsFootDetail = document.createElement('tbody');
                            TABLEjacsFootDetail.appendChild(TBODYjacsFootDetail);

                                TRjacsFootDetail = document.createElement('tr');
                                TBODYjacsFootDetail.appendChild(TRjacsFootDetail);

                                    TDjacsFootDetail           = document.createElement('td');
                                    TDjacsFootDetail.className = 'jacsClear';
                                    TDjacsFootDetail.id        = calId+'Clear';
                                    TDjacsFootDetail.style.padding = '0px';
                                    TRjacsFootDetail.appendChild(TDjacsFootDetail);

                                        INPUTjacsClearButton           = document.createElement('input');
                                        INPUTjacsClearButton.type      = 'button';
                                        INPUTjacsClearButton.id        = calId+'ClearButton';
                                        INPUTjacsClearButton.className = 'Clear';
                                        INPUTjacsClearButton.style.textAlign = 'center';
                                        INPUTjacsClearButton.onclick   = function() {cal.targetEle.value='';hide(calId);};
                                        TDjacsFootDetail.appendChild(INPUTjacsClearButton);

                                    TDjacsNow                 = document.createElement('td');
                                    TDjacsNow.className       = 'jacsNow';
                                    TDjacsNow.id              = calId+'Now';
                                    TDjacsNow.style.padding   = '0px';
                                    TRjacsFootDetail.appendChild(TDjacsNow);

                 if (TABLEjacs.clickToHide)
                    {if (document.addEventListener)
                            {      TABLEjacs.addEventListener('click',    cancel,         false);
                                   TABLEjacs.addEventListener('change',   cancel,         false);
                                  TDjacsDrag.addEventListener('mousedown',beginDrag,      false);
                              INPUTjacsHead1.addEventListener('click',    stopPropagation,false);
                             SELECTjacsHead2.addEventListener('click',    stopPropagation,false);
                             SELECTjacsHead2.addEventListener('change',   stopPropagation,false);
                             SELECTjacsHead3.addEventListener('click',    stopPropagation,false);
                             SELECTjacsHead3.addEventListener('change',   stopPropagation,false);
                              INPUTjacsHead4.addEventListener('click',    stopPropagation,false);
                              TBODYjacsCells.addEventListener('click',    stopPropagation,false);
                            }
                     else   {      TABLEjacs.attachEvent('onclick',    cancel);
                                   TABLEjacs.attachEvent('onchange',   cancel);
                                  TDjacsDrag.attachEvent('onmousedown',beginDrag);
                              INPUTjacsHead1.attachEvent('onclick',    stopPropagation);
                             SELECTjacsHead2.attachEvent('onclick',    stopPropagation);
                             SELECTjacsHead2.attachEvent('onchange',   stopPropagation);
                             SELECTjacsHead3.attachEvent('onclick',    stopPropagation);
                             SELECTjacsHead3.attachEvent('onchange',   stopPropagation);
                              INPUTjacsHead4.attachEvent('onclick',    stopPropagation);
                              TBODYjacsCells.attachEvent('onclick',    stopPropagation);
                            }
                    }
                 else
                    {if (document.addEventListener)
                        {      TABLEjacs.addEventListener('click',    stopPropagation,false);
                               TABLEjacs.addEventListener('change',   stopPropagation,false);
                              TDjacsDrag.addEventListener('mousedown',beginDrag,      false);
                        }
                     else
                        {      TABLEjacs.attachEvent('onclick',    stopPropagation);
                               TABLEjacs.attachEvent('onchange',   stopPropagation);
                              TDjacsDrag.attachEvent('onmousedown',beginDrag);
                        }
                    }

                 if (dynamic)
                        {iFrame = document.createElement('iframe');

                         iFrame.className    = 'jacs';
                         iFrame.id           = calId+'Iframe';
                         if (getEl('jacsIElt7')) {iFrame.src = '/jacsblank.html';}
                         iFrame.name         = 'jacsIframe';
                         iFrame.frameborder  = '0';
                         iFrame.style.zIndex = TABLEjacs.zIndex;

                         document.body.insertBefore(iFrame, document.body.firstChild);
                         document.body.insertBefore(TABLEjacs, iFrame);
                        }
                 else   {if (!getEl('jacsSpan'+calId)) {document.writeln("<span id='jacsSpan"+calId+"'></span>");}
                         getEl('jacsSpan'+calId).appendChild(TABLEjacs);
                        }
                },

             cals: function ()  {return cals;},
             next: function ()
                {if (typeof arguments[0]=='string')
                        {calID       = arguments[0];
                         inFunc      = arguments[1];
                         argPosition = 2;
                        }
                 else   {calID       = 'jacs';
                         inFunc      = arguments[0];
                         argPosition = 1;
                        }

                 if (getEl(calID))
                    {// Take the arguments to be passed through to the defined function.

                     var args = new Array();

                     for (var i=argPosition;i<arguments.length;i++) {args.push(arguments[i]);}

                     // Pass them through to jacsRunNext

                     newFunc = inFunc.jacsRunNext(args,calID);

                     // If the function has already been set, clear the old
                     // function and set the new one (mostly relevant for dynamic
                     // calendars but refreshing the function for static calendars
                     // caters for dynamic parameters).

                     var cal = getEl(calID);

                     if (cal.dynamic) {cal.arrOnNext.push(newFunc);}
                     else             {cal.onNext = newFunc;}
                    }
                 else
                    {alert('ERROR: Calendar object <<' + calID + '>> does not exist.\n' +
                           'Please check that the calendar object id is correct\n' +
                           'and that JACS.show is called before JACS.next.');
                    }
                }
            };
    };

// ******************************
// End of Public Function Library
// ******************************************************
// End of Javascript Advanced Calendar Script (JACS) Code
// ******************************************************