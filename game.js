/*  
	game.js
	Sam Swarr (sswarr)
*/

// constants
var CANVAS_WIDTH;
var CANVAS_HEIGHT;

// Game class
function Game(){
	// instance variables
	this.ctx;
	this.letters;
	this.multipliers;
	this.trie;
	this.words;
	
	this.r;
	this.c;
	
	// keyboard listeners
	document.game = this;
	document.onkeydown = function(e) { 
		//this.game.keys[e.which] = true 
	};
	document.onkeyup = function(e) { 
		//this.game.keys[e.which] = false;
		if (this.game.r < 4 && this.game.c < 4 && (e.which >= 65 && e.which <= 90)) {
			this.game.letters[this.game.r][this.game.c][0] = String.fromCharCode(e.which).toLowerCase();
			this.game.c++;
			if (this.game.c >= 4) {
				this.game.c = 0;
				this.game.r++;
			}
			this.game.draw();
		}
		
		// Enter key
		if (e.which === 13) {
			//make sure all letters are filled in
			if(this.game.allLettersValid()) {
				this.game.words = {};
				this.game.words_array = [];
				this.game.findWords();
				this.game.wordsToHTML();
			}
		}
	}
}
function giveFocus (event) {
	document.getElementById('hiddeninput').focus();
}

// initialize the Game fields
Game.prototype.init = function() {
	var canvas = $('#mainCanvas')[0];
	canvas.addEventListener("mousedown", react, false);
	canvas.addEventListener("mouseup", giveFocus, false);
    if(canvas.getContext){
    	/* This is the 2d rendering context you will be drawing on. */
		this.ctx = canvas.getContext('2d');
		// [<letter>, <letter multiplier>, <word multiplier>]
		this.letters = [[['f',1,1],['u',1,1],['n',1,1],['o',1,1]],
						[['r',1,1],['w',1,1],['d',1,1],['t',3,1]],
						[['o',1,1],['a',3,1],['e',3,1],['m',1,1]],
						[['b',1,1],['l',1,1],['t',1,3],['n',1,1]]];
		
		// 0 = none, 1 = dl, 2 = tl, 3 = dw, 4 = tw
		this.multipliers = [[0,0,0,0],
							[0,0,0,2],
							[0,2,2,0],
							[0,0,4,0]];
		
		CANVAS_WIDTH = this.ctx.canvas.width;
		CANVAS_HEIGHT = this.ctx.canvas.height;
		
		console.log("CONSTRUCTING TRIE");
		this.trie = new TrieNode("");
		for (var i = 0; i < dict_array.length; i++) {
			if (!this.trie.insert(dict_array[i])) {
				console.log("BAD INSERT: " + dict_array[i]);
			}
		}
		console.log("TRIE CONSTRUCTED");
		
		this.words = {};
		this.words_array = [];
		
		this.r = 0;
		this.c = 0;
		
		return true;
	}
	return false;
}


Game.prototype.allLettersValid = function() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (this.letters[i][j][0] === '') { return false;}
		}
	}
	return true;
}

