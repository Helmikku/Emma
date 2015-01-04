

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
	LIST: [],
	SECTION: document.getElementById('works_section'),
	init: function() {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.success) {
					Emma.Works.SECTION.innerHTML = '';
					for (var i = 0; i < response.works.length; i++) {
						var work = new Work (response.works[i]);
						Emma.Works.SECTION.appendChild(work.outlines());
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
	this.teaser = data.hasOwnProperty('teaser') ? data.teaser : null;
	this.body = data.hasOwnProperty('body') ? data.body : null;
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
		Emma.Core.createElement('div', [{name: 'class', value: 'outlines'}], [
			Emma.Core.createElement('h2', [], [document.createTextNode(this.title)], false),
			Emma.Core.createElement('p', [], [document.createTextNode(this.teaser)], false)
		], false)
	], true, 'click', (function() {}));
}


function loadThreads(loader,loading,display,list,page,brands_id,brands_ideas_number,brands_forum_number,forum_number,recipes_number,blog_number,blog_label) {
	var parameters = '?xslt=json-v2.xsl&page=' + page;
	var url = '/groupecasino/plugins/custom/groupecasino/groupecasino/cvous.threads';
	var xhr = new XMLHttpRequest();
	if (brands_id !== '' && brands_id !== null) {
		parameters += '&brands_id=' + brands_id + '&brands_ideas_number=' + brands_ideas_number + '&brands_forum_number=' + brands_forum_number;
	}
	if (forum_number > 0) {
		parameters += '&forum_number=' + forum_number;
	}
	if (recipes_number > 0) {
		parameters += '&recipes_number=' + recipes_number;
	}
	if (blog_number > 0) {
		parameters += '&blog_number=' + blog_number + '&blog_label=' + encodeURIComponent(blog_label);
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.responseText);
			if (response.response.status == 'success') {
				var threads = (typeof(response.response.threads.thread.length) != 'undefined') ? response.response.threads.thread : [response.response.threads.thread];
				for (var i = 0;i < threads.length;i++) {
					var thread = new Thread (new Topic (threads[i].id,threads[i].subject,threads[i].view_href,threads[i].teaser,threads[i].body,threads[i].post_time.date,new Ctop (threads[i].ctop.count,threads[i].ctop.status,threads[i].ctop.givers_href),threads[i].replies,new User(threads[i].author.id,threads[i].author.login,threads[i].author.avatar,threads[i].author.ranking_id,threads[i].author.ranking_name,threads[i].author.ranking_image_left,threads[i].author.ranking_image_right,threads[i].author.ranking_color),threads[i].board.id,threads[i].board.title,threads[i].section.brand.id,threads[i].section.brand.name,threads[i].section.type,threads[i].label.id,threads[i].label.text,threads[i].status.key,threads[i].status.name),[],[],[],display);
					var element = Emma.Core.createElement('div',[{name:'class', value:'minimized thread'}],[],false);
						thread.build(element);
					list.appendChild(element);
				}
			} else {
				loader.innerHTML = '<p>Pas d\'autre actualité pour le moment !</p>';
			}
			loader.style.display = 'block';
			loading.style.display = 'none';
		} else if (xhr.readyState < 4) {
			loader.style.display = 'none';
			loading.style.display = 'block';
		}
	};
	xhr.open('GET',url + parameters,true);
	xhr.send();
}




