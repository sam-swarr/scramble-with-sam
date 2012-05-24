var currentInput = -1;

var wordsArray;

// 0 = no multiplier, 1 = double letter, 2 = double word, 3 = triple letter, 4 = triple word
var multipliers = new Array(16);
for (var i = 0; i < multipliers.length; i++) {
	multipliers[i] = 0;
}

function setCurrentInput(i) {
	currentInput = i;
}

document.onkeyup = function(e) { 
	// key a-z and an input is selected
	if (e.which >= 65 && e.which <= 90 && currentInput >= 0 && currentInput < 16) {
		// if a 'q' was entered, add a 'u'
		if (e.which === 81) {
			$('#' + currentInput).val(String.fromCharCode(e.which).toUpperCase() + 'u');
		} else {
			$('#' + currentInput).val(String.fromCharCode(e.which).toUpperCase());
		}
		if ($('#autotab').is(":checked")) {
			$('#' + currentInput).blur();
			currentInput++;
			$('#' + currentInput).focus();
		}
	}
	// spacebar key was pressed (cycle through multipliers)
	else if (e.which === 32 && currentInput >= 0 && currentInput < 16) {
		multipliers[currentInput] = (multipliers[currentInput] + 1)%5;
		var new_x_offset = multipliers[currentInput]*-70;
		$('#' + currentInput).css("background-position", new_x_offset);
	}
	// Enter key
	else if (e.which === 13) {
		submit();
	}
	// invalid key clears it
	else {
		$('#' + currentInput).val('');
	}
}

function submit() {
	//make sure all letters are filled in with chars a-z
	if (allLettersValid()) {
		// construct the string of 16 letters
		var l = '';
		for (var i = 0; i < 16; i++) {
			l += $('#' + i).val()[0].toLowerCase();
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
		alert("Please make sure every square is assigned a letter a-z (or qu).");
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
		var charCode = $('#' + i).val().charCodeAt(0);
		if (!(charCode >= 65 && charCode <= 90)) {
			return false;
		}
	}
	return true;
}