Game.prototype.findWords = function() {
	var num_rows = this.letters.length;
	var num_cols = (num_rows > 0) ? this.letters[0].length : 0;
	for (var i = 0; i < num_rows; i++) {
		for (var j = 0; j < num_cols; j++) {
			this.find_permutations(i, j, this.letters, num_cols, num_rows);
		}
	}
	this.words_array.sort(compareWordsByPoints);
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

Game.prototype.wordsToHTML = function() {
	$( "#results" ).html(			
		"<tr>" +
			"<td>Word</td>" +
			"<td>Length</td>" +
			"<td>Points</td>" +
		"</tr>");
	for (var i = 0; i < this.words_array.length; i++) {
		$( "#results" ).append(			
			"<tr>" +
				"<td>" + this.words_array[i][0] + "</td>" +
				"<td>" + this.words_array[i][0].length + "</td>" + 
				"<td>" + this.words_array[i][1] + "</td>" +
			"</tr>");
	}
}

// finds all words that can be formed starting at location (r, c) on the 
// array of letters, chars, with the given width and height and adds them to this.words
Game.prototype.find_permutations = function(r, c, chars, width, height) {
	// create boolean array of the same size as chars to represent which letters have been used
	var used = new Array(height);
	for (var i = 0; i < height; i++) {
		used[i] = new Array(width);
		for (var j = 0; j < width; j++) {
			used[i][j] = false;
		}
	}
	used[r][c] = true;
	
	// start with the first letter
	var cumul_string = chars[r][c][0];
	
	// start with the first letter's location
	var cumul_coords = [[r,c]];
	
	this.find_permutations_helper(r, c, chars, used, width, height, cumul_string, cumul_coords, letter_values[chars[r][c][0]] * chars[r][c][1], chars[r][c][2]);
}

Game.prototype.find_permutations_helper = function(r, c, chars, used, width, height, cumul_string, cumul_coords, point_value, multiplier) {
	// find the coords all the neighboring cells that haven't been used yet
	var valid_neighbors = this.find_unused_neighbors(r, c, used, width, height);
	
	// make a copy of the boolean array since multiple branches of recursion will occur
	var used_copy = new Array(height);
	for (var i = 0; i < height; i++) {
		used_copy[i] = used[i].slice(0);
	}
	used_copy[r][c] = true;
	
	// for each unused neighbor
	for (var n = 0; n < valid_neighbors.length; n++) {
		// create the string that would be formed with this neighbor
		var string_copy = cumul_string + chars[valid_neighbors[n][0]][valid_neighbors[n][1]][0];
		var coords_copy = cumul_coords.slice(0);
		coords_copy.push([valid_neighbors[n][0],valid_neighbors[n][1]]);
		var new_point_value = point_value + letter_values[chars[valid_neighbors[n][0]][valid_neighbors[n][1]][0]] * chars[valid_neighbors[n][0]][valid_neighbors[n][1]][1];
		var new_multiplier = multiplier * chars[valid_neighbors[n][0]][valid_neighbors[n][1]][2];
		// add it to this.words if its a word
		if (this.trie.containsWord(string_copy)) { 
			var points = (string_copy.length === 2) ? 1 : new_point_value;
			this.words[string_copy] = [points * new_multiplier + length_bonus[string_copy.length], coords_copy]; 
			this.words_array.push([string_copy, points * new_multiplier + length_bonus[string_copy.length], coords_copy]);
		}
		// continue on this branch of recursion only if the prefix accumulated so far is in the trie
		if (this.trie.containsPrefix(string_copy)) {
			this.find_permutations_helper(valid_neighbors[n][0], valid_neighbors[n][1], chars, used_copy, width, height, string_copy, coords_copy, new_point_value, new_multiplier);
		}
	}
	
}

/*Game.prototype.find_permutations_helper = function(r, c, chars, used, width, height, cumul_string, cumul_result) {
	var valid_neighbors = this.find_unused_neighbors(r, c, used, width, height);
	
	var used_copy = new Array(height);
	for (var i = 0; i < height; i++) {
		used_copy[i] = used[i].slice(0);
	}
	used_copy[r][c] = true;
	
	for (var n = 0; n < valid_neighbors.length; n++) {
		cumul_result.push(cumul_string + chars[valid_neighbors[n][0]][valid_neighbors[n][1]]);
		var string_copy = cumul_string + chars[valid_neighbors[n][0]][valid_neighbors[n][1]];
		this.find_permutations_helper(valid_neighbors[n][0], valid_neighbors[n][1], chars, used_copy, width, height, string_copy, cumul_result)
	}
	
}*/

Game.prototype.find_unused_neighbors = function(r, c, used, width, height) {
	var result = [];
	for (var y = -1; y <= 1; y++) {
		for (var x = -1; x <= 1; x++) {
			if (y === 0 && x === 0) {continue;}
			var curr_r = r + y;
			var curr_c = c + x;
			if (curr_r >= 0 && curr_r < height) {
				if(curr_c >= 0 && curr_c < width) {
					if (!used[curr_r][curr_c]) {
						result.push([curr_r, curr_c]);
					}
				}
			}
		}
	}
	return result;
}

// main drawing method, called at 60fps
Game.prototype.draw = function() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			this.ctx.strokeStyle = "rgb(0,0,0)";
			if (i === this.r && j === this.c) { this.ctx.fillStyle = "rgb(200,200,250)";}
			else {this.ctx.fillStyle = "rgb(200,200,200)";}
			this.ctx.strokeRect(j*CANVAS_WIDTH/4, i*CANVAS_HEIGHT/4, CANVAS_HEIGHT/4, CANVAS_WIDTH/4);
			this.ctx.fillRect(j*CANVAS_WIDTH/4, i*CANVAS_HEIGHT/4, CANVAS_HEIGHT/4, CANVAS_WIDTH/4);	
		}
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			this.ctx.strokeStyle = "rgb(0,0,0)";
			this.ctx.fillStyle = "rgb(160,160,160)";
			this.ctx.strokeRect(j*CANVAS_WIDTH/4 + 3*CANVAS_HEIGHT/16 - 1, i*CANVAS_HEIGHT/4 + 3*CANVAS_HEIGHT/16 - 1, CANVAS_WIDTH/16, CANVAS_HEIGHT/16);
			this.ctx.fillRect(j*CANVAS_WIDTH/4 + 3*CANVAS_HEIGHT/16 - 1, i*CANVAS_HEIGHT/4 + 3*CANVAS_HEIGHT/16 - 1, CANVAS_WIDTH/16, CANVAS_HEIGHT/16);
		
			this.ctx.fillStyle = "rgb(0,0,0)";
			this.ctx.font = "14px Arial";
			this.ctx.textAlign = "start";
			this.ctx.textBaseline = "top";
			switch (this.multipliers[i][j]) {
				case 1:
					this.ctx.fillText('DL', j*CANVAS_WIDTH/4 + 3*CANVAS_HEIGHT/16, i*CANVAS_HEIGHT/4 + 3*CANVAS_HEIGHT/16 + 3);
					break;
				case 2:
					this.ctx.fillText('TL', j*CANVAS_WIDTH/4 + 3*CANVAS_HEIGHT/16 , i*CANVAS_HEIGHT/4 + 3*CANVAS_HEIGHT/16 + 3);
					break;
				case 3:
					this.ctx.font = "12px Arial";
					this.ctx.fillText('DW', j*CANVAS_WIDTH/4 + 3*CANVAS_HEIGHT/16 - 1, i*CANVAS_HEIGHT/4 + 3*CANVAS_HEIGHT/16 + 4);
					break;
				case 4:
					this.ctx.font = "12px Arial";
					this.ctx.fillText('TW', j*CANVAS_WIDTH/4 + 3*CANVAS_HEIGHT/16 - 1, i*CANVAS_HEIGHT/4 + 3*CANVAS_HEIGHT/16 + 4);
					break;
				default:
					break;
			}
			
		}
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			this.ctx.fillStyle = "rgb(0,0,0)";
			this.ctx.font = "40px Arial";
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.ctx.fillText(this.letters[i][j][0].toUpperCase(), j*CANVAS_WIDTH/4 + CANVAS_WIDTH/8, i*CANVAS_HEIGHT/4 + CANVAS_HEIGHT/8);
		}
	}
}

