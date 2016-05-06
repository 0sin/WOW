(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.wow = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  //
  // Name    : wow
  // Author  : Matthieu Aussaguel, http://mynameismatthieu.com/, @mattaussaguel
  // Version : 1.1.2
  // Repo    : https://github.com/matthieua/WOW
  // Website : http://mynameismatthieu.com/wow

  function fact() {
    var _class, _temp;

    var Util = function () {
      function Util() {
        _classCallCheck(this, Util);
      }

      _createClass(Util, [{
        key: 'extend',
        value: function extend(custom, defaults) {
          for (var key in defaults) {
            var value = defaults[key];if (custom[key] == null) {
              custom[key] = value;
            }
          }
          return custom;
        }
      }, {
        key: 'isMobile',
        value: function isMobile(agent) {
          return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent)
          );
        }
      }, {
        key: 'createEvent',
        value: function createEvent(event) {
          var bubble = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
          var cancel = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
          var detail = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

          if (document.createEvent != null) {
            // W3C DOM
            var customEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent(event, bubble, cancel, detail);
          } else if (document.createEventObject != null) {
            // IE DOM < 9
            var customEvent = document.createEventObject();
            customEvent.eventType = event;
          } else {
            customEvent.eventName = event;
          }

          return customEvent;
        }
      }, {
        key: 'emitEvent',
        value: function emitEvent(elem, event) {
          if (elem.dispatchEvent != null) {
            // W3C DOM
            elem.dispatchEvent(event);
          } else if (event in (elem != null)) {
            var evt = elem[event];
            evt();
          } else if ('on' + event in (elem != null)) {
            var evt = elem['on' + event];
            evt();
          }
          return undefined;
        }
      }, {
        key: 'addEvent',
        value: function addEvent(elem, event, fn) {
          if (elem.addEventListener != null) {
            // W3C DOM
            return elem.addEventListener(event, fn, false);
          } else if (elem.attachEvent != null) {
            // IE DOM
            return elem.attachEvent('on' + event, fn);
          } else {
            // fallback
            return elem[event] = fn;
          }
        }
      }, {
        key: 'removeEvent',
        value: function removeEvent(elem, event, fn) {
          if (elem.removeEventListener != null) {
            // W3C DOM
            return elem.removeEventListener(event, fn, false);
          } else if (elem.detachEvent != null) {
            // IE DOM
            return elem.detachEvent('on' + event, fn);
          } else {
            // fallback
            return delete elem[event];
          }
        }
      }, {
        key: 'innerHeight',
        value: function innerHeight() {
          if ('innerHeight' in window) {
            return window.innerHeight;
          } else {
            return document.documentElement.clientHeight;
          }
        }
      }]);

      return Util;
    }();

    // Minimalistic WeakMap shim, just in case.
    var WeakMap = this.WeakMap || this.MozWeakMap || function () {
      function WeakMap() {
        _classCallCheck(this, WeakMap);

        this.keys = [];
        this.values = [];
      }

      _createClass(WeakMap, [{
        key: 'get',
        value: function get(key) {
          for (var i = 0; i < this.keys.length; i++) {
            var item = this.keys[i];
            if (item === key) {
              return this.values[i];
            }
          }
        }
      }, {
        key: 'set',
        value: function set(key, value) {
          for (var i = 0; i < this.keys.length; i++) {
            var item = this.keys[i];
            if (item === key) {
              this.values[i] = value;
              return;
            }
          }
          this.keys.push(key);
          return this.values.push(value);
        }
      }]);

      return WeakMap;
    }();

    // Dummy MutationObserver, to avoid raising exceptions.
    var MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (_temp = _class = function () {
      function MutationObserver() {
        _classCallCheck(this, MutationObserver);

        if (typeof console !== 'undefined' && console !== null) {
          console.warn('MutationObserver is not supported by your browser.');
          console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
        }
      }

      _createClass(MutationObserver, [{
        key: 'observe',
        value: function observe() {}
      }]);

      return MutationObserver;
    }(), _class.notSupported = true, _temp);

    // getComputedStyle shim, from http://stackoverflow.com/a/21797294
    var getComputedStyle = this.getComputedStyle || function (el, pseudo) {
      this.getPropertyValue = function (prop) {
        var getComputedStyleRX = /(\-([a-z]){1})/g;
        if (prop === 'float') {
          prop = 'styleFloat';
        }
        if (getComputedStyleRX.test(prop)) {
          prop.replace(getComputedStyleRX, function (_, _char) {
            return _char.toUpperCase();
          });
        }
        var currentStyle = el.currentStyle;

        return (currentStyle != null ? currentStyle[prop] : void 0) || null;
      };
      return this;
    };

    var WOW = function () {
      function WOW() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, WOW);

        this.defaults = {
          boxClass: 'wow',
          animateClass: 'animated',
          offset: 0,
          mobile: true,
          live: true,
          callback: null,
          scrollContainer: null
        };

        this.animate = function () {
          if ('requestAnimationFrame' in window) {
            return function (callback) {
              return window.requestAnimationFrame(callback);
            };
          } else {
            return function (callback) {
              return callback();
            };
          }
        }();

        this.vendors = ["moz", "webkit"];

        this.start = this.start.bind(this);
        this.resetAnimation = this.resetAnimation.bind(this);
        this.scrollHandler = this.scrollHandler.bind(this);
        this.scrollCallback = this.scrollCallback.bind(this);
        this.scrolled = true;
        this.config = this.util().extend(options, this.defaults);
        if (options.scrollContainer != null) {
          this.config.scrollContainer = document.querySelector(options.scrollContainer);
        }
        // Map of elements to animation names:
        this.animationNameCache = new WeakMap();
        this.wowEvent = this.util().createEvent(this.config.boxClass);
      }

      _createClass(WOW, [{
        key: 'init',
        value: function init() {
          this.element = window.document.documentElement;
          if (__in__(document.readyState, ["interactive", "complete"])) {
            this.start();
          } else {
            this.util().addEvent(document, 'DOMContentLoaded', this.start);
          }
          return this.finished = [];
        }
      }, {
        key: 'start',
        value: function start() {
          var _this = this;

          this.stopped = false;
          this.boxes = [].slice.call(this.element.querySelectorAll('.' + this.config.boxClass));
          this.all = this.boxes.slice(0);
          if (this.boxes.length) {
            if (this.disabled()) {
              this.resetStyle();
            } else {
              for (var i = 0; i < this.boxes.length; i++) {
                var box = this.boxes[i];
                this.applyStyle(box, true);
              }
            }
          }
          if (!this.disabled()) {
            this.util().addEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
            this.util().addEvent(window, 'resize', this.scrollHandler);
            this.interval = setInterval(this.scrollCallback, 50);
          }
          if (this.config.live) {
            return new MutationObserver(function (records) {
              for (var j = 0; j < records.length; j++) {
                var record = records[j];
                for (var k = 0; k < record.addedNodes.length; k++) {
                  var node = record.addedNodes[k];
                  _this.doSync(node);
                }
              }
              return undefined;
            }).observe(document.body, {
              childList: true,
              subtree: true
            });
          }
        }
      }, {
        key: 'stop',
        value: function stop() {
          this.stopped = true;
          this.util().removeEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
          this.util().removeEvent(window, 'resize', this.scrollHandler);
          if (this.interval != null) {
            return clearInterval(this.interval);
          }
        }
      }, {
        key: 'sync',
        value: function sync(element) {
          if (MutationObserver.notSupported) {
            return this.doSync(this.element);
          }
        }
      }, {
        key: 'doSync',
        value: function doSync(element) {
          if (typeof element === 'undefined' || element === null) {
            element = this.element;
          }
          if (element.nodeType !== 1) {
            return;
          }
          element = element.parentNode || element;
          var iterable = element.querySelectorAll('.' + this.config.boxClass);
          for (var i = 0; i < iterable.length; i++) {
            var box = iterable[i];
            if (__in__(box, this.all)) {
              this.boxes.push(box);
              this.all.push(box);
              if (this.stopped || this.disabled()) {
                this.resetStyle();
              } else {
                this.applyStyle(box, true);
              }
              this.scrolled = true;
            }
          }
          return undefined;
        }
      }, {
        key: 'show',
        value: function show(box) {
          this.applyStyle(box);
          box.className = box.className + ' ' + this.config.animateClass;
          if (this.config.callback != null) {
            this.config.callback(box);
          }
          this.util().emitEvent(box, this.wowEvent);

          this.util().addEvent(box, 'animationend', this.resetAnimation);
          this.util().addEvent(box, 'oanimationend', this.resetAnimation);
          this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
          this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);

          return box;
        }
      }, {
        key: 'applyStyle',
        value: function applyStyle(box, hidden) {
          var _this2 = this;

          var duration = box.getAttribute('data-wow-duration');
          var delay = box.getAttribute('data-wow-delay');
          var iteration = box.getAttribute('data-wow-iteration');

          return this.animate(function () {
            return _this2.customStyle(box, hidden, duration, delay, iteration);
          });
        }
      }, {
        key: 'resetStyle',
        value: function resetStyle() {
          for (var i = 0; i < this.boxes.length; i++) {
            var box = this.boxes[i];
            box.style.visibility = 'visible';
          }
          return undefined;
        }
      }, {
        key: 'resetAnimation',
        value: function resetAnimation(event) {
          if (event.type.toLowerCase().indexOf('animationend') >= 0) {
            var target = event.target || event.srcElement;
            return target.className = target.className.replace(this.config.animateClass, '').trim();
          }
        }
      }, {
        key: 'customStyle',
        value: function customStyle(box, hidden, duration, delay, iteration) {
          if (hidden) {
            this.cacheAnimationName(box);
          }
          box.style.visibility = hidden ? 'hidden' : 'visible';

          if (duration) {
            this.vendorSet(box.style, { animationDuration: duration });
          }
          if (delay) {
            this.vendorSet(box.style, { animationDelay: delay });
          }
          if (iteration) {
            this.vendorSet(box.style, { animationIterationCount: iteration });
          }
          this.vendorSet(box.style, { animationName: hidden ? 'none' : this.cachedAnimationName(box) });

          return box;
        }
      }, {
        key: 'vendorSet',
        value: function vendorSet(elem, properties) {
          for (var name in properties) {
            var value = properties[name];
            elem['' + name] = value;
            for (var i = 0; i < this.vendors.length; i++) {
              var vendor = this.vendors[i];elem['' + vendor + name.charAt(0).toUpperCase() + name.substr(1)] = value;
            }
          }
          return undefined;
        }
      }, {
        key: 'vendorCSS',
        value: function vendorCSS(elem, property) {
          var style = getComputedStyle(elem);
          var result = style.getPropertyCSSValue(property);
          for (var i = 0; i < this.vendors.length; i++) {
            var vendor = this.vendors[i];result = result || style.getPropertyCSSValue('-' + vendor + '-' + property);
          }
          return result;
        }
      }, {
        key: 'animationName',
        value: function animationName(box) {
          try {
            var animationName = this.vendorCSS(box, 'animation-name').cssText;
          } catch (error) {
            // Opera, fall back to plain property value
            var animationName = getComputedStyle(box).getPropertyValue('animation-name');
          }
          if (animationName === 'none') {
            return ''; // SVG/Firefox, unable to get animation name?
          } else {
              return animationName;
            }
        }
      }, {
        key: 'cacheAnimationName',
        value: function cacheAnimationName(box) {
          // https://bugzilla.mozilla.org/show_bug.cgi?id=921834
          // box.dataset is not supported for SVG elements in Firefox
          return this.animationNameCache.set(box, this.animationName(box));
        }
      }, {
        key: 'cachedAnimationName',
        value: function cachedAnimationName(box) {
          return this.animationNameCache.get(box);
        }
      }, {
        key: 'scrollHandler',
        value: function scrollHandler() {
          return this.scrolled = true;
        }
      }, {
        key: 'scrollCallback',
        value: function scrollCallback() {
          if (this.scrolled) {
            this.scrolled = false;
            var results = [];
            for (var i = 0; i < this.boxes.length; i++) {
              var box = this.boxes[i];
              if (box) {
                if (this.isVisible(box)) {
                  this.show(box);
                  continue;
                }
                results.push(box);
              }
            }
            this.boxes = results;
            if (!this.boxes.length && !this.config.live) {
              return this.stop();
            }
          }
        }
      }, {
        key: 'offsetTop',
        value: function offsetTop(element) {
          // SVG elements don't have an offsetTop in Firefox.
          // This will use their nearest parent that has an offsetTop.
          // Also, using ('offsetTop' of element) causes an exception in Firefox.
          while (element.offsetTop === undefined) {
            element = element.parentNode;
          }
          var top = element.offsetTop;
          while (element = element.offsetParent) {
            top += element.offsetTop;
          }
          return top;
        }
      }, {
        key: 'isVisible',
        value: function isVisible(box) {
          var offset = box.getAttribute('data-wow-offset') || this.config.offset;
          var viewTop = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset;
          var viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
          var top = this.offsetTop(box);
          var bottom = top + box.clientHeight;

          return top <= viewBottom && bottom >= viewTop;
        }
      }, {
        key: 'util',
        value: function util() {
          return this._util != null ? this._util : this._util = new Util();
        }
      }, {
        key: 'disabled',
        value: function disabled() {
          return !this.config.mobile && this.util().isMobile(navigator.userAgent);
        }
      }]);

      return WOW;
    }();

    function __in__(needle, haystack) {
      return haystack.indexOf(needle) >= 0;
    }

    return WOW;
  }

  var WOW = fact.call(window);
  exports.WOW = WOW;
});
