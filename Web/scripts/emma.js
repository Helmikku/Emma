// Problème lorsqu'on clique plusieurs fois sur la même section


// ----------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- LIBRARY ---------------------------------------------- //
// ----------------------------------------------------------------------------------------------------- //



if (typeof Emma == 'undefined') {
	var Emma = {};
}

Emma.Config = {
	FACEBOOK_APP_ID: '1553833488197470',
	IMAGE: {
		HEIGHT: 540,
		WIDTH: 720
	},
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
	h1: function(text) {
		return Emma.Core.createElement('h1', [], [document.createTextNode(text)], false);
	},
	h2: function(text) {
		return Emma.Core.createElement('h2', [], [document.createTextNode(text)], false);
	},
	p: function(text) {
		return Emma.Core.createElement('p', [], [document.createTextNode(text)], false);
	},
	showArticle: function(module) {
		if (Emma.Core.MODULE !== null && Emma.Core.MODULE !== module) {
			Emma.Core.MODULE.SECTION.style.display = 'none';
			Emma.Core.MODULE.TAB.className = 'tab';
		}
		Emma.Core.MODULE = module;
		Emma.Core.MODULE.SUMMARY.style.display = 'none';
		Emma.Core.MODULE.ARTICLE.style.display = 'block';
		Emma.Core.MODULE.SECTION.style.display = 'block';
		Emma.Core.MODULE.TAB.className = 'active tab';
	},
	showSection: function(module) {
		if (Emma.Core.MODULE !== null && Emma.Core.MODULE !== module) {
			Emma.Core.MODULE.SECTION.style.display = 'none';
			Emma.Core.MODULE.TAB.className = 'tab';
		}
		if (module !== null) {
			Emma.Core.MODULE = module;
			Emma.Core.MODULE.SUMMARY.style.display = 'block';
			Emma.Core.MODULE.ARTICLE.style.display = 'none';
			Emma.Core.MODULE.SECTION.style.display = 'block';
			Emma.Core.MODULE.TAB.className = 'active tab';
		} else {

		}
	}
};

Emma.Exhibitions = {
	LIST: [],
	SECTION: document.getElementById('exhibitions'),
	SUMMARY: document.getElementById('exhibitions_summary'),
	ARTICLE: document.getElementById('exhibitions_article'),
	TAB: document.getElementById('exhibitions_tab'),
	show: function() {
		Emma.History.push({section: 'exhibitions'}, 'Exhibitions', '/exhibitions');
		Emma.Core.showSection(Emma.Exhibitions);
	}
};

Emma.Facebook = {
	connect: function() {
		FB.getLoginStatus(function(response) {
			if (response.status == 'connected') {
				Emma.User.signIn();
			} else {
				FB.Event.subscribe('auth.statusChange', function(response) {
					if (response.status == 'connected') {
						Emma.User.signIn();
					}
				});
				FB.login();
			}
		});
	},
	init: function() {
		FB.init({
			appId      : Emma.Config.FACEBOOK_APP_ID,
			cookie     : true,
			oauth      : true,
			status     : true,
			version    : 'v2.2',
			xfbml      : false
		});
	}
};

Emma.History = {
	URL: '/',
	load: function(event) {
		var path = window.location.pathname.split('/');
		if (path[1] == 'exhibitions') {
			Emma.Core.showSection(Emma.Exhibitions);
		} else if (path[1] == 'me') {
			Emma.Core.showSection(Emma.Me);
		} else if (path[1] == 'works') {
			if (path.length > 2) {
				if (Emma.Works.LIST.length === 0) {
					Emma.Works.init(path[2]);
				} else {
					for (var i = 0; i < Emma.Works.LIST.length; i++) {
						if (Emma.Works.LIST[i].id == path[2]) {
							Emma.Core.emptyElement(Emma.Works.ARTICLE);
							Emma.Works.ARTICLE.appendChild(Emma.Works.LIST[i].article());
							Emma.Core.showArticle(Emma.Works);
							break;
						}
					}
				}
			} else {
				if (Emma.Works.LIST.length === 0) {
					Emma.Works.init();
				}
				Emma.Core.showSection(Emma.Works);
			}
		} else {
			Emma.Home.show();
		}
		//if (event.state !== null) {} else {}
	},
	push: function(state, title, url) {
		Emma.History.URL = url;
		history.pushState(state, title, url);
	}
};

Emma.Home = {
	show: function() {
		Emma.History.push({section: 'home'}, 'Home', '/');
		Emma.Core.showSection(null);
	}
};

Emma.Me = {
	SECTION: document.getElementById('me'),
	SUMMARY: document.getElementById('me_summary'),
	ARTICLE: document.getElementById('me_article'),
	TAB: document.getElementById('me_tab'),
	show: function() {
		Emma.History.push({section: 'me'}, 'Me', '/me');
		Emma.Core.showSection(Emma.Me);
	}
};

