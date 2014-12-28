<?php
namespace Applications\API\Modules\Works;

class WorksController extends \Library\Controller {
	public function runGet(\Library\HTTPRequest $request) {
		if ($request->getExists('work_id')) {
			$works = $this->app->database()->getModelOf('Works')->getWorkById($request->getData('work_id'));
			$this->page->addVar('success', true);
			$this->page->addVar('works', $works);
		} else {
			if ($request->getExists('page_number')) {
				$page_number = (int) $request->getData('page_number');
			} else {
				$page_number = 1;
			}
			$page_size = $this->app->config()->getDefinition('page_size');
			if ($request->getExists('collection_id')) {
				$filters = [$collection_id => $request->getData('collection_id')];
			} else {
				$filters = []; 
			}
			$works = $this->app->database()->getModelOf('Works')->getWorksList($filters, $page_number, $page_size);
			$this->page->addVar('success', true);
			$this->page->addVar('works', $works);
		}
	}
}