// main game logic method, called at 60fps
Game.prototype.update = function() {
	
}

function react(event) {
	var coords = relMouseCoords(event);
	canvasX = coords.x;
	canvasY = coords.y;
	
	var rc = [Math.floor(canvasY/(CANVAS_HEIGHT/4)), Math.floor(canvasX/(CANVAS_WIDTH/4))];
	canvasX = canvasX%(CANVAS_WIDTH/4);
	canvasY = canvasY%(CANVAS_HEIGHT/4);
	if (canvasX >= 60 && canvasX <= 80 && canvasY >= 60 && canvasY <= 80) {
		game.multipliers[rc[0]][rc[1]] = (game.multipliers[rc[0]][rc[1]] + 1) % 5;
		switch (game.multipliers[rc[0]][rc[1]]) {
			case 0:
				game.letters[rc[0]][rc[1]][1] = 1;
				game.letters[rc[0]][rc[1]][2] = 1;
				break;
			case 1:
				game.letters[rc[0]][rc[1]][1] = 2;
				game.letters[rc[0]][rc[1]][2] = 1;
				break;
			case 2:
				game.letters[rc[0]][rc[1]][1] = 3;
				game.letters[rc[0]][rc[1]][2] = 1;
				break;
			case 3:
				game.letters[rc[0]][rc[1]][1] = 1;
				game.letters[rc[0]][rc[1]][2] = 2;
				break;
			case 4:
				game.letters[rc[0]][rc[1]][1] = 1;
				game.letters[rc[0]][rc[1]][2] = 3;
				break;
			default:
				game.letters[rc[0]][rc[1]][1] = 1;
				game.letters[rc[0]][rc[1]][2] = 1;
				break;
		}
	} else {
		game.r = rc[0];
		game.c = rc[1];
	}
	game.draw();
}

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = $('#mainCanvas')[0];

    do{
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}