(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.window = global.window || {}));
  }(this, (function (exports) { 'use strict';
  
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
  
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
  
    /*!
     * Observer 3.10.1
     * https://greensock.com
     *
     * @license Copyright 2008-2022, GreenSock. All rights reserved.
     * Subject to the terms at https://greensock.com/standard-license or for
     * Club GreenSock members, the agreement issued with that membership.
     * @author: Jack Doyle, jack@greensock.com
    */
    var gsap,
        _coreInitted,
        _clamp,
        _win,
        _doc,
        _docEl,
        _body,
        _isTouch,
        _pointerType,
        ScrollTrigger,
        _root,
        _normalizer,
        _getGSAP = function _getGSAP() {
      return gsap || typeof window !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap;
    },
        _startup = 1,
        _observers = [],
        _scrollers = [],
        _proxies = [],
        _getTime = Date.now,
        _bridge = function _bridge(name, value) {
      return value;
    },
        _integrate = function _integrate() {
      var core = ScrollTrigger.core,
          data = core.bridge || {},
          scrollers = core._scrollers,
          proxies = core._proxies;
      scrollers.push.apply(scrollers, _scrollers);
      proxies.push.apply(proxies, _proxies);
      _scrollers = scrollers;
      _proxies = proxies;
  
      _bridge = function _bridge(name, value) {
        return data[name](value);
      };
    },
        _getProxyProp = function _getProxyProp(element, property) {
      return ~_proxies.indexOf(element) && _proxies[_proxies.indexOf(element) + 1][property];
    },
        _isViewport = function _isViewport(el) {
      return !!~_root.indexOf(el);
    },
        _addListener = function _addListener(element, type, func, nonPassive) {
      return element.addEventListener(type, func, {
        passive: !nonPassive
      });
    },
        _removeListener = function _removeListener(element, type, func) {
      return element.removeEventListener(type, func);
    },
        _scrollLeft = "scrollLeft",
        _scrollTop = "scrollTop",
        _onScroll = function _onScroll() {
      return _normalizer && _normalizer.isPressed || _scrollers.cache++;
    },
        _scrollCacheFunc = function _scrollCacheFunc(f) {
      return function (value) {
        if (value || value === 0) {
          _startup && (_win.history.scrollRestoration = "manual");
          f(value);
          f.v = value;
          f.c = _scrollers.cache;
          _normalizer && _normalizer.isPressed && _bridge("ss", value);
        } else if (_scrollers.cache !== f.c || _bridge("ref")) {
          f.c = _scrollers.cache;
          f.v = f();
        }
  
        return f.v;
      };
    },
        _horizontal = {
      s: _scrollLeft,
      p: "left",
      p2: "Left",
      os: "right",
      os2: "Right",
      d: "width",
      d2: "Width",
      a: "x",
      sc: _scrollCacheFunc(function (value) {
        return arguments.length ? _win.scrollTo(value, _vertical.sc()) : _win.pageXOffset || _doc[_scrollLeft] || _docEl[_scrollLeft] || _body[_scrollLeft] || 0;
      })
    },
        _vertical = {
      s: _scrollTop,
      p: "top",
      p2: "Top",
      os: "bottom",
      os2: "Bottom",
      d: "height",
      d2: "Height",
      a: "y",
      op: _horizontal,
      sc: _scrollCacheFunc(function (value) {
        return arguments.length ? _win.scrollTo(_horizontal.sc(), value) : _win.pageYOffset || _doc[_scrollTop] || _docEl[_scrollTop] || _body[_scrollTop] || 0;
      })
    },
        _getTarget = function _getTarget(t) {
      return gsap.utils.toArray(t)[0] || (typeof t === "string" && gsap.config().nullTargetWarn !== false ? console.warn("Element not found:", t) : null);
    },
        _getScrollFunc = function _getScrollFunc(element, _ref) {
      var s = _ref.s,
          sc = _ref.sc;
  
      var i = _scrollers.indexOf(element),
          offset = sc === _vertical.sc ? 1 : 2;
  
      !~i && (i = _scrollers.push(element) - 1);
      return _scrollers[i + offset] || (_scrollers[i + offset] = _getProxyProp(element, s) || (_isViewport(element) ? sc : function (value) {
        return arguments.length ? element[s] = value : element[s];
      }));
    },
        _getVelocityProp = function _getVelocityProp(value, minTimeRefresh, useDelta) {
      var v1 = value,
          v2 = value,
          t1 = _getTime(),
          t2 = t1,
          min = minTimeRefresh || 50,
          dropToZeroTime = Math.max(500, min * 3),
          update = function update(value, force) {
        var t = _getTime();
  
        if (force || t - t1 > min) {
          v2 = v1;
          v1 = value;
          t2 = t1;
          t1 = t;
        } else if (useDelta) {
          v1 += value;
        } else {
          v1 = v2 + (value - v2) / (t - t2) * (t1 - t2);
        }
      },
          reset = function reset() {
        v2 = v1 = useDelta ? 0 : v1;
        t2 = t1 = 0;
      },
          getVelocity = function getVelocity(latestValue) {
        var tOld = t2,
            vOld = v2,
            t = _getTime();
  
        (latestValue || latestValue === 0) && latestValue !== v1 && update(latestValue);
        return t1 === t2 || t - t2 > dropToZeroTime ? 0 : (v1 + (useDelta ? vOld : -vOld)) / ((useDelta ? t : t1) - tOld) * 1000;
      };
  
      return {
        update: update,
        reset: reset,
        getVelocity: getVelocity
      };
    },
        _getEvent = function _getEvent(e, preventDefault) {
      preventDefault && e.preventDefault();
      return e.changedTouches ? e.changedTouches[0] : e;
    },
        _getAbsoluteMax = function _getAbsoluteMax(a) {
      var max = Math.max.apply(Math, a),
          min = Math.min.apply(Math, a);
      return Math.abs(max) >= Math.abs(min) ? max : min;
    },
        _initCore = function _initCore(core) {
      gsap = core || _getGSAP();
  
      if (gsap && !_coreInitted && typeof document !== "undefined") {
        _win = window;
        _doc = document;
        _docEl = _doc.documentElement;
        _body = _doc.body;
        _root = [_win, _doc, _docEl, _body];
        _clamp = gsap.utils.clamp;
        _pointerType = "onpointerenter" in _body ? "pointer" : "mouse";
        _isTouch = Observer.isTouch = _win.matchMedia && _win.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in _win || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0;
        setTimeout(function () {
          return _startup = 0;
        }, 500);
        _coreInitted = 1;
      }
  
      return _coreInitted;
    };
  
    _horizontal.op = _vertical;
    _scrollers.cache = 0;
    var Observer = function () {
      function Observer(vars) {
        this.init(vars);
      }
  
      var _proto = Observer.prototype;
  
      _proto.init = function init(vars) {
        _coreInitted || _initCore(gsap) || console.warn("Please gsap.registerPlugin(Observer)");
  
        if (!ScrollTrigger) {
          ScrollTrigger = gsap.core.globals().ScrollTrigger;
          ScrollTrigger && ScrollTrigger.core && _integrate();
        }
  
        var tolerance = vars.tolerance,
            dragMinimum = vars.dragMinimum,
            type = vars.type,
            target = vars.target,
            lineHeight = vars.lineHeight,
            debounce = vars.debounce,
            preventDefault = vars.preventDefault,
            onStop = vars.onStop,
            onStopDelay = vars.onStopDelay,
            ignore = vars.ignore,
            wheelSpeed = vars.wheelSpeed,
            event = vars.event,
            onDragStart = vars.onDragStart,
            onDragEnd = vars.onDragEnd,
            onDrag = vars.onDrag,
            onPress = vars.onPress,
            onRelease = vars.onRelease,
            onRight = vars.onRight,
            onLeft = vars.onLeft,
            onUp = vars.onUp,
            onDown = vars.onDown,
            onChangeX = vars.onChangeX,
            onChangeY = vars.onChangeY,
            onChange = vars.onChange,
            onToggleX = vars.onToggleX,
            onToggleY = vars.onToggleY,
            onHover = vars.onHover,
            onHoverEnd = vars.onHoverEnd,
            onMove = vars.onMove,
            ignoreCheck = vars.ignoreCheck,
            isNormalizer = vars.isNormalizer,
            onGestureStart = vars.onGestureStart,
            onGestureEnd = vars.onGestureEnd,
            onWheel = vars.onWheel,
            onEnable = vars.onEnable,
            onDisable = vars.onDisable,
            onClick = vars.onClick,
            scrollSpeed = vars.scrollSpeed;
        this.target = target = _getTarget(target) || _docEl;
        this.vars = vars;
        ignore && (ignore = gsap.utils.toArray(ignore));
        tolerance = tolerance || 0;
        dragMinimum = dragMinimum || 0;
        wheelSpeed = wheelSpeed || 1;
        scrollSpeed = scrollSpeed || 1;
        type = type || "wheel,touch,pointer";
        debounce = debounce !== false;
        lineHeight || (lineHeight = parseFloat(_win.getComputedStyle(_body).lineHeight) || 22);
  
        var id,
            onStopDelayedCall,
            dragged,
            moved,
            wheeled,
            self = this,
            prevDeltaX = 0,
            prevDeltaY = 0,
            scrollFuncX = _getScrollFunc(target, _horizontal),
            scrollFuncY = _getScrollFunc(target, _vertical),
            scrollX = scrollFuncX(),
            scrollY = scrollFuncY(),
            events = ("ontouchstart" in _docEl ? "touchstart,touchmove,touchcancel,touchend" : type.indexOf("pointer") >= 0 && !("onpointerdown" in _docEl) ? "mousedown,mousemove,mouseup,mouseup" : "pointerdown,pointermove,pointercancel,pointerup").split(","),
            limitToTouch = ~type.indexOf("touch") && !~type.indexOf("pointer") && events[0] === "pointerdown",
            isViewport = _isViewport(target),
            ownerDoc = target.ownerDocument || _doc,
            deltaX = [0, 0, 0],
            deltaY = [0, 0, 0],
            _ignoreCheck = function _ignoreCheck(e, isPointerOrTouch) {
          return (self.event = e) && ignore && ~ignore.indexOf(e.target) || isPointerOrTouch && limitToTouch && e.pointerType !== "touch" || ignoreCheck && ignoreCheck(e);
        },
            onStopFunc = function onStopFunc() {
          self._vx.reset();
  
          self._vy.reset();
  
          onStopDelayedCall.pause();
          onStop && onStop(self);
        },
            update = function update() {
          var dx = self.deltaX = _getAbsoluteMax(deltaX),
              dy = self.deltaY = _getAbsoluteMax(deltaY),
              changedX = Math.abs(dx) >= tolerance,
              changedY = Math.abs(dy) >= tolerance;
  
          onChange && (changedX || changedY) && onChange(self, dx, dy, deltaX, deltaY);
  
          if (changedX) {
            onRight && self.deltaX > 0 && onRight(self);
            onLeft && self.deltaX < 0 && onLeft(self);
            onChangeX && onChangeX(self);
            onToggleX && self.deltaX < 0 !== prevDeltaX < 0 && onToggleX(self);
            prevDeltaX = self.deltaX;
            deltaX[0] = deltaX[1] = deltaX[2] = 0;
          }
  
          if (changedY) {
            onDown && self.deltaY > 0 && onDown(self);
            onUp && self.deltaY < 0 && onUp(self);
            onChangeY && onChangeY(self);
            onToggleY && self.deltaY < 0 !== prevDeltaY < 0 && onToggleY(self);
            prevDeltaY = self.deltaY;
            deltaY[0] = deltaY[1] = deltaY[2] = 0;
          }
  
          if (moved) {
            onMove(self);
            moved = false;
          }
  
          if (dragged) {
            onDrag(self);
            dragged = false;
          }
  
          if (wheeled) {
            onWheel(self);
            wheeled = false;
          }
  
          id = 0;
        },
            onDelta = function onDelta(x, y, index) {
          deltaX[index] += x;
          deltaY[index] += y;
  
          self._vx.update(x, index === 2);
  
          self._vy.update(y, index === 2);
  
          debounce ? id || (id = requestAnimationFrame(update)) : update();
        },
            _onDrag = function _onDrag(e) {
          if (_ignoreCheck(e, 1)) {
            return;
          }
  
          e = _getEvent(e, preventDefault);
          var x = e.clientX,
              y = e.clientY,
              dx = x - self.x,
              dy = y - self.y,
              isDragging = self.isDragging;
          self.x = x;
          self.y = y;
  
          if (isDragging || Math.abs(self.startX - x) >= dragMinimum || Math.abs(self.startY - y) >= dragMinimum) {
            onDrag && (dragged = true);
            isDragging || (self.isDragging = true);
            onDelta(dx, dy, 2);
            isDragging || onDragStart && onDragStart(self);
          }
        },
            _onPress = self.onPress = function (e) {
          if (_ignoreCheck(e, 1)) {
            return;
          }
  
          onStopDelayedCall.pause();
          self.isPressed = true;
          e = _getEvent(e, preventDefault);
          prevDeltaX = prevDeltaY = 0;
          self.startX = self.x = e.clientX;
          self.startY = self.y = e.clientY;
  
          self._vx.reset();
  
          self._vy.reset();
  
          _addListener(isNormalizer ? target : ownerDoc, events[1], _onDrag, preventDefault);
  
          self.deltaX = self.deltaY = 0;
          onPress && onPress(self);
        },
            _onRelease = function _onRelease(e) {
          if (_ignoreCheck(e, 1)) {
            return;
          }
  
          _removeListener(isNormalizer ? target : ownerDoc, events[1], _onDrag);
  
          var wasDragging = self.isDragging;
  
          if (!wasDragging) {
            self._vx.reset();
  
            self._vy.reset();
          }
  
          self.isDragging = self.isGesturing = self.isPressed = false;
          onStop && !isNormalizer && onStopDelayedCall.restart(true);
          onDragEnd && wasDragging && onDragEnd(self);
          onRelease && onRelease(self, wasDragging);
        },
            _onGestureStart = function _onGestureStart(e) {
          return e.touches && e.touches.length > 1 && (self.isGesturing = true) && onGestureStart(e, self.isDragging);
        },
            _onGestureEnd = function _onGestureEnd() {
          return (self.isGesturing = false) || onGestureEnd(self);
        },
            onScroll = function onScroll(e) {
          if (_ignoreCheck(e)) {
            return;
          }
  
          var x = scrollFuncX(),
              y = scrollFuncY();
          onDelta((x - scrollX) * scrollSpeed, (y - scrollY) * scrollSpeed, 1);
          scrollX = x;
          scrollY = y;
          onStop && onStopDelayedCall.restart(true);
        },
            _onWheel = function _onWheel(e) {
          if (_ignoreCheck(e)) {
            return;
          }
  
          e = _getEvent(e, preventDefault);
          onWheel && (wheeled = true);
          var multiplier = (e.deltaMode === 1 ? lineHeight : e.deltaMode === 2 ? _win.innerHeight : 1) * wheelSpeed;
          onDelta(e.deltaX * multiplier, e.deltaY * multiplier, 0);
          onStop && !isNormalizer && onStopDelayedCall.restart(true);
        },
            _onMove = function _onMove(e) {
          if (_ignoreCheck(e)) {
            return;
          }
  
          var x = e.clientX,
              y = e.clientY,
              dx = x - self.x,
              dy = y - self.y;
          self.x = x;
          self.y = y;
          onMove && (moved = true);
          (dx || dy) && onDelta(dx, dy, 2);
        },
            _onHover = function _onHover(e) {
          self.event = e;
          onHover(self);
        },
            _onHoverEnd = function _onHoverEnd(e) {
          self.event = e;
          onHoverEnd(self);
        },
            _onClick = function _onClick(e) {
          return _ignoreCheck(e) || _getEvent(e, preventDefault) && onClick(self);
        };
  
        onStopDelayedCall = self._dc = gsap.delayedCall(onStopDelay || 0.25, onStopFunc).pause();
        self.deltaX = self.deltaY = 0;
        self._vx = _getVelocityProp(0, 50, true);
        self._vy = _getVelocityProp(0, 50, true);
        self.scrollX = scrollFuncX;
        self.scrollY = scrollFuncY;
        self.isDragging = self.isGesturing = self.isPressed = false;
  
        self.enable = function (e) {
          if (!self.isEnabled) {
            _addListener(isViewport ? ownerDoc : target, "scroll", _onScroll);
  
            type.indexOf("scroll") >= 0 && _addListener(isViewport ? ownerDoc : target, "scroll", onScroll, preventDefault);
            type.indexOf("wheel") >= 0 && _addListener(target, "wheel", _onWheel, preventDefault);
  
            if (type.indexOf("touch") >= 0 && _isTouch || type.indexOf("pointer") >= 0) {
              _addListener(target, events[0], _onPress, preventDefault);
  
              _addListener(ownerDoc, events[2], _onRelease);
  
              _addListener(ownerDoc, events[3], _onRelease);
  
              onClick && _addListener(target, "click", _onClick);
              onGestureStart && _addListener(ownerDoc, "gesturestart", _onGestureStart);
              onGestureEnd && _addListener(ownerDoc, "gestureend", _onGestureEnd);
              onHover && _addListener(target, _pointerType + "enter", _onHover);
              onHoverEnd && _addListener(target, _pointerType + "leave", _onHoverEnd);
              onMove && _addListener(target, _pointerType + "move", _onMove);
            }
  
            self.isEnabled = true;
            e && e.type && _onPress(e);
            onEnable && onEnable(self);
          }
  
          return self;
        };
  
        self.disable = function () {
          if (self.isEnabled) {
            _observers.filter(function (o) {
              return o !== self && _isViewport(o.target);
            }).length || _removeListener(isViewport ? ownerDoc : target, "scroll", _onScroll);
  
            _removeListener(isViewport ? ownerDoc : target, "scroll", onScroll);
  
            _removeListener(target, "wheel", _onWheel);
  
            _removeListener(target, events[0], _onPress);
  
            _removeListener(ownerDoc, events[2], _onRelease);
  
            _removeListener(ownerDoc, events[3], _onRelease);
  
            _removeListener(target, "click", _onClick);
  
            _removeListener(ownerDoc, "gesturestart", _onGestureStart);
  
            _removeListener(ownerDoc, "gestureend", _onGestureEnd);
  
            _removeListener(target, _pointerType + "enter", _onHover);
  
            _removeListener(target, _pointerType + "leave", _onHoverEnd);
  
            _removeListener(target, _pointerType + "move", _onMove);
  
            self.isEnabled = false;
            onDisable && onDisable(self);
          }
        };
  
        self.kill = function () {
          self.disable();
  
          var i = _observers.indexOf(self);
  
          i >= 0 && _observers.splice(i, 1);
          _normalizer === self && (_normalizer = 0);
        };
  
        _observers.push(self);
  
        isNormalizer && (_normalizer = self);
        self.enable(event);
      };
  
      _createClass(Observer, [{
        key: "velocityX",
        get: function get() {
          return this._vx.getVelocity();
        }
      }, {
        key: "velocityY",
        get: function get() {
          return this._vy.getVelocity();
        }
      }]);
  
      return Observer;
    }();
    Observer.version = "3.10.1";
  
    Observer.create = function (vars) {
      return new Observer(vars);
    };
  
    Observer.register = _initCore;
  
    Observer.getAll = function () {
      return _observers.slice();
    };
  
    Observer.getById = function (id) {
      return _observers.filter(function (o) {
        return o.vars.id === id;
      })[0];
    };
  
    _getGSAP() && gsap.registerPlugin(Observer);
  
    /*!
     * ScrollTrigger 3.10.1
     * https://greensock.com
     *
     * @license Copyright 2008-2022, GreenSock. All rights reserved.
     * Subject to the terms at https://greensock.com/standard-license or for
     * Club GreenSock members, the agreement issued with that membership.
     * @author: Jack Doyle, jack@greensock.com
    */
  
    var gsap$1,
        _coreInitted$1,
        _win$1,
        _doc$1,
        _docEl$1,
        _body$1,
        _root$1,
        _resizeDelay,
        _toArray,
        _clamp$1,
        _time2,
        _syncInterval,
        _refreshing,
        _pointerIsDown,
        _transformProp,
        _i,
        _prevWidth,
        _prevHeight,
        _autoRefresh,
        _sort,
        _suppressOverwrites,
        _ignoreResize,
        _normalizer$1,
        _ignoreMobileResize,
        _baseScreenHeight,
        _baseScreenWidth,
        _limitCallbacks,
        _startup$1 = 1,
        _getTime$1 = Date.now,
        _time1 = _getTime$1(),
        _lastScrollTime = 0,
        _enabled = 0,
        _pointerDownHandler = function _pointerDownHandler() {
      return _pointerIsDown = 1;
    },
        _pointerUpHandler = function _pointerUpHandler() {
      return _pointerIsDown = 0;
    },
        _passThrough = function _passThrough(v) {
      return v;
    },
        _round = function _round(value) {
      return Math.round(value * 100000) / 100000 || 0;
    },
        _windowExists = function _windowExists() {
      return typeof window !== "undefined";
    },
        _getGSAP$1 = function _getGSAP() {
      return gsap$1 || _windowExists() && (gsap$1 = window.gsap) && gsap$1.registerPlugin && gsap$1;
    },
        _isViewport$1 = function _isViewport(e) {
      return !!~_root$1.indexOf(e);
    },
        _getBoundsFunc = function _getBoundsFunc(element) {
      return _getProxyProp(element, "getBoundingClientRect") || (_isViewport$1(element) ? function () {
        _winOffsets.width = _win$1.innerWidth;
        _winOffsets.height = _win$1.innerHeight;
        return _winOffsets;
      } : function () {
        return _getBounds(element);
      });
    },
        _getSizeFunc = function _getSizeFunc(scroller, isViewport, _ref) {
      var d = _ref.d,
          d2 = _ref.d2,
          a = _ref.a;
      return (a = _getProxyProp(scroller, "getBoundingClientRect")) ? function () {
        return a()[d];
      } : function () {
        return (isViewport ? _win$1["inner" + d2] : scroller["client" + d2]) || 0;
      };
    },
        _getOffsetsFunc = function _getOffsetsFunc(element, isViewport) {
      return !isViewport || ~_proxies.indexOf(element) ? _getBoundsFunc(element) : function () {
        return _winOffsets;
      };
    },
        _maxScroll = function _maxScroll(element, _ref2) {
      var s = _ref2.s,
          d2 = _ref2.d2,
          d = _ref2.d,
          a = _ref2.a;
      return (s = "scroll" + d2) && (a = _getProxyProp(element, s)) ? a() - _getBoundsFunc(element)()[d] : _isViewport$1(element) ? (_docEl$1[s] || _body$1[s]) - (_win$1["inner" + d2] || _docEl$1["client" + d2] || _body$1["client" + d2]) : element[s] - element["offset" + d2];
    },
        _iterateAutoRefresh = function _iterateAutoRefresh(func, events) {
      for (var i = 0; i < _autoRefresh.length; i += 3) {
        (!events || ~events.indexOf(_autoRefresh[i + 1])) && func(_autoRefresh[i], _autoRefresh[i + 1], _autoRefresh[i + 2]);
      }
    },
        _isString = function _isString(value) {
      return typeof value === "string";
    },
        _isFunction = function _isFunction(value) {
      return typeof value === "function";
    },
        _isNumber = function _isNumber(value) {
      return typeof value === "number";
    },
        _isObject = function _isObject(value) {
      return typeof value === "object";
    },
        _callIfFunc = function _callIfFunc(value) {
      return _isFunction(value) && value();
    },
        _combineFunc = function _combineFunc(f1, f2) {
      return function () {
        var result1 = _callIfFunc(f1),
            result2 = _callIfFunc(f2);
  
        return function () {
          _callIfFunc(result1);
  
          _callIfFunc(result2);
        };
      };
    },
        _endAnimation = function _endAnimation(animation, reversed, pause) {
      return animation && animation.progress(reversed ? 0 : 1) && pause && animation.pause();
    },
        _callback = function _callback(self, func) {
      if (self.enabled) {
        var result = func(self);
        result && result.totalTime && (self.callbackAnimation = result);
      }
    },
        _abs = Math.abs,
        _left = "left",
        _top = "top",
        _right = "right",
        _bottom = "bottom",
        _width = "width",
        _height = "height",
        _Right = "Right",
        _Left = "Left",
        _Top = "Top",
        _Bottom = "Bottom",
        _padding = "padding",
        _margin = "margin",
        _Width = "Width",
        _Height = "Height",
        _px = "px",
        _getComputedStyle = function _getComputedStyle(element) {
      return _win$1.getComputedStyle(element);
    },
        _makePositionable = function _makePositionable(element) {
      var position = _getComputedStyle(element).position;
  
      element.style.position = position === "absolute" || position === "fixed" ? position : "relative";
    },
        _setDefaults = function _setDefaults(obj, defaults) {
      for (var p in defaults) {
        p in obj || (obj[p] = defaults[p]);
      }
  
      return obj;
    },
        _getBounds = function _getBounds(element, withoutTransforms) {
      var tween = withoutTransforms && _getComputedStyle(element)[_transformProp] !== "matrix(1, 0, 0, 1, 0, 0)" && gsap$1.to(element, {
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        skewX: 0,
        skewY: 0
      }).progress(1),
          bounds = element.getBoundingClientRect();
      tween && tween.progress(0).kill();
      return bounds;
    },
        _getSize = function _getSize(element, _ref3) {
      var d2 = _ref3.d2;
      return element["offset" + d2] || element["client" + d2] || 0;
    },
        _getLabelRatioArray = function _getLabelRatioArray(timeline) {
      var a = [],
          labels = timeline.labels,
          duration = timeline.duration(),
          p;
  
      for (p in labels) {
        a.push(labels[p] / duration);
      }
  
      return a;
    },
        _getClosestLabel = function _getClosestLabel(animation) {
      return function (value) {
        return gsap$1.utils.snap(_getLabelRatioArray(animation), value);
      };
    },
        _snapDirectional = function _snapDirectional(snapIncrementOrArray) {
      var snap = gsap$1.utils.snap(snapIncrementOrArray),
          a = Array.isArray(snapIncrementOrArray) && snapIncrementOrArray.slice(0).sort(function (a, b) {
        return a - b;
      });
      return a ? function (value, direction, threshold) {
        if (threshold === void 0) {
          threshold = 1e-3;
        }
  
        var i;
  
        if (!direction) {
          return snap(value);
        }
  
        if (direction > 0) {
          value -= threshold;
  
          for (i = 0; i < a.length; i++) {
            if (a[i] >= value) {
              return a[i];
            }
          }
  
          return a[i - 1];
        } else {
          i = a.length;
          value += threshold;
  
          while (i--) {
            if (a[i] <= value) {
              return a[i];
            }
          }
        }
  
        return a[0];
      } : function (value, direction, threshold) {
        if (threshold === void 0) {
          threshold = 1e-3;
        }
  
        var snapped = snap(value);
        return !direction || Math.abs(snapped - value) < threshold || snapped - value < 0 === direction < 0 ? snapped : snap(direction < 0 ? value - snapIncrementOrArray : value + snapIncrementOrArray);
      };
    },
        _getLabelAtDirection = function _getLabelAtDirection(timeline) {
      return function (value, st) {
        return _snapDirectional(_getLabelRatioArray(timeline))(value, st.direction);
      };
    },
        _multiListener = function _multiListener(func, element, types, callback) {
      return types.split(",").forEach(function (type) {
        return func(element, type, callback);
      });
    },
        _addListener$1 = function _addListener(element, type, func, nonPassive) {
      return element.addEventListener(type, func, {
        passive: !nonPassive
      });
    },
        _removeListener$1 = function _removeListener(element, type, func) {
      return element.removeEventListener(type, func);
    },
        _wheelListener = function _wheelListener(func, el, scrollFunc) {
      return scrollFunc && scrollFunc.wheelHandler && func(el, "wheel", scrollFunc);
    },
        _markerDefaults = {
      startColor: "green",
      endColor: "red",
      indent: 0,
      fontSize: "16px",
      fontWeight: "normal"
    },
        _defaults = {
      toggleActions: "play",
      anticipatePin: 0
    },
        _keywords = {
      top: 0,
      left: 0,
      center: 0.5,
      bottom: 1,
      right: 1
    },
        _offsetToPx = function _offsetToPx(value, size) {
      if (_isString(value)) {
        var eqIndex = value.indexOf("="),
            relative = ~eqIndex ? +(value.charAt(eqIndex - 1) + 1) * parseFloat(value.substr(eqIndex + 1)) : 0;
  
        if (~eqIndex) {
          value.indexOf("%") > eqIndex && (relative *= size / 100);
          value = value.substr(0, eqIndex - 1);
        }
  
        value = relative + (value in _keywords ? _keywords[value] * size : ~value.indexOf("%") ? parseFloat(value) * size / 100 : parseFloat(value) || 0);
      }
  
      return value;
    },
        _createMarker = function _createMarker(type, name, container, direction, _ref4, offset, matchWidthEl, containerAnimation) {
      var startColor = _ref4.startColor,
          endColor = _ref4.endColor,
          fontSize = _ref4.fontSize,
          indent = _ref4.indent,
          fontWeight = _ref4.fontWeight;
  
      var e = _doc$1.createElement("div"),
          useFixedPosition = _isViewport$1(container) || _getProxyProp(container, "pinType") === "fixed",
          isScroller = type.indexOf("scroller") !== -1,
          parent = useFixedPosition ? _body$1 : container,
          isStart = type.indexOf("start") !== -1,
          color = isStart ? startColor : endColor,
          css = "border-color:" + color + ";font-size:" + fontSize + ";color:" + color + ";font-weight:" + fontWeight + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
  
      css += "position:" + ((isScroller || containerAnimation) && useFixedPosition ? "fixed;" : "absolute;");
      (isScroller || containerAnimation || !useFixedPosition) && (css += (direction === _vertical ? _right : _bottom) + ":" + (offset + parseFloat(indent)) + "px;");
      matchWidthEl && (css += "box-sizing:border-box;text-align:left;width:" + matchWidthEl.offsetWidth + "px;");
      e._isStart = isStart;
      e.setAttribute("class", "gsap-marker-" + type + (name ? " marker-" + name : ""));
      e.style.cssText = css;
      e.innerText = name || name === 0 ? type + "-" + name : type;
      parent.children[0] ? parent.insertBefore(e, parent.children[0]) : parent.appendChild(e);
      e._offset = e["offset" + direction.op.d2];
  
      _positionMarker(e, 0, direction, isStart);
  
      return e;
    },
        _positionMarker = function _positionMarker(marker, start, direction, flipped) {
      var vars = {
        display: "block"
      },
          side = direction[flipped ? "os2" : "p2"],
          oppositeSide = direction[flipped ? "p2" : "os2"];
      marker._isFlipped = flipped;
      vars[direction.a + "Percent"] = flipped ? -100 : 0;
      vars[direction.a] = flipped ? "1px" : 0;
      vars["border" + side + _Width] = 1;
      vars["border" + oppositeSide + _Width] = 0;
      vars[direction.p] = start + "px";
      gsap$1.set(marker, vars);
    },
        _triggers = [],
        _ids = {},
        _rafID,
        _sync = function _sync() {
      return _getTime$1() - _lastScrollTime > 34 && _updateAll();
    },
        _onScroll$1 = function _onScroll() {
      if (!_normalizer$1 || !_normalizer$1.isPressed) {
        _scrollers.cache++;
        _rafID || (_rafID = requestAnimationFrame(_updateAll));
        _lastScrollTime || _dispatch("scrollStart");
        _lastScrollTime = _getTime$1();
      }
    },
        _onResize = function _onResize() {
      _scrollers.cache++;
      !_refreshing && !_ignoreResize && !_doc$1.fullscreenElement && (!_ignoreMobileResize || _baseScreenWidth !== _win$1.innerWidth || Math.abs(_win$1.innerHeight - _baseScreenHeight) > _win$1.innerHeight * 0.25) && _resizeDelay.restart(true);
    },
        _listeners = {},
        _emptyArray = [],
        _media = [],
        _creatingMedia,
        _lastMediaTick,
        _onMediaChange = function _onMediaChange(e) {
      var tick = gsap$1.ticker.frame,
          matches = [],
          i = 0,
          index;
  
      if (_lastMediaTick !== tick || _startup$1) {
        _revertAll();
  
        for (; i < _media.length; i += 4) {
          index = _win$1.matchMedia(_media[i]).matches;
  
          if (index !== _media[i + 3]) {
            _media[i + 3] = index;
            index ? matches.push(i) : _revertAll(1, _media[i]) || _isFunction(_media[i + 2]) && _media[i + 2]();
          }
        }
  
        _revertRecorded();
  
        for (i = 0; i < matches.length; i++) {
          index = matches[i];
          _creatingMedia = _media[index];
          _media[index + 2] = _media[index + 1](e);
        }
  
        _creatingMedia = 0;
        _coreInitted$1 && _refreshAll(0, 1);
        _lastMediaTick = tick;
  
        _dispatch("matchMedia");
      }
    },
        _softRefresh = function _softRefresh() {
      return _removeListener$1(ScrollTrigger$1, "scrollEnd", _softRefresh) || _refreshAll(true);
    },
        _dispatch = function _dispatch(type) {
      return _listeners[type] && _listeners[type].map(function (f) {
        return f();
      }) || _emptyArray;
    },
        _savedStyles = [],
        _revertRecorded = function _revertRecorded(media) {
      for (var i = 0; i < _savedStyles.length; i += 5) {
        if (!media || _savedStyles[i + 4] === media) {
          _savedStyles[i].style.cssText = _savedStyles[i + 1];
          _savedStyles[i].getBBox && _savedStyles[i].setAttribute("transform", _savedStyles[i + 2] || "");
          _savedStyles[i + 3].uncache = 1;
        }
      }
    },
        _revertAll = function _revertAll(kill, media) {
      var trigger;
  
      for (_i = 0; _i < _triggers.length; _i++) {
        trigger = _triggers[_i];
  
        if (!media || trigger.media === media) {
          if (kill) {
            trigger.kill(1);
          } else {
            trigger.revert();
          }
        }
      }
  
      media && _revertRecorded(media);
      media || _dispatch("revert");
    },
        _clearScrollMemory = function _clearScrollMemory() {
      return _scrollers.cache++ && _scrollers.forEach(function (obj) {
        return typeof obj === "function" && (obj.rec = 0);
      });
    },
        _refreshingAll,
        _refreshID = 0,
        _refreshAll = function _refreshAll(force, skipRevert) {
      if (_lastScrollTime && !force) {
        _addListener$1(ScrollTrigger$1, "scrollEnd", _softRefresh);
  
        return;
      }
  
      _refreshingAll = true;
  
      var refreshInits = _dispatch("refreshInit");
  
      _sort && ScrollTrigger$1.sort();
      skipRevert || _revertAll();
  
      _triggers.slice(0).forEach(function (t) {
        return t.refresh();
      });
  
      _triggers.forEach(function (t) {
        return t.vars.end === "max" && t.setPositions(t.start, _maxScroll(t.scroller, t._dir));
      });
  
      refreshInits.forEach(function (result) {
        return result && result.render && result.render(-1);
      });
  
      _clearScrollMemory();
  
      _resizeDelay.pause();
  
      _refreshID++;
      _refreshingAll = false;
  
      _dispatch("refresh");
    },
        _lastScroll = 0,
        _direction = 1,
        _primary,
        _updateAll = function _updateAll() {
      if (!_refreshingAll) {
        _primary && _primary.update(0);
        ScrollTrigger$1.isUpdating = true;
  
        var l = _triggers.length,
            time = _getTime$1(),
            recordVelocity = time - _time1 >= 50,
            scroll = l && _triggers[0].scroll();
  
        _direction = _lastScroll > scroll ? -1 : 1;
        _lastScroll = scroll;
  
        if (recordVelocity) {
          if (_lastScrollTime && !_pointerIsDown && time - _lastScrollTime > 200) {
            _lastScrollTime = 0;
  
            _dispatch("scrollEnd");
          }
  
          _time2 = _time1;
          _time1 = time;
        }
  
        if (_direction < 0) {
          _i = l;
  
          while (_i-- > 0) {
            _triggers[_i] && _triggers[_i].update(0, recordVelocity);
          }
  
          _direction = 1;
        } else {
          for (_i = 0; _i < l; _i++) {
            _triggers[_i] && _triggers[_i].update(0, recordVelocity);
          }
        }
  
        ScrollTrigger$1.isUpdating = false;
      }
  
      _rafID = 0;
    },
        _propNamesToCopy = [_left, _top, _bottom, _right, _margin + _Bottom, _margin + _Right, _margin + _Top, _margin + _Left, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"],
        _stateProps = _propNamesToCopy.concat([_width, _height, "boxSizing", "max" + _Width, "max" + _Height, "position", _margin, _padding, _padding + _Top, _padding + _Right, _padding + _Bottom, _padding + _Left]),
        _swapPinOut = function _swapPinOut(pin, spacer, state) {
      _setState(state);
  
      var cache = pin._gsap;
  
      if (cache.spacerIsNative) {
        _setState(cache.spacerState);
      } else if (pin.parentNode === spacer) {
        var parent = spacer.parentNode;
  
        if (parent) {
          parent.insertBefore(pin, spacer);
          parent.removeChild(spacer);
        }
      }
    },
        _swapPinIn = function _swapPinIn(pin, spacer, cs, spacerState) {
      if (pin.parentNode !== spacer) {
        var i = _propNamesToCopy.length,
            spacerStyle = spacer.style,
            pinStyle = pin.style,
            p;
  
        while (i--) {
          p = _propNamesToCopy[i];
          spacerStyle[p] = cs[p];
        }
  
        spacerStyle.position = cs.position === "absolute" ? "absolute" : "relative";
        cs.display === "inline" && (spacerStyle.display = "inline-block");
        pinStyle[_bottom] = pinStyle[_right] = spacerStyle.flexBasis = "auto";
        spacerStyle.overflow = "visible";
        spacerStyle.boxSizing = "border-box";
        spacerStyle[_width] = _getSize(pin, _horizontal) + _px;
        spacerStyle[_height] = _getSize(pin, _vertical) + _px;
        spacerStyle[_padding] = pinStyle[_margin] = pinStyle[_top] = pinStyle[_left] = "0";
  
        _setState(spacerState);
  
        pinStyle[_width] = pinStyle["max" + _Width] = cs[_width];
        pinStyle[_height] = pinStyle["max" + _Height] = cs[_height];
        pinStyle[_padding] = cs[_padding];
        pin.parentNode.insertBefore(spacer, pin);
        spacer.appendChild(pin);
      }
    },
        _capsExp = /([A-Z])/g,
        _setState = function _setState(state) {
      if (state) {
        var style = state.t.style,
            l = state.length,
            i = 0,
            p,
            value;
        (state.t._gsap || gsap$1.core.getCache(state.t)).uncache = 1;
  
        for (; i < l; i += 2) {
          value = state[i + 1];
          p = state[i];
  
          if (value) {
            style[p] = value;
          } else if (style[p]) {
            style.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
          }
        }
      }
    },
        _getState = function _getState(element) {
      var l = _stateProps.length,
          style = element.style,
          state = [],
          i = 0;
  
      for (; i < l; i++) {
        state.push(_stateProps[i], style[_stateProps[i]]);
      }
  
      state.t = element;
      return state;
    },
        _copyState = function _copyState(state, override, omitOffsets) {
      var result = [],
          l = state.length,
          i = omitOffsets ? 8 : 0,
          p;
  
      for (; i < l; i += 2) {
        p = state[i];
        result.push(p, p in override ? override[p] : state[i + 1]);
      }
  
      result.t = state.t;
      return result;
    },
        _winOffsets = {
      left: 0,
      top: 0
    },
        _parsePosition = function _parsePosition(value, trigger, scrollerSize, direction, scroll, marker, markerScroller, self, scrollerBounds, borderWidth, useFixedPosition, scrollerMax, containerAnimation) {
      _isFunction(value) && (value = value(self));
  
      if (_isString(value) && value.substr(0, 3) === "max") {
        value = scrollerMax + (value.charAt(4) === "=" ? _offsetToPx("0" + value.substr(3), scrollerSize) : 0);
      }
  
      var time = containerAnimation ? containerAnimation.time() : 0,
          p1,
          p2,
          element;
      containerAnimation && containerAnimation.seek(0);
  
      if (!_isNumber(value)) {
        _isFunction(trigger) && (trigger = trigger(self));
        var offsets = value.split(" "),
            bounds,
            localOffset,
            globalOffset,
            display;
        element = _getTarget(trigger) || _body$1;
        bounds = _getBounds(element) || {};
  
        if ((!bounds || !bounds.left && !bounds.top) && _getComputedStyle(element).display === "none") {
          display = element.style.display;
          element.style.display = "block";
          bounds = _getBounds(element);
          display ? element.style.display = display : element.style.removeProperty("display");
        }
  
        localOffset = _offsetToPx(offsets[0], bounds[direction.d]);
        globalOffset = _offsetToPx(offsets[1] || "0", scrollerSize);
        value = bounds[direction.p] - scrollerBounds[direction.p] - borderWidth + localOffset + scroll - globalOffset;
        markerScroller && _positionMarker(markerScroller, globalOffset, direction, scrollerSize - globalOffset < 20 || markerScroller._isStart && globalOffset > 20);
        scrollerSize -= scrollerSize - globalOffset;
      } else if (markerScroller) {
        _positionMarker(markerScroller, scrollerSize, direction, true);
      }
  
      if (marker) {
        var position = value + scrollerSize,
            isStart = marker._isStart;
        p1 = "scroll" + direction.d2;
  
        _positionMarker(marker, position, direction, isStart && position > 20 || !isStart && (useFixedPosition ? Math.max(_body$1[p1], _docEl$1[p1]) : marker.parentNode[p1]) <= position + 1);
  
        if (useFixedPosition) {
          scrollerBounds = _getBounds(markerScroller);
          useFixedPosition && (marker.style[direction.op.p] = scrollerBounds[direction.op.p] - direction.op.m - marker._offset + _px);
        }
      }
  
      if (containerAnimation && element) {
        p1 = _getBounds(element);
        containerAnimation.seek(scrollerMax);
        p2 = _getBounds(element);
        containerAnimation._caScrollDist = p1[direction.p] - p2[direction.p];
        value = value / containerAnimation._caScrollDist * scrollerMax;
      }
  
      containerAnimation && containerAnimation.seek(time);
      return containerAnimation ? value : Math.round(value);
    },
        _prefixExp = /(webkit|moz|length|cssText|inset)/i,
        _reparent = function _reparent(element, parent, top, left) {
      if (element.parentNode !== parent) {
        var style = element.style,
            p,
            cs;
  
        if (parent === _body$1) {
          element._stOrig = style.cssText;
          cs = _getComputedStyle(element);
  
          for (p in cs) {
            if (!+p && !_prefixExp.test(p) && cs[p] && typeof style[p] === "string" && p !== "0") {
              style[p] = cs[p];
            }
          }
  
          style.top = top;
          style.left = left;
        } else {
          style.cssText = element._stOrig;
        }
  
        gsap$1.core.getCache(element).uncache = 1;
        parent.appendChild(element);
      }
    },
        _getTweenCreator = function _getTweenCreator(scroller, direction) {
      var getScroll = _getScrollFunc(scroller, direction),
          prop = "_scroll" + direction.p2,
          lastScroll1,
          lastScroll2,
          getTween = function getTween(scrollTo, vars, initialValue, change1, change2) {
        var tween = getTween.tween,
            onComplete = vars.onComplete,
            modifiers = {};
        initialValue = initialValue || getScroll();
        change2 = change1 && change2 || 0;
        change1 = change1 || scrollTo - initialValue;
        tween && tween.kill();
        lastScroll1 = Math.round(initialValue);
        vars[prop] = scrollTo;
        vars.modifiers = modifiers;
  
        modifiers[prop] = function (value) {
          value = _round(getScroll());
  
          if (value !== lastScroll1 && value !== lastScroll2 && Math.abs(value - lastScroll1) > 2 && Math.abs(value - lastScroll2) > 2) {
            tween.kill();
            getTween.tween = 0;
          } else {
            value = initialValue + change1 * tween.ratio + change2 * tween.ratio * tween.ratio;
          }
  
          lastScroll2 = lastScroll1;
          return lastScroll1 = _round(value);
        };
  
        vars.onComplete = function () {
          getTween.tween = 0;
          onComplete && onComplete.call(tween);
        };
  
        tween = getTween.tween = gsap$1.to(scroller, vars);
        return tween;
      };
  
      scroller[prop] = getScroll;
  
      getScroll.wheelHandler = function () {
        return getTween.tween && getTween.tween.kill() && (getTween.tween = 0);
      };
  
      _addListener$1(scroller, "wheel", getScroll.wheelHandler);
  
      return getTween;
    };
  
    var ScrollTrigger$1 = function () {
      function ScrollTrigger(vars, animation) {
        _coreInitted$1 || ScrollTrigger.register(gsap$1) || console.warn("Please gsap.registerPlugin(ScrollTrigger)");
        this.init(vars, animation);
      }
  
      var _proto = ScrollTrigger.prototype;
  
      _proto.init = function init(vars, animation) {
        this.progress = this.start = 0;
        this.vars && this.kill(true, true);
  
        if (!_enabled) {
          this.update = this.refresh = this.kill = _passThrough;
          return;
        }
  
        vars = _setDefaults(_isString(vars) || _isNumber(vars) || vars.nodeType ? {
          trigger: vars
        } : vars, _defaults);
  
        var _vars = vars,
            onUpdate = _vars.onUpdate,
            toggleClass = _vars.toggleClass,
            id = _vars.id,
            onToggle = _vars.onToggle,
            onRefresh = _vars.onRefresh,
            scrub = _vars.scrub,
            trigger = _vars.trigger,
            pin = _vars.pin,
            pinSpacing = _vars.pinSpacing,
            invalidateOnRefresh = _vars.invalidateOnRefresh,
            anticipatePin = _vars.anticipatePin,
            onScrubComplete = _vars.onScrubComplete,
            onSnapComplete = _vars.onSnapComplete,
            once = _vars.once,
            snap = _vars.snap,
            pinReparent = _vars.pinReparent,
            pinSpacer = _vars.pinSpacer,
            containerAnimation = _vars.containerAnimation,
            fastScrollEnd = _vars.fastScrollEnd,
            preventOverlaps = _vars.preventOverlaps,
            direction = vars.horizontal || vars.containerAnimation && vars.horizontal !== false ? _horizontal : _vertical,
            isToggle = !scrub && scrub !== 0,
            scroller = _getTarget(vars.scroller || _win$1),
            scrollerCache = gsap$1.core.getCache(scroller),
            isViewport = _isViewport$1(scroller),
            useFixedPosition = ("pinType" in vars ? vars.pinType : _getProxyProp(scroller, "pinType") || isViewport && "fixed") === "fixed",
            callbacks = [vars.onEnter, vars.onLeave, vars.onEnterBack, vars.onLeaveBack],
            toggleActions = isToggle && vars.toggleActions.split(" "),
            markers = "markers" in vars ? vars.markers : _defaults.markers,
            borderWidth = isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0,
            self = this,
            onRefreshInit = vars.onRefreshInit && function () {
          return vars.onRefreshInit(self);
        },
            getScrollerSize = _getSizeFunc(scroller, isViewport, direction),
            getScrollerOffsets = _getOffsetsFunc(scroller, isViewport),
            lastSnap = 0,
            scrollFunc = _getScrollFunc(scroller, direction),
            tweenTo,
            pinCache,
            snapFunc,
            scroll1,
            scroll2,
            start,
            end,
            markerStart,
            markerEnd,
            markerStartTrigger,
            markerEndTrigger,
            markerVars,
            change,
            pinOriginalState,
            pinActiveState,
            pinState,
            spacer,
            offset,
            pinGetter,
            pinSetter,
            pinStart,
            pinChange,
            spacingStart,
            spacerState,
            markerStartSetter,
            markerEndSetter,
            cs,
            snap1,
            snap2,
            scrubTween,
            scrubSmooth,
            snapDurClamp,
            snapDelayedCall,
            prevProgress,
            prevScroll,
            prevAnimProgress,
            caMarkerSetter,
            customRevertReturn;
  
        self.media = _creatingMedia;
        self._dir = direction;
        anticipatePin *= 45;
        self.scroller = scroller;
        self.scroll = containerAnimation ? containerAnimation.time.bind(containerAnimation) : scrollFunc;
        scroll1 = scrollFunc();
        self.vars = vars;
        animation = animation || vars.animation;
  
        if ("refreshPriority" in vars) {
          _sort = 1;
          vars.refreshPriority === -9999 && (_primary = self);
        }
  
        scrollerCache.tweenScroll = scrollerCache.tweenScroll || {
          top: _getTweenCreator(scroller, _vertical),
          left: _getTweenCreator(scroller, _horizontal)
        };
        self.tweenTo = tweenTo = scrollerCache.tweenScroll[direction.p];
  
        self.scrubDuration = function (value) {
          scrubSmooth = _isNumber(value) && value;
  
          if (!scrubSmooth) {
            scrubTween && scrubTween.progress(1).kill();
            scrubTween = 0;
          } else {
            scrubTween ? scrubTween.duration(value) : scrubTween = gsap$1.to(animation, {
              ease: "expo",
              totalProgress: "+=0.001",
              duration: scrubSmooth,
              paused: true,
              onComplete: function onComplete() {
                return onScrubComplete && onScrubComplete(self);
              }
            });
          }
        };
  
        if (animation) {
          animation.vars.lazy = false;
          animation._initted || animation.vars.immediateRender !== false && vars.immediateRender !== false && animation.render(0, true, true);
          self.animation = animation.pause();
          animation.scrollTrigger = self;
          self.scrubDuration(scrub);
          snap1 = 0;
          id || (id = animation.vars.id);
        }
  
        _triggers.push(self);
  
        if (snap) {
          if (!_isObject(snap) || snap.push) {
            snap = {
              snapTo: snap
            };
          }
  
          "scrollBehavior" in _body$1.style && gsap$1.set(isViewport ? [_body$1, _docEl$1] : scroller, {
            scrollBehavior: "auto"
          });
          snapFunc = _isFunction(snap.snapTo) ? snap.snapTo : snap.snapTo === "labels" ? _getClosestLabel(animation) : snap.snapTo === "labelsDirectional" ? _getLabelAtDirection(animation) : snap.directional !== false ? function (value, st) {
            return _snapDirectional(snap.snapTo)(value, _refreshing ? 0 : st.direction);
          } : gsap$1.utils.snap(snap.snapTo);
          snapDurClamp = snap.duration || {
            min: 0.1,
            max: 2
          };
          snapDurClamp = _isObject(snapDurClamp) ? _clamp$1(snapDurClamp.min, snapDurClamp.max) : _clamp$1(snapDurClamp, snapDurClamp);
          snapDelayedCall = gsap$1.delayedCall(snap.delay || scrubSmooth / 2 || 0.1, function () {
            if (Math.abs(self.getVelocity()) < 10 && !_pointerIsDown && lastSnap !== scrollFunc()) {
              var totalProgress = animation && !isToggle ? animation.totalProgress() : self.progress,
                  velocity = (totalProgress - snap2) / (_getTime$1() - _time2) * 1000 || 0,
                  change1 = gsap$1.utils.clamp(-self.progress, 1 - self.progress, _abs(velocity / 2) * velocity / 0.185),
                  naturalEnd = self.progress + (snap.inertia === false ? 0 : change1),
                  endValue = _clamp$1(0, 1, snapFunc(naturalEnd, self)),
                  scroll = scrollFunc(),
                  endScroll = Math.round(start + endValue * change),
                  _snap = snap,
                  onStart = _snap.onStart,
                  _onInterrupt = _snap.onInterrupt,
                  _onComplete = _snap.onComplete,
                  tween = tweenTo.tween;
  
              if (scroll <= end && scroll >= start && endScroll !== scroll) {
                if (tween && !tween._initted && tween.data <= _abs(endScroll - scroll)) {
                  return;
                }
  
                if (snap.inertia === false) {
                  change1 = endValue - self.progress;
                }
  
                tweenTo(endScroll, {
                  duration: snapDurClamp(_abs(Math.max(_abs(naturalEnd - totalProgress), _abs(endValue - totalProgress)) * 0.185 / velocity / 0.05 || 0)),
                  ease: snap.ease || "power3",
                  data: _abs(endScroll - scroll),
                  onInterrupt: function onInterrupt() {
                    return snapDelayedCall.restart(true) && _onInterrupt && _onInterrupt(self);
                  },
                  onComplete: function onComplete() {
                    self.update();
                    lastSnap = scrollFunc();
                    snap1 = snap2 = animation && !isToggle ? animation.totalProgress() : self.progress;
                    onSnapComplete && onSnapComplete(self);
                    _onComplete && _onComplete(self);
                  }
                }, scroll, change1 * change, endScroll - scroll - change1 * change);
                onStart && onStart(self, tweenTo.tween);
              }
            } else if (self.isActive) {
              snapDelayedCall.restart(true);
            }
          }).pause();
        }
  
        id && (_ids[id] = self);
        trigger = self.trigger = _getTarget(trigger || pin);
        customRevertReturn = trigger && trigger._gsap && trigger._gsap.stRevert;
        customRevertReturn && (customRevertReturn = customRevertReturn(self));
        pin = pin === true ? trigger : _getTarget(pin);
        _isString(toggleClass) && (toggleClass = {
          targets: trigger,
          className: toggleClass
        });
  
        if (pin) {
          pinSpacing === false || pinSpacing === _margin || (pinSpacing = !pinSpacing && _getComputedStyle(pin.parentNode).display === "flex" ? false : _padding);
          self.pin = pin;
          vars.force3D !== false && gsap$1.set(pin, {
            force3D: true
          });
          pinCache = gsap$1.core.getCache(pin);
  
          if (!pinCache.spacer) {
            if (pinSpacer) {
              pinSpacer = _getTarget(pinSpacer);
              pinSpacer && !pinSpacer.nodeType && (pinSpacer = pinSpacer.current || pinSpacer.nativeElement);
              pinCache.spacerIsNative = !!pinSpacer;
              pinSpacer && (pinCache.spacerState = _getState(pinSpacer));
            }
  
            pinCache.spacer = spacer = pinSpacer || _doc$1.createElement("div");
            spacer.classList.add("pin-spacer");
            id && spacer.classList.add("pin-spacer-" + id);
            pinCache.pinState = pinOriginalState = _getState(pin);
          } else {
            pinOriginalState = pinCache.pinState;
          }
  
          self.spacer = spacer = pinCache.spacer;
          cs = _getComputedStyle(pin);
          spacingStart = cs[pinSpacing + direction.os2];
          pinGetter = gsap$1.getProperty(pin);
          pinSetter = gsap$1.quickSetter(pin, direction.a, _px);
  
          _swapPinIn(pin, spacer, cs);
  
          pinState = _getState(pin);
        }
  
        if (markers) {
          markerVars = _isObject(markers) ? _setDefaults(markers, _markerDefaults) : _markerDefaults;
          markerStartTrigger = _createMarker("scroller-start", id, scroller, direction, markerVars, 0);
          markerEndTrigger = _createMarker("scroller-end", id, scroller, direction, markerVars, 0, markerStartTrigger);
          offset = markerStartTrigger["offset" + direction.op.d2];
  
          var content = _getTarget(_getProxyProp(scroller, "content") || scroller);
  
          markerStart = this.markerStart = _createMarker("start", id, content, direction, markerVars, offset, 0, containerAnimation);
          markerEnd = this.markerEnd = _createMarker("end", id, content, direction, markerVars, offset, 0, containerAnimation);
          containerAnimation && (caMarkerSetter = gsap$1.quickSetter([markerStart, markerEnd], direction.a, _px));
  
          if (!useFixedPosition && !(_proxies.length && _getProxyProp(scroller, "fixedMarkers") === true)) {
            _makePositionable(isViewport ? _body$1 : scroller);
  
            gsap$1.set([markerStartTrigger, markerEndTrigger], {
              force3D: true
            });
            markerStartSetter = gsap$1.quickSetter(markerStartTrigger, direction.a, _px);
            markerEndSetter = gsap$1.quickSetter(markerEndTrigger, direction.a, _px);
          }
        }
  
        if (containerAnimation) {
          var oldOnUpdate = containerAnimation.vars.onUpdate,
              oldParams = containerAnimation.vars.onUpdateParams;
          containerAnimation.eventCallback("onUpdate", function () {
            self.update(0, 0, 1);
            oldOnUpdate && oldOnUpdate.apply(oldParams || []);
          });
        }
  
        self.previous = function () {
          return _triggers[_triggers.indexOf(self) - 1];
        };
  
        self.next = function () {
          return _triggers[_triggers.indexOf(self) + 1];
        };
  
        self.revert = function (revert) {
          var r = revert !== false || !self.enabled,
              prevRefreshing = _refreshing;
  
          if (r !== self.isReverted) {
            if (r) {
              self.scroll.rec || !_refreshing || !_refreshingAll || (self.scroll.rec = scrollFunc());
              prevScroll = Math.max(scrollFunc(), self.scroll.rec || 0);
              prevProgress = self.progress;
              prevAnimProgress = animation && animation.progress();
            }
  
            markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
              return m.style.display = r ? "none" : "block";
            });
            r && (_refreshing = 1);
            self.update(r);
            _refreshing = prevRefreshing;
            pin && (r ? _swapPinOut(pin, spacer, pinOriginalState) : (!pinReparent || !self.isActive) && _swapPinIn(pin, spacer, _getComputedStyle(pin), spacerState));
            self.isReverted = r;
          }
        };
  
        self.refresh = function (soft, force) {
          if ((_refreshing || !self.enabled) && !force) {
            return;
          }
  
          if (pin && soft && _lastScrollTime) {
            _addListener$1(ScrollTrigger, "scrollEnd", _softRefresh);
  
            return;
          }
  
          !_refreshingAll && onRefreshInit && onRefreshInit(self);
          _refreshing = 1;
          scrubTween && scrubTween.pause();
          invalidateOnRefresh && animation && animation.time(-0.01, true).invalidate();
          self.isReverted || self.revert();
  
          var size = getScrollerSize(),
              scrollerBounds = getScrollerOffsets(),
              max = containerAnimation ? containerAnimation.duration() : _maxScroll(scroller, direction),
              offset = 0,
              otherPinOffset = 0,
              parsedEnd = vars.end,
              parsedEndTrigger = vars.endTrigger || trigger,
              parsedStart = vars.start || (vars.start === 0 || !trigger ? 0 : pin ? "0 0" : "0 100%"),
              pinnedContainer = self.pinnedContainer = vars.pinnedContainer && _getTarget(vars.pinnedContainer),
              triggerIndex = trigger && Math.max(0, _triggers.indexOf(self)) || 0,
              i = triggerIndex,
              cs,
              bounds,
              scroll,
              isVertical,
              override,
              curTrigger,
              curPin,
              oppositeScroll,
              initted,
              revertedPins;
  
          while (i--) {
            curTrigger = _triggers[i];
            curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = 1);
            curPin = curTrigger.pin;
  
            if (curPin && (curPin === trigger || curPin === pin) && !curTrigger.isReverted) {
              revertedPins || (revertedPins = []);
              revertedPins.unshift(curTrigger);
              curTrigger.revert();
            }
  
            if (curTrigger !== _triggers[i]) {
              triggerIndex--;
              i--;
            }
          }
  
          _isFunction(parsedStart) && (parsedStart = parsedStart(self));
          start = _parsePosition(parsedStart, trigger, size, direction, scrollFunc(), markerStart, markerStartTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation) || (pin ? -0.001 : 0);
          _isFunction(parsedEnd) && (parsedEnd = parsedEnd(self));
  
          if (_isString(parsedEnd) && !parsedEnd.indexOf("+=")) {
            if (~parsedEnd.indexOf(" ")) {
              parsedEnd = (_isString(parsedStart) ? parsedStart.split(" ")[0] : "") + parsedEnd;
            } else {
              offset = _offsetToPx(parsedEnd.substr(2), size);
              parsedEnd = _isString(parsedStart) ? parsedStart : start + offset;
              parsedEndTrigger = trigger;
            }
          }
  
          end = Math.max(start, _parsePosition(parsedEnd || (parsedEndTrigger ? "100% 0" : max), parsedEndTrigger, size, direction, scrollFunc() + offset, markerEnd, markerEndTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation)) || -0.001;
          change = end - start || (start -= 0.01) && 0.001;
          offset = 0;
          i = triggerIndex;
  
          while (i--) {
            curTrigger = _triggers[i];
            curPin = curTrigger.pin;
  
            if (curPin && curTrigger.start - curTrigger._pinPush < start && !containerAnimation && curTrigger.end > 0) {
              cs = curTrigger.end - curTrigger.start;
  
              if ((curPin === trigger || curPin === pinnedContainer) && !_isNumber(parsedStart)) {
                offset += cs * (1 - curTrigger.progress);
              }
  
              curPin === pin && (otherPinOffset += cs);
            }
          }
  
          start += offset;
          end += offset;
          self._pinPush = otherPinOffset;
  
          if (markerStart && offset) {
            cs = {};
            cs[direction.a] = "+=" + offset;
            pinnedContainer && (cs[direction.p] = "-=" + scrollFunc());
            gsap$1.set([markerStart, markerEnd], cs);
          }
  
          if (pin) {
            cs = _getComputedStyle(pin);
            isVertical = direction === _vertical;
            scroll = scrollFunc();
            pinStart = parseFloat(pinGetter(direction.a)) + otherPinOffset;
            !max && end > 1 && ((isViewport ? _body$1 : scroller).style["overflow-" + direction.a] = "scroll");
  
            _swapPinIn(pin, spacer, cs);
  
            pinState = _getState(pin);
            bounds = _getBounds(pin, true);
            oppositeScroll = useFixedPosition && _getScrollFunc(scroller, isVertical ? _horizontal : _vertical)();
  
            if (pinSpacing) {
              spacerState = [pinSpacing + direction.os2, change + otherPinOffset + _px];
              spacerState.t = spacer;
              i = pinSpacing === _padding ? _getSize(pin, direction) + change + otherPinOffset : 0;
              i && spacerState.push(direction.d, i + _px);
  
              _setState(spacerState);
  
              useFixedPosition && scrollFunc(prevScroll);
            }
  
            if (useFixedPosition) {
              override = {
                top: bounds.top + (isVertical ? scroll - start : oppositeScroll) + _px,
                left: bounds.left + (isVertical ? oppositeScroll : scroll - start) + _px,
                boxSizing: "border-box",
                position: "fixed"
              };
              override[_width] = override["max" + _Width] = Math.ceil(bounds.width) + _px;
              override[_height] = override["max" + _Height] = Math.ceil(bounds.height) + _px;
              override[_margin] = override[_margin + _Top] = override[_margin + _Right] = override[_margin + _Bottom] = override[_margin + _Left] = "0";
              override[_padding] = cs[_padding];
              override[_padding + _Top] = cs[_padding + _Top];
              override[_padding + _Right] = cs[_padding + _Right];
              override[_padding + _Bottom] = cs[_padding + _Bottom];
              override[_padding + _Left] = cs[_padding + _Left];
              pinActiveState = _copyState(pinOriginalState, override, pinReparent);
            }
  
            if (animation) {
              initted = animation._initted;
  
              _suppressOverwrites(1);
  
              animation.render(animation.duration(), true, true);
              pinChange = pinGetter(direction.a) - pinStart + change + otherPinOffset;
              change !== pinChange && pinActiveState.splice(pinActiveState.length - 2, 2);
              animation.render(0, true, true);
              initted || animation.invalidate();
  
              _suppressOverwrites(0);
            } else {
              pinChange = change;
            }
          } else if (trigger && scrollFunc() && !containerAnimation) {
            bounds = trigger.parentNode;
  
            while (bounds && bounds !== _body$1) {
              if (bounds._pinOffset) {
                start -= bounds._pinOffset;
                end -= bounds._pinOffset;
              }
  
              bounds = bounds.parentNode;
            }
          }
  
          revertedPins && revertedPins.forEach(function (t) {
            return t.revert(false);
          });
          self.start = start;
          self.end = end;
          scroll1 = scroll2 = scrollFunc();
  
          if (!containerAnimation) {
            scroll1 < prevScroll && scrollFunc(prevScroll);
            self.scroll.rec = 0;
          }
  
          self.revert(false);
          snapDelayedCall && self.isActive && scrollFunc(start + change * prevProgress);
          _refreshing = 0;
          animation && isToggle && (animation._initted || prevAnimProgress) && animation.progress() !== prevAnimProgress && animation.progress(prevAnimProgress, true).render(animation.time(), true, true);
  
          if (prevProgress !== self.progress || containerAnimation) {
            animation && !isToggle && animation.totalProgress(prevProgress, true);
            self.progress = prevProgress;
            self.update(0, 0, 1);
          }
  
          pin && pinSpacing && (spacer._pinOffset = Math.round(self.progress * pinChange));
          onRefresh && onRefresh(self);
        };
  
        self.getVelocity = function () {
          return (scrollFunc() - scroll2) / (_getTime$1() - _time2) * 1000 || 0;
        };
  
        self.endAnimation = function () {
          _endAnimation(self.callbackAnimation);
  
          if (animation) {
            scrubTween ? scrubTween.progress(1) : !animation.paused() ? _endAnimation(animation, animation.reversed()) : isToggle || _endAnimation(animation, self.direction < 0, 1);
          }
        };
  
        self.labelToScroll = function (label) {
          return animation && animation.labels && (start || self.refresh() || start) + animation.labels[label] / animation.duration() * change || 0;
        };
  
        self.getTrailing = function (name) {
          var i = _triggers.indexOf(self),
              a = self.direction > 0 ? _triggers.slice(0, i).reverse() : _triggers.slice(i + 1);
  
          return (_isString(name) ? a.filter(function (t) {
            return t.vars.preventOverlaps === name;
          }) : a).filter(function (t) {
            return self.direction > 0 ? t.end <= start : t.start >= end;
          });
        };
  
        self.update = function (reset, recordVelocity, forceFake) {
          if (containerAnimation && !forceFake && !reset) {
            return;
          }
  
          var scroll = self.scroll(),
              p = reset ? 0 : (scroll - start) / change,
              clipped = p < 0 ? 0 : p > 1 ? 1 : p || 0,
              prevProgress = self.progress,
              isActive,
              wasActive,
              toggleState,
              action,
              stateChanged,
              toggled,
              isAtMax,
              isTakingAction;
  
          if (recordVelocity) {
            scroll2 = scroll1;
            scroll1 = containerAnimation ? scrollFunc() : scroll;
  
            if (snap) {
              snap2 = snap1;
              snap1 = animation && !isToggle ? animation.totalProgress() : clipped;
            }
          }
  
          anticipatePin && !clipped && pin && !_refreshing && !_startup$1 && _lastScrollTime && start < scroll + (scroll - scroll2) / (_getTime$1() - _time2) * anticipatePin && (clipped = 0.0001);
  
          if (clipped !== prevProgress && self.enabled) {
            isActive = self.isActive = !!clipped && clipped < 1;
            wasActive = !!prevProgress && prevProgress < 1;
            toggled = isActive !== wasActive;
            stateChanged = toggled || !!clipped !== !!prevProgress;
            self.direction = clipped > prevProgress ? 1 : -1;
            self.progress = clipped;
  
            if (stateChanged && !_refreshing) {
              toggleState = clipped && !prevProgress ? 0 : clipped === 1 ? 1 : prevProgress === 1 ? 2 : 3;
  
              if (isToggle) {
                action = !toggled && toggleActions[toggleState + 1] !== "none" && toggleActions[toggleState + 1] || toggleActions[toggleState];
                isTakingAction = animation && (action === "complete" || action === "reset" || action in animation);
              }
            }
  
            preventOverlaps && (toggled || isTakingAction) && (isTakingAction || scrub || !animation) && (_isFunction(preventOverlaps) ? preventOverlaps(self) : self.getTrailing(preventOverlaps).forEach(function (t) {
              return t.endAnimation();
            }));
  
            if (!isToggle) {
              if (scrubTween && !_refreshing && !_startup$1) {
                (containerAnimation || _primary && _primary !== self) && scrubTween.render(scrubTween._dp._time - scrubTween._start);
  
                if (scrubTween.resetTo) {
                  scrubTween.resetTo("totalProgress", clipped, animation._tTime / animation._tDur);
                } else {
                  scrubTween.vars.totalProgress = clipped;
                  scrubTween.invalidate().restart();
                }
              } else if (animation) {
                animation.totalProgress(clipped, !!_refreshing);
              }
            }
  
            if (pin) {
              reset && pinSpacing && (spacer.style[pinSpacing + direction.os2] = spacingStart);
  
              if (!useFixedPosition) {
                pinSetter(_round(pinStart + pinChange * clipped));
              } else if (stateChanged) {
                isAtMax = !reset && clipped > prevProgress && end + 1 > scroll && scroll + 1 >= _maxScroll(scroller, direction);
  
                if (pinReparent) {
                  if (!reset && (isActive || isAtMax)) {
                    var bounds = _getBounds(pin, true),
                        _offset = scroll - start;
  
                    _reparent(pin, _body$1, bounds.top + (direction === _vertical ? _offset : 0) + _px, bounds.left + (direction === _vertical ? 0 : _offset) + _px);
                  } else {
                    _reparent(pin, spacer);
                  }
                }
  
                _setState(isActive || isAtMax ? pinActiveState : pinState);
  
                pinChange !== change && clipped < 1 && isActive || pinSetter(pinStart + (clipped === 1 && !isAtMax ? pinChange : 0));
              }
            }
  
            snap && !tweenTo.tween && !_refreshing && !_startup$1 && snapDelayedCall.restart(true);
            toggleClass && (toggled || once && clipped && (clipped < 1 || !_limitCallbacks)) && _toArray(toggleClass.targets).forEach(function (el) {
              return el.classList[isActive || once ? "add" : "remove"](toggleClass.className);
            });
            onUpdate && !isToggle && !reset && onUpdate(self);
  
            if (stateChanged && !_refreshing) {
              if (isToggle) {
                if (isTakingAction) {
                  if (action === "complete") {
                    animation.pause().totalProgress(1);
                  } else if (action === "reset") {
                    animation.restart(true).pause();
                  } else if (action === "restart") {
                    animation.restart(true);
                  } else {
                    animation[action]();
                  }
                }
  
                onUpdate && onUpdate(self);
              }
  
              if (toggled || !_limitCallbacks) {
                onToggle && toggled && _callback(self, onToggle);
                callbacks[toggleState] && _callback(self, callbacks[toggleState]);
                once && (clipped === 1 ? self.kill(false, 1) : callbacks[toggleState] = 0);
  
                if (!toggled) {
                  toggleState = clipped === 1 ? 1 : 3;
                  callbacks[toggleState] && _callback(self, callbacks[toggleState]);
                }
              }
  
              if (fastScrollEnd && !isActive && Math.abs(self.getVelocity()) > (_isNumber(fastScrollEnd) ? fastScrollEnd : 2500)) {
                _endAnimation(self.callbackAnimation);
  
                scrubTween ? scrubTween.progress(1) : _endAnimation(animation, !clipped, 1);
              }
            } else if (isToggle && onUpdate && !_refreshing) {
              onUpdate(self);
            }
          }
  
          if (markerEndSetter) {
            var n = containerAnimation ? scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0) : scroll;
            markerStartSetter(n + (markerStartTrigger._isFlipped ? 1 : 0));
            markerEndSetter(n);
          }
  
          caMarkerSetter && caMarkerSetter(-scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0));
        };
  
        self.enable = function (reset, refresh) {
          if (!self.enabled) {
            self.enabled = true;
  
            _addListener$1(scroller, "resize", _onResize);
  
            _addListener$1(isViewport ? _doc$1 : scroller, "scroll", _onScroll$1);
  
            onRefreshInit && _addListener$1(ScrollTrigger, "refreshInit", onRefreshInit);
  
            if (reset !== false) {
              self.progress = prevProgress = 0;
              scroll1 = scroll2 = lastSnap = scrollFunc();
            }
  
            refresh !== false && self.refresh();
          }
        };
  
        self.getTween = function (snap) {
          return snap && tweenTo ? tweenTo.tween : scrubTween;
        };
  
        self.setPositions = function (newStart, newEnd) {
          if (pin) {
            pinStart += newStart - start;
            pinChange += newEnd - newStart - change;
          }
  
          self.start = start = newStart;
          self.end = end = newEnd;
          change = newEnd - newStart;
          self.update();
        };
  
        self.disable = function (reset, allowAnimation) {
          if (self.enabled) {
            reset !== false && self.revert();
            self.enabled = self.isActive = false;
            allowAnimation || scrubTween && scrubTween.pause();
            prevScroll = 0;
            pinCache && (pinCache.uncache = 1);
            onRefreshInit && _removeListener$1(ScrollTrigger, "refreshInit", onRefreshInit);
  
            if (snapDelayedCall) {
              snapDelayedCall.pause();
              tweenTo.tween && tweenTo.tween.kill() && (tweenTo.tween = 0);
            }
  
            if (!isViewport) {
              var i = _triggers.length;
  
              while (i--) {
                if (_triggers[i].scroller === scroller && _triggers[i] !== self) {
                  return;
                }
              }
  
              _removeListener$1(scroller, "resize", _onResize);
  
              _removeListener$1(scroller, "scroll", _onScroll$1);
            }
          }
        };
  
        self.kill = function (revert, allowAnimation) {
          self.disable(revert, allowAnimation);
          scrubTween && !allowAnimation && scrubTween.kill();
          id && delete _ids[id];
  
          var i = _triggers.indexOf(self);
  
          i >= 0 && _triggers.splice(i, 1);
          i === _i && _direction > 0 && _i--;
          i = 0;
  
          _triggers.forEach(function (t) {
            return t.scroller === self.scroller && (i = 1);
          });
  
          i || (self.scroll.rec = 0);
  
          if (animation) {
            animation.scrollTrigger = null;
            revert && animation.render(-1);
            allowAnimation || animation.kill();
          }
  
          markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
            return m.parentNode && m.parentNode.removeChild(m);
          });
  
          if (pin) {
            pinCache && (pinCache.uncache = 1);
            i = 0;
  
            _triggers.forEach(function (t) {
              return t.pin === pin && i++;
            });
  
            i || (pinCache.spacer = 0);
          }
  
          vars.onKill && vars.onKill(self);
        };
  
        self.enable(false, false);
        customRevertReturn && customRevertReturn(self);
        !animation || !animation.add || change ? self.refresh() : gsap$1.delayedCall(0.01, function () {
          return start || end || self.refresh();
        }) && (change = 0.01) && (start = end = 0);
      };
  
      ScrollTrigger.register = function register(core) {
        if (!_coreInitted$1) {
          gsap$1 = core || _getGSAP$1();
          _windowExists() && window.document && ScrollTrigger.enable();
          _coreInitted$1 = _enabled;
        }
  
        return _coreInitted$1;
      };
  
      ScrollTrigger.defaults = function defaults(config) {
        if (config) {
          for (var p in config) {
            _defaults[p] = config[p];
          }
        }
  
        return _defaults;
      };
  
      ScrollTrigger.disable = function disable(reset, kill) {
        _enabled = 0;
  
        _triggers.forEach(function (trigger) {
          return trigger[kill ? "kill" : "disable"](reset);
        });
  
        _removeListener$1(_win$1, "wheel", _onScroll$1);
  
        _removeListener$1(_doc$1, "scroll", _onScroll$1);
  
        clearInterval(_syncInterval);
  
        _removeListener$1(_doc$1, "touchcancel", _passThrough);
  
        _removeListener$1(_body$1, "touchstart", _passThrough);
  
        _multiListener(_removeListener$1, _doc$1, "pointerdown,touchstart,mousedown", _pointerDownHandler);
  
        _multiListener(_removeListener$1, _doc$1, "pointerup,touchend,mouseup", _pointerUpHandler);
  
        _resizeDelay.kill();
  
        _iterateAutoRefresh(_removeListener$1);
  
        for (var i = 0; i < _scrollers.length; i += 3) {
          _wheelListener(_removeListener$1, _scrollers[i], _scrollers[i + 1]);
  
          _wheelListener(_removeListener$1, _scrollers[i], _scrollers[i + 2]);
        }
      };
  
      ScrollTrigger.enable = function enable() {
        _win$1 = window;
        _doc$1 = document;
        _docEl$1 = _doc$1.documentElement;
        _body$1 = _doc$1.body;
  
        if (gsap$1) {
          _toArray = gsap$1.utils.toArray;
          _clamp$1 = gsap$1.utils.clamp;
          _suppressOverwrites = gsap$1.core.suppressOverwrites || _passThrough;
          gsap$1.core.globals("ScrollTrigger", ScrollTrigger);
  
          if (_body$1) {
            _enabled = 1;
            ScrollTrigger.isTouch = _win$1.matchMedia && _win$1.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in _win$1 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0;
            _root$1 = [_win$1, _doc$1, _docEl$1, _body$1];
            _baseScreenHeight = _win$1.innerHeight;
            _baseScreenWidth = _win$1.innerWidth;
            Observer.register(gsap$1);
  
            _addListener$1(_doc$1, "scroll", _onScroll$1);
  
            var bodyStyle = _body$1.style,
                border = bodyStyle.borderTopStyle,
                bounds,
                i;
            bodyStyle.borderTopStyle = "solid";
            bounds = _getBounds(_body$1);
            _vertical.m = Math.round(bounds.top + _vertical.sc()) || 0;
            _horizontal.m = Math.round(bounds.left + _horizontal.sc()) || 0;
            border ? bodyStyle.borderTopStyle = border : bodyStyle.removeProperty("border-top-style");
            _syncInterval = setInterval(_sync, 250);
            gsap$1.delayedCall(0.5, function () {
              return _startup$1 = 0;
            });
  
            _addListener$1(_doc$1, "touchcancel", _passThrough);
  
            _addListener$1(_body$1, "touchstart", _passThrough);
  
            _multiListener(_addListener$1, _doc$1, "pointerdown,touchstart,mousedown", _pointerDownHandler);
  
            _multiListener(_addListener$1, _doc$1, "pointerup,touchend,mouseup", _pointerUpHandler);
  
            _transformProp = gsap$1.utils.checkPrefix("transform");
  
            _stateProps.push(_transformProp);
  
            _coreInitted$1 = _getTime$1();
            _resizeDelay = gsap$1.delayedCall(0.2, _refreshAll).pause();
            _autoRefresh = [_doc$1, "visibilitychange", function () {
              var w = _win$1.innerWidth,
                  h = _win$1.innerHeight;
  
              if (_doc$1.hidden) {
                _prevWidth = w;
                _prevHeight = h;
              } else if (_prevWidth !== w || _prevHeight !== h) {
                _onResize();
              }
            }, _doc$1, "DOMContentLoaded", _refreshAll, _win$1, "load", _refreshAll, _win$1, "resize", _onResize];
  
            _iterateAutoRefresh(_addListener$1);
  
            _triggers.forEach(function (trigger) {
              return trigger.enable(0, 1);
            });
  
            for (i = 0; i < _scrollers.length; i += 3) {
              _wheelListener(_removeListener$1, _scrollers[i], _scrollers[i + 1]);
  
              _wheelListener(_removeListener$1, _scrollers[i], _scrollers[i + 2]);
            }
          }
        }
      };
  
      ScrollTrigger.config = function config(vars) {
        "limitCallbacks" in vars && (_limitCallbacks = !!vars.limitCallbacks);
        var ms = vars.syncInterval;
        ms && clearInterval(_syncInterval) || (_syncInterval = ms) && setInterval(_sync, ms);
        "ignoreMobileResize" in vars && (_ignoreMobileResize = ScrollTrigger.isTouch === 1 && vars.ignoreMobileResize);
  
        if ("autoRefreshEvents" in vars) {
          _iterateAutoRefresh(_removeListener$1) || _iterateAutoRefresh(_addListener$1, vars.autoRefreshEvents || "none");
          _ignoreResize = (vars.autoRefreshEvents + "").indexOf("resize") === -1;
        }
      };
  
      ScrollTrigger.scrollerProxy = function scrollerProxy(target, vars) {
        var t = _getTarget(target),
            i = _scrollers.indexOf(t),
            isViewport = _isViewport$1(t);
  
        if (~i) {
          _scrollers.splice(i, isViewport ? 6 : 2);
        }
  
        if (vars) {
          isViewport ? _proxies.unshift(_win$1, vars, _body$1, vars, _docEl$1, vars) : _proxies.unshift(t, vars);
        }
      };
  
      ScrollTrigger.matchMedia = function matchMedia(vars) {
        var mq, p, i, func, result;
  
        for (p in vars) {
          i = _media.indexOf(p);
          func = vars[p];
          _creatingMedia = p;
  
          if (p === "all") {
            func();
          } else {
            mq = _win$1.matchMedia(p);
  
            if (mq) {
              mq.matches && (result = func());
  
              if (~i) {
                _media[i + 1] = _combineFunc(_media[i + 1], func);
                _media[i + 2] = _combineFunc(_media[i + 2], result);
              } else {
                i = _media.length;
  
                _media.push(p, func, result);
  
                mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
              }
  
              _media[i + 3] = mq.matches;
            }
          }
  
          _creatingMedia = 0;
        }
  
        return _media;
      };
  
      ScrollTrigger.clearMatchMedia = function clearMatchMedia(query) {
        query || (_media.length = 0);
        query = _media.indexOf(query);
        query >= 0 && _media.splice(query, 4);
      };
  
      ScrollTrigger.isInViewport = function isInViewport(element, ratio, horizontal) {
        var bounds = (_isString(element) ? _getTarget(element) : element).getBoundingClientRect(),
            offset = bounds[horizontal ? _width : _height] * ratio || 0;
        return horizontal ? bounds.right - offset > 0 && bounds.left + offset < _win$1.innerWidth : bounds.bottom - offset > 0 && bounds.top + offset < _win$1.innerHeight;
      };
  
      ScrollTrigger.positionInViewport = function positionInViewport(element, referencePoint, horizontal) {
        _isString(element) && (element = _getTarget(element));
        var bounds = element.getBoundingClientRect(),
            size = bounds[horizontal ? _width : _height],
            offset = referencePoint == null ? size / 2 : referencePoint in _keywords ? _keywords[referencePoint] * size : ~referencePoint.indexOf("%") ? parseFloat(referencePoint) * size / 100 : parseFloat(referencePoint) || 0;
        return horizontal ? (bounds.left + offset) / _win$1.innerWidth : (bounds.top + offset) / _win$1.innerHeight;
      };
  
      return ScrollTrigger;
    }();
    ScrollTrigger$1.version = "3.10.1";
  
    ScrollTrigger$1.saveStyles = function (targets) {
      return targets ? _toArray(targets).forEach(function (target) {
        if (target && target.style) {
          var i = _savedStyles.indexOf(target);
  
          i >= 0 && _savedStyles.splice(i, 5);
  
          _savedStyles.push(target, target.style.cssText, target.getBBox && target.getAttribute("transform"), gsap$1.core.getCache(target), _creatingMedia);
        }
      }) : _savedStyles;
    };
  
    ScrollTrigger$1.revert = function (soft, media) {
      return _revertAll(!soft, media);
    };
  
    ScrollTrigger$1.create = function (vars, animation) {
      return new ScrollTrigger$1(vars, animation);
    };
  
    ScrollTrigger$1.refresh = function (safe) {
      return safe ? _onResize() : (_coreInitted$1 || ScrollTrigger$1.register()) && _refreshAll(true);
    };
  
    ScrollTrigger$1.update = _updateAll;
    ScrollTrigger$1.clearScrollMemory = _clearScrollMemory;
  
    ScrollTrigger$1.maxScroll = function (element, horizontal) {
      return _maxScroll(element, horizontal ? _horizontal : _vertical);
    };
  
    ScrollTrigger$1.getScrollFunc = function (element, horizontal) {
      return _getScrollFunc(_getTarget(element), horizontal ? _horizontal : _vertical);
    };
  
    ScrollTrigger$1.getById = function (id) {
      return _ids[id];
    };
  
    ScrollTrigger$1.getAll = function () {
      return _triggers.filter(function (t) {
        return t.vars.id !== "ScrollSmoother";
      });
    };
  
    ScrollTrigger$1.isScrolling = function () {
      return !!_lastScrollTime;
    };
  
    ScrollTrigger$1.snapDirectional = _snapDirectional;
  
    ScrollTrigger$1.addEventListener = function (type, callback) {
      var a = _listeners[type] || (_listeners[type] = []);
      ~a.indexOf(callback) || a.push(callback);
    };
  
    ScrollTrigger$1.removeEventListener = function (type, callback) {
      var a = _listeners[type],
          i = a && a.indexOf(callback);
      i >= 0 && a.splice(i, 1);
    };
  
    ScrollTrigger$1.batch = function (targets, vars) {
      var result = [],
          varsCopy = {},
          interval = vars.interval || 0.016,
          batchMax = vars.batchMax || 1e9,
          proxyCallback = function proxyCallback(type, callback) {
        var elements = [],
            triggers = [],
            delay = gsap$1.delayedCall(interval, function () {
          callback(elements, triggers);
          elements = [];
          triggers = [];
        }).pause();
        return function (self) {
          elements.length || delay.restart(true);
          elements.push(self.trigger);
          triggers.push(self);
          batchMax <= elements.length && delay.progress(1);
        };
      },
          p;
  
      for (p in vars) {
        varsCopy[p] = p.substr(0, 2) === "on" && _isFunction(vars[p]) && p !== "onRefreshInit" ? proxyCallback(p, vars[p]) : vars[p];
      }
  
      if (_isFunction(batchMax)) {
        batchMax = batchMax();
  
        _addListener$1(ScrollTrigger$1, "refresh", function () {
          return batchMax = vars.batchMax();
        });
      }
  
      _toArray(targets).forEach(function (target) {
        var config = {};
  
        for (p in varsCopy) {
          config[p] = varsCopy[p];
        }
  
        config.trigger = target;
        result.push(ScrollTrigger$1.create(config));
      });
  
      return result;
    };
  
    var _clampScrollAndGetDurationMultiplier = function _clampScrollAndGetDurationMultiplier(scrollFunc, current, end, max) {
      current > max ? scrollFunc(max) : current < 0 && scrollFunc(0);
      return end > max ? (max - current) / (end - current) : end < 0 ? current / (current - end) : 1;
    },
        _allowNativePanning = function _allowNativePanning(direction) {
      if (direction === true) {
        _body$1.style.removeProperty("touch-action");
  
        _docEl$1.style.removeProperty("touch-action");
      } else {
        _body$1.style.touchAction = _docEl$1.style.touchAction = direction ? "pan-" + direction : "none";
      }
    },
        _getScrollNormalizer = function _getScrollNormalizer(vars) {
      _isObject(vars) || (vars = {});
      vars.preventDefault = vars.isNormalizer = true;
      vars.type || (vars.type = "wheel,touch");
      vars.debounce = !!vars.debounce;
      vars.id = vars.id || "normalizer";
  
      var _vars2 = vars,
          normalizeScrollX = _vars2.normalizeScrollX,
          momentum = _vars2.momentum,
          self,
          maxY,
          onClickTime = 0,
          scrollFuncY = _getScrollFunc(_docEl$1, _vertical),
          scrollFuncX = _getScrollFunc(_docEl$1, _horizontal),
          scale = 1,
          resolveMomentumDuration = _isFunction(momentum) ? function () {
        return momentum(self);
      } : function () {
        return momentum || 2.8;
      },
          skipTouchMove,
          lastRefreshID,
          onClick = function onClick() {
        return onClickTime = _getTime$1();
      },
          resumeTouchMove = function resumeTouchMove() {
        return skipTouchMove = false;
      },
          scrollClampX = _passThrough,
          scrollClampY = _passThrough,
          updateClamps = function updateClamps() {
        maxY = _maxScroll(_docEl$1, _vertical);
        scrollClampY = _clamp$1(0, maxY);
        normalizeScrollX && (scrollClampX = _clamp$1(0, _maxScroll(_docEl$1, _horizontal)));
        lastRefreshID = _refreshID;
      },
          fixIOSBug = ScrollTrigger$1.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),
          ignoreDrag = function ignoreDrag() {
        if (skipTouchMove) {
          requestAnimationFrame(resumeTouchMove);
          return true;
        }
  
        skipTouchMove = true;
      },
          tween,
          startScrollX,
          startScrollY,
          ownerDoc,
          onStopDelayedCall,
          onResize = function onResize() {
        updateClamps();
        tween.isActive() && tween.vars.scrollY > maxY && tween.resetTo("scrollY", _maxScroll(_docEl$1, _vertical));
      };
  
      vars.ignoreCheck = function (e) {
        return fixIOSBug && e.type === "touchmove" && ignoreDrag() || scale > 1 || self.isGesturing || e.touches && e.touches.length > 1;
      };
  
      vars.onPress = function () {
        var prevScale = scale;
        scale = _win$1.visualViewport && _win$1.visualViewport.scale || 1;
        tween.pause();
        prevScale !== scale && _allowNativePanning(scale > 1 ? true : normalizeScrollX ? false : "x");
        skipTouchMove = false;
        startScrollX = scrollFuncX();
        startScrollY = scrollFuncY();
        updateClamps();
        lastRefreshID = _refreshID;
      };
  
      vars.onRelease = vars.onGestureStart = function (self, wasDragging) {
        var e = self.event,
            eventData = e.changedTouches ? e.changedTouches[0] : e;
  
        if (!wasDragging || Math.abs(self.x - self.startX) <= 3 && Math.abs(self.y - self.startY) <= 3) {
          gsap$1.delayedCall(0.05, function () {
            if (_getTime$1() - onClickTime > 300 && !e.defaultPrevented) {
              if (e.target.click) {
                e.target.click();
              } else if (ownerDoc.createEvent) {
                var syntheticEvent = ownerDoc.createEvent("MouseEvents");
                syntheticEvent.initMouseEvent("click", true, true, _win$1, 1, eventData.screenX, eventData.screenY, eventData.clientX, eventData.clientY, false, false, false, false, 0, null);
                e.target.dispatchEvent(syntheticEvent);
              }
            }
          });
          onStopDelayedCall.restart(true);
        } else {
          var dur = resolveMomentumDuration(),
              currentScroll,
              endScroll;
  
          if (normalizeScrollX) {
            currentScroll = scrollFuncX();
            endScroll = currentScroll + dur * 0.05 * -self.velocityX / 0.227 / scale;
            dur *= _clampScrollAndGetDurationMultiplier(scrollFuncX, currentScroll, endScroll, _maxScroll(_docEl$1, _horizontal));
            tween.vars.scrollX = scrollClampX(endScroll);
          }
  
          currentScroll = scrollFuncY();
          endScroll = currentScroll + dur * 0.05 * -self.velocityY / 0.227 / scale;
          dur *= _clampScrollAndGetDurationMultiplier(scrollFuncY, currentScroll, endScroll, _maxScroll(_docEl$1, _vertical));
          tween.vars.scrollY = scrollClampY(endScroll);
          tween.invalidate().duration(dur).play(0.01);
        }
      };
  
      vars.onWheel = function () {
        return tween._ts && tween.pause();
      };
  
      vars.onChange = function (self, dx, dy, xArray, yArray) {
        _refreshID !== lastRefreshID && updateClamps();
        dx && normalizeScrollX && scrollFuncX(scrollClampX(xArray[2] === dx ? startScrollX + (self.startX - self.x) / scale : scrollFuncX() + dx - xArray[1]));
        dy && scrollFuncY(scrollClampY(yArray[2] === dy ? startScrollY + (self.startY - self.y) / scale : scrollFuncY() + dy - yArray[1]));
  
        _updateAll();
      };
  
      vars.onEnable = function (self) {
        _allowNativePanning(normalizeScrollX ? false : "x");
  
        _addListener$1(_win$1, "resize", onResize);
  
        self.target.addEventListener("click", onClick, {
          capture: true
        });
      };
  
      vars.onDisable = function (self) {
        _allowNativePanning(true);
  
        _removeListener$1(_win$1, "resize", onResize);
  
        _removeListener$1(self.target, "click", onClick);
      };
  
      self = new Observer(vars);
      ownerDoc = self.target.ownerDocument || _doc$1;
      onStopDelayedCall = self._dc;
      tween = gsap$1.to(self, {
        ease: "power4",
        paused: true,
        scrollX: normalizeScrollX ? "+=0.1" : "+=0",
        scrollY: "+=0.1",
        onComplete: onStopDelayedCall.vars.onComplete
      });
      return self;
    };
  
    ScrollTrigger$1.sort = function (func) {
      return _triggers.sort(func || function (a, b) {
        return (a.vars.refreshPriority || 0) * -1e6 + a.start - (b.start + (b.vars.refreshPriority || 0) * -1e6);
      });
    };
  
    ScrollTrigger$1.observe = function (vars) {
      return new Observer(vars);
    };
  
    ScrollTrigger$1.normalizeScroll = function (vars) {
      if (typeof vars === "undefined") {
        return _normalizer$1;
      }
  
      if (vars === true && _normalizer$1) {
        return _normalizer$1.enable();
      }
  
      var isInstance = vars instanceof Observer;
      _normalizer$1 && (vars === false || isInstance && vars !== _normalizer$1) && _normalizer$1.kill();
      vars && !isInstance && (vars = _getScrollNormalizer(vars));
      return _normalizer$1 = vars && vars.enable();
    };
  
    ScrollTrigger$1.core = {
      _getVelocityProp: _getVelocityProp,
      _scrollers: _scrollers,
      _proxies: _proxies,
      bridge: {
        ss: function ss() {
          _lastScrollTime || _dispatch("scrollStart");
          _lastScrollTime = _getTime$1();
        },
        ref: function ref() {
          return _refreshing;
        }
      }
    };
    _getGSAP$1() && gsap$1.registerPlugin(ScrollTrigger$1);
  
    exports.ScrollTrigger = ScrollTrigger$1;
    exports.default = ScrollTrigger$1;
  
    if (typeof(window) === 'undefined' || window !== exports) {Object.defineProperty(exports, '__esModule', { value: true });} else {delete window.default;}
  
  })));
  1