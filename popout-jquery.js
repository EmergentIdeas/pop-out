(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

(function($) {
	var Dialog = require('ei-dialog')
	
	
	$.fn.popout = function(options) {
		
		var theselector = this.selector;
		
		$(theselector).on('click', function(evt) {
			evt.preventDefault()
			
			var diag = new Dialog({
				title: $(this).attr('data-title'),
				body: $(this).attr('data-content'),
				on: {
					'.btn-ok': function() {
						diag.close()
					}
				}
			})
			diag.open()
		})
	}

})(jQuery)
	

},{"ei-dialog":2}],2:[function(require,module,exports){
var $ = typeof jQuery == 'undefined' ? require('jquery') : jQuery

var tri = require('tripartite').createBlank()
var templates = require('./dialog.tmpl')
tri.parseTemplateScript(templates)

templates = tri.templates

var addStylesIfNeeded = function() {
	if($('#dialog-frame-styles').length == 0) {
		$('head').append('<style type="text/css" id="dialog-frame-styles">' +
		templates['dialogFrameStyles']() +
		'</style>')
	}
}

var createButtonHandler = function(selector, dialog) {
	return function() {
		var result = dialog.on[selector]()
		if(typeof result == 'boolean') {
			if(result) {
				dialog.close()
			}
		}
		else {
			dialog.close()
		}
	}
}

var Dialog = function(options) {
	options = options || {}
	options.on = options.on || {}
	this.title = options.title
	
	if(options.buttons) {
		this.buttons = options.buttons
	}
	else {
		this.buttons = [
			{
				classes: 'btn btn-primary btn-ok',
				label: 'OK'
			},
			{
				classes: 'btn btn-cancel',
				label: 'Cancel'
			}
		]
	}
	this.on = options.on
	
	if(!this.on['.btn-cancel']) {
		this.on['.btn-cancel'] = function() {
		}
	}
	this.body = options.body
}

Dialog.prototype.open = function() {
	addStylesIfNeeded()
	$('body').append(templates['dialogFrame'](this))
	
	if(typeof this.body == 'function') {
		$('.dialog-frame .body').append(this.body($('.dialog-frame .body').get(0)))
	}
	else if(typeof this.body == 'string') {
		$('.dialog-frame .body').append(this.body)
	}
	
	for(var selector in this.on) {
		$('.dialog-frame').on('click', selector, createButtonHandler(selector, this))
	}
	
	setTimeout(function() {
		var head = $('.dialog-frame .head').outerHeight()
		var foot = $('.dialog-frame .foot').outerHeight()
		var topAndBottom = head + foot
		$('.dialog-frame .body').css('max-height', 'calc(90vh - ' + topAndBottom + 'px)')
		$('.dialog-frame').addClass('open')
	})
	return this
}

Dialog.prototype.close = function() {
	$('.dialog-frame').remove()
	return this
}

module.exports = Dialog


},{"./dialog.tmpl":3,"jquery":"jquery","tripartite":5}],3:[function(require,module,exports){
module.exports = "##dialogFrame##\n<div class=\"dialog-frame\">\n\t<div class=\"mask\">&nbsp;</div>\n\t<div class=\"dialog-holder\">\n\t\t<div class=\"the-dialog\">\n\t\t\t<div class=\"head\">\n\t\t\t\t__title__\n\t\t\t</div>\n\t\t\t<div class=\"body\">\n\t\t\t</div>\n\t\t\t<div class=\"foot\">\n\t\t\t\t__buttons::button__\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n##button##\n<button class=\"__classes__\" type=\"button\">__label__</button>\n##dialogFrameStyles##\n.dialog-frame {\n\tposition: fixed;\n\ttop: 0;\n\tbottom: 0;\n\tleft: 0;\n\tright: 0;\n\tz-index: 10000;\n\topacity: 0;\n\ttransition: opacity .3s;\n\toverflow: hidden;\n}\n\n.dialog-frame.open {\n\topacity: 1;\n}\n\n.dialog-frame .mask {\n\tposition: absolute;\n\ttop: 0;\n\tbottom: 0;\n\tleft: 0;\n\tright: 0;\n\tbackground-color: #333333;\n\topacity: .7;\n\theight: 100%;\n\tz-index: 0;\n}\n\n.dialog-frame .dialog-holder {\n\tposition: relative;\n\twidth: 100%;\n\theight: 100%;\n\tmargin-left: 50%;\n}\n\n.dialog-frame .the-dialog {\n\tposition: relative;\n\tdisplay: inline-block;\n\ttop: 50%;\n\tmax-width: 90%;\n\tmax-height: 90%;\n\tz-index: 1;\n\tborder-radius: 5px;\n\tbackground-color: white;\n\toverflow: hidden;\n\ttransform: translate(-50%, -50%) scale(.84);\n\ttransition: transform 0.262s cubic-bezier(.77,-1.72,.08,1);\n}\n\n.dialog-frame.open .the-dialog {\n\ttransform: translate(-50%, -50%) scale(1);\n}\n\n\n.dialog-frame .the-dialog .head {\n\tborder-bottom: solid #aaaaaa 1px;\n\tline-height: 2em;\n\tpadding: 0 10px;\n}\n\n.dialog-frame .the-dialog .body {\n\tbox-sizing: border-box;\n\tpadding: 20px;\n\toverflow: auto;\n\tmax-height: calc(90vh - 75px);\n}\n\n.dialog-frame .the-dialog .foot {\n\tborder-top: solid #aaaaaa 1px;\n\tpadding: 10px;\n}\n\n.dialog-frame .the-dialog .foot button {\n\tmargin-right: 15px;\n}";

},{}],4:[function(require,module,exports){
var calculateRelativePath = function(parentPath, currentPath) {
	if(!parentPath) {
		return currentPath
	}
	if(!currentPath) {
		return currentPath
	}
	
	if(currentPath.indexOf('../') != 0 && currentPath.indexOf('./') != 0) {
		return currentPath
	}
	
	var pparts = parentPath.split('/')
	var cparts = currentPath.split('/')
	
	// trim any starting blank sections
	while(pparts.length && !pparts[0]) {
		pparts.shift()
	}
	while(cparts.length && !cparts[0]) {
		cparts.shift()
	}
	
	if(currentPath.indexOf('../') == 0 ) {
		while(cparts.length && cparts[0] == '..') {
			pparts.pop()
			cparts.shift()
		}
		pparts.pop()
		
		while(cparts.length) {
			pparts.push(cparts.shift())
		}
		return pparts.join('/')
	}
	if(currentPath.indexOf('./') == 0 ) {
		cparts.shift()
		pparts.pop()
		while(cparts.length) {
			pparts.push(cparts.shift())
		}
		return pparts.join('/')
	}
	
	return currentPath
}

module.exports = calculateRelativePath
},{}],5:[function(require,module,exports){
(function (global){

var calculateRelativePath = require('./calculate-relative-path')

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

function cloneArray(ar) {
	var consumed = []
	for(var i = 0; i < ar.length; i++) {
		consumed.push(ar[i])
	}
	return consumed
}

var Tripartite = function() {
	this.templates = {
		defaultTemplate: function(thedata) {
			return '' + thedata;
		}
	}
	
	this.templates.defaultTemplate.write = function(thedata, stream, callback) {
		stream.write('' + thedata)
		if(callback) {
			callback()
		}
	}
	
	this.constants = {
		templateBoundary: '__',
		templateNameBoundary: '##'
	}
	
	// This object (if set) will receive the template functions parsed from a script
	// I want to be able to call my templates as global functions, so I've set it
	// to be the window object
	this.secondaryTemplateFunctionObject = null
	
	this.loaders = []
	
	this.dataFunctions = {}
}

var t = Tripartite


t.prototype.addTemplate = function(name, template) {
	if(typeof template !== 'function') {
		template = this.pt(template);
	}
	if(!template.write) {
		var oldFun = template
		template = function(cc, globalData) {
			if(arguments.length > 1 && arguments[1] && arguments[1].write) {
				template.write.apply(this, arguments)
			}
			else {
				return oldFun(cc, globalData)
			}
		}
		template.write = function(cc, stream, callback) {
			stream.write(oldFun(cc))
			if(callback) {
				callback()
			}
		}
	}
	this.templates[name] = template;
	template.templateMeta = template.templateMeta || {}
	template.templateMeta.name = name
	return template;
};

t.prototype.createBlank = function() {
	return new Tripartite()
}

t.prototype.getTemplate = function(name) {
	return this.templates[name]
}

t.prototype.loadTemplate = function(name, callback) {
	if(this.templates[name]) {
		callback(this.templates[name])
		
	}
	else {
		var tri = this
		var count = this.loaders.length
		var done = false
		for(var i = 0; i < this.loaders.length; i++) {
			this.loaders[i](name, function(template) {
				if(done) {
					return
				}
				count--
				if(template) {
					done = true
					tri.addTemplate(name, template)
					callback(tri.getTemplate(name))
				}
				else if(count == 0) {
					callback(null)
				}
			})
		}
	}
}

t.prototype.parseTemplateScript = function(tx) {
	var tks = this.tts(tx);
	/* current template name */
	var ctn = null;
	for(var i = 0; i < tks.length; i++) {
		var token = tks[i];
		if(token.active) {
			ctn = token.content;
		}
		else {
			if(ctn) {
				var template = this.addTemplate(ctn, this.stw(token.content));
				if(this.secondaryTemplateFunctionObject) {
					this.secondaryTemplateFunctionObject[ctn] = template;
				}
				ctn = null;
			}
		}
	}
}

/* strip template whitespace */
t.prototype.stw = function(txt) {
	var i = txt.indexOf('\n');
	if(i > -1 && txt.substring(0, i).trim() == '') {
		txt = txt.substring(i + 1);
	}
	i = txt.lastIndexOf('\n');
	if(i > -1 && txt.substring(i).trim() == '') {
		txt = txt.substring(0, i);
	}
	return txt;
};

t.prototype.ActiveElement = function(/* the conditional */cd, data, hd, tripartite) {
	/* assign the conditional expression */
	this.ce = cd;
	/* assign the data selector expression */
	this.dse = data;
	
	this.tripartite = tripartite
	
	/* assign the hd expression */
	if(hd) {
		this.he = hd;
	}
	else {
		this.he = 'defaultTemplate';
	}
	
	/* evaluated data */
	this.ed = null;
};

var ae = t.prototype.ActiveElement;

/* SimpleTemplate */
t.prototype.st = function(/* conditional expression */ cd, data, /* handling expression */ hd, tripartite, templateMeta) {
	this.tripartite = tripartite
	var el = new ae(cd, data, hd, tripartite);
	el.templateMeta = templateMeta
	var f = function(cc, globalData) {
		if(arguments.length > 1 && arguments[1] && arguments[1].write) {
			el.write.apply(el, arguments)
		}
		else {
			return el.run(cc, globalData);
		}
	}
	f.templateMeta = templateMeta
	
	f.write = function(cc, stream, callback, globalData) {
		el.write(cc, stream, callback, globalData)
	}
	return f
};


ae.prototype.run = function(/* current context */cc, globalData) {
	/* run template */
	var rt = false;
	/* evaluated data */
	this.ed = this.edse(cc, globalData);
	if(this.ce) {
		rt = this.eic(cc, this.ce, globalData);
	}
	else {
		if(this.ed instanceof Array) {
			if(this.ed.length > 0) {
				rt = true;
			}
		}
		else {
			if(this.ed) {
				rt = true;
			}
			else if(!this.dse) {
				rt = true
				this.ed = cc
			}
		}
	}
	
	var at = this.he;
	if(at.charAt(0) == '$') {
		at = this.eic(cc, at.substring(1), globalData);
	}
	if(!at) {
		at = 'defaultTemplate';
	}
	
	// resolve relative template paths
	if(at.indexOf('./') == 0 || at.indexOf('../') == 0) {
		at = calculateRelativePath(this.templateMeta.name, at)
	}
	
	if(rt) {
		if(this.ed instanceof Array) {
			var r = '';
			for(var i = 0; i < this.ed.length; i++) {
				r += this.getTemplate(at)(this.ed[i], globalData || cc);
			}
			return r;
		}
		else {
			return this.getTemplate(at)(this.ed, globalData || cc);
		}
	}
	return '';
};

ae.prototype.write = function(/* current context */cc, stream, callback, globalData) {
	/* run template */
	var rt = false;
	/* evaluated data */
	this.ed = this.edse(cc, globalData);
	if(this.ce) {
		rt = this.eic(cc, this.ce, globalData);
	}
	else {
		if(this.ed instanceof Array) {
			if(this.ed.length > 0) {
				rt = true;
			}
		}
		else {
			if(this.ed) {
				rt = true;
			}
			else if(!this.dse) {
				rt = true
				this.ed = cc
			}
		}
	}
	
	var at = this.he;
	if(at.charAt(0) == '$') {
		at = this.eic(cc, at.substring(1), globalData);
	}
	if(!at) {
		at = 'defaultTemplate';
	}

	// resolve relative template paths
	if(at.indexOf('./') == 0 || at.indexOf('../') == 0) {
		at = calculateRelativePath(this.templateMeta.name, at)
	}
	
	
	var self = this
	
	
	if(rt) {
		this.tripartite.loadTemplate(at, function(template) {
			var consumed
			if(self.ed instanceof Array) {
				consumed = cloneArray(self.ed)
			}
			else {
				consumed = [self.ed]
			}
			
			var procConsumed = function() {
				if(template) {
					template.write(consumed.shift(), stream, function() {
						if(consumed.length > 0) {
							procConsumed()
						}
						else if(callback) {
							callback()
						}
					}, globalData || cc)
				}
				else {
					if(callback) {
						var err = new Error('Cound not load template: ' + at)
						err.templateName = at
						err.type = 'missing template'
						callback(err)
					}
					else {
						console.error('Cound not load template: ' + at)
					}
				}
			}
			
			if(consumed.length > 0) {
				procConsumed()
			}
			else {
				callback()
			}
		})
	}
	else {
		callback()
	}
};

ae.prototype.getTemplate = function(name) {
	return this.tripartite.getTemplate(name)
}

/* evaluate data selector expression */
ae.prototype.edse = function(cc, globalData) {
	if(!this.dse) {
		return null;
	}
	if(this.dse === '$this') {
		return cc;
	}
	return this.eic(cc, this.dse, globalData);
};

/* evaluate in context */
ae.prototype.eic = function(cc, ex, globalData) {
	cc = cc || {};
	return this.eicwt.call(cc, cc, ex, this.tripartite.dataFunctions, globalData);
};

/* Evaluate in context having been called so that this === cc (current context */
ae.prototype.eicwt = function(cc, ex, dataFunctions, globalData) {
	dataFunctions = dataFunctions || {}
	globalData = globalData || cc || {}
	
	with ({
		'$globals': globalData 
	}) {
		with (dataFunctions) {
			with (cc) {
				try {
					return eval(ex);
				} catch(e) {
					return null;
				}
			}
		}
	}
};

/* parse template */
t.prototype.pt = function(tx) {
	var tks = this.tt(tx);
	var pt = [];
	var templateMeta = {}
	
	for(var i = 0; i < tks.length; i++) {
		var tk = tks[i];
		if(tk.active) {
			pt.push(this.tap(tk.content, templateMeta));
		}
		else {
			if(tk.content) {
				pt.push(tk.content);
			}
		}
	}
	
	var t = function(cc, globalData) {
		if(arguments.length > 1 && arguments[1] && arguments[1].write) {
			t.write.apply(t, arguments)
		}
		else {
			var r = '';
			for(var i = 0; i < pt.length; i++) {
				if(typeof pt[i] === 'string') {
					r += pt[i];
				}
				else {
					r += pt[i](cc, globalData);
				}
			}
			return r;
		}
	}
	
	t.templateMeta = templateMeta
	
	t.write = function(cc, stream, callback, globalData) {
		var consumed = cloneArray(pt)
		var lastError
		
		var procConsumed = function() {
			var unit = consumed.shift()
			if(typeof unit === 'string') {
				stream.write(unit)
				if(consumed.length > 0) {
					procConsumed()
				}
				else if(callback) {
					callback()
				}
			}
			else {
				unit.write(cc, stream, function(err) {
					if(err && stream.continueOnTripartiteError) {
						lastError = err
					}
					
					if(err && callback && !stream.continueOnTripartiteError) {
						callback(err)
					}
					else if(consumed.length > 0) {
						procConsumed()
					}
					else if(callback) {
						if(lastError) {
							callback(lastError)
						}
						else {
							callback()
						}
					}
				}, globalData)
			}
		}
		
		if(consumed.length > 0) {
			procConsumed()
		}
	}
	
	return t
};

/* tokenize active part */
t.prototype.tokenizeActivePart = function(tx, templateMeta) {
	var con = null;
	var dat = null;
	var han = null;
	
	/* condition index */
	var ci = tx.indexOf('??');
	if(ci > -1) {
		con = tx.substring(0, ci);
		ci += 2;
	}
	else {
		ci = 0;
	}
	
	/* handler index */
	var hi = tx.indexOf('::');
	if(hi > -1) {
		dat = tx.substring(ci, hi);
		han = tx.substring(hi + 2);
	}
	else {
		dat = tx.substring(ci);
	}
	return new this.st(con, dat, han, this, templateMeta);
}

t.prototype.tap = t.prototype.tokenizeActivePart

/* tokenize template */
t.prototype.tokenizeTemplate = function(tx) {
	return this.taib(tx, this.constants.templateBoundary);
}

t.prototype.tt = t.prototype.tokenizeTemplate

/** tokenize template script */
t.prototype.tts = function(tx) {
	return this.taib(tx, this.constants.templateNameBoundary);
}

/* tokenize active and inactive blocks */
t.prototype.taib = function(tx, /*Active Region Boundary */ bnd) {
	/* whole length */
	var l = tx.length;
	
	/* current position */
	var p = 0;
	
	/* are we in an active region */
	var act = false;
	
	var tks = [];
	
	while(p < l) {
		var i = tx.indexOf(bnd, p);
		if(i == -1) {
			i = l;
		}
		var tk = { active: act, content: tx.substring(p, i)};
		tks.push(tk);
		p = i + 2;
		act = !act;
	}
	
	return tks;
}

var tripartiteInstance = new Tripartite()

if(typeof window != 'undefined') {
	tripartiteInstance.secondaryTemplateFunctionObject = window
}



if(module) {
	module.exports = tripartiteInstance
}
else {
	window.Tripartite = tripartiteInstance
}

if(global) {
	if(!global.Tripartite) {
		global.Tripartite = Tripartite
	}
	if(!global.tripartite) {
		global.tripartite = tripartiteInstance
	}
}


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./calculate-relative-path":4}]},{},[1]);
