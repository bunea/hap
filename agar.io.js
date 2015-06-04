
ga('create', 'UA-63127164-1', 'auto', {'name': 'newTracker'});  // New tracker.

ga('newTracker.send', 'pageview'); // Send page view for new tracker.

$('#settings > div').append('<label><input type="checkbox" onchange="external.UseJoystick($(this).is(\':checked\') ? 1 : 0)" id="joystick"> Use Joystick instead of accelerometer</label>');

var saveStatesFor = {
	'name': $('#nick'),
	'region': $('#region'),
	'gamemode': $('#gamemode'),
	'darktheme': $('#settings input').eq(2),
	'joystick': $('#joystick')
};
var checkboxStates = {'darktheme': true, 'joystick': true};
var playerDead = 1;
var pid = 2;

var playerStateChanged = function(){
	var isVisible = $('#overlays').is(':visible');
	if(isVisible && playerDead == 0) {
		playerDied();
	} else if( ! isVisible && playerDead == 1) {
		playerStarted();
	}
};

var playerDied = function() {
	playerDead = 1;
	ga('newTracker.send', 'event', 'dead', 1); // Send page view for new tracker.
	external.PlayerDead(pid);
}

var playerStarted = function() {
	playerDead = 0;
	external.PlayerStarted();
	// save settings in localstorage
	var state = {};
	for(var stateName in saveStatesFor) {
		state[stateName] = (typeof checkboxStates[stateName] == "undefined") ? saveStatesFor[stateName].val() : saveStatesFor[stateName].is(':checked');
	}
	localStorage.setItem('config', JSON.stringify(state));
}

var setMouseCoords = function(x, y) {
	canvas.onmousemove({clientX: x, clientY: y});
}

var splitPlayer = function() {
	window.onkeydown({keyCode: 32});
}

var exitGame = function() {
	window.onkeydown({keyCode: 27});
}

var ejectMass = function() {
	window.onkeydown({keyCode: 87});
}

var savedState = localStorage.getItem('config');
if(savedState) {
	savedState = JSON.parse(savedState);
	if(savedState) {
		for(var stateName in savedState) {
			if(typeof checkboxStates[stateName] == "undefined") {
				saveStatesFor[stateName].val(savedState[stateName]);
				saveStatesFor[stateName].change();
			} else {
				if(savedState[stateName]) {
					saveStatesFor[stateName].click();
				}
			}
		}
	}
}


$('body').on('touchmove', function (event) {
  // event.preventDefault();
}, false);
//
// remove "Hello" title
// $('#overlays').find('.form-group').eq(0).remove();
// remove "add nick" sentence
// $('#overlays').find('.form-group p').eq(0).remove();
// remove settings button
$('.btn-settings').remove();
// remove spectate button
$('.btn-spectate').remove();
// remove skins label
$('#settings label').eq(0).hide();
// disable skins
setSkins(false);
// remove "no names" label
$('#settings label').eq(1).hide();
// enable names
setNames(true);

// remove no colors label
$('#settings label').eq(3).hide();
setColors(false);
// remove "show mass" label
$('#settings label').eq(4).hide();
// enable show mass
setShowMass(true);

$('head').append('<style>#helloDialog {margin: 10px auto !important;position: absolute;top: 80%; left: 50%;overflow-y: scroll; padding-top: 15px !important;} #settings{display:block !important;}.btn-play {width: 100% !important;} .text-muted {color:#000;}#settings label, #settings input {line-height: 25px;position:relative;}</style>')
// $('head').append('<link href="http://localhost/agar_android.css" rel="stylesheet">')
$('span.text-muted').html('<img style="float:left;" src="https://s3.eu-central-1.amazonaws.com/agario/bfbdd805-81cd-4970-8df9-6e202538948f+copy.png" /> Use the phone sensors to move arround or select "Use Joystick instead of accelerometer" if it\'s more confortable for you');

$('#instructions').next().hide().next().hide();

if($('#cf_alert_div').length == 0) {
	external.ShowWebView();
	setTimeout(function(){
		console.log(canvas.width + " - " + canvas.height);
		external.Start(pid, canvas.width, canvas.height);
		setInterval(playerStateChanged, 100);
	}, 400);
}
