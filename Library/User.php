<?php
namespace Library;

session_start();

class User extends ApplicationComponent {
	protected $id;
	protected $name;
	protected $ranking;
	public function __construct(Application $app) {
		parent::__construct($app);
		if (!$this->anonymous()) {
			$this->id = $_SESSION['id'];
			$this->name = $_SESSION['name'];
			$this->ranking = $_SESSION['ranking'];
		}
	}
	public function anonymous() {
		return !($this->attribute('online') === true);
	}
	public function attribute($attribute) {
		return isset($_SESSION[$attribute]) ? $_SESSION[$attribute] : null;
	}
	public function setAttribute($attribute, $value) {
		$_SESSION[$attribute] = $value;
	}
	public function id() {
		return $this->id;
	}
	public function name() {
		return $this->name;
	}
	public function ranking() {
		return $this->ranking;
	}
}