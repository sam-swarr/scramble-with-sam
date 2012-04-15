<?php

class Trie {

	public $prefix;
	public $isWord = false;
	public $children = array();

	public function __construct($prefix) {
		$this->prefix = $prefix;
	}

	// insert a word into the trie
	public function insert($word) {
		// sanity check; make sure the node has the right prefix
		if ($this->prefix && strpos($word, $this->prefix) !== 0) {
			exit("Tried inserting ". $word . " into node with prefix " . $this->prefix . "!");
		}
		else if ($word === $this->prefix) {
			$this->isWord = true;
			return true;
		}
		else {
			//	check for an existing child
			for ($i = 0; $i < count($this->children); $i++) {
				if (strpos($word, $this->children[$i]->prefix) === 0) {
					$this->children[$i]->insert($word);
					return true;
				}
			}
			// otherwise create a new node
			$child = new Trie($this->prefix . $word{strlen($this->prefix)});
			$this->children[] = $child;
			$child->insert($word);
			return true;
		}
	}
	
	// returns true if $word is contained in the tree rooted at this node
	public function containsWord($word) {
		if ($this->prefix && strpos($word, $this->prefix) !== 0) {
			return false;
		}
		else if ($word === $this->prefix && $this->isWord) {
			return true;
		}
		else {
			for ($i = 0; $i < count($this->children); $i++) {
				if ($this->children[$i]->containsWord($word)) {
					return true;
				}
			}
			return false;
		}
	}
	
	// returns true if $prefix is represented in the tree rooted at this node
	public function containsPrefix($prefix) {
		if ($this->prefix && strpos($prefix, $this->prefix) !== 0) {
			return false;
		}
		else if ($prefix === $this->prefix) {
			return true;
		}
		else {
			for ($i = 0; $i < count($this->children); $i++) {
				if ($this->children[$i]->containsPrefix($prefix)) {
					return true;
				}
			}
			return false;
		}
	}
}

/*
$trie = new Trie('');

for ($i = 0; $i < count($dict); $i++) {
	if ($dict[$i]{0} === 's' || $dict[$i]{0} === 'a' || $dict[$i]{0} === 'b' || $dict[$i]{0} === 'c' ||
		$dict[$i]{0} === 'd' || $dict[$i]{0} === 'm' || $dict[$i]{0} === 'p' || $dict[$i]{0} === 't' ||
		$dict[$i]{0} === 'g') {
		$trie->insert($dict[$i]);
	}
}

echo $trie->containsWord('aardvark');
echo $trie->containsWord('apple');*/

function insert(&$trie, $word, $i) {
	if (strlen($word) === $i) {
		$trie[0] = true;
		return true;
	}
	
	if ($trie[$word{$i}]) {
		insert($trie[$word{$i}], $word, $i + 1);
	}
	else {
		$trie[$word{$i}] = array();
		insert($trie[$word{$i}], $word, $i + 1);
	}

}

function contains(&$trie, $word, $i) {
	if (strlen($word) === $i) { return $trie[0];}
	if ($trie[$word[$i]]) { return contains($trie[$word[$i]], $word, $i + 1); }
	else { return false; }
}



// JUNK
/*
$trieopt = array();


insert($trieopt, 'abc', 0);

insert($trieopt, 'abcd', 0);

insert($trieopt, 'abd', 0);
insert($trieopt, 'a', 0);

print_r($trieopt);


//for ($i = 0; $i < count($dict); $i++) {
//	insert($trieopt, $dict[$i], 0);
//}

function printOut(&$trie) {
	echo 'array(';
	foreach ($trie as $key => $value) {
		if ($key === 0) { echo '0 => 1,';}
		else { 
			echo '\'' . $key . '\' => ';
			printOut($value);
		}
	}
	echo '),';
}
//printOut($trieopt);




/*$hash = array();
for ($i = 0; $i < count($dict); $i++) {
	if (strlen($dict[$i]) > 2) {
		if($hash[substr($dict[$i], 0, 3)]) {
			$hash[substr($dict[$i], 0, 3)][] = $dict[$i];
		}
		else {
			$hash[substr($dict[$i], 0, 3)] = array();
			$hash[substr($dict[$i], 0, 3)][] = $dict[$i];
		}
	}
}

//file_put_contents("cached_hash", serialize($hash));

//print_r($hash);

//print_r($hash);
echo memory_get_usage()/1024/1024;

//print_r($trie3);
//trieopt2 = Array ( ['a'] => Array ( ['a'] => Array ( [0] => 1, ['h'] => Array ( [0] => 1, ['e'] => Array ( ['d'] => Array ( [0] => 1 ) ) ['i'] => Array ( ['n'] => Array ( ['g'] => Array ( [0] => 1 ) ) ) ['s'] => Array ( [0] => 1 ) ) ) ) ) ;
//print_r($trieopt);*/