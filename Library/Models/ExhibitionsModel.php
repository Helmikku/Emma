<?php
namespace Library\Models;

abstract class ExhibitionsModel extends \Library\Model {
	abstract public function getExhibitionById($exhibition_id);
	abstract public function getExhibitionsList($filters, $page_number = 0, $page_size = 0);
}