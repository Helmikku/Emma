<?php
namespace Library\Models;

abstract class UsersModel extends \Library\Model {
	abstract public function signIn($id, $name);
}