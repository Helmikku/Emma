<?php
namespace Library\Models;

abstract class WorksModel extends \Library\Model {
	abstract public function getWorkById($work_id);
	abstract public function getWorksList($filters, $page_number = 0, $page_size = 0);
}