<?php
namespace Library\Models;

class ExhibitionsModel_PDO extends ExhibitionsModel {
	public function getExhibitionById($exhibition_id) {
		$query = $this->dao->prepare('SELECT * FROM exhibitions WHERE id = :id');
		$query->bindValue(':id', $exhibition_id, \PDO::PARAM_INT);
		$query->execute();
		$query->setFetchMode(\PDO::FETCH_CLASS | \PDO::FETCH_PROPS_LATE, '\Library\Objects\Exhibition');
		$exhibitions = $query->fetchAll();
		foreach ($exhibitions as $exhibition) {
			$exhibition->setDate(new \DateTime($exhibition->date()));
		}
		$query->closeCursor();
		return $exhibitions;
	}
	public function getExhibitionsList($filters = [], $page_number = 0, $page_size = 0) {
		$sql = 'SELECT * FROM exhibitions ORDER BY date DESC';
		if (isset($filters['place_id'])) {
			$sql .= ' WHERE place_id = '.(int) $filters['place_id'];
		}
		if ($page_number > 0 || $page_size > 0) {
			$limit = $page_size;
			$start = ($page_number - 1) * $page_size;
			$sql .= ' LIMIT '.(int) $limit.' OFFSET '.(int) $start;
		}
		$query = $this->dao->query($sql);
		$query->setFetchMode(\PDO::FETCH_CLASS | \PDO::FETCH_PROPS_LATE, '\Library\Objects\Exhibition');
		$exhibitions = $query->fetchAll();
		foreach ($exhibitions as $exhibition) {
			$exhibition->setDate(new \DateTime($exhibition->date()));
		}
		$query->closeCursor();
		return $exhibitions;
	}
}