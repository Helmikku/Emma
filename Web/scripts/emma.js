

// ----------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- LIBRARY ---------------------------------------------- //
// ----------------------------------------------------------------------------------------------------- //



var Emma = {};

Emma.Config = {
	FACEBOOK_APP_ID: '1553833488197470',
	IMAGE: {
		HEIGHT: 540,
		WIDTH: 720
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
	html: function(html) {
		var element = Emma.Core.createElement('div', [], [], false);
		element.innerHTML = html;
		return element;
	},
	p: function(text) {
		return Emma.Core.createElement('p', [], [document.createTextNode(text)], false);
	},
	showArticle: function(module) {
		if (Emma.Core.MODULE !== null && Emma.Core.MODULE !== module) {
			Emma.Core.MODULE.SECTION.style.display = 'none';
			Emma.Core.MODULE.TAB.className = 'tab';
		}
		if (module !== null) {
			Emma.Core.MODULE = module;
			Emma.Core.MODULE.SUMMARY.style.display = 'none';
			Emma.Core.MODULE.ARTICLE.style.display = 'block';
			Emma.Core.MODULE.SECTION.style.display = 'block';
			Emma.Core.MODULE.TAB.className = 'active tab';
			document.getElementById('emma').style.background = '#ffffff';
		} else {
			document.getElementById('emma').removeAttribute('style');
		}
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
			document.getElementById('emma').style.background = '#ffffff';
		} else {
			document.getElementById('emma').removeAttribute('style');
		}
	}
};

Emma.Exhibitions = {
	LIST: [],
	SECTION: document.getElementById('exhibitions'),
	SUMMARY: document.getElementById('exhibitions_summary'),
	ARTICLE: document.getElementById('exhibitions_article'),
	TAB: document.getElementById('exhibitions_tab'),
	init: function(id) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.success && response.exhibitions && response.exhibitions.length) {
					Emma.Core.emptyElement(Emma.Exhibitions.SUMMARY);
					for (var i = 0; i < response.exhibitions.length; i++) {
						var exhibition = new Exhibition (response.exhibitions[i]);
						Emma.Exhibitions.LIST.push(exhibition);
						Emma.Exhibitions.SUMMARY.appendChild(exhibition.overview());
						if (id !== null && id == exhibition.id) {
							Emma.Exhibitions.ARTICLE.appendChild(exhibition.article());
							Emma.Core.showArticle(Emma.Exhibitions);
						}
					}
					Emma.Exhibitions.SUMMARY.appendChild(Emma.Core.createElement('div', [{name: 'class', value: 'clear'}], [], false));
				} else {
					console.log(response);
				}
				Emma.Core.LOADING.style.display = 'none';
			} else if (xhr.readyState < 4) {
				Emma.Core.LOADING.style.display = 'block';
			}
		};
		xhr.open('GET', '/api/exhibitions/init', true);
		xhr.send();
	},
	show: function() {
		if (Emma.Exhibitions.LIST.length === 0) {
			Emma.Exhibitions.init();
		}
		Emma.Core.showSection(Emma.Exhibitions);
		Emma.History.push({section: 'exhibitions'}, 'Exhibitions', '/exhibitions');
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
			appId: Emma.Config.FACEBOOK_APP_ID,
			cookie: true,
			oauth: true,
			status: true,
			version: 'v2.2',
			xfbml: false
		});
	}
};

