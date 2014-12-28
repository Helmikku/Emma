<?php
namespace Library;

session_start();

class User extends ApplicationComponent {
	protected $id;
	protected $login;
	protected $email;
	protected $signup_time;
	protected $login_time;
	public function __construct(Application $app) {
		parent::__construct($app);
		if ($this->connected()) {
			$this->id = $_SESSION['id'];
			$this->login = $_SESSION['login'];
			$this->email = $_SESSION['email'];
			$this->signup_time = $_SESSION['signup_time'];
			$this->login_time = $_SESSION['login_time'];
		}
	}
	public function id() {
		return $this->id;
	}
	public function login() {
		return $this->login;
	}
	public function email() {
		return $this->email;
	}
	public function signup_time() {
		return $this->signup_time;
	}
	public function login_time() {
		return $this->login_time;
	}
	public function connected() {
		return (isset($_SESSION['connected']) && $_SESSION['connected'] === true);
	}
	public function setAttribute($attribute, $value) {
		$_SESSION[$attribute] = $value;
	}
	public function getAttribute($attribute) {
		return isset($_SESSION[$attribute]) ? $_SESSION[$attribute] : null;
	}
	public function setFlash($value) {
		$_SESSION['flash'] = $value;
	}
	public function hasFlash() {
		return isset($_SESSION['flash']);
	}
	public function getFlash() {
		$flash = $_SESSION['flash'];
		unset($_SESSION['flash']);
		return $flash;
	}
}