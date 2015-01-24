<?php
namespace Library;

abstract class Model {
	protected $dao;
	public function __construct($dao) {
		$this->dao = $dao;
	}
}