Emma.History = {
	URL: null,
	load: function() {
		var i = 0;
		var path = window.location.pathname.split('/');
		if (path[1] == 'exhibitions') {
			if (path.length > 2) {
				if (Emma.Exhibitions.LIST.length === 0) {
					Emma.Exhibitions.init(path[2]);
				} else {
					for (i = 0; i < Emma.Exhibitions.LIST.length; i++) {
						if (Emma.Exhibitions.LIST[i].id == path[2]) {
							Emma.Core.emptyElement(Emma.Exhibitions.ARTICLE);
							Emma.Exhibitions.ARTICLE.appendChild(Emma.Exhibitions.LIST[i].article());
							Emma.Core.showArticle(Emma.Exhibitions);
							break;
						}
					}
				}
			} else {
				if (Emma.Exhibitions.LIST.length === 0) {
					Emma.Exhibitions.init();
				}
				Emma.Core.showSection(Emma.Exhibitions);
			}
		} else if (path[1] == 'me') {
			Emma.Core.showSection(Emma.Me);
		} else if (path[1] == 'works') {
			if (path.length > 2) {
				if (Emma.Works.LIST.length === 0) {
					Emma.Works.init(path[2]);
				} else {
					for (i = 0; i < Emma.Works.LIST.length; i++) {
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
	},
	push: function(state, title, url) {
		if (Emma.History.URL != url && history.pushState) {
			Emma.History.URL = url;
			history.pushState(state, title, url);
			ga('set', 'page', url);
			ga('send', 'pageview');
		}
	}
};

Emma.Home = {
	show: function() {
		Emma.Core.showSection(null);
		Emma.History.push({section: 'home'}, 'Home', '/');
	}
};

Emma.Me = {
	SECTION: document.getElementById('me'),
	SUMMARY: document.getElementById('me_summary'),
	ARTICLE: document.getElementById('me_article'),
	TAB: document.getElementById('me_tab'),
	show: function() {
		Emma.Core.showSection(Emma.Me);
		Emma.History.push({section: 'me'}, 'Me', '/me');
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
};

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
		if (Emma.Works.LIST.length === 0) {
			Emma.Works.init();
		}
		Emma.Core.showSection(Emma.Works);
		Emma.History.push({section: 'works'}, 'Works', '/works');
	}
};




// ----------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- CLASSES ---------------------------------------------- //
// ----------------------------------------------------------------------------------------------------- //



function Exhibition (data) {
	this.id = data.hasOwnProperty('id') ? data.id : null;
	this.title = data.hasOwnProperty('title') ? data.title : null;
	this.caption = data.hasOwnProperty('caption') ? data.caption : null;
	this.description = data.hasOwnProperty('description') ? data.description : null;
	this.thumbnails = data.hasOwnProperty('thumbnails') ? data.thumbnails.split(',') : [];
	this.images = data.hasOwnProperty('images') ? data.images.split(',') : [];
	this.date = data.hasOwnProperty('date') ? data.date : null;
	this.place_id = data.hasOwnProperty('place_id') ? data.place_id : null;
}


Exhibition.prototype.article = function() {
	return Emma.Core.createElement('div', [{name: 'class', value: 'exhibition'}], [
		Emma.Core.createElement('div', [{name: 'class', value: 'caption clear'}], [
			Emma.Core.h1(this.title),
			Emma.Core.html(this.caption)
		], false),
		this.slider(),
		Emma.Core.createElement('div', [{name: 'class', value: 'description clear'}], [
			Emma.Core.html(this.description)
		], false)
	], false);
};


Exhibition.prototype.overview = function() {
	var exhibition = this;
	return Emma.Core.createElement('div', [{name: 'class', value: 'exhibition'}], [
		Emma.Core.createElement('img', [{name: 'class', value: 'thumbnail'}, {name: 'src', value: '/images/' + this.thumbnails[0]}, {name: 'title', value: this.title}], [], false),
		Emma.Core.createElement('div', [{name: 'class', value: 'caption'}], [
			Emma.Core.h2(this.title),
			Emma.Core.html(this.caption)
		], false)
	], true, 'click', (function() { exhibition.show(); }));
};


Exhibition.prototype.show = function() {
	Emma.History.push({section: 'exhibitions', id: this.id}, this.title, '/exhibitions/' + this.id);
	Emma.Core.emptyElement(Emma.Exhibitions.ARTICLE);
	Emma.Exhibitions.ARTICLE.appendChild(this.article());
	Emma.Core.showArticle(Emma.Exhibitions);
};


Exhibition.prototype.slider = function() {
	var exhibition = this;
	var images = [Emma.Core.createElement('div', [{name: 'class', value: 'files'}, {name: 'style', value: 'top: 0px; height: ' + this.images.length * Emma.Config.IMAGE.HEIGHT + 'px;'}], [], false)];
	var thumbnails = [];
	for (var i = 0; i < this.thumbnails.length; i++) {
		(function(i) {
			images[0].appendChild(
				Emma.Core.createElement('div', [{name: 'class', value: 'image n' + i}], [
					Emma.Core.createElement('img', [{name: 'src', value: '/images/' + exhibition.images[i]}], [], false)
				], false)
			);
			thumbnails.push(
				Emma.Core.createElement('div', [{name: 'class', value: 'thumbnail n' + i}], [
					Emma.Core.createElement('img', [{name: 'src', value: '/images/' + exhibition.thumbnails[i]}, {name: 'title', value: i + 1}], [], false),
					Emma.Core.createElement('div', [{name: 'class', value: 'shadow'}], [], false)
				], true, 'click', (function() {
					images[0].style.top = (-i * Emma.Config.IMAGE.HEIGHT) + 'px';
					if (i === 0) {
						images[0].parentNode.className = 'images start';
					} else if (i == exhibition.thumbnails.length - 1) {
						images[0].parentNode.className = 'images end';
					} else {
						images[0].parentNode.className = 'images';
					}
				}))
			);
		})(i);
	}
	if (this.thumbnails.length > 1) {
		images.push(Emma.Core.createElement('div', [{name: 'class', value: 'next button'}], [
			Emma.Core.createElement('div', [], [], true, 'click', (function() {
				var nextTop = images[0].offsetTop - Emma.Config.IMAGE.HEIGHT;
				images[0].style.top = Math.max(- (exhibition.thumbnails.length - 1) * Emma.Config.IMAGE.HEIGHT, nextTop) + 'px';
				if (nextTop == - (exhibition.thumbnails.length - 1) * Emma.Config.IMAGE.HEIGHT) {
					images[0].parentNode.className = 'images end';
				} else {
					images[0].parentNode.className = 'images';
				}
			}))
		], false));
		images.push(Emma.Core.createElement('div', [{name: 'class', value: 'previous button'}], [
			Emma.Core.createElement('div', [], [], true, 'click', (function() {
				var previousTop = images[0].offsetTop + Emma.Config.IMAGE.HEIGHT;
				images[0].style.top = Math.min(0, previousTop) + 'px';
				if (previousTop === 0) {
					images[0].parentNode.className = 'images start';
				} else {
					images[0].parentNode.className = 'images';
				}
			}))
		], false));
	}
	return Emma.Core.createElement('div', [{name: 'class', value: 'slider'}], [
		Emma.Core.createElement('div', [{name: 'class', value: 'images start'}], images, false),
		Emma.Core.createElement('div', [{name: 'class', value: 'thumbnails'}], thumbnails, false)
	], false);
};



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
			Emma.Core.html(this.caption)
		], false),
		this.slider(),
		Emma.Core.createElement('div', [{name: 'class', value: 'description clear'}], [
			Emma.Core.html(this.description)
		], false)
	], false);
};


