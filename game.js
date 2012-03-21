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
	this.trie;
	this.words;
	
	// keyboard listeners
	/*document.game = this;
	document.onkeydown = function(e) { 
		this.game.keys[e.which] = true 
	};
	document.onkeyup = function(e) { 
		this.game.keys[e.which] = false;
		// P key
		if (e.which === 80) {
			//this.game.paused = !this.game.paused;
		}
	}*/
}

// initialize the Game fields
Game.prototype.init = function() {
	var canvas = $('#mainCanvas')[0];
    if(canvas.getContext){
    	/* This is the 2d rendering context you will be drawing on. */
		this.ctx = canvas.getContext('2d');
		// [<letter>, <letter multiplier>, <word multiplier>]
		this.letters = [[['r',1,1],['r',1,1],['e',1,1],['d',2,1]],
						[['u',1,1],['s',1,1],['a',1,1],['p',1,1]],
						[['b',1,1],['e',1,2],['i',1,1],['d',1,1]],
						[['y',1,1],['t',2,1],['v',1,1],['u',1,1]]];
		
		
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
		
		this.findWords();
		
		return true;
	}
	return false;
}

Game.prototype.findWords = function() {
	var num_rows = this.letters.length;
	var num_cols = (num_rows > 0) ? this.letters[0].length : 0;
	for (var i = 0; i < num_rows; i++) {
		for (var j = 0; j < num_cols; j++) {
			this.find_permutations(i, j, this.letters, num_cols, num_rows);
		}
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
	
	this.find_permutations_helper(r, c, chars, used, width, height, cumul_string, letter_values[chars[r][c][0]] * chars[r][c][1], chars[r][c][2]);
}

Game.prototype.find_permutations_helper = function(r, c, chars, used, width, height, cumul_string, point_value, multiplier) {
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
		var new_point_value = point_value + letter_values[chars[valid_neighbors[n][0]][valid_neighbors[n][1]][0]] * chars[valid_neighbors[n][0]][valid_neighbors[n][1]][1];
		var new_multiplier = multiplier * chars[valid_neighbors[n][0]][valid_neighbors[n][1]][2];
		// add it to this.words if its a word
		if (this.trie.containsWord(string_copy)) { 
			this.words[string_copy] = new_point_value * new_multiplier + length_bonus[string_copy.length]; 
		}
		// continue on this branch of recursion only if the prefix accumulated so far is in the trie
		if (this.trie.containsPrefix(string_copy)) {
			this.find_permutations_helper(valid_neighbors[n][0], valid_neighbors[n][1], chars, used_copy, width, height, string_copy, new_point_value, new_multiplier);
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
	this.ctx.fillStyle = "rgb(0,0,0)";
	this.ctx.fillRect(100, 100, 200, 200);
}

// main game logic method, called at 60fps
Game.prototype.update = function() {
	
}