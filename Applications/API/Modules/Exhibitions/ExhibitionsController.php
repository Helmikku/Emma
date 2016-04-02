<?php
namespace Applications\API\Modules\Exhibitions;

class ExhibitionsController extends \Library\Controller {
	public function runGet(\Library\HTTPRequest $request) {
		if ($request->getExists('exhibition_id')) {
			$this->page->addVar('success', true);
			$this->page->addVar('exhibitions', $this->app->database()->getModelOf('Exhibitions')->getExhibitionById($request->getData('exhibition_id')));
		} else {
			$page_size = $this->app->config()->getDefinition('page_size');
			if ($request->getExists('page_number')) {
				$page_number = (int) $request->getData('page_number');
			} else {
				$page_number = 1;
			}
			if ($request->getExists('place_id')) {
				$filters = [$place_id => $request->getData('place_id')];
			} else {
				$filters = []; 
			}
			$this->page->addVar('success', true);
			$this->page->addVar('exhibitions', $this->app->database()->getModelOf('Exhibitions')->getExhibitionsList($filters, $page_number, $page_size));
		}
	}
	public function runInit(\Library\HTTPRequest $request) {
		$this->page->addVar('success', true);
		$this->page->addVar('exhibitions', $this->app->database()->getModelOf('Exhibitions')->getExhibitionsList());
	}
}