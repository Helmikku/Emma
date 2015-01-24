<?php
namespace Library;

class Database extends ApplicationComponent {
	protected $api;
	protected $dao;
	protected $models;
	public function __construct(Application $app, $api, $dao) {
		parent::__construct($app);
		$this->api = $api;
		$this->dao = $dao;
		$this->models = array();
	}
	public function api() {
		return $this->api;
	}
	public function dao() {
		return $this->dao;
	}
	public function getModelOf($class) {
		if (!is_string($class) || empty($class)) {
			throw new \InvalidArgumentException('Invalid class');
		}
		if (!isset($this->models[$class])) {
			$model = '\\Library\\Models\\'.$class.'Model_'.$this->api;
			$this->models[$class] = new $model($this->dao);
		}
		return $this->models[$class];
	}
}