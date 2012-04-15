<?php
$hash = unserialize(file_get_contents("cached_hash"));

function contains(&$hash, $word) {
	foreach ($hash[substr($word, 0, 3)] as $curr) {
		if ($word === $curr) { return true; }
	}
	return false;
}
?>