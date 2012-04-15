<?php
//require("dict.php");
require("hash.php");

						
$letters = array(array('f',1,1), array('u',1,1), array('n',1,1), array('o',1,1),
				 array('r',1,1), array('w',1,1), array('d',1,1), array('t',3,1),
				 array('o',1,1), array('a',3,1), array('e',3,1), array('m',1,1),
				 array('b',1,1), array('l',1,1), array('t',1,3), array('n',1,1));
				 
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
	
	// start with the first letter's location
	//$cumul_coords = array(array($r, $c));
	
	find_perms_helper($r, $c, $chars, $used, $cumul_string, $letter_values[$chars[ind($r,$c)][0]] * $chars[ind($r,$c)][1], $chars[ind($r,$c)][2]);
}

function find_perms_helper($r, $c, $chars, $used, $cumul_string, $point_value, $multiplier) {
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
		
		
		// copy the coords and add the coord of this neighbor
		//$coords_copy = $cumul_coords;
		//$coords_copy[] = array($neighbor[0],$neighbor[1]);
		
		// calculate the new point value and multiplier
		$new_point_value = $point_value + $letter_values[$chars[ind($neighbor[0],$neighbor[1])][0]] *$chars[ind($neighbor[0],$neighbor[1])][1];
		$new_multiplier = $multiplier * $chars[ind($neighbor[0],$neighbor[1])][2];
		
		$len = strlen($string_copy);
		
		// if the word is two letters long, check the 2 letter hash and add if its a word
		if ($len === 2 && $hash2l[$string_copy]) {
			$words_found[] = array($string_copy, $new_multiplier);
		}
		// otherwise if the word is three or more letters, check the big hash and add if necessary
		if ($len > 2 && contains($string_copy)) {
			$words_found[] = array($string_copy, $new_point_value * $new_multiplier + $length_bonus[$len]);
		}
		
		// continue on this branch of recursion only if the 3-letter prefix accumulated so far is valid
		
		if ($len < 3) { // || $hash[substr($string_copy, 0, 3)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 3 && $len < 6 && $hash[substr($string_copy, 0, 3)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 6 && $len < 9 && $prefix6[substr($string_copy, 0, 6)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 9 && $len < 12  && $prefix9[substr($string_copy, 0, 9)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 12 && $len < 14 && $prefix12[substr($string_copy, 0, 12)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $new_point_value, $new_multiplier);
		}
		else if ($len >= 14 && $prefix14[substr($string_copy, 0, 14)]) {
			find_perms_helper($neighbor[0], $neighbor[1], $chars, $used_copy, $string_copy, $new_point_value, $new_multiplier);
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

echo memory_get_usage()/1024/1024;
?>