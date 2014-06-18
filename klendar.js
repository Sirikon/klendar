/*  _   ___                _            
 * | | / / |              | |           
 * | |/ /| | ___ _ __   __| | __ _ _ __ 
 * |    \| |/ _ \ '_ \ / _` |/ _` | '__|
 * | |\  \ |  __/ | | | (_| | (_| | |   
 * \_| \_/_|\___|_| |_|\__,_|\__,_|_|   
 *    Carlos Fernández Llamas (@sirikon)
 */

// Extend HTMLElement with the property 'klendar'
HTMLElement.prototype.klendar = null;
HTMLElement.prototype.date = null;

var klendarStatics = {
	monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
	weekDayChars: ['L','M','X','J','V','S','D']
}

// klendar class
var klendar = function(element,daycontroller){
	// When klendar is instantiated, make anchor
	this.element = element;

	// Check if a daycontroller was passed as argument
	this.dayController = function(d){return d;};
	if(daycontroller){
		this.dayController = daycontroller;
	}

	// Create vars for storing days and days custom data
	this.days = {};
	this.daysData = {};
	
	// CONSTRUCT
	this.__construct__ = function(){
		this.element.klendar = this;
		this.element.className += ' klendar';
		this.actual = new Date(this.element.dataset.actual || Date.now());
		this.drawStruct();
		this.drawMonth(new Date(this.actual.getTime()));
	};

	// Backwards to previous month
	this.prevMonth = function(){
		var newmonth = this.actualMonth;
		newmonth.setMonth(newmonth.getMonth()-1);
		this.drawMonth(newmonth);
	};

	// Forwards to next month
	this.nextMonth = function(){
		var newmonth = this.actualMonth;
		newmonth.setMonth(newmonth.getMonth()+1);
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
		btnLeft.addEventListener('click', function(){
			anchor.prevMonth();
		});
		var btnRight = document.createElement('button');
		btnRight.className = "klendar-next";
		btnRight.textContent = '>';
		btnRight.addEventListener('click', function(){
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
		for(i=0;i<7;i++){
			daychars.appendChild(this.createCell(klendarStatics.weekDayChars[i]));
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
		var year = d.getFullYear();
		var month = d.getMonth()+1+'';
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
		this.element.headerView.textContent = klendarStatics.monthNames[d.getMonth()] + ' ' + year;

		var cellList = [];
		for(i=0;i< ((dayOne.getDay()+6)%7) ;i++){
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