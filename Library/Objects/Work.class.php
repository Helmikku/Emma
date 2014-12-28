<?php
namespace Library\Objects;

class Work extends \Library\Object {
	public $title, $teaser, $body, $thumbnails, $images, $date, $collection_id;
	public function setTitle($title) {
		$title = htmlspecialchars($title);
		if (!empty($title) && is_string($title)) {
			$this->title = $title;
		}
	}
	public function setTeaser($teaser) {
		$teaser = htmlspecialchars($teaser);
		if (!empty($teaser) && is_string($teaser)) {
			$this->teaser = $teaser;
		}
	}
	public function setBody($body) {
		$body = htmlspecialchars($body);
		if (!empty($body) && is_string($body)) {
			$this->body = $body;
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
	public function teaser() {
		return $this->teaser;
	}
	public function body() {
		return $this->body;
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
		return !(empty($this->title) || empty($this->teaser) || empty($this->thumbnails) || empty($this->date) || empty($this->collection_id));
	}
}