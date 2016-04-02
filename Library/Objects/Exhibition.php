<?php
namespace Library\Objects;

class Exhibition extends \Library\Object {
	public $caption;
	public $date;
	public $description;
	public $images;
	public $place_id;
	public $thumbnails;
	public $title;
	public function caption() {
		return $this->caption;
	}
	public function setCaption($caption) {
		$caption = htmlspecialchars($caption);
		if (!empty($caption) && is_string($caption)) {
			$this->caption = $caption;
		}
	}
	public function date() {
		return $this->date;
	}
	public function setDate(\DateTime $date) {
		$this->date = $date;
	}
	public function description() {
		return $this->description;
	}
	public function setDescription($description) {
		$description = htmlspecialchars($description);
		if (!empty($description) && is_string($description)) {
			$this->description = $description;
		}
	}
	public function images() {
		return $this->images;
	}
	public function setImages($images) {
		$images = htmlspecialchars($images);
		if (!empty($images) && is_string($images)) {
			$this->images = $images;
		}
	}
	public function place_id() {
		return $this->place_id;
	}
	public function setPlace_id($place_id) {
		if ((int) $place_id > 0) {
			$this->place_id = $place_id;
		}
	}
	public function thumbnails() {
		return $this->thumbnails;
	}
	public function setThumbnails($thumbnails) {
		$thumbnails = htmlspecialchars($thumbnails);
		if (!empty($thumbnails) && is_string($thumbnails)) {
			$this->thumbnails = $thumbnails;
		}
	}
	public function title() {
		return $this->title;
	}
	public function setTitle($title) {
		$title = htmlspecialchars($title);
		if (!empty($title) && is_string($title)) {
			$this->title = $title;
		}
	}
	public function isValid() {
		return !(empty($this->title) || empty($this->caption) || empty($this->thumbnails) || empty($this->date) || empty($this->place_id));
	}
}