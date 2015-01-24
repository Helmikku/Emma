<?php
namespace Library;

session_start();

class User extends ApplicationComponent {
	public function __construct(Application $app) {
		parent::__construct($app);
	}
	public function loggedIn() {
		return (isset($_SESSION['connected']) && $_SESSION['connected'] === true);
	}
	public function setAttribute($attribute, $value) {
		$_SESSION[$attribute] = $value;
	}
	public function getAttribute($attribute) {
		return isset($_SESSION[$attribute]) ? $_SESSION[$attribute] : null;
	}
}