// ---------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- THREAD ---------------------------------------------- //
// ---------------------------------------------------------------------------------------------------- //

	// --- Thread Object ---
	function Thread (topic,replies,header,footer,display) {
		this.topic = topic;
		this.replies = replies;
		this.header = header;
		this.footer = footer;
		this.display = display;
	}

	// --- Thread Prototype ---
	Thread.prototype.build = function(thread) {
		thread.innerHTML = '';
		var author_avatar = Emma.Core.createElement('div',[{name:'class', value:'lia-user-avatar'}],[
			Emma.Core.createElement('a',[{name:'href', value:('/t5/user/viewprofilepage/user-id/' + this.topic.author.id)}],[
				Emma.Core.createElement('img',[{name:'class', value:'lia-user-avatar-message'},{name:'src', value:this.topic.author.avatar}],[],false)
			],false)
		],false);
		var author_name = Emma.Core.createElement('span',[{name:'class', value:'lia-user-name'}],[],false);
			if (this.topic.author.ranking_image_left !== '' && this.topic.author.ranking_image_left !== null) { author_name.appendChild(Emma.Core.createElement('img',[{name:'class', value:'lia-user-rank-icon-left'},{name:'title', value:this.topic.author.ranking_name},{name:'alt', value:this.topic.author.ranking_name},{name:'src', value:this.topic.author.ranking_image_left}],[],false)); }
			author_name.appendChild(Emma.Core.createElement('a',[{name:'href', value:('/t5/user/viewprofilepage/user-id/' + this.topic.author.id)},{name:'style', value:('color:' + this.topic.author.ranking_color + ';')}],[Emma.Core.createElement('span',[],[document.createTextNode(this.topic.author.login)],false)],false));
			if (this.topic.author.ranking_image_right !== '' && this.topic.author.ranking_image_right !== null) { author_name.appendChild( Emma.Core.createElement('img',[{name:'class', value:'lia-user-rank-icon-right'},{name:'title', value:this.topic.author.ranking_name},{name:'alt', value:this.topic.author.ranking_name},{name:'src', value:this.topic.author.ranking_image_right}],[],false)); }
		var status = (this.topic.status_name !== '' && this.topic.status_name !== null && this.topic.status_name != 'Unspecified') ? this.topic.status_name : '';
		var subject = Emma.Core.createElement('a',[{name:'href', value:this.topic.view_href}],[],false);
			subject.innerHTML = this.topic.subject;
		var heading = Emma.Core.createElement('div',[{name:'class', value:'lia-message-heading'}],[
				Emma.Core.createElement('h2',[{name:'class', value:'lia-message-subject'}],[
					Emma.Core.createElement('span',[{name:'class', value:('chip '+ Emma.User.CURRENT_BRAND + ' ' + this.topic.type)}],[],false),
					subject
				],false),
				Emma.Core.createElement('span',[{name:'class', value:'lia-message-subject-status'}],[
					Emma.Core.createElement('span',[{name:'class', value:'MessageStatus'}],[
						Emma.Core.createElement('a',[{name:'class', value:'lia-link-navigation message-status-link'}],[document.createTextNode(status)],false)
					],false)
				],false),
				Emma.Core.createElement('div',[{name:'class', value:'lia-message-author'}],[author_avatar,author_name],false)
			],false);
		var ctop = Emma.Core.createElement('div',[{name:'class', value:'lia-message-kudos'}],[],false);
			this.topic.ctop.build(ctop,this.topic);
		var label = (this.topic.label_text !== '' && this.topic.label_text !== null && this.topic.type == 'idea') ? ('dans ' + this.topic.label_text + ' ') : '';
		var body = Emma.Core.createElement('div',[{name:'class', value:'lia-message-body'}],[],false);
			body.innerHTML = this.topic.type == 'blog' ? this.topic.teaser : this.topic.body;
		var date = Emma.Core.createElement('div',[{name:'class', value:'lia-message-posted-on'}],[Emma.Core.createElement('span',[{name:'class', value:'local-date'}],[document.createTextNode('Posté ' + label + 'le ' + this.topic.date)],false)],false);
		var list = Emma.Core.createElement('div',[{name:'class', value:'CommentList'}],[],false);
			this.buildRepliesList(list);
		var loader = Emma.Core.createElement('span',[{name:'class', value:'loader'}],[],false);
			this.buildRepliesLoader(loader,thread,list);
		var form = Emma.Core.createElement('div',[{name:'class', value:'form'}],[],false);
			this.buildReplyForm(form,list);
		var topic = Emma.Core.createElement('div',[{name:'class', value:(this.topic.type + ' topic lia-panel-message lia-panel-message-root')}],[],false);
			topic.appendChild(Emma.Core.createElement('div',[{name:'class', value:'lia-decoration-border-top'}],this.header,false));
			topic.appendChild(Emma.Core.createElement('div',[{name:'class', value:'lia-decoration-border-content'}],[
				Emma.Core.createElement('div',[{name:'class', value:'lia-quilt-row-main'}],[heading,ctop,body,date],false),
				Emma.Core.createElement('div',[{name:'class', value:'lia-quilt-row-footer'}],[
					Emma.Core.createElement('div',[{name:'class', value:'thread_footer'}],[
						this.buildBrandLabel(),
						this.buildShareLinks(),
						this.buildGiversLink(),
						loader
					],false),
					Emma.Core.createElement('div',[{name:'class', value:'thread_replies'}],[list,form],false)
				],false)
			],false));
			topic.appendChild(Emma.Core.createElement('div',[{name:'class', value:'lia-decoration-border-bottom'}],this.footer,false));
		thread.appendChild(topic);
	};
	Thread.prototype.buildBrandLabel = function() {
		return(
			Emma.Core.createElement('a',[{name:'class', value:('label brand ' + this.topic.brand_id)},{name:'href', value:'#'}],[document.createTextNode(this.topic.brand_name)],false)
		);
	};
	Thread.prototype.buildGiversLink = function() {
		return(
			Emma.Core.createElement('span',[{name:'class', value:'givers'}],[
				Emma.Core.createElement('a',[{name:'href', value:this.topic.ctop.givers_href}],[document.createTextNode(this.topic.ctop.count + ' C\'Top')],false)
			],false)
		);
	};
	Thread.prototype.buildRepliesList = function(list) {
		list.innerHTML = '';
		for (var i = this.replies.length;i > 0;i--) {
			var reply = Emma.Core.createElement('div',[{name:'class', value:'reply lia-panel-message'}],[],false);
			this.replies[(i - 1)].build(reply);
			list.appendChild(reply);
		}
	};
	Thread.prototype.buildRepliesLoader = function(loader,thread,list) {
		var _this;
		var button;
		var handler;
		var label;
		var loading;
		loader.innerHTML = '';
		if (this.display == 'thumbnail') {
			if (this.topic.replies > 0) {
				_this = this;
				label = (this.topic.replies > 1) ? (this.topic.replies + ' commentaires') : ('1 commentaire');
				handler = function() { window.location = _this.topic.view_href; };
				button = Emma.Core.createElement('a',[{name:'class', value:'button'}],[document.createTextNode(label)],true,'click',handler);
				loader.appendChild(button);
			}
		} else {
			if (this.topic.replies > 0) {
				var repliesToLoad = this.topic.replies - this.replies.length;
				if (repliesToLoad > 0) {
					_this = this;
					loading = Emma.Core.createElement('span',[{name:'class', value:'loading'}],[document.createTextNode('Chargement...')],false);
					label = (repliesToLoad > 1) ? (repliesToLoad + ' commentaires') : ('1 commentaire');
					handler = function() { _this.loadReplies(loader,thread,list,loading); thread.className = thread.className.replace('minimized ',''); };
					button = Emma.Core.createElement('a',[{name:'class', value:'button'}],[document.createTextNode(label),Emma.Core.createElement('span',[{name:'class', value:'chip'}],[],false)],true,'click',handler);
					loader.appendChild(Emma.Core.createElement('span',[{name:'class', value:'separator'}],[document.createTextNode(' - ')],false));
					loader.appendChild(button);
					loader.appendChild(loading);
				}
			} else if (this.display != 'highlight') {
				handler = function() { thread.className = thread.className.replace('minimized ',''); loader.innerHTML = ''; };
				button = Emma.Core.createElement('a',[{name:'class', value:'button'}],[Emma.Core.createElement('span',[{name:'class', value:'chip'}],[],false)],true,'click',handler);
				loader.appendChild(button);
			}
		}
	};
	Thread.prototype.buildReplyForm = function(form,list) {
		var _this = this;
		var reply_input = Emma.Core.createElement('input',[{name:'type', value:'text'}, {name:'class', value:'reply'}, {name:'value', value:''}, {name:'placeholder', value:'Commenter'}],[],false);
		var submit = Emma.Core.createElement('input',[{name:'type', value:'submit'}, {name:'class', value:'submit'}, {name:'value', value:'OK'}],[],false);
		var loading = Emma.Core.createElement('span',[{name:'class', value:'loading'}],[document.createTextNode('Chargement...')],false);
		var handler = function (e) {
			if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
			_this.reply(reply_input,list,loading);
		};
		form.innerHTML = '';
		form.appendChild(Emma.Core.createElement('form',[],[reply_input,submit,loading],true,'submit',handler));
	};
	Thread.prototype.buildShareLinks = function() {
		return(
			Emma.Core.createElement('span',[{name:'class', value:'addthis_toolbox addthis_default_style'},{name:'addthis:url', value:('http://www.cvous.com' + this.topic.view_href)}],[
				Emma.Core.createElement('a',[{name:'class', value:'addthis_button_facebook'}],[],false),
				Emma.Core.createElement('a',[{name:'class', value:'addthis_button_twitter'}],[],false)
			],false)
		);
	};
	Thread.prototype.loadReplies = function(loader,thread,list,loading) {
		if (this.replies.length < this.topic.replies) {
			var _this = this;
			var page = parseInt(this.replies.length / Emma.Config.REPLIES_TO_LOAD) + 1;
			var repliesToSqueeze = this.replies.length - ((page - 1) * Emma.Config.REPLIES_TO_LOAD) - 1;
			var url = '/groupecasino/plugins/custom/groupecasino/groupecasino/cvous.replies.by.topic.id?id=' + this.topic.id + '&page=' + page + '&page_size=' + Emma.Config.REPLIES_TO_LOAD + '&xslt=json-v2.xsl';
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					loading.style.display = 'none';
					var response = JSON.parse(xhr.responseText);
					if (response.response.status == 'success') {
						var replies = (typeof(response.response.replies.reply.length) != 'undefined') ? response.response.replies.reply : [response.response.replies.reply];
						for (var i = 0;i < replies.length;i++) {
							if (i > repliesToSqueeze) {
								_this.replies.push(new Reply(replies[i].id,replies[i].body,replies[i].post_time.date.slice(0,10),new User(replies[i].author.id,replies[i].author.login,replies[i].author.avatar,replies[i].author.ranking_id,replies[i].author.ranking_name,replies[i].author.ranking_image_left,replies[i].author.ranking_image_right,replies[i].author.ranking_color,null,null)));
							}
						}
						_this.buildRepliesLoader(loader,thread,list);
						_this.buildRepliesList(list);
					} else {
						alert(Emma.Config.ERROR_MESSAGE);
					}
				} else if (xhr.readyState < 4) {
					loading.style.display = 'inline';
				}
			};
			xhr.open('GET',url,true);
			xhr.send();
		}
	};
	Thread.prototype.reply = function(reply_input,list,loading) {
		var _this = this;
		var url = '/restapi/vc/threads/id/' + this.topic.id + '/reply';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				loading.style.display = 'none';
				var response = JSON.parse(xhr.responseText);
				if (response.response.status == 'success') {
					if (_this.display == 'thumbnail') {
						window.location = response.response.message.view_href;
					} else {
						var element = Emma.Core.createElement('div',[{name:'class', value:'reply lia-panel-message'}],[],false);
						var reply = new Reply (response.response.message.id.$,response.response.message.body.$,Emma.Core.formatDate(new Date()),user);
						_this.topic.replies += 1;
						_this.replies.unshift(reply);
						reply.build(element);
						list.appendChild(element);
						reply_input.value = '';
						var xhread = new XMLHttpRequest();
						xhread.open('POST','/restapi/vc/messages/id/' + response.response.message.id.$ + '/read/mark',true);
						xhread.send();
					}
				} else {
					alert(Emma.Config.ERROR_MESSAGE);
				}
			} else if (xhr.readyState < 4) {
				loading.style.display = 'inline';
			}
		};
		if (Emma.User.ANONYMOUS) {
			window.location = 'https://' + window.location.host + '/t5/custom/page/page-id/Connexion?referer=' + encodeURIComponent(window.location.href);
		} else if (reply_input.value === null || reply_input.value === '') {
			alert('Votre commentaire est vide !');
		} else {
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send('xslt=json-v2.xsl&restapi.response_style=view&message.subject=' + encodeURIComponent('Re : ' + Emma.Core.decodeHtmlSpecialChars(this.topic.subject)) + '&message.body=' + encodeURIComponent(reply_input.value));
		}
	};