Work.prototype.overview = function() {
	var work = this;
	return Emma.Core.createElement('div', [{name: 'class', value: 'work'}], [
		Emma.Core.createElement('img', [{name: 'class', value: 'thumbnail'}, {name: 'src', value: '/images/' + this.thumbnails[0]}, {name: 'title', value: this.title}], [], false),
		Emma.Core.createElement('div', [{name: 'class', value: 'caption'}], [
			Emma.Core.h2(this.title),
			Emma.Core.html(this.caption)
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
	var images = [Emma.Core.createElement('div', [{name: 'class', value: 'files'}, {name: 'style', value: 'top: 0px; height: ' + this.images.length * Emma.Config.IMAGE.HEIGHT + 'px;'}], [], false)];
	var thumbnails = [];
	for (var i = 0; i < this.thumbnails.length; i++) {
		(function(i) {
			images[0].appendChild(
				Emma.Core.createElement('div', [{name: 'class', value: 'image n' + i}], [
					Emma.Core.createElement('img', [{name: 'src', value: '/images/' + work.images[i]}], [], false)
				], false)
			);
			thumbnails.push(
				Emma.Core.createElement('div', [{name: 'class', value: 'thumbnail n' + i}], [
					Emma.Core.createElement('img', [{name: 'src', value: '/images/' + work.thumbnails[i]}, {name: 'title', value: i + 1}], [], false),
					Emma.Core.createElement('div', [{name: 'class', value: 'shadow'}], [], false)
				], true, 'click', (function() {
					images[0].style.top = (-i * Emma.Config.IMAGE.HEIGHT) + 'px';
					if (i === 0) {
						images[0].parentNode.className = 'images start';
					} else if (i == work.thumbnails.length - 1) {
						images[0].parentNode.className = 'images end';
					} else {
						images[0].parentNode.className = 'images';
					}
				}))
			);
		})(i);
	}
	if (this.thumbnails.length > 1) {
		images.push(Emma.Core.createElement('div', [{name: 'class', value: 'next button'}], [
			Emma.Core.createElement('div', [], [], true, 'click', (function() {
				var nextTop = images[0].offsetTop - Emma.Config.IMAGE.HEIGHT;
				images[0].style.top = Math.max(- (work.thumbnails.length - 1) * Emma.Config.IMAGE.HEIGHT, nextTop) + 'px';
				if (nextTop == - (work.thumbnails.length - 1) * Emma.Config.IMAGE.HEIGHT) {
					images[0].parentNode.className = 'images end';
				} else {
					images[0].parentNode.className = 'images';
				}
			}))
		], false));
		images.push(Emma.Core.createElement('div', [{name: 'class', value: 'previous button'}], [
			Emma.Core.createElement('div', [], [], true, 'click', (function() {
				var previousTop = images[0].offsetTop + Emma.Config.IMAGE.HEIGHT;
				images[0].style.top = Math.min(0, previousTop) + 'px';
				if (previousTop === 0) {
					images[0].parentNode.className = 'images start';
				} else {
					images[0].parentNode.className = 'images';
				}
			}))
		], false));
	}
	return Emma.Core.createElement('div', [{name: 'class', value: 'slider'}], [
		Emma.Core.createElement('div', [{name: 'class', value: 'images start'}], images, false),
		Emma.Core.createElement('div', [{name: 'class', value: 'thumbnails'}], thumbnails, false)
	], false);
};

