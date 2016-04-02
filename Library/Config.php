<?php
namespace Library;

class Config extends ApplicationComponent {
	const NO_ROUTE = 1;
	protected $definitions;
	protected $routes;
	public function __construct(Application $app) {
		parent::__construct($app);
		$this->setDefinitions($app);
		$this->setRoutes($app);
	}
	public function getDefinition($definition) {
		if (isset($this->definitions[$definition])) {
			return $this->definitions[$definition];
		}
		return null;
	}
	public function setDefinitions(Application $app) {
		$definitions = array();
		$xml = new \DOMDocument;
		$xml->load(__DIR__.'/../Applications/'.$app->name().'/Config/definitions.xml');
		$elements = $xml->getElementsByTagName('definition');
		foreach ($elements as $element) {
			$definitions[$element->getAttribute('key')] = $element->getAttribute('value');
		}
		$this->definitions = $definitions;
	}
	public function getRoute($url) {
		foreach ($this->routes as $route) {
			if ($route->match($url) !== false) {
				return $route;
			}
		}
		throw new \RuntimeException('Unknown URL', self::NO_ROUTE);
	}
	public function setRoutes(Application $app) {
		$routes = array();
		$xml = new \DOMDocument;
		$xml->load(__DIR__.'/../Applications/'.$app->name().'/Config/routes.xml');
		$elements = $xml->getElementsByTagName('route');
		foreach ($elements as $element) {
			$routes[] = new Route($element->getAttribute('url'), $element->getAttribute('module'), $element->getAttribute('action'));
		}
		$this->routes = $routes;
	}
}