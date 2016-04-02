<?php
namespace Library;

class Application {
	protected $config;
	protected $database;
	protected $httpRequest;
	protected $httpResponse;
	protected $name;
	protected $user;
	public function __construct($name) {
		$this->name = $name;
		$this->config = new Config($this);
		$this->database = new Database($this, 'PDO', PDOFactory::getMySQLConnexion());
		$this->httpRequest = new HTTPRequest($this);
		$this->httpResponse = new HTTPResponse($this);
		$this->user = new User($this);
	}
	public function config() {
		return $this->config;
	}
	public function database() {
		return $this->database;
	}
	public function httpRequest() {
		return $this->httpRequest;
	}
	public function httpResponse() {
		return $this->httpResponse;
	}
	public function name() {
		return $this->name;
	}
	public function user() {
		return $this->user;
	}
	public function getController() {
		try {
			$route = $this->config->getRoute($this->httpRequest->uri());
		}
		catch (\RuntimeException $e) {
			if ($e->getCode() == \Library\Config::NO_ROUTE) {
				$this->httpResponse->redirect404();
			}
		}
		$controller = 'Applications\\'.$this->name.'\\Modules\\'.$route->module().'\\'.$route->module().'Controller';
		return new $controller($this, $route->module(), $route->action());
	}
	public function run() {
		$controller = $this->getController();
		$controller->run();
		$this->httpResponse->setPage($controller->page());
		$this->httpResponse->send();
	}
}