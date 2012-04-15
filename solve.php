<?php
//require("dict.php");
require("hash.php");

						
$letters = array(array('f',1,1), array('u',1,1), array('n',1,1), array('o',1,1),
				 array('r',1,1), array('w',1,1), array('d',1,1), array('t',3,1),
				 array('o',1,1), array('a',3,1), array('e',3,1), array('m',1,1),
				 array('b',1,1), array('l',1,1), array('t',1,3), array('n',1,1));

function ind($row, $col) {
	return 4*$row + $col;
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

function find_perms($r, $c, $chars) {
	$used = array();
	$used[ind($r,$c)] = true;
	
	$cumul_string = $chars[ind($r,$c)][0];
	
	$cumul_coords = array(array($r, $c));
	
	find_perms_helper($r, $c, $chars, $used, $cumul_string, $cumul_coords, 
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

function find_perms_helper($r, $c, $chars, $used, $cumul_string, $cumul_coords, $point_value, $multiplier) {
	$valid_neighbors = find_unused_neighbors($r, $c, $used);
	
	
}


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


function find_unused_neighbors($r, $c, $used) {
	$result = array();
	for ($y = -1; $y <= 1; $y++) {
		for ($x = -1; $x <= 1; $x++) {
			if ($y === 0 && $x === 0) {continue;}
			$curr_r = $r + $y;
			$curr_c = $c + $x;
			if ($curr_r >= 0 && $curr_r < 4) {
				if ($curr_c >= 0 && $curr_c < 4) {
				
				}
			}
		}
	}
}

echo memory_get_usage()/1024/1024;
?>