Emma.User = {
	me: function() {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.success) {
					console.log('Bienvenue ' + response.name);
					console.log(response);
				} else {
					console.log(response);
				}
				Emma.Core.LOADING.style.display = 'none';
			} else if (xhr.readyState < 4) {
				Emma.Core.LOADING.style.display = 'block';
			}
		};
		xhr.open('GET', '/api/users/me', true);
		xhr.send();
	},
	signIn: function() {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.success) {
					Emma.User.me();
				} else {
					console.log(response);
				}
				Emma.Core.LOADING.style.display = 'none';
			} else if (xhr.readyState < 4) {
				Emma.Core.LOADING.style.display = 'block';
			}
		};
		xhr.open('GET', '/api/users/signin', true);
		xhr.send();
	},
	signOut: function() {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.success) {
					console.log('À bientôt !');
					console.log(response);
				} else {
					console.log(response);
				}
				Emma.Core.LOADING.style.display = 'none';
			} else if (xhr.readyState < 4) {
				Emma.Core.LOADING.style.display = 'block';
			}
		};
		xhr.open('GET', '/api/users/signout', true);
		xhr.send();
	}
}

Emma.Works = {
	LIST: [],
	SECTION: document.getElementById('works'),
	SUMMARY: document.getElementById('works_summary'),
	ARTICLE: document.getElementById('works_article'),
	TAB: document.getElementById('works_tab'),
	init: function(id) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.success) {
					Emma.Core.emptyElement(Emma.Works.SUMMARY);
					Emma.Works.SUMMARY.appendChild(Emma.Core.h1(Emma.Config.WORKS.TITLE));
					Emma.Works.SUMMARY.appendChild(Emma.Core.p(Emma.Config.WORKS.INTRODUCTION));
					for (var i = 0; i < response.works.length; i++) {
						var work = new Work (response.works[i]);
						Emma.Works.LIST.push(work);
						Emma.Works.SUMMARY.appendChild(work.overview());
						if (id !== null && id == work.id) {
							Emma.Works.ARTICLE.appendChild(work.article());
							Emma.Core.showArticle(Emma.Works);
						}
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
		Emma.History.push({section: 'works'}, 'Works', '/works');
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


Work.prototype.article = function() {
	return Emma.Core.createElement('div', [{name: 'class', value: 'work'}], [
		Emma.Core.createElement('div', [{name: 'class', value: 'caption clear'}], [
			Emma.Core.h1(this.title),
			Emma.Core.p(this.caption)
		], false),
		this.slider(),
		Emma.Core.createElement('div', [{name: 'class', value: 'description clear'}], [
			Emma.Core.p(this.description)
		], false)
	], false);
};


Work.prototype.overview = function() {
	var work = this;
	return Emma.Core.createElement('div', [{name: 'class', value: 'work'}], [
		Emma.Core.createElement('img', [{name: 'class', value: 'thumbnail'}, {name: 'src', value: '/images/' + this.thumbnails[0]}, {name: 'title', value: this.title}], [], false),
		Emma.Core.createElement('div', [{name: 'class', value: 'caption'}], [
			Emma.Core.h2(this.title),
			Emma.Core.p(this.caption)
		], false)
	], true, 'click', (function() { work.show(); }));
};


Work.prototype.show = function() {
	Emma.History.push({section: 'works', id: this.id}, this.title, '/works/' + this.id);
	Emma.Core.emptyElement(Emma.Works.ARTICLE);
	Emma.Works.ARTICLE.appendChild(this.article());
	Emma.Core.showArticle(Emma.Works);
};


Work.prototype.slider = function() {
	var work = this;
	var images = [Emma.Core.createElement('div', [{name: 'style', value: 'height: ' + this.images.length * Emma.Config.IMAGE.HEIGHT + 'px;'}], [], false)];
	var thumbnails = [];
	for (var i = 0; i < this.thumbnails.length; i++) {
		(function(i) {
			images[0].appendChild(
				Emma.Core.createElement('div', [{name: 'class', value: 'image n' + i}], [
					Emma.Core.createElement('img', [{name: 'src', value: '/images/' + work.images[i]}, {name: 'title', value: i + 1}], [], false)
				], false)
			);
			thumbnails.push(
				Emma.Core.createElement('div', [{name: 'class', value: 'thumbnail n' + i}], [
					Emma.Core.createElement('img', [{name: 'src', value: '/images/' + work.thumbnails[i]}, {name: 'title', value: i + 1}], [], false)
				], true, 'click', (function() { images[0].style.top = (-i * Emma.Config.IMAGE.HEIGHT) + 'px'; }))
			);
		})(i);
	}
	return Emma.Core.createElement('div', [{name: 'class', value: 'slider'}], [
		Emma.Core.createElement('div', [{name: 'class', value: 'images'}], images, false),
		Emma.Core.createElement('div', [{name: 'class', value: 'thumbnails'}], thumbnails, false)
	], false);
};

