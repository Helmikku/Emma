<?php
namespace Library;

abstract class Object implements \ArrayAccess {
	public $id;
	public function __construct(array $data = array()) {
		if (!empty($data)) {
			$this->hydrate($data);
		}
	}
	public function setId($id) {
		if ((int) $id > 0) {
			$this->id = $id;
		}
	}
	public function id() {
		return $this->id;
	}
	public function hydrate(array $data) {
		foreach ($data as $attribute => $value) {
			$method = 'set'.ucfirst($attribute);
			if (is_callable(array($this, $method))) {
				$this->$method($value);
			}
		}
	}
	public function isNew() {
		return empty($this->id);
	}
	public function offsetExists($var) {
		return isset($this->$var) && is_callable(array($this, $var));
	}
	public function offsetGet($attribute) {
		if (isset($this->$attribute) && is_callable(array($this, $attribute))) {
			return $this->$attribute();
		}
	}
	public function offsetSet($attribute, $value) {
		$method = 'set'.ucfirst($attribute);
		if (isset($this->$attribute) && is_callable(array($this, $method))) {
			$this->$method($value);
		}
	}
	public function offsetUnset($var) {
		throw new \Exception('Impossible de supprimer une quelconque valeur');
	}
}