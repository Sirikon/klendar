klendar
=======
The customizable Calendar Widget with API

## Install ##
Just include the files into bin folder in your HTML

```html
<script type="text/javascript" src="klendar.min.js"></script>
<link rel="stylesheet" href="klendar.min.css" />
```

## Use ##
Include in your HTML, anywhere into body tag, a tag like this one:

```html
<div id="mycalendar" data-actual="2014-06-05" class="klendar-scale">
	...
</div>
```

__data-actual__: (Optional) Defines the day marked as 'actual' in the calendar. Default: Date.now()
__(class) klendar-scale__: (Optional) A klendar element with this class auto-resizes its components to fill the container

Then, all you need to do is create a new klendar this way in Javascript:

```javascript
window.mycalendar = new klendar(document.getElementById('mycalendar'), function(day){
	// Write here your day controller
	// Here you have access to the day's cell in the table to manipulate it as you want
	// Also have access to .isActual property to check if the given day is the actual day:
	if(day.isActual){
		day.textContent = 'Today!';
	}
});
```

## API ##
__klendar.set(string day, object data)__: Sets the given data of a given day

You can access this properties using the day controller:

```javascript
window.mycalendar = new klendar(document.getElementById('mycalendar'), function(day){
	if(day.awesomeLevel){
		if(day.awesomeLevel > 9000){
			day.textContent = "It's over 9000!";
		}
	}
});
window.mycalendar.set('2014-06-10', {awesomeLevel: 9300});
```