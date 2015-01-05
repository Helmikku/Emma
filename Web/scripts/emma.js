

// ----------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- LIBRARY ---------------------------------------------- //
// ----------------------------------------------------------------------------------------------------- //



if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, ''); 
	};
}

if (typeof Emma == 'undefined') {
	var Emma = {};
}

Emma.Config = {
	FILTER: 'hoho'
};

Emma.Core = {
	LOADING: document.getElementById('loading'),
	SECTION: null,
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
	getCookie: function(name) {
		name += '=';
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim();
			if (cookie.indexOf(name) === 0) {
				return cookie.substring(name.length);
			}
		}
		return '';
	},
	setCookie: function(name, value, expirationDays) {
		var now = new Date();
		now.setTime(now.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
		document.cookie = name + '=' + value + '; expires=' + now.toGMTString() + '; path=/';
	},
	showSection: function(section) {
		if (Emma.Core.SECTION !== null) {
			Emma.Core.SECTION.style.display = 'none';
		}
		Emma.Core.SECTION = section;
		Emma.Core.SECTION.style.display = 'block';
	}
};

Emma.Exhibitions = {
	LIST: [],
	SECTION: document.getElementById('exhibitions_section'),
	show: function() {
		Emma.Core.showSection(Emma.Exhibitions.SECTION);
	}
};

Emma.Me = {
	SECTION: document.getElementById('me_section'),
	show: function() {
		Emma.Core.showSection(Emma.Me.SECTION);
	}
};

Emma.Works = {
	CONTAINER: document.getElementById('works_list'),
	LIST: [],
	SECTION: document.getElementById('works_section'),
	init: function() {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.success) {
					Emma.Works.CONTAINER.innerHTML = '';
					for (var i = 0; i < response.works.length; i++) {
						var work = new Work (response.works[i]);
						Emma.Works.CONTAINER.appendChild(work.outlines());
					}
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
		Emma.Core.showSection(Emma.Works.SECTION);
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
	for (var i = 0; i < this.thumbnails.length; i++) {
		this.thumbnails[i] = Emma.Core.createElement('img', [{name: 'class', value: 'thumbnail'}, {name: 'src', value: '/images/' + this.thumbnails[i]}, {name: 'title', value: this.title}], [], false)
	}
	for (var i = 0; i < this.images.length; i++) {
		this.images[i] = Emma.Core.createElement('img', [{name: 'class', value: 'thumbnail'}, {name: 'src', value: '/images/' + this.images[i]}, {name: 'title', value: this.title}], [], false)
	}
}


Work.prototype.outlines = function() {
	var handler
	return Emma.Core.createElement('div', [{name: 'class', value: 'outlines'}], [
		this.thumbnails[0],
		Emma.Core.createElement('div', [{name: 'class', value: 'caption'}], [
			Emma.Core.createElement('h2', [], [document.createTextNode(this.title)], false),
			Emma.Core.createElement('p', [], [document.createTextNode(this.caption)], false)
		], false)
	], true, 'click', (function() {}));
}