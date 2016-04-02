<?php
namespace Library;

class Route {
	protected $action;
	protected $module;
	protected $url;
	public function __construct($url, $module, $action) {
		$this->setUrl($url);
		$this->setModule($module);
		$this->setAction($action);
	}
	public function action() {
		return $this->action;
	}
	public function setAction($action) {
		if (is_string($action)) {
			$this->action = $action;
		}
	}
	public function module() {
		return $this->module;
	}
	public function setModule($module) {
		if (is_string($module)) {
			$this->module = $module;
		}
	}
	public function url() {
		return $this->url;
	}
	public function setUrl($url) {
		if (is_string($url)) {
			$this->url = $url;
		}
	}
	public function match($url) {
		if (preg_match('`^'.$this->url.'$`', $url, $matches)) {
			return $matches;
		} else {
			return false;
		}
	}
}