<?php
namespace Library\Objects;

class Work extends \Library\Object {
	public $title, $caption, $description, $thumbnails, $images, $date, $collection_id;
	public function setTitle($title) {
		$title = htmlspecialchars($title);
		if (!empty($title) && is_string($title)) {
			$this->title = $title;
		}
	}
	public function setCaption($caption) {
		$caption = htmlspecialchars($caption);
		if (!empty($caption) && is_string($caption)) {
			$this->caption = $caption;
		}
	}
	public function setDescription($description) {
		$description = htmlspecialchars($description);
		if (!empty($description) && is_string($description)) {
			$this->description = $description;
		}
	}
	public function setThumbnails($thumbnails) {
		$thumbnails = htmlspecialchars($thumbnails);
		if (!empty($thumbnails) && is_string($thumbnails)) {
			$this->thumbnails = $thumbnails;
		}
	}
	public function setImages($images) {
		$images = htmlspecialchars($images);
		if (!empty($images) && is_string($images)) {
			$this->images = $images;
		}
	}
	public function setDate(\DateTime $date) {
		$this->date = $date;
	}
	public function setCollection_id($collection_id) {
		if ((int) $collection_id > 0) {
			$this->collection_id = $collection_id;
		}
	}
	public function title() {
		return $this->title;
	}
	public function caption() {
		return $this->caption;
	}
	public function description() {
		return $this->description;
	}
	public function thumbnails() {
		return $this->thumbnails;
	}
	public function images() {
		return $this->images;
	}
	public function date() {
		return $this->date;
	}
	public function collection_id() {
		return $this->collection_id;
	}
	public function isValid() {
		return !(empty($this->title) || empty($this->caption) || empty($this->thumbnails) || empty($this->date) || empty($this->collection_id));
	}
}