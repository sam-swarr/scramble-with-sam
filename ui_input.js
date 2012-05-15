var currentInput = -1;

var currentClick = -1;

var wordsArray;

// 0 = no multiplier, 1 = double letter, 2 = double word, 3 = triple letter, 4 = triple word
var multipliers = new Array(16);
for (var i = 0; i < multipliers.length; i++) {
	multipliers[i] = 0;
}

function setCurrentInput(i) {
	currentInput = i;
}

function inputClick(i) {
	if (currentClick === i) {
		multipliers[i] = (multipliers[i] + 1)%5;
		$('#' + currentClick).val(multipliers[i]);
	}
	currentClick = i;
}

document.onkeyup = function(e) { 
	// key a-z and an input is selected
	if (e.which >= 65 && e.which <= 90 && currentInput >= 0 && currentInput < 16) {
		$('#' + currentInput).val(String.fromCharCode(e.which).toLowerCase());
		if ($('#autotab').is(":checked")) {
			$('#' + currentInput).blur();
			currentInput++;
			$('#' + currentInput).focus();
		}
	}
	else if (e.which === 50 && currentInput >= 0 && currentInput < 16) {
		if (multipliers[currentInput] < 3) {
			multipliers[currentInput] = (multipliers[currentInput] + 1)%3;
		} else {
			multipliers[currentInput] = 1;
		}
		$('#' + currentInput).val(multipliers[currentInput]);
	}
	else if (e.which === 51 && currentInput >= 0 && currentInput < 16) {
		if (multipliers[currentInput] > 2) {
			multipliers[currentInput] = (multipliers[currentInput] + 1)%5;
		} else {
			multipliers[currentInput] = 3;
		}
		$('#' + currentInput).val(multipliers[currentInput]);
	}
	else {
		$('#' + currentInput).val('');
	}
	
	// Enter key
	if (e.which === 13) {
		submit();
	}
	currentClick = -1;
}

function submit() {
	//make sure all letters are filled in with chars a-z
	if (allLettersValid()) {
		// construct the string of 16 letters
		var l = '';
		for (var i = 0; i < 16; i++) {
			l += $('#' + i).val();
		}
		
		// construct the string of 16 letter multipliers
		var lm = '';
		for (var i = 0; i < 16; i++) {
			var currMult = '1';
			if (multipliers[i] === 1) {
				currMult = '2';
			}
			if (multipliers[i] === 3) {
				currMult = '3';
			}
			lm += currMult;
		}
		
		// construct the string of 16 word multipliers
		var wm = '';
		for (var i = 0; i < 16; i++) {
			var currMult = '1';
			if (multipliers[i] === 2) {
				currMult = '2';
			}
			if (multipliers[i] === 4) {
				currMult = '3';
			}
			wm += currMult;
		}
		
		$.ajax({
			type: "GET",
			url: "solve.php",
			data: { l: l, lm: lm, wm: wm }
		}).done(function(output) {
			wordsArray = jQuery.parseJSON(output);
			wordsArray.sort(compareWordsByPoints);
			wordsToHTML(wordsArray);
		});
		
	} else {
		alert("Please make sure every square is assigned a letter a-z.");
	}
}

function wordsToHTML(wordsArray) {
	$( "#results" ).html(			
		"<tr>" +
			"<td>Word</td>" +
			"<td>Length</td>" +
			"<td>Points</td>" +
		"</tr>");
	for (var i = 0; i < this.wordsArray.length; i++) {
		$( "#results" ).append(			
			"<tr>" +
				"<td>" + this.wordsArray[i][0] + "</td>" +
				"<td>" + this.wordsArray[i][0].length + "</td>" + 
				"<td>" + this.wordsArray[i][1] + "</td>" +
			"</tr>");
	}
}

// function to compare words in the form [<word>, <point value>, <coord sequence>]
// compare point values first, if they're equal sort by word alphabetically
function compareWordsByPoints(a, b) {
	if (a[1] > b[1]) { return -1;}
	else if (a[1] < b[1]) { return 1;}
	else {
		if (a[0] > b[0]) { return 1;}
		else if (a[0] < b[0]) { return -1;}
		else { return 0;}
	}
}

function allLettersValid() {
	for (var i = 0; i < 16; i++) {
		var charCode = $('#' + i).val().charCodeAt();
		if (!(charCode >= 97 && charCode <= 122)) {
			return false;
		}
	}
	return true;
}