// --------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- TOPIC ---------------------------------------------- //
// --------------------------------------------------------------------------------------------------- //

	// --- Topic Object ---
	function Topic (id,subject,view_href,teaser,body,date,ctop,replies,author,board_id,board_title,brand_id,brand_name,type,label_id,label_text,status_key,status_name) {
		this.id = id;
		this.subject = subject;
		this.view_href = view_href;
		this.teaser = teaser;
		this.body = body;
		this.date = date.replace(/-/g,'/');
		this.ctop = ctop;
		this.replies = replies;
		this.author = author;
		this.board_id = board_id;
		this.board_title = board_title;
		this.brand_id = brand_id;
		this.brand_name = brand_name;
		this.type = type;
		this.label_id = label_id;
		this.label_text = label_text;
		this.status_key = status_key;
		this.status_name = status_name;
	}

	// --- Topic Prototype ---
	Topic.prototype.like = function(ctop) {
		var _this = this;
		var url = '/restapi/vc/messages/id/' + this.id + '/kudos/give';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				_this.ctop.count += 1;
				_this.ctop.status = 'kudoed';
				_this.ctop.build(ctop,_this);
			}
		};
		xhr.open('POST',url,true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send();
	};




// -------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- CTOP ---------------------------------------------- //
// -------------------------------------------------------------------------------------------------- //

	// --- CTop Instance ---
	function Ctop (count,status,givers_href) {
		this.count = count;
		this.status = status;
		this.givers_href = givers_href;
	}

	// --- CTop Prototype ---
	Ctop.prototype.build = function(ctop,message) {
		var handler = '';
		var interactive = false;
		var statusClass;
		var title;
		if (this.status == 'disabled') {
			statusClass = 'lia-button-image-kudos-disabled';
			title = 'Il n\'est plus possible de voter pour ce message.';
		} else if (this.status == 'kudoed') {
			statusClass = 'lia-button-image-kudos-disabled lia-button-image-kudos-kudoed';
			title = 'Merci d\'avoir voté pour ce message.';
		} else if (this.status == 'enabled') {
			interactive = true;
			handler = function() { message.like(ctop); };
			statusClass = 'lia-button-image-kudos-enabled lia-button-image-kudos-not-kudoed';
			title = 'Cliquer ici pour voter pour ce message.';
		} else {
			interactive = true;
			handler = function() {
				Emma.Core.setCookie('SAVED',('kudos&' + message.id),1);
				window.location = 'https://' + window.location.host + '/t5/custom/page/page-id/Connexion?referer=' + encodeURIComponent(window.location.href);
			};
			statusClass = 'lia-button-image-kudos-enabled lia-button-image-kudos-not-kudoed';
			title = 'Cliquer ici pour voter pour ce message.';
		}
		var counter = Emma.Core.createElement('div',[{name:'class', value:'lia-button-image-kudos-count'}],[
				Emma.Core.createElement('span',[{name:'class', value:'MessageKudosCount'}],[
					document.createTextNode(this.count)
				],false)
			],false);
		var button = Emma.Core.createElement('div',[{name:'class', value:'lia-button-image-kudos-give'},{name:'title', value:title}],[
				Emma.Core.createElement('span',[{name:'class', value:'kudos-link'}],[],false)
			],interactive,'click',handler);
		ctop.innerHTML = '';
		ctop.appendChild(Emma.Core.createElement('div',[{name:'class', value:statusClass}],[counter,button],false));
	};




