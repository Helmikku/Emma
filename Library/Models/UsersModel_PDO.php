<?php
namespace Library\Models;

class UsersModel_PDO extends UsersModel {
	public function signIn($id, $name) {
		$query = $this->dao->prepare('INSERT INTO users (id, name) VALUES (:id, :name) ON DUPLICATE KEY UPDATE name = VALUES(name)');
		$query->bindValue(':id', $id, \PDO::PARAM_INT);
		$query->bindValue(':name', $name, \PDO::PARAM_STR);
		$query->execute();
		$query->closeCursor();
		$query = $this->dao->prepare('SELECT * FROM users WHERE id = :id');
		$query->bindValue(':id', $id, \PDO::PARAM_INT);
		$query->execute();
		$query->setFetchMode(\PDO::FETCH_CLASS | \PDO::FETCH_PROPS_LATE, '\Library\Objects\User');
		$user = $query->fetch();
		$query->closeCursor();
		return $user;
	}
}