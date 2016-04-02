<?php
namespace Library;

abstract class Controller extends ApplicationComponent {
	protected $action;
	protected $module;
	protected $page;
	protected $view;
	public function __construct(Application $app, $module, $action) {
		parent::__construct($app);
		$this->page = new Page($app);
		$this->setAction($action);
		$this->setModule($module);
		$this->setView($action);
	}
	public function setAction($action) {
		if (!is_string($action) || empty($action)) {
			throw new \InvalidArgumentException('Invalid controller action');
		}
		$this->action = $action;
	}
	public function setModule($module) {
		if (!is_string($module) || empty($module)) {
			throw new \InvalidArgumentException('Invalid controller module');
		}
		$this->module = $module;
	}
	public function setView($view) {
		if (!is_string($view) || empty($view)) {
			throw new \InvalidArgumentException('Invalid controller view');
		}
		$this->view = $view;
		$this->page->setContentFile(__DIR__.'/../Applications/'.$this->app->name().'/Modules/'.$this->module.'/Views/'.$this->view.'.php');
	}
	public function page() {
		return $this->page;
	}
	public function run() {
		$method = 'run'.$this->action;
		if (!is_callable(array($this, $method))) {
			throw new \RuntimeException('Undefined controller action');
		}
		$this->$method($this->app->httpRequest());
	}
}