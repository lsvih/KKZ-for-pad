/*! JRoll v2.1.0 ~ (c) 2015-2016 Author:BarZu Git:https://git.oschina.net/chenjianlong/JRoll2/ Website:http://www.chjtx.com/JRoll/ */ ;
! function(o, r, t) {
	"use strict";

	function e(o, t) {
		for(var e; o !== r && (t || !("TEXTAREA" === o.tagName && o.scrollHeight > o.offsetHeight));) {
			if(e = o.getAttribute("jroll-id")) return _[e];
			o = o.parentNode
		}
		return null
	}

	function l(o) {
		var r = e(o.target);
		r ? (p.jrollActive = r, r._start(o)) : p.jrollActive = null
	}

	function s(o) {
		p.jrollActive && (p.jrollActive.options.preventDefault && o.preventDefault(), p.jrollActive._move(o))
	}

	function n() {
		p.jrollActive && p.jrollActive._end()
	}

	function i(o) {
		var r = e(o.target, !0);
		r && r._focusin(o)
	}

	function a(o) {
		var r = e(o.target, !0);
		r && r._focusout()
	}

	function c() {
		setTimeout(function() {
			for(var o in _) _[o].refresh(), _[o].scrollTo(_[o].x, _[o].y)
		}, 600)
	}
	var p, d, u = "2.1.0",
		f = o.requestAnimationFrame || o.webkitRequestAnimationFrame || function(o) {
			setTimeout(o, 17)
		},
		m = r.createElement("div").style,
		_ = {};
	d = {
		TSF: "transform" in m ? "transform" : "-webkit-transform",
		TSD: "transitionDuration" in m ? "transition-duration" : "-webkit-transition-duration",
		TFO: "transformOrigin" in m ? "transform-origin" : "-webkit-transform-origin",
		isAndroid: /android/.test(navigator.userAgent.toLowerCase()),
		computePosition: function(o, r) {
			for(var t = 0, e = 0; o;) t += o.offsetLeft, e += o.offsetTop, o = o.offsetParent, o === r && (o = null);
			return {
				left: t,
				top: e
			}
		},
		moveTo: function(o, r, t, e, l) {
			function s() {
				p -= 17, p <= 0 ? (n = r, i = t) : (n = parseInt(n + a, 10), i = parseInt(i + c, 10)), o.style[d.TSF] = "translate(" + n + "px, " + i + "px) translateZ(0px) scale(" + v + ")", p > 0 && (n !== r || i !== t) ? f(s) : "function" == typeof l && l()
			}
			var n, i, a, c, p, u, m = 0,
				_ = 0,
				v = 1;
			u = /translate\(([\-\d\.]+)px,\s+([\-\d\.]+)px\)\s+translateZ\(0px\)\s+scale\(([\d\.]+)\)/g.exec(o.style[d.TSF]), u && (m = Number(u[1]), _ = Number(u[2]), v = Number(u[3])), p = e || 17, a = (r - m) / (p / 17), c = (t - _) / (p / 17), n = m, i = _, s()
		}
	}, r.addEventListener("touchstart", l, !1), r.addEventListener("touchmove", s, !1), r.addEventListener("touchend", n, !1), r.addEventListener("touchcancel", n, !1), o.addEventListener("resize", c, !1), o.addEventListener("orientationchange", c, !1), d.isAndroid && (r.addEventListener("focusin", i, !1), r.addEventListener("focusout", a, !1)), p = function(o, r) {
		this._init(o, r)
	}, p.version = u, p.utils = d, p.jrollMap = _, p.prototype = {
		_init: function(e, l) {
			var s = this;
			if(s.wrapper = "string" == typeof e ? r.querySelector(e) : e, s.scroller = l && l.scroller ? "string" == typeof l.scroller ? r.querySelector(l.scroller) : l.scroller : s.wrapper.children[0], s.scroller.jroll) return s.scroller.jroll.refresh(), s.scroller.jroll;
			s.scroller.jroll = s, s.wrapperOffset = d.computePosition(s.wrapper, r.body), s.id = l && l.id || s.scroller.getAttribute("jroll-id") || "jroll_" + t.random().toString().substr(2, 8), s.scroller.setAttribute("jroll-id", s.id), _[s.id] = s, s.options = {
				scrollX: !1,
				scrollY: !0,
				scrollFree: !1,
				minX: null,
				maxX: null,
				minY: null,
				maxY: null,
				zoom: !1,
				zoomMin: 1,
				zoomMax: 4,
				bounce: !0,
				scrollBarX: !1,
				scrollBarY: !1,
				scrollBarFade: !1,
				preventDefault: !0,
				momentum: !0,
				autoStyle: !0,
				adjustTop: 190
			};
			for(var n in l) "scroller" !== n && (s.options[n] = l[n]);
			s.options.autoStyle && ("static" === o.getComputedStyle(s.wrapper).position && (s.wrapper.style.position = "relative", s.wrapper.style.top = "0", s.wrapper.style.left = "0"), s.wrapper.style.overflow = "hidden", s.scroller.style.minHeight = "100%"), s.x = 0, s.y = 0, s.s = null, s.scrollBarX = null, s.scrollBarY = null, s._s = {
				startX: 0,
				startY: 0,
				lastX: 0,
				lastY: 0,
				endX: 0,
				endY: 0
			}, s._z = {
				spacing: 0,
				scale: 1,
				startScale: 1
			}, s._event = {
				scrollStart: [],
				scroll: [],
				scrollEnd: [],
				zoomStart: [],
				zoom: [],
				zoomEnd: [],
				refresh: [],
				touchEnd: []
			}, s.refresh(!0)
		},
		enable: function() {
			var o = this;
			return o.scroller.setAttribute("jroll-id", o.id), o
		},
		disable: function() {
			var o = this;
			return o.scroller.removeAttribute("jroll-id"), o
		},
		destroy: function() {
			var o = this;
			delete _[o.id], delete o.scroller.jroll, o.scrollBarX && o.wrapper.removeChild(o.scrollBarX), o.scrollBarY && o.wrapper.removeChild(o.scrollBarY), o.disable(), o.scroller.style[d.tSF] = "", o.scroller.style[d.tSD] = "", o.prototype = null;
			for(var r in o) o.hasOwnProperty(r) && delete o[r]
		},
		call: function(o, r) {
			var t = this;
			return t._s.lockX = !1, t._s.lockY = !1, t.scrollTo(t.x, t.y), p.jrollActive = o, r && o._start(r), o
		},
		refresh: function(o) {
			var r, e, l = this;
			return l.wrapperWidth = l.wrapper.clientWidth, l.wrapperHeight = l.wrapper.clientHeight, l.scrollerWidth = t.round(l.scroller.offsetWidth * l._z.scale), l.scrollerHeight = t.round(l.scroller.offsetHeight * l._z.scale), l.minScrollX = null === l.options.minX ? 0 : l.options.minX, l.maxScrollX = null === l.options.maxX ? l.wrapperWidth - l.scrollerWidth : l.options.maxX, l.minScrollY = null === l.options.minY ? 0 : l.options.minY, l.maxScrollY = null === l.options.maxY ? l.wrapperHeight - l.scrollerHeight : l.options.maxY, l.minScrollX < 0 && (l.minScrollX = 0), l.minScrollY < 0 && (l.minScrollY = 0), l.maxScrollX > 0 && (l.maxScrollX = 0), l.maxScrollY > 0 && (l.maxScrollY = 0), l._s.endX = l.x, l._s.endY = l.y, l.options.scrollBarX ? (l.scrollBarX || (r = l._createScrollBar("jroll-xbar", "jroll-xbtn", !1), l.scrollBarX = r[0], l.scrollBtnX = r[1]), l.scrollBarScaleX = l.wrapper.clientWidth / l.scrollerWidth, e = t.round(l.scrollBarX.clientWidth * l.scrollBarScaleX), l.scrollBtnX.style.width = (e > 8 ? e : 8) + "px") : l.scrollBarX && (l.wrapper.removeChild(l.scrollBarX), l.scrollBarX = null), l.options.scrollBarY ? (l.scrollBarY || (r = l._createScrollBar("jroll-ybar", "jroll-ybtn", !0), l.scrollBarY = r[0], l.scrollBtnY = r[1]), l.scrollBarScaleY = l.wrapper.clientHeight / l.scrollerHeight, e = t.round(l.scrollBarY.clientHeight * l.scrollBarScaleY), l.scrollBtnY.style.height = (e > 8 ? e : 8) + "px") : l.scrollBarY && (l.wrapper.removeChild(l.scrollBarY), l.scrollBarY = null), o || l._execEvent("refresh"), l
		},
		scale: function(o) {
			var r = this,
				t = parseFloat(o);
			return isNaN(t) || (r.scroller.style[d.TFO] = "0 0", r._z.scale = t, r.refresh()._scrollTo(r.x, r.y), r.scrollTo(r.x, r.y, 400)), r
		},
		_focusin: function(o) {
			var r = this;
			setTimeout(function() {
				var t, e;
				r.refresh(), t = d.computePosition(o.target, r.wrapper), e = t.top + r.y, e > r.options.adjustTop && r.scrollTo(r.x, r.y - e + r.options.adjustTop, 200)
			}, 400)
		},
		_focusout: function() {
			var o = this;
			setTimeout(function() {
				o.refresh(), o.scrollTo(o.x, o.y, 200)
			}, 600)
		},
		_runScrollBarX: function() {
			var o = this,
				r = t.round(-1 * o.x * o.scrollBarScaleX);
			o._scrollTo.call({
				scroller: o.scrollBtnX,
				_z: {
					scale: 1
				}
			}, r, 0)
		},
		_runScrollBarY: function() {
			var o = this,
				r = t.round(-1 * o.y * o.scrollBarScaleY);
			o._scrollTo.call({
				scroller: o.scrollBtnY,
				_z: {
					scale: 1
				}
			}, 0, r)
		},
		_createScrollBar: function(o, t, e) {
			var l, s, n = this;
			return l = r.createElement("div"), s = r.createElement("div"), l.className = o, s.className = t, this.options.scrollBarX !== !0 && this.options.scrollBarY !== !0 || (e ? (l.style.cssText = "position:absolute;top:2px;right:2px;bottom:2px;width:6px;overflow:hidden;border-radius:2px;-webkit-transform: scaleX(.5);transform: scaleX(.5);", s.style.cssText = "background:rgba(0,0,0,.4);position:absolute;top:0;left:0;right:0;border-radius:2px;") : (l.style.cssText = "position:absolute;left:2px;bottom:2px;right:2px;height:6px;overflow:hidden;border-radius:2px;-webkit-transform: scaleY(.5);transform: scaleY(.5);", s.style.cssText = "background:rgba(0,0,0,.4);height:100%;position:absolute;left:0;top:0;bottom:0;border-radius:2px;")), n.options.scrollBarFade && (l.style.opacity = 0), l.appendChild(s), n.wrapper.appendChild(l), [l, s]
		},
		_fade: function(o, r) {
			var t = this;
			t.fading && r > 0 && (r -= 25, r % 100 === 0 && (o.style.opacity = r / 1e3), f(t._fade.bind(t, o, r)))
		},
		on: function(o, r) {
			var t = this;
			switch(o) {
				case "scrollStart":
					t._event.scrollStart.push(r);
					break;
				case "scroll":
					t._event.scroll.push(r);
					break;
				case "scrollEnd":
					t._event.scrollEnd.push(r);
					break;
				case "zoomStart":
					t._event.zoomStart.push(r);
					break;
				case "zoom":
					t._event.zoom.push(r);
					break;
				case "zoomEnd":
					t._event.zoomEnd.push(r);
					break;
				case "refresh":
					t._event.refresh.push(r);
					break;
				case "touchEnd":
					t._event.touchEnd.push(r)
			}
		},
		_execEvent: function(o, r) {
			for(var t = this, e = t._event[o].length - 1; e >= 0; e--) t._event[o][e].call(t, r)
		},
		_compute: function(o, r, e) {
			var l = this;
			return o > r ? l.options.bounce && o > r + 10 ? t.round(r + (o - r) / 4) : r : o < e ? l.options.bounce && o < e - 10 ? t.round(e + (o - e) / 4) : e : o
		},
		_scrollTo: function(o, r) {
			this.scroller.style[d.TSF] = "translate(" + o + "px, " + r + "px) translateZ(0px) scale(" + this._z.scale + ")"
		},
		scrollTo: function(o, r, t, e, l, s) {
			var n = this;
			return e ? (n.x = o, n.y = r) : (n.x = o >= n.minScrollX ? n.minScrollX : o <= n.maxScrollX ? n.maxScrollX : o, n.y = r >= n.minScrollY ? n.minScrollY : r <= n.maxScrollY ? n.maxScrollY : r), s || (n._s.endX = n.x, n._s.endY = n.y), t ? d.moveTo(n.scroller, n.x, n.y, t, l) : (n._scrollTo(n.x, n.y), "function" == typeof l && l()), n.scrollBtnX && n._runScrollBarX(), n.scrollBtnY && n._runScrollBarY(), n
		},
		_endAction: function() {
			var o = this;
			o._s.endX = o.x, o._s.endY = o.y, o.options.scrollBarFade && !o.fading && (o.fading = !0, o.scrollBarX && o._fade(o.scrollBarX, 2e3), o.scrollBarY && o._fade(o.scrollBarY, 2e3)), o._execEvent("scrollEnd")
		},
		_stepBounce: function() {
			function o() {
				r.scrollTo(r.x, r.y, 100)
			}
			var r = this;
			r.bouncing = !1, 4 === r.s ? 1 === r.directionY ? (r.scrollTo(r.x, r.minScrollY + 20, 100, !0, o), r.y = r.minScrollY) : (r.scrollTo(r.x, r.maxScrollY - 20, 100, !0, o), r.y = r.maxScrollY) : 3 === r.s && (1 === r.directionX ? (r.scrollTo(r.minScrollX + 20, r.y, 100, !0, o), r.x = r.minScrollX) : (r.scrollTo(r.maxScrollX - 20, r.y, 100, !0, o), r.x = r.maxScrollX))
		},
		_x: function(o) {
			var r = this,
				t = r.directionX * o;
			isNaN(t) || (r.x = r.x + t, (r.x >= r.minScrollX || r.x <= r.maxScrollX) && (r.moving = !1, r.options.bounce && (r.bouncing = !0)))
		},
		_y: function(o) {
			var r = this,
				t = r.directionY * o;
			isNaN(t) || (r.y = r.y + t, (r.y >= r.minScrollY || r.y <= r.maxScrollY) && (r.moving = !1, r.options.bounce && (r.bouncing = !0)))
		},
		_xy: function(o) {
			var r = this,
				e = t.round(r.cosX * o),
				l = t.round(r.cosY * o);
			isNaN(e) || isNaN(l) || (r.x = r.x + e, r.y = r.y + l, (r.x >= r.minScrollX || r.x <= r.maxScrollX) && (r.y >= r.minScrollY || r.y <= r.maxScrollY) && (r.moving = !1))
		},
		_step: function(o) {
			var r = this,
				e = Date.now(),
				l = e - o,
				s = 0;
			if(r.bouncing && r._stepBounce(), !r.moving) return void r._endAction();
			if(l > 10) {
				if(r.speed = r.speed - l * (r.speed > 1.2 ? .001 : r.speed > .6 ? 8e-4 : 6e-4), s = t.round(r.speed * l), r.speed <= 0 || s <= 0) return void r._endAction();
				o = e, r._do(s), r.scrollTo(r.x, r.y, 0, !1, null, !0), r._execEvent("scroll")
			}
			f(r._step.bind(r, o))
		},
		_doScroll: function(r, t) {
			var e, l = this;
			l.distance = r, l.options.bounce && (l.x = l._compute(l.x, l.minScrollX, l.maxScrollX), l.y = l._compute(l.y, l.minScrollY, l.maxScrollY)), l.scrollTo(l.x, l.y, 0, !!l.options.bounce, null, !0), l._execEvent("scroll", t), t && t.touches && (e = t.touches[0].pageY, (e <= 10 || e >= o.innerHeight - 10) && l._end())
		},
		_start: function(o) {
			var r = this,
				e = o.touches;
			if(r.moving = !1, (r.options.scrollX || r.options.scrollY || r.options.scrollFree) && (1 === e.length || !r.options.zoom)) return r.s = 1, r.distance = 0, r.startTime = Date.now(), r._s.lastX = r.startPositionX = r._s.startX = e[0].pageX, r._s.lastY = r.startPositionY = r._s.startY = e[0].pageY, void r._execEvent("scrollStart", o);
			if(r.s = null, r.options.zoom && e.length > 1) {
				r.s = 2, r.scroller.style[d.TFO] = "0 0";
				var l = t.abs(e[0].pageX - e[1].pageX),
					s = t.abs(e[0].pageY - e[1].pageY);
				return r._z.spacing = t.sqrt(l * l + s * s), r._z.startScale = r._z.scale, r.originX = t.abs(e[0].pageX + e[1].pageX) / 2 - r.wrapperOffset.left - r.x, r.originY = t.abs(e[0].pageY + e[1].pageY) / 2 - r.wrapperOffset.top - r.y, void r._execEvent("zoomStart", o)
			}
		},
		_move: function(o) {
			var r, e, l, s, n, i, a, c, p = this,
				d = o.touches,
				u = 1,
				f = 1;
			if(e = d[0].pageX, l = d[0].pageY, s = e - p._s.lastX, n = l - p._s.lastY, p._s.lastX = e, p._s.lastY = l, u = s >= 0 ? 1 : -1, f = n >= 0 ? 1 : -1, r = Date.now(), (r - p.startTime > 200 || p.directionX !== u || p.directionY !== f) && (p.startTime = r, p.startPositionX = e, p.startPositionY = l, p.directionX = u, p.directionY = f), i = e - p.startPositionX, a = l - p.startPositionY, 1 === p.s) {
				if(p.options.scrollBarFade && (p.fading = !1, p.scrollBarX && (p.scrollBarX.style.opacity = 1), p.scrollBarY && (p.scrollBarY.style.opacity = 1)), !p.options.scrollFree && p.options.scrollY && (!p.options.scrollX || t.abs(l - p._s.startY) >= t.abs(e - p._s.startX))) return p._do = p._y, void(p.s = 4);
				if(!p.options.scrollFree && p.options.scrollX && (!p.options.scrollY || t.abs(l - p._s.startY) < t.abs(e - p._s.startX))) return p._do = p._x, void(p.s = 3);
				if(p.options.scrollFree) return p._do = p._xy, void(p.s = 5)
			}
			if(4 === p.s) return p.y = l - p._s.startY + p._s.endY, void p._doScroll(a, o);
			if(3 === p.s) return p.x = e - p._s.startX + p._s.endX, void p._doScroll(i, o);
			if(5 === p.s) return p.x = e - p._s.startX + p._s.endX, p.y = l - p._s.startY + p._s.endY, c = t.sqrt(i * i + a * a), p.cosX = i / c, p.cosY = a / c, void p._doScroll(t.sqrt(i * i + a * a), o);
			if(2 === p.s) {
				var m, _ = t.abs(d[0].pageX - d[1].pageX),
					v = t.abs(d[0].pageY - d[1].pageY),
					x = t.sqrt(_ * _ + v * v),
					h = x / p._z.spacing * p._z.startScale;
				return h < p.options.zoomMin ? h = p.options.zoomMin : h > p.options.zoomMax && (h = p.options.zoomMax), m = h / p._z.startScale, p.x = t.round(p.originX - p.originX * m + p._s.endX), p.y = t.round(p.originY - p.originY * m + p._s.endY), p._z.scale = h, p._scrollTo(p.x, p.y), void p._execEvent("zoom", o)
			}
		},
		_end: function() {
			var o, r, e = this,
				l = Date.now(),
				s = 4 === e.s,
				n = 3 === e.s,
				i = 5 === e.s;
			return p.jrollActive = null, e._execEvent("touchEnd"), s || n || i ? (e.duration = l - e.startTime, o = e.y > e.minScrollY || e.y < e.maxScrollY, r = e.x > e.minScrollX || e.x < e.maxScrollX, void(s && o || n && r || i && (o || r) ? e.scrollTo(e.x, e.y, 300)._endAction() : e.options.momentum && e.duration < 200 ? (e.speed = t.abs(e.distance / e.duration), e.speed = e.speed > 2 ? 2 : e.speed, e.moving = !0, f(e._step.bind(e, l))) : e._endAction())) : 2 === e.s ? (e._z.scale > e.options.zoomMax ? e._z.scale = e.options.zoomMax : e._z.scale < e.options.zoomMin && (e._z.scale = e.options.zoomMin), e.refresh(), e.scrollTo(e.x, e.y, 400), void e._execEvent("zoomEnd")) : void(1 !== e.s && 2 !== e.s || !e.options.scrollBarFade || e.fading || (e.fading = !0, e.scrollBarX && e._fade(e.scrollBarX, 2e3), e.scrollBarY && e._fade(e.scrollBarY, 2e3)))
		}
	}, "undefined" != typeof module && module.exports && (module.exports = p), "function" == typeof define && define(function() {
		return p
	}), o.JRoll = p
}(window, document, Math);