// --------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- REPLY ---------------------------------------------- //
// --------------------------------------------------------------------------------------------------- //

	// --- Reply Instance ---
	function Reply (id,body,date,author) {
		this.id = id;
		this.body = body;
		this.date = date.replace(/-/g,'/');
		this.author = author;
	}

	// --- Reply Prototype ---
	Reply.prototype.build = function(reply) {
		reply.innerHTML = '';
		var heading = Emma.Core.createElement('div',[{name:'class', value:'lia-message-heading'}],[
				Emma.Core.createElement('div',[{name:'class', value:'lia-message-author'}],[
					Emma.Core.createElement('div',[{name:'class', value:'lia-user-avatar'}],[
						Emma.Core.createElement('a',[{name:'href', value:('/t5/user/viewprofilepage/user-id/' + this.author.id)}],[
							Emma.Core.createElement('img',[{name:'class', value:'lia-user-avatar-message'},{name:'src', value:this.author.avatar}],[],false)
						],false)
					],false),
					Emma.Core.createElement('span',[{name:'class', value:'lia-user-name'}],[
						Emma.Core.createElement('a',[{name:'href', value:('/t5/user/viewprofilepage/user-id/' + this.author.id)},{name:'style', value:('color:' + this.author.ranking_color + ';')}],[
							Emma.Core.createElement('span',[],[document.createTextNode(this.author.login)],false)
						],false)
					],false)
				],false)
			],false);
		var body = Emma.Core.createElement('div',[{name:'class', value:'lia-message-body'}],[],false);
			body.innerHTML = this.body;
		var footer = Emma.Core.createElement('div',[{name:'class', value:'lia-message-footer'}],[
				Emma.Core.createElement('span',[{name:'class', value:'DateTime'}],[
					Emma.Core.createElement('span',[{name:'class', value:'local-date'}],[document.createTextNode(this.date)],false)
				],false)
			],false);
		reply.appendChild(Emma.Core.createElement('div',[{name:'class', value:'lia-decoration-border-top'}],[],false));
		reply.appendChild(Emma.Core.createElement('div',[{name:'class', value:'lia-decoration-border-content'}],[heading,body,footer],false));
		reply.appendChild(Emma.Core.createElement('div',[{name:'class', value:'lia-decoration-border-bottom'}],[],false));
	};




