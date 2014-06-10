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
var klendar = function(element){
	// When klendar is instantiated, make anchor
	this.element = element;

	// CONSTRUCT
	this.__construct__ = function(){
		this.element.klendar = this;
		this.element.className += ' klendar';
		this.today = new Date(this.element.dataset.today || Date.now());
		console.log(this.today);
		this.drawStruct();
		this.drawMonth(this.today);
	};

	// Draw struct
	this.drawStruct = function(){
		var header = document.createElement('div');
		header.className = 'klendar-header';
		var month = document.createElement('div');
		month.className = 'klendar-month';
		var daychars = document.createElement('div');
		this.element.innerHTML = '';
		this.element.appendChild(header);
		for(i=0;i<7;i++){
			daychars.appendChild(this.createDayCell(klendarStatics.weekDayChars[i]));
		}
		this.element.appendChild(daychars);
		this.element.appendChild(month);
		this.element.headerView = header;
		this.element.monthView = month;
	}

	// Draw Month
	this.drawMonth = function(d){
		var year = d.getFullYear();
		var month = d.getMonth()+1+'';
		if(month.length < 2){
			month = '0' + month;
		}
		var dayOne = new Date(
				''+
				year+'-'+
				month+'-01T12:00:00'
			)
		console.log(dayOne);
		window.thedate = dayOne;
		this.element.querySelector('div.klendar-month').innerHTML = '';
		this.element.headerView.innerText = klendarStatics.monthNames[d.getMonth()];
		for(i=0;i< ((dayOne.getDate()+5)%7) ;i++){
			this.element.monthView.appendChild(this.createDayCell(''));
		}
		for(i=0;i<31;i++){
			this.element.monthView.appendChild(this.createDayCell(i+1));
		}
	}

	this.createDayCell = function(n){
		var dc = document.createElement('div');
		dc.className = 'klendar-day-cell';
		dc.innerText = n;
		return dc;
	}

	// Call construct
	this.__construct__();
};