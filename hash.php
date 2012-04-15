<?php

$hash2l = unserialize(file_get_contents("cached_hash2l"));

$hash = unserialize(file_get_contents("cached_hash"));

$prefix6 = unserialize(file_get_contents("cached_prefix6"));

$prefix9 = unserialize(file_get_contents("cached_prefix9"));

$prefix12 = unserialize(file_get_contents("cached_prefix12"));

$prefix14 = unserialize(file_get_contents("cached_prefix14"));



function contains($word) {
	global $hash;
	if ($hash[substr($word, 0, 3)]) {
		foreach ($hash[substr($word, 0, 3)] as $curr) {
			if ($word === $curr) { return true; }
		}
	}
	return false;
}

/*
$hash2l = array();
for ($i = 0; $i < count($dict); $i++) {
	if (strlen($dict[$i]) === 2) {
		$hash2l[$dict[$i]] = true;
	}
}

file_put_contents("cached_hash2l", serialize($hash2l));
*/
$letter_values = array(
"a" => 1,
"b" => 4,
"c" => 4,
"d" => 2,
"e" => 1,
"f" => 4,
"g" => 3,
"h" => 3,
"i" => 1,
"j" => 10,
"k" => 5,
"l" => 2,
"m" => 4,
"n" => 2,
"o" => 1,
"p" => 4,
"q" => 10,
"r" => 1,
"s" => 1,
"t" => 1,
"u" => 2,
"v" => 5,
"w" => 4,
"x" => 8,
"y" => 3,
"z" => 10
);

$length_bonus = array(0,0,0,0,0,3,6,10,15,20,30,50,80,150,500,1000,30000);
?>