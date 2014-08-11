window.mycalendar = new klendar(document.getElementById('mycalendar'), function(day){
	if(day.isActual){
		day.textContent = ('¡' + day.textContent + '!');
	}
	if(day.customData){
		day.textContent = day.customData;
		day.setAttribute('style','color:pink;')
	}
	if(day.date){
		if(day.date.weekDay == 2){
			day.setAttribute('style','color:red;')
		}
	}
	return day;
});
mycalendar.set('2014-08-20', {customData: 'e.e'});