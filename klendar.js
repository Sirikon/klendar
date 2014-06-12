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

var klendarStatics = {
	monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
	weekDayChars: ['L','M','X','J','V','S','D']
}

// klendar class
var klendar = function(element,daycontroller){
	// When klendar is instantiated, make anchor
	this.element = element;
	this.dayController = function(d){return d;};
	if(daycontroller){
		this.dayController = daycontroller;
	}

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

	this.prevMonth = function(){
		var newmonth = this.actualMonth;
		newmonth.setMonth(newmonth.getMonth()-1);
		this.drawMonth(newmonth);
	};

	this.nextMonth = function(){
		var newmonth = this.actualMonth;
		newmonth.setMonth(newmonth.getMonth()+1);
		this.drawMonth(newmonth);
	};

	// Draw struct
	this.drawStruct = function(){
		var anchor = this;
		var header = document.createElement('div');
		header.className = 'klendar-header';
		var month = document.createElement('table');
		month.className = 'klendar-month';
		month.setAttribute('border',0);
		month.setAttribute('cellspacing',0);
		var daychars = document.createElement('table');
		daychars.className = 'klendar-daychars';
		daychars.setAttribute('border',0);
		daychars.setAttribute('cellspacing',0);
		var headspan = document.createElement('span');
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
		this.element.innerHTML = '';
		header.appendChild(btnLeft);
		header.appendChild(headspan);
		header.appendChild(btnRight);
		this.element.appendChild(header);
		for(i=0;i<7;i++){
			daychars.appendChild(this.createCell(klendarStatics.weekDayChars[i]));
		}
		this.element.appendChild(daychars);
		this.element.appendChild(month);
		this.element.headerView = headspan;
		this.element.monthView = month;
	}

	// Draw Month
	this.drawMonth = function(d){
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
		this.element.monthView.innerHTML = '';
		this.element.headerView.textContent = klendarStatics.monthNames[d.getMonth()] + ' ' + year;

		var cellList = [];
		for(i=0;i< ((dayOne.getDay()+6)%7) ;i++){
			cellList.push(this.createCell(''));
		}
		var sandboxDate = new Date(this.actual.getTime());
		sandboxDate.setMonth(sandboxDate.getMonth()+1);
		sandboxDate.setDate(1);
		for(i=0;i<31;i++){
			var newCell = this.createDayCell(i+1);
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
			if(this.daysData[''+year+'-'+month+'-'+dayText]){
				var thisdaydata = this.daysData[''+year+'-'+month+'-'+dayText]
				for(var key in thisdaydata){
					newCell[key] = thisdaydata[key];
				}
			}
			newCell = this.dayController(newCell);
			this.days[''+year+'-'+month+'-'+dayText] = newCell;
			cellList.push(newCell);
		}
		var c = 0;
		var row = document.createElement('tr');
		for(i=0;i<cellList.length;i++){
			if(c == 7){
				this.element.monthView.appendChild(row);
				row = document.createElement('tr');
				c = 0;
			}
			row.appendChild(cellList[i]);
			c++;
		}
		if(c > 0){
			this.element.monthView.appendChild(row);
		}
	}

	this.createDayCell = function(n){
		var dc = document.createElement('td');
		dc.textContent = n;
		return dc;
	}

	this.createCell = function(t){
		var c = document.createElement('td');
		c.textContent = t;
		return c;
	}

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