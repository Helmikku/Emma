<?php
namespace Library\Objects;

class User extends \Library\Object {
	public $name, $ranking;
	public function setName($name) {
		$name = htmlspecialchars($name);
		if (!empty($name) && is_string($name)) {
			$this->name = $name;
		}
	}
	public function setRanking($ranking) {
		$ranking = htmlspecialchars($ranking);
		if (!empty($ranking) && is_string($ranking)) {
			$this->ranking = $ranking;
		}
	}
	public function name() {
		return $this->name;
	}
	public function ranking() {
		return $this->ranking;
	}
	public function isValid() {
		return !(empty($this->name) || empty($this->ranking));
	}
}