// ---------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- OUTBOX ---------------------------------------------- //
// ---------------------------------------------------------------------------------------------------- //

	// --- Outbox Instance ---
	function Outbox (recipient,subject,body,subjectInputText,subjectInputPlaceHolder,bodyInputText,bodyInputPlaceHolder) {
		this.recipient = recipient;
		this.subject = subject;
		this.body = body;
		this.subjectInputText = subjectInputText;
		this.subjectInputPlaceHolder = subjectInputPlaceHolder;
		this.bodyInputText = bodyInputText;
		this.bodyInputPlaceHolder = bodyInputPlaceHolder;
	}

	// --- Outbox Prototype ---
	Outbox.prototype.build = function(outbox,mode,post_handler) {
		outbox.innerHTML = '';
		var _this = this;
		var body_input = Emma.Core.createElement('textarea',[{name:'class', value:'body'}, {name:'placeholder', value:this.bodyInputPlaceHolder}],[document.createTextNode(this.bodyInputText)],false);
		var loading = Emma.Core.createElement('span',[{name:'class', value:'loading'}],[document.createTextNode('Chargement...')],false);
		var submit_input = Emma.Core.createElement('input',[{name:'type', value:'submit'}, {name:'class', value:'lia-button lia-button-primary lia-button-Submit-action'}, {name:'value', value:'ENVOYER'}],[],false);
		var submit_handler = function (e) {
			if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
			_this.post(loading,post_handler);
		};
		Emma.Core.addEvent(body_input,'click',function () { if (body_input.value == _this.bodyInputText) { body_input.value = ''; } });
		Emma.Core.addEvent(body_input,'input',function () { _this.body = '<p>' + body_input.value.replace(/\r?\n/g, '<br />') + '</p>'; });
		if (mode == 'help') {
			outbox.appendChild(Emma.Core.createElement('form',[{name:'class', value:'lia-form lia-form-vertical'}],[body_input,submit_input,loading],true,'submit',submit_handler));
		} else {
			var chip = Emma.Core.createElement('span',[{name:'class', value:'chip'}],[],false);
			var subject_input = Emma.Core.createElement('input',[{name:'type', value:'text'}, {name:'class', value:'subject'}, {name:'value', value:this.subjectInputText}, {name:'placeholder', value:this.subjectInputPlaceHolder}],[],false);
			var cancel = Emma.Core.createElement('input',[{name:'type', value:'button'}, {name:'class', value:'lia-button lia-button-primary lia-button-Cancel-action'}, {name:'value', value:'ANNULER'}],[],true,'click',function () { subject_input.value = ''; body_input.value = ''; outbox.className = 'minimized outbox'; });
			Emma.Core.addEvent(subject_input,'click',function () { outbox.className = 'outbox'; if (subject_input.value == _this.subjectInputText) { subject_input.value = ''; } });
			Emma.Core.addEvent(subject_input,'input',function () { _this.subject = subject_input.value; });
			outbox.appendChild(Emma.Core.createElement('h2',[],[document.createTextNode('Écrire un message')],false));
			outbox.appendChild(Emma.Core.createElement('form',[{name:'class', value:'lia-form lia-form-vertical'}],[chip,subject_input,body_input,submit_input,cancel,loading],true,'submit',submit_handler));
		}
	};
	Outbox.prototype.post = function(loading,handler) {
		if (Emma.User.ANONYMOUS) {
			window.location = 'https://' + window.location.host + '/t5/custom/page/page-id/Connexion?referer=' + encodeURIComponent(window.location.href);
		} else if (this.subject === null || this.subject === '') {
			alert('N\'oubliez pas d\'indiquer un objet pour votre message privé.');
		} else if (this.body === null || this.body === '' || this.body == this.bodyInputText) {
			alert('Votre message privé est vide.');
		} else {
			var url = '/restapi/vc/postoffice/notes/send';
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					var response = JSON.parse(xhr.responseText);
					if (response.response.status == 'success') {
						loading.style.display = 'none';
						handler();
					} else {
						alert(Emma.Config.ERROR_MESSAGE);
					}
				} else if (xhr.readyState < 4) {
					loading.style.display = 'inline';
				}
			};
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send('xslt=json-v2.xsl&notes.recipient=id/' + encodeURIComponent(this.recipient) + '&notes.subject=' + encodeURIComponent(this.subject) + '&notes.note=' + encodeURIComponent(this.body));
		}
	};




