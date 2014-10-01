<?php
namespace Library;

abstract class Field {
	protected $label;
	protected $name;
	protected $value;
	protected $validators = array();
	protected $error;
	public function __construct(array $data = array()) {
		if (!empty($data)) {
			$this->hydrate($data);
		}
	}
	public function hydrate(array $data) {
		foreach ($data as $attribute => $value) {
			$method = 'set'.ucfirst($attribute);
			if (is_callable(array($this, $method))) {
				$this->$method($value);
			}
		}
	}
	public function setLabel($label) {
		if (is_string($label)) {
			$this->label = $label;
		}
	}
	public function setName($name) {
		if (is_string($name)) {
			$this->name = $name;
		}
	}
	public function setValue($value) {
		if (is_string($value)) {
			$this->value = $value;
		}
	}
	public function setValidators(array $validators) {
		foreach ($validators as $validator) {
			if ($validator instanceof Validator && !in_array($validator,$this->validators)) {
				$this->validators[] = $validator;
			}
		}
	}
	public function label() {
		return $this->label;
	}
	public function name() {
		return $this->name;
	}
	public function value() {
		return $this->value;
	}
	public function validators() {
		return $this->validators;
	}
	public function isValid() {
		foreach ($this->validators as $validator) {
			if (!$validator->isValid($this->value)) {
				$this->error = $validator->error();
				return false;
			}
		}
		return true;
	}
	abstract public function show();
}