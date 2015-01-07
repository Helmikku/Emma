

// ----------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- LIBRARY ---------------------------------------------- //
// ----------------------------------------------------------------------------------------------------- //



if (typeof Emma == 'undefined') {
	var Emma = {};
}

Emma.Config = {
	WORKS: {
		TITLE: 'My works',
		INTRODUCTION: 'Please take a look of my works. They are sorted from the most recent one to the last'
	}
};

Emma.Core = {
	LOADING: document.getElementById('loading'),
	MODULE: null,
	addEvent: function(element, event, handler) {
		if (element.addEventListener) {
			element.addEventListener(event, handler, false);
		} else {
			if (event == 'input') {
				event = 'change';
			}
			element.attachEvent('on' + event, handler);
		}
	},
	createElement: function(tag, attributes, childs, interactive, event, handler) {
		var element = document.createElement(tag);
		var i;
		if (attributes !== null) {
			for (i = 0; i < attributes.length; i++) {
				element.setAttribute(attributes[i].name, attributes[i].value);
			}
		}
		if (childs !== null) {
			for (i = 0; i < childs.length; i++) {
				element.appendChild(childs[i]);
			}
		}
		if (interactive) {
			Emma.Core.addEvent(element, event, handler);
		}
		return element;
	},
	emptyElement: function(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	},
	formatDate: function(date) {
		return ((date.getDate() < 10) ? '0' : '') + date.getDate() + '/' + ((date.getMonth() < 9) ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear();
	},
	formatNumber: function(number, length) {
		number += '';
		if (number.length > length) {
			return number.slice(number.length - length);
		} else {
			while (number.length < length) {
				number = '0' + number;
			}
			return number;
		}
	},
	showArticle: function() {
		Emma.Core.MODULE.SUMMARY.style.display = 'none';
		Emma.Core.MODULE.ARTICLE.style.display = 'block';
	},
	showSection: function(module) {
		if (Emma.Core.MODULE !== null) {
			Emma.Core.MODULE.SECTION.style.display = 'none';
			Emma.Core.MODULE.TAB.className = 'tab';
			Emma.Core.showSummary();
		}
		Emma.Core.MODULE = module;
		Emma.Core.MODULE.SECTION.style.display = 'block';
		Emma.Core.MODULE.TAB.className = 'active tab';
	},
	showSummary: function() {
		Emma.Core.MODULE.ARTICLE.style.display = 'none';
		Emma.Core.MODULE.SUMMARY.style.display = 'block';
	}
};

Emma.Exhibitions = {
	LIST: [],
	SECTION: document.getElementById('exhibitions'),
	SUMMARY: document.getElementById('exhibitions_summary'),
	ARTICLE: document.getElementById('exhibitions_article'),
	TAB: document.getElementById('exhibitions_tab'),
	show: function() {
		Emma.Core.showSection(Emma.Exhibitions);
	}
};

Emma.Me = {
	SECTION: document.getElementById('me'),
	SUMMARY: document.getElementById('me_summary'),
	ARTICLE: document.getElementById('me_article'),
	TAB: document.getElementById('me_tab'),
	show: function() {
		Emma.Core.showSection(Emma.Me);
	}
};

Emma.Works = {
	LIST: [],
	SECTION: document.getElementById('works'),
	SUMMARY: document.getElementById('works_summary'),
	ARTICLE: document.getElementById('works_article'),
	TAB: document.getElementById('works_tab'),
	init: function() {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.success) {
					Emma.Core.emptyElement(Emma.Works.SUMMARY);
					Emma.Works.SUMMARY.appendChild(Emma.Core.createElement('h1', [], [document.createTextNode(Emma.Config.WORKS.TITLE)], false));
					Emma.Works.SUMMARY.appendChild(Emma.Core.createElement('p', [], [document.createTextNode(Emma.Config.WORKS.INTRODUCTION)], false));
					for (var i = 0; i < response.works.length; i++) {
						var work = new Work (response.works[i]);
						Emma.Works.LIST.push(work);
						Emma.Works.SUMMARY.appendChild(work.overview());
					}
					Emma.Works.SUMMARY.appendChild(Emma.Core.createElement('div', [{name: 'class', value: 'clear'}], [], false));
				} else {
					console.log(response);
				}
				Emma.Core.LOADING.style.display = 'none';
			} else if (xhr.readyState < 4) {
				Emma.Core.LOADING.style.display = 'block';
			}
		};
		xhr.open('GET', '/api/works/init', true);
		xhr.send();
	},
	show: function() {
		if (Emma.Works.LIST.length === 0) {
			Emma.Works.init();
		}
		Emma.Core.showSection(Emma.Works);
	}
};




// ----------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- CLASSES ---------------------------------------------- //
// ----------------------------------------------------------------------------------------------------- //



function Work (data) {
	this.id = data.hasOwnProperty('id') ? data.id : null;
	this.title = data.hasOwnProperty('title') ? data.title : null;
	this.caption = data.hasOwnProperty('caption') ? data.caption : null;
	this.description = data.hasOwnProperty('description') ? data.description : null;
	this.thumbnails = data.hasOwnProperty('thumbnails') ? data.thumbnails.split(',') : [];
	this.images = data.hasOwnProperty('images') ? data.images.split(',') : [];
	this.date = data.hasOwnProperty('date') ? data.date : null;
	this.collection_id = data.hasOwnProperty('collection_id') ? data.collection_id : null;
}


Work.prototype.show = function() {
	var work = this;
	Emma.Core.emptyElement(Emma.Works.ARTICLE);
	Emma.Works.ARTICLE.appendChild(
		Emma.Core.createElement('div', [{name: 'class', value: 'work'}], [
			Emma.Core.createElement('div', [{name: 'class', value: 'caption'}], [
				Emma.Core.createElement('h1', [], [document.createTextNode(this.title)], false),
				Emma.Core.createElement('p', [], [document.createTextNode(this.caption)], false)
			], false),
			Emma.Core.createElement('img', [{name: 'class', value: 'thumbnail'}, {name: 'src', value: '/images/' + this.images[0]}, {name: 'title', value: this.title}], [], false)
		], false)
	);
	Emma.Core.showArticle();
}


Work.prototype.overview = function() {
	var work = this;
	return Emma.Core.createElement('div', [{name: 'class', value: 'work'}], [
		Emma.Core.createElement('img', [{name: 'class', value: 'thumbnail'}, {name: 'src', value: '/images/' + this.thumbnails[0]}, {name: 'title', value: this.title}], [], false),
		Emma.Core.createElement('div', [{name: 'class', value: 'caption'}], [
			Emma.Core.createElement('h2', [], [document.createTextNode(this.title)], false),
			Emma.Core.createElement('p', [], [document.createTextNode(this.caption)], false)
		], false)
	], true, 'click', (function() {work.show();}));
}