// ------------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- PUBLISHER ---------------------------------------------- //
// ------------------------------------------------------------------------------------------------------- //

	// --- Publisher Instance ---
	function Publisher (subject,teaser,body,board_id,board_title,brand_id,brand_name,type,label_text,subjectInputText,subjectInputPlaceHolder,bodyInputText,bodyInputPlaceHolder,picture) {
		this.topic = new Topic('',subject,'',teaser,body,'',new Ctop (0,'disabled',''),0,user,board_id,board_title,brand_id,brand_name,type,'',label_text,'','');
		this.subjectInputText = subjectInputText;
		this.subjectInputPlaceHolder = subjectInputPlaceHolder;
		this.bodyInputText = bodyInputText;
		this.bodyInputPlaceHolder = bodyInputPlaceHolder;
		this.picture = picture;
		this.brands = [{id:'casino', name:'Casino'},{id:'franprix', name:'Franprix'},{id:'leaderprice', name:'Leader Price'},{id:'monoprix', name:'Monoprix'},{id:'spar', name:'SPAR'}];
		this.types = [];
		this.labels = [];
	}

	// --- Publisher Prototype ---
	Publisher.prototype.build = function(publisher,brands,types,labels,list) {
		this.update();
		publisher.innerHTML = '';
		var _this = this;
		var chip = Emma.Core.createElement('span',[{name:'class', value:'chip'}],[],false);
		var subject_input = Emma.Core.createElement('input',[{name:'type', value:'text'}, {name:'class', value:'subject'}, {name:'value', value:this.subjectInputText}, {name:'placeholder', value:this.subjectInputPlaceHolder}],[],false);
		Emma.Core.addEvent(subject_input,'click',function () { publisher.className = 'publisher'; if (subject_input.value == _this.subjectInputText) { subject_input.value = ''; } });
		Emma.Core.addEvent(subject_input,'input',function () { _this.topic.subject = subject_input.value; });
		var body_input = Emma.Core.createElement('textarea',[{name:'class', value:'body'}, {name:'placeholder', value:this.bodyInputPlaceHolder}],[document.createTextNode(this.bodyInputText)],false);
		Emma.Core.addEvent(body_input,'click',function () { if (body_input.value == _this.bodyInputText) { body_input.value = ''; } });
		Emma.Core.addEvent(body_input,'input',function () { _this.topic.body = '<p>' + body_input.value.replace(/\r?\n/g, '<br />') + '</p>'; });
		var options = Emma.Core.createElement('div',[{name:'class', value:'options'}],[],false);
		this.buildOptions(options,brands,types,labels);
		var notification_checkbox = Emma.Core.createElement('input',[{name:'type', value:'checkbox'}, {name:'checked', value:'checked'}, {name:'id', value:'notification'}, {name:'name', value:'notification'}],[],false);
		var notification = Emma.Core.createElement('label',[{name:'for', value:'notification'},{name:'class', value:'notification'}],[notification_checkbox,document.createTextNode('Recevoir des notifications par email')],false);
		var cancel = Emma.Core.createElement('input',[{name:'type', value:'button'}, {name:'class', value:'lia-button lia-button-primary lia-button-Cancel-action'}, {name:'value', value:'ANNULER'}],[],false);
		Emma.Core.addEvent(cancel,'click',function () { subject_input.value = ''; body_input.value = ''; publisher.className = 'minimized publisher'; });
		var submit = Emma.Core.createElement('input',[{name:'type', value:'submit'}, {name:'class', value:'lia-button lia-button-primary lia-button-Submit-action'}, {name:'value', value:'POSTER'}],[],false);
		var loading = Emma.Core.createElement('span',[{name:'class', value:'loading'}],[document.createTextNode('Chargement...')],false);
		var handler = function (e) {
			if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
			_this.post(publisher,subject_input,body_input,notification_checkbox,brands,types,labels,list,loading);
		};
		publisher.appendChild(Emma.Core.createElement('h2',[],[document.createTextNode('Écrire un message')],false));
		publisher.appendChild(Emma.Core.createElement('form',[{name:'class', value:'lia-form lia-form-vertical'}],[chip,subject_input,body_input,options,submit,notification,cancel,loading],true,'submit',handler));
	};
	Publisher.prototype.buildOptions = function(options,brands,types,labels) {
		var _this = this;
		var i;
		var selection_number = 0;
		if (brands) { selection_number += 1; }
		if (types && this.types.length > 0) { selection_number += 1; }
		if (labels && this.labels.length > 0) { selection_number += 1; }
		var selection_width = 'width:' + (Math.round(10000 / selection_number) / 100) + '%;';
		options.innerHTML = '';
		if (brands) {
			var brand_options = [Emma.Core.createElement('option',[{name:'value', value:''}],[document.createTextNode('Enseigne')],false)];
			for (i = 0;i < this.brands.length;i++) {
				var brand_option = Emma.Core.createElement('option',[{name:'value', value:this.brands[i].id}],[document.createTextNode(this.brands[i].name)],false);
				if (this.brands[i].id == this.topic.brand_id) { brand_option.selected = 'selected'; }
				brand_options.push(brand_option);
			}
			var brand_selection = Emma.Core.createElement('select',[{name:'class', value:'brand selection'},{name:'style', value:selection_width}],brand_options,false);
			Emma.Core.addEvent(brand_selection,'change',function () {
				_this.topic.brand_id = brand_selection.options[brand_selection.selectedIndex].value;
				_this.topic.label_text = '';
				_this.update();
				_this.buildOptions(options,brands,types,labels);
			});
			options.appendChild(brand_selection);
		}
		if (types && this.types.length > 0) {
			var type_options = [Emma.Core.createElement('option',[{name:'value', value:''}],[document.createTextNode('Type de message')],false)];
			for (i = 0;i < this.types.length;i++) {
				var type_option = Emma.Core.createElement('option',[{name:'value', value:this.types[i].id}],[document.createTextNode(this.types[i].name)],false);
				if (this.types[i].id == this.topic.type) { type_option.selected = 'selected'; }
				type_options.push(type_option);
			}
			var type_selection = Emma.Core.createElement('select',[{name:'class', value:'type selection'},{name:'style', value:selection_width}],type_options,false);
			Emma.Core.addEvent(type_selection,'change',function () {
				_this.topic.type = type_selection.options[type_selection.selectedIndex].value;
				_this.topic.label_text = '';
				_this.update();
				_this.buildOptions(options,brands,types,labels);
			});
			options.appendChild(type_selection);
		}
		if (labels && this.labels.length > 0) {
			var label_options = [Emma.Core.createElement('option',[{name:'value', value:''}],[document.createTextNode('Thème')],false)];
			for (i = 0;i < this.labels.length;i++) {
				label_options.push(Emma.Core.createElement('option',[{name:'value', value:this.labels[i]}],[document.createTextNode(this.labels[i])],false));
			}
			var label_selection = Emma.Core.createElement('select',[{name:'class', value:'label selection'},{name:'style', value:selection_width}],label_options,false);
			Emma.Core.addEvent(label_selection,'change',function () {
				_this.topic.label_text = label_selection.options[label_selection.selectedIndex].value;
			});
			options.appendChild(label_selection);
		}
	};
	Publisher.prototype.post = function(publisher,subject_input,body_input,notification_checkbox,brands,types,labels,list,loading) {
		if (Emma.User.ANONYMOUS) {
			window.location = 'https://' + window.location.host + '/t5/custom/page/page-id/Connexion?referer=' + encodeURIComponent(window.location.href);
		} else if (this.topic.subject === null || this.topic.subject === '' || this.topic.subject == this.subjectInputText) {
			alert('N\'oubliez pas d\'indiquer un titre pour votre message.');
		} else if (this.topic.brand_id === null || this.topic.brand_id === '') {
			alert('Pour quelle enseigne voulez vous envoyer ce message ?');
		} else if (this.topic.type != 'idea' && this.topic.type != 'forum' && this.topic.type != 'event') {
			alert('Quel type de message voulez vous envoyer ?');
		} else if (labels && this.labels.length > 0 && (this.topic.label_text === null || this.topic.label_text === '')) {
			alert('Quel est le thème de votre message ?');
		} else {
			var _this = this;
			var label = (labels && this.labels.length > 0) ? ('&label.labels=' + this.topic.label_text) : '';
			var notification = notification_checkbox.checked ? '&message.subscribe_type=thread' : '';
			var url = '/restapi/vc/boards/id/' + this.topic.board_id + '/messages/post';
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					var response = JSON.parse(xhr.responseText);
					if (response.response.status == 'success') {
						_this.topic.id = response.response.message.id.$;
						_this.topic.view_href = response.response.message.view_href.replace('http://www.cvous.com','');
						_this.topic.date = Emma.Core.formatDate(new Date());
						_this.topic.ctop.givers_href = '/t5/kudos/messagepage/board-id/' + _this.topic.board_id + '/message-id/' + response.response.message.board_id.$ + '/tab/all-users';
						if (response.response.message.labels) {
							_this.topic.label_id = response.response.message.labels.label.id.$;
						}
						if (response.response.message.message_status) {
							_this.topic.status_key = response.response.message.message_status.key.$;
							_this.topic.status_name = response.response.message.message_status.name.$;
						}
						var thread = new Thread (_this.topic,[],[],[]);
						var element = Emma.Core.createElement('div',[{name:'class', value:'minimized thread'}],[],false);
							thread.build(element);
						subject_input.value = '';
						body_input.value = '';
						loading.style.display = 'none';
						publisher.className = 'minimized publisher';
						list.insertBefore(element,list.hasChildNodes() ? list.childNodes[0] : null);
					} else {
						alert(Emma.Config.ERROR_MESSAGE);
					}
				} else if (xhr.readyState < 4) {
					loading.style.display = 'inline';
				}
			};
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send('xslt=json-v2.xsl&restapi.response_style=view&message.subject=' + encodeURIComponent(this.topic.subject) + '&message.body=' + encodeURIComponent(this.topic.body) + label + notification);
		}
	};
	Publisher.prototype.update = function() {
		if (this.topic.brand_id == 'casino') {
			this.topic.brand_name = 'Casino';
			this.types = [{id:'forum', name:'Forum'},{id:'idea', name:'Idée'}];
			if (this.topic.type == 'idea') {
				this.topic.board_id = 'CAO_IDE_IDEES';
				this.topic.board_title = 'Idées';
				this.labels = ['Magasins','Produits','Services','Fidélité','e-Commerce','Technologie','Développement Durable','Santé'];
			} else if (this.topic.type == 'forum') {
				this.topic.board_id = 'CAO_FOM_FORUM';
				this.topic.board_title = 'Forum';
				this.labels = [];
			}
		} else if (this.topic.brand_id == 'franprix') {
			this.topic.brand_name = 'Franprix';
			this.types = [{id:'forum', name:'Forum'},{id:'idea', name:'Idée'}];
			if (this.topic.type == 'idea') {
				this.topic.board_id = 'FRX_IDE_IDEES';
				this.topic.board_title = 'Idées';
				this.labels = ['Magasins','Produits','Services','Fidélité','e-Commerce','Technologie','Développement Durable','Santé'];
			} else if (this.topic.type == 'forum') {
				this.topic.board_id = 'FRX_FOM_FORUM';
				this.topic.board_title = 'Forum';
				this.labels = [];
			}
		} else if (this.topic.brand_id == 'leaderprice') {
			this.topic.brand_name = 'Leader Price';
			this.types = [{id:'forum', name:'Forum'},{id:'idea', name:'Idée'}];
			if (this.topic.type == 'idea') {
				this.topic.board_id = 'LEE_IDE_IDEES';
				this.topic.board_title = 'Idées';
				this.labels = ['Magasins','Produits','Services','Fidélité','e-Commerce','Technologie','Développement Durable','Santé'];
			} else if (this.topic.type == 'forum') {
				this.topic.board_id = 'LEE_FOM_FORUM';
				this.topic.board_title = 'Forum';
				this.labels = [];
			}
		} else if (this.topic.brand_id == 'monoprix') {
			this.topic.brand_name = 'Monoprix';
			this.types = [];
			this.topic.type = 'idea';
			this.topic.board_id = 'MOX_IDE_IDEES';
			this.topic.board_title = 'Idées';
			this.labels = ['Magasins','Produits','Services','Fidélité','e-Commerce','Développement Durable'];
		} else if (this.topic.brand_id == 'spar') {
			this.topic.brand_name = 'SPAR';
			this.types = [];
			this.topic.type = 'forum';
			this.topic.board_id = 'SPR_FOM_FORUM';
			this.topic.board_title = 'Forum';
			this.labels = [];
		}
	};




