<?php
//require("dict.php");
require("hash.php");

$l = (isset($_GET['l']) && strlen($_GET['l']) === 16) ? $_GET['l'] : '';

$lm = (isset($_GET['lm']) && strlen($_GET['lm']) === 16) ? $_GET['lm'] : '';

$wm = (isset($_GET['wm']) && strlen($_GET['wm']) === 16) ? $_GET['wm'] : '';

if (empty($l) || empty($lm) || empty($wm)) {
	exit('The letters and/or multipliers were not input correctly.');
}

$letters = array(array($l{0},intval($lm{0}),intval($wm{0})),
				 array($l{1},intval($lm{1}),intval($wm{1})),
				 array($l{2},intval($lm{2}),intval($wm{2})),
				 array($l{3},intval($lm{3}),intval($wm{3})),
				 array($l{4},intval($lm{4}),intval($wm{4})),
				 array($l{5},intval($lm{5}),intval($wm{5})),
				 array($l{6},intval($lm{6}),intval($wm{6})),
				 array($l{7},intval($lm{7}),intval($wm{7})),
				 array($l{8},intval($lm{8}),intval($wm{8})),
				 array($l{9},intval($lm{9}),intval($wm{9})),
				 array($l{10},intval($lm{10}),intval($wm{10})),
				 array($l{11},intval($lm{11}),intval($wm{11})),
				 array($l{12},intval($lm{12}),intval($wm{12})),
				 array($l{13},intval($lm{13}),intval($wm{13})),
				 array($l{14},intval($lm{14}),intval($wm{14})),
				 array($l{15},intval($lm{15}),intval($wm{15})));
		
/*$letters = array(array('f',1,1), array('u',1,1), array('n',1,1), array('o',1,1),
				 array('r',1,1), array('w',1,1), array('d',1,1), array('t',3,1),
				 array('o',1,1), array('a',3,1), array('e',3,1), array('m',1,1),
				 array('b',1,1), array('l',1,1), array('t',1,3), array('n',1,1));*/
				 
/*$letters = array(array('a',1,1), array('b',1,1), array('r',1,1), array('a',1,1),
				 array('e',1,1), array('v',1,1), array('i',1,1), array('s',3,1),
				 array('n',1,1), array('e',3,1), array('s',3,1), array('s',1,1),
				 array('n',1,1), array('o',1,1), array('s',1,3), array('e',1,1));*/

function ind($row, $col) {
	return 4*$row + $col;
}

$words_found = array();

// finds all words that can be formed starting at location (r, c) on the 
// array of letters, chars, and adds them to $words_found
function find_perms($r, $c, $chars) {
	global $letter_values;

	// create boolean array to represent which letters have been used
	$used = array();
	$used[ind($r,$c)] = true;
	
	// start with the first letter
	$cumul_string = $chars[ind($r,$c)][0];
	
	// special case where a 'q' is actually a 'qu'
	if ($chars[ind($r,$c)][0] === 'q') {
		$cumul_string = $cumul_string . 'u';
	}
	
	// start with the first letter's location
	$cumul_coords = array(array($r, $c));
	
	find_perms_helper($r, $c, $chars, $used, $cumul_string, $cumul_coords, $letter_values[$chars[ind($r,$c)][0]] * $chars[ind($r,$c)][1], $chars[ind($r,$c)][2]);
}

function find_perms_helper($r, $c, $chars, $used, $cumul_string, $cumul_coords, $point_value, $multiplier) {
	global $letter_values, $words_found, $hash, $hash2l, $length_bonus, $prefix6, $prefix9, $prefix12, $prefix14;
	
	
	// find the coords all the neighboring cells that haven't been used yet
	$valid_neighbors = find_unused_neighbors($r, $c, $used);
	
	// make a copy of the boolean array since multiple branches of recursion will occur
	$used_copy = $used;
	$used_copy[ind($r,$c)] = true;
	
	// for each unused neighbor
	foreach ($valid_neighbors as $neighbor) {
		// create the string that would be formed with this neighbor
		$string_copy = $cumul_string . $chars[ind($neighbor[0],$neighbor[1])][0];
		
		// special case where a 'q' is actually a 'qu'
		if ($chars[ind($neighbor[0],$neighbor[1])][0] === 'q') {
			$string_copy = $string_copy . 'u';
		}
		
		
		// copy the coords and add the coord of this neighbor
		$coords_copy = $cumul_coords;
		$coords_copy[] = array($neighbor[0],$neighbor[1]);
		
		// calculate the new point value and multiplier
		$new_point_value = $point_value + $letter_values[$chars[ind($neighbor[0],$neighbor[1])][0]] *$chars[ind($neighbor[0],$neighbor[1])][1];
		$new_multiplier = $multiplier * $chars[ind($neighbor[0],$neighbor[1])][2];
		
		$len = strlen($string_copy);
		
		// if the word is two letters long, check the 2 letter hash and add if its a word
		if ($len === 2 && $hash2l[$string_copy]) {
			$words_found[] = array($string_copy, $new_multiplier, $coords_copy);
		}
		// otherwise if the word is three or more letters, check the big hash and add if necessary
		if ($len > 2 && contains($string_copy)) {
			$words_found[] = array($string_copy, $new_point_value * $new_multiplier + $length_bonus[$len], $coords_copy);
		}
		
		// continue on this branch of recursion only if the 3-letter prefix accumulated so far is valid
		
		if ($len < 3) { // || $hash[substr($string_copy, 0, 3)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $coords_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 3 && $len < 6 && $hash[substr($string_copy, 0, 3)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $coords_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 6 && $len < 9 && $prefix6[substr($string_copy, 0, 6)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $coords_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 9 && $len < 12  && $prefix9[substr($string_copy, 0, 9)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $coords_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 12 && $len < 14 && $prefix12[substr($string_copy, 0, 12)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $coords_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 14 && $prefix14[substr($string_copy, 0, 14)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $coords_copy, $new_point_value, $new_multiplier);
		}
		else {}
	}
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
					if (!$used[ind($curr_r,$curr_c)]) {
						$result[] = array($curr_r, $curr_c);
					}
				}
			}
		}
	}
	return $result;
}

for ($r = 0; $r < 4; $r++) {
	for ($c = 0; $c < 4; $c++) {
		find_perms($r,$c,$letters);
	}
}
print_r(json_encode($words_found));
/*
$used = array();
$used[ind(1,1)] = true;
$used2 = $used;
$used2[ind(1,2)] = true;
print_r($used2);*/

//print_r(find_unused_neighbors(1,0,$used));

//echo memory_get_usage()/1024/1024;
?>