<?php
namespace Library;

class Page extends ApplicationComponent {
	protected $contentFile;
	protected $vars = array();
	public function setContentFile($contentFile) {
		if (!is_string($contentFile) || empty($contentFile)) {
			throw new \InvalidArgumentException('Invalid page content file');
		}
		$this->contentFile = $contentFile;
	}
	public function addVar($key, $value) {
		if (!is_string($key) || is_numeric($key) || empty($key)) {
			throw new \InvalidArgumentException('Invalid page var');
		}
		$this->vars[$key] = $value;
	}
	public function getGeneratedPage() {
		if (!file_exists($this->contentFile)) {
			throw new \RuntimeException('Invalid page content file');
		}
		$user = $this->app->user();
		extract($this->vars);
		ob_start();
			require $this->contentFile;
			$content = ob_get_clean();
		ob_start();
			require __DIR__.'/../Applications/'.$this->app->name().'/Templates/layout.php';
		return ob_get_clean();
	}
}