// ---------------------------------------------------------------------------------------------------- //
// ---------------------------------------------- SLIDER ---------------------------------------------- //
// ---------------------------------------------------------------------------------------------------- //

	// --- Slider Instance ---
	function Slider () {
		this.element = null;
		this.slidesCount = 0;
		this.currentSlide = null;
		this.currentSlideNumber = 0;
		this.timer = null;
	}

	// --- Slider Prototype ---
	Slider.prototype.init = function(slider,slideNumber) {
		this.slidesCount = slider.find('.slide').length;
		if (this.slidesCount > 0) {
			this.element = slider;
			if (screen.width > 720) {
				if (this.slidesCount > 1) {
					this.element.find('.slide').hide();
					this.currentSlide = this.element.find('.slide:eq(' + (slideNumber) + ')');
					this.currentSlide.show();
					this.currentSlideNumber = slideNumber;
					this.element.append('<div class="nav"></div>');
					for (var i = 0;i < this.slidesCount;i++) {
						this.element.find('.nav').append('<div style="width:' + (100 / this.slidesCount) + '%;" class="next"><span class="number">' + (i + 1) + '</span><span class="title">' + this.element.find('.slide:eq(' + i + ')').attr("title") + '</span></div>');
					}
					var _this = this;
					this.element.find('.nav div').click(function(){ _this.gotoSlide($(this).find('span:first').text() - 1); _this.stopSlide(); });
					this.element.find('.nav div:first').removeClass('next');
					this.element.find('.nav div:eq(' + slideNumber + ')').addClass('active');
					this.playSlide(this);
				}
			}
		} else {
			slider.hide();
		}
	};
	Slider.prototype.gotoSlide = function(slideNumber) {
		if (slideNumber != this.currentSlideNumber) {
			var sens = (slideNumber < this.currentSlideNumber) ? -1 : 1;
			var start = {'left' : sens * this.element.width()};
			var end = {'left' : - sens * this.element.width()};
			var nextSlide = this.element.find('.slide:eq(' + (slideNumber) + ')');
			nextSlide.show().css(start);
			nextSlide.animate({'top':0,'left':0},1000);
			this.currentSlide.animate(end,1000);
			this.element.find('.nav div').removeClass('active');
			this.element.find('.nav div:eq(' + (slideNumber) + ')').addClass('active');
			this.currentSlideNumber = slideNumber;
			this.currentSlide = nextSlide;
		}
	};
	Slider.prototype.nextSlide = function() {
		var slideNumber = this.currentSlideNumber + 1;
		if (slideNumber >= this.slidesCount) {
			slideNumber = 0;
		}
		this.gotoSlide(slideNumber);
	};
	Slider.prototype.previousSlide = function() {
		var slideNumber = this.currentSlideNumber - 1;
		if(slideNumber < 0) {
			slideNumber = this.slidesCount - 1;
		}
		this.gotoSlide(slideNumber);
	};
	Slider.prototype.playSlide = function() {
		var _this = this;
		window.clearInterval(this.timer);
		this.timer = window.setInterval(function() { _this.nextSlide(); },6000);
	};
	Slider.prototype.stopSlide = function() {
		window.clearInterval(this.timer);
	};




// ------------------------------------------------------------------------------------------------------------ //
// ---------------------------------------------- INITIALISATION ---------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

	Emma.Core.addEvent(document,'click', function(event) {
		if (Emma.Core.MENU !== null) {
			var target = event.target ? event.target : window.event.srcElement;
			while (target != Emma.Core.MENU.parentNode && target.nodeName != 'BODY') {
				target = target.parentNode;
			}
			if (target != Emma.Core.MENU.parentNode) {
				Emma.Core.MENU.style.display = 'none';
				Emma.Core.MENU = null;
			}
		}
	});