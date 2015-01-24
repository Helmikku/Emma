<?php
namespace Library;

class Route {
	protected $url;
	protected $module;
	protected $action;
	public function __construct($url, $module, $action) {
		$this->setUrl($url);
		$this->setModule($module);
		$this->setAction($action);
	}
	public function setUrl($url) {
		if (is_string($url)) {
			$this->url = $url;
		}
	}
	public function setModule($module) {
		if (is_string($module)) {
			$this->module = $module;
		}
	}
	public function setAction($action) {
		if (is_string($action)) {
			$this->action = $action;
		}
	}
	public function url() {
		return $this->url;
	}
	public function module() {
		return $this->module;
	}
	public function action() {
		return $this->action;
	}
	public function match($url) {
		if (preg_match('`^'.$this->url.'$`', $url, $matches)) {
			return $matches;
		} else {
			return false;
		}
	}
}