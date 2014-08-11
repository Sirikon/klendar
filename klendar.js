/*  _   ___                _            
 * | | / / |              | |           
 * | |/ /| | ___ _ __   __| | __ _ _ __ 
 * |    \| |/ _ \ '_ \ / _` |/ _` | '__|
 * | |\  \ |  __/ | | | (_| | (_| | |   
 * \_| \_/_|\___|_| |_|\__,_|\__,_|_|   
 *    Carlos Fernández Llamas (@sirikon)
 */
'use strict';

// Extend HTMLElement with the property 'klendar'
HTMLElement.prototype.klendar = null;
HTMLElement.prototype.date = null;

// Some needed functions
Date.prototype.increaseMonth = function(inc){
	var initMonth = this.getMonth();
	this.setMonth(initMonth+inc)
	if (this.getMonth() != initMonth+inc){
		this.setMonth(initMonth+inc)
	}
}

var klendari18n = {
	'es': {
		monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		weekDayChars: ['L','M','X','J','V','S','D'],
	},
	'en': {
		monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
		weekDayChars: ['M','T','W','T','F','S','S'],
	}
}

var klendarStatics = {
	getMonthNames: function(){
		var i18n = this.geti18n();
		return i18n.monthNames;
	},
	getWeekDayChars: function(){
		var i18n = this.geti18n();
		return i18n.weekDayChars;
	},
	geti18n: function(){
		var lang = this.getBrowserLanguage();
		if ( klendari18n[lang] ){
			return klendari18n[lang];
		}else if( klendari18n[lang.split('-')[0]] ){
			return klendari18n[lang.split('-')[0]];
		}else{
			return klendari18n['en'];
		}
	},
	getBrowserLanguage: function(){
		return navigator.language || navigator.userLanguage || 'en';
	}
}

// klendar class
var klendar = function(element,daycontroller){
	// Create vars for storing days and days custom data
	this.days = {};
	this.daysData = {};
	this.dayController = function(d){return d;};

	// When klendar is instantiated, make anchor
	this.element = element;

	// Check if a daycontroller was passed as argument
	if(daycontroller){ this.dayController = daycontroller; }
	
	// CONSTRUCT
	this.__construct__ = function(){
		this.element.klendar = this;
		this.element.className += ' klendar';
		this.actual = new Date(this.element.getAttribute('data-actual') || Date.now());
		this.drawStruct();
		this.drawMonth(new Date(this.actual.getTime()));
	};

	// Backwards to previous month
	this.prevMonth = function(){
		var newmonth = this.actualMonth;
		newmonth.increaseMonth(-1);
		this.drawMonth(newmonth);
	};

	// Forwards to next month
	this.nextMonth = function(){
		var newmonth = this.actualMonth;
		newmonth.increaseMonth(1);
		this.drawMonth(newmonth);
	};

	// Draw struct
	this.drawStruct = function(){
		// Anchor, for callbacks later
		var anchor = this;

		// Header Element
		var header = document.createElement('div');
		header.className = 'klendar-header';

		// Header Span
		var headspan = document.createElement('span');

		// Left and Right buttons to nav thru months
		var btnLeft = document.createElement('button');
		btnLeft.className = "klendar-prev";
		btnLeft.textContent = '<';
		btnLeft.addEventListener('click', function(e){
			e.preventDefault();
			anchor.prevMonth();
		});

		var btnRight = document.createElement('button');
		btnRight.className = "klendar-next";
		btnRight.textContent = '>';
		btnRight.addEventListener('click', function(e){
			e.preventDefault();
			anchor.nextMonth();
		});

		// Month view table element
		var month = document.createElement('table');
		month.className = 'klendar-month';
		month.setAttribute('border',0);
		month.setAttribute('cellspacing',0);

		// Day Chars Element
		var daychars = document.createElement('table');
		daychars.className = 'klendar-daychars';
		daychars.setAttribute('border',0);
		daychars.setAttribute('cellspacing',0);

		// Empty the element
		this.element.innerHTML = '';

		// Append header elements defined below
		header.appendChild(btnLeft);
		header.appendChild(headspan);
		header.appendChild(btnRight);

		// Append the header
		this.element.appendChild(header);

		// Create and append each weekday's fields
		for(var i=0;i<7;i++){
			daychars.appendChild(this.createCell(klendarStatics.getWeekDayChars()[i]));
		}

		// Append elements
		this.element.appendChild(daychars);
		this.element.appendChild(month);

		// Save as a var in element's object structure
		this.element.headerView = headspan;
		this.element.monthView = month;
	}

	// Draws the given date's month
	this.drawMonth = function(d){
		// Define year and month vars
		var year 	= d.getFullYear();
		var month 	= d.getMonth()+1+'';
		this.actualMonth = d;
		if(month.length < 2){
			month = '0' + month;
		}
		var dayOne = new Date(
				''+
				year+'-'+
				month+'-01T12:00:00'
			)
		window.thedate = dayOne;

		// Empty monthView
		this.element.monthView.innerHTML = '';
		// Put month name + year in headerView
		this.element.headerView.textContent = klendarStatics.getMonthNames()[d.getMonth()] + ' ' + year;

		var cellList = [];
		for(var i=0;i< ((dayOne.getDay()+6)%7) ;i++){
			// Create empty cells for offset
			cellList.push(this.createCell(''));
		}

		// Calc month's last day
		var sandboxDate = new Date(d.getTime());
		sandboxDate.setMonth(sandboxDate.getMonth()+1);
		sandboxDate.setDate(1);
		sandboxDate.setDate(sandboxDate.getDate()-1);

		// For each day in the month...
		for(i=0;i<sandboxDate.getDate();i++){
			var newCell = this.createDayCell(i+1);
			// If newCell is the actual day's cell...
			if((i+1) == this.actual.getDate() && this.actual.getMonth() == d.getMonth() && this.actual.getFullYear() == d.getFullYear()){
				newCell.isActual = true;
				newCell.className += ' actual';
			}else{
				newCell.isActual = false;
			}
			var dayText = (i+1)+'';
			if(dayText.length < 2){
				dayText = '0' + dayText;
			}

			// If the day has data, save it in the object structure
			if(this.daysData[''+year+'-'+month+'-'+dayText]){
				var thisdaydata = this.daysData[''+year+'-'+month+'-'+dayText]
				for(var key in thisdaydata){
					newCell[key] = thisdaydata[key];
				}
			}
			newCell.date = {};
			newCell.date.year = parseInt(year);
			newCell.date.month = parseInt(month);
			newCell.date.day = parseInt(dayText);

			// Save day's cell in days store
			this.days[''+year+'-'+month+'-'+dayText] = newCell;

			// Append to cellList
			cellList.push(newCell);
		}

		// Day drawing counter
		var c = 0;
		// Initial row
		var row = document.createElement('tr');
		for(i=0;i<cellList.length;i++){
			if(c == 7){
				this.element.monthView.appendChild(row);
				row = document.createElement('tr');
				c = 0;
			}
			if(cellList[i].date){
				cellList[i].date.weekDay = c;
			}

			// Run controller
			cellList[i] = this.dayController(cellList[i]);
			row.appendChild(cellList[i]);
			c++;
		}
		if(c > 0){
			this.element.monthView.appendChild(row);
		}
	}

	// Create a day cell
	this.createDayCell = function(n){
		var dc = document.createElement('td');
		dc.textContent = n;
		return dc;
	}

	// Create a simple cell
	this.createCell = function(t){
		var c = document.createElement('td');
		c.textContent = t;
		return c;
	}

	// Sets the given data of a given day
	this.set = function(day, data){
		if(!this.daysData[day]){
			this.daysData[day] = {};
		}
		for(var key in data){
			this.daysData[day][key] = data[key];
			if(this.days[day]){
				this.days[day][key] = data[key];
			}
		}
		if(this.days[day]){
			this.days[day] = this.dayController(this.days[day]);
		}
		//this.__construct__();
	}

	// Call construct
	this.__construct__();
};