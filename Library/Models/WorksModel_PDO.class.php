<?php
namespace Library\Models;

class WorksModel_PDO extends WorksModel {
	public function getWorkById($work_id) {
		$query = $this->dao->prepare('SELECT * FROM works WHERE id = :id');
		$query->bindValue(':id', $work_id, \PDO::PARAM_INT);
		$query->execute();
		$query->setFetchMode(\PDO::FETCH_CLASS | \PDO::FETCH_PROPS_LATE, '\Library\Objects\Work');
		if ($work = $query->fetch()) {
			$work->setDate(new \DateTime($work->date()));
			$query->closeCursor();
			return [$work];
		}
		$query->closeCursor();
		return null;
	}
	public function getWorksList($filters, $page_number = 0, $page_size = 0) {
		$sql = 'SELECT id, title, teaser, thumbnails, date, collection_id FROM works ORDER BY date DESC';
		if (isset($filters['collection_id'])) {
			$sql .= 'WHERE collection_id = '.(int) $filters['collection_id'];
		}
		if ($page_number > 0 || $page_size > 0) {
			$limit = $page_size;
			$start = ($page_number - 1) * $page_size;
			$sql .= ' LIMIT '.(int) $limit.' OFFSET '.(int) $start;
		}
		$query = $this->dao->query($sql);
		$query->setFetchMode(\PDO::FETCH_CLASS | \PDO::FETCH_PROPS_LATE, '\Library\Objects\Work');
		$works = $query->fetchAll();
		foreach ($works as $work) {
			$work->setDate(new \DateTime($work->date()));
		}
		$query->closeCursor();
		return $works;
	}
}