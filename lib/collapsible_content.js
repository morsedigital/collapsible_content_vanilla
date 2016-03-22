"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require("lodash/core");
_.includes = require("lodash/includes");

var ViewportDetectionClass = require("viewport-detection-es6");
var viewport = new ViewportDetectionClass();

var CollapsibleContentClass = function () {
  function CollapsibleContentClass() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var init = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, CollapsibleContentClass);

    this.config = _.defaults(config, { bodyContainerClass: "collapsible-content-body" }, { itemContainerClass: "collapsible-content-item" }, { toggleContainerClass: "collapsible-content-toggle" });

    if (init) {
      this._initViewport();
      this._init();
    }
  }

  _createClass(CollapsibleContentClass, [{
    key: "render",
    value: function render() {
      this._getItems();
      this._getToggles();
      this._getBodies();
      this._setBreakpointDefaults();
    }
  }, {
    key: "_addToggleClickListeners",
    value: function _addToggleClickListeners() {
      _.forEach(this.toggles, function (toggle) {
        toggle.addEventListener("click", this._toggleClick.bind(this, toggle), false);
      }.bind(this));
    }
  }, {
    key: "_getBodies",
    value: function _getBodies() {
      _.forEach(this.items, function (item) {
        this.bodies.push(item.querySelector("." + this.config.bodyContainerClass));
      }.bind(this));

      this._setBodyClasses();
    }
  }, {
    key: "_getItems",
    value: function _getItems() {
      var dataParent = void 0;
      var items = this.config.element.querySelectorAll("." + this.config.itemContainerClass);

      _.forEach(items, function (item) {
        dataParent = item.getAttribute("data-parent");

        if (dataParent === this.dataName) {
          this.items.push(item);
        }
      }.bind(this));

      this._setVisibleItems();
    }
  }, {
    key: "_getToggles",
    value: function _getToggles() {
      _.forEach(this.items, function (item) {
        this.toggles.push(item.querySelector("." + this.config.toggleContainerClass));
      }.bind(this));

      this._setToggleAriaControls();
      this._addToggleClickListeners();
    }
  }, {
    key: "_init",
    value: function _init() {
      this.bodies = [];
      this.items = [];
      this.toggles = [];
      this.dataName = this.config.element.getAttribute("data-name");
      this.render();
    }
  }, {
    key: "_initViewport",
    value: function _initViewport() {
      this.device = viewport.getDevice();
      this.size = viewport.windowSize();
      viewport.trackSize(this._trackSize.bind(this));
    }
  }, {
    key: "_setBodyAriaHidden",
    value: function _setBodyAriaHidden(toggle) {
      var body = this._skipTextNodes(toggle.nextSibling, "nextSibling");
      var attribute = body.getAttribute("aria-hidden");

      body.setAttribute("aria-hidden", attribute === "true" ? "false" : "true");
    }
  }, {
    key: "_setBodyClass",
    value: function _setBodyClass(toggle) {
      var body = this._skipTextNodes(toggle.nextSibling, "nextSibling");
      var className = body.className;

      if (_.includes(className, "open")) {
        body.className = className.replace(/(?:^|\s)open(?!\S)/g, "");
      } else {
        body.className = className += " open";
      }
    }
  }, {
    key: "_setBodyClasses",
    value: function _setBodyClasses() {
      _.forEach(this.bodies, function (body, i) {
        body.className += !_.isNull(this.dataName) ? " " + this.dataName + "-collapsible-" + i : " collapsible-" + i;
      }.bind(this));
    }
  }, {
    key: "_setBreakpointDefaults",
    value: function _setBreakpointDefaults() {
      switch (this.device) {
        case "mobile":
          this._setDefaults(this.visibleMobile);
          break;
        case "tablet":
          this._setDefaults(this.visibleTablet);
          break;
        case "desktop":
          this._setDefaults(this.visibleDesktop);
          break;
      }
    }
  }, {
    key: "_setDefaultBodyAriaHiddens",
    value: function _setDefaultBodyAriaHiddens(visible) {
      _.forEach(this.bodies, function (body) {
        body.setAttribute("aria-hidden", visible === "true" ? "false" : "true");
      }.bind(this));
    }
  }, {
    key: "_setDefaultBodyClasses",
    value: function _setDefaultBodyClasses(visible) {
      _.forEach(this.bodies, function (body) {
        var className = body.className;

        if (visible === "true") {
          if (!_.includes(className, "open")) {
            body.className = className += " open";
          }
        } else {
          body.className = className.replace(/(?:^|\s)open(?!\S)/g, "");
        }
      }.bind(this));
    }
  }, {
    key: "_setDefaults",
    value: function _setDefaults(visible) {
      this._setDefaultToggleAriaExpandeds(visible);
      this._setDefaultToggleClasses(visible);
      this._setDefaultBodyAriaHiddens(visible);
      this._setDefaultBodyClasses(visible);
    }
  }, {
    key: "_setDefaultToggleAriaExpandeds",
    value: function _setDefaultToggleAriaExpandeds(visible) {
      _.forEach(this.toggles, function (toggle) {
        toggle.setAttribute("aria-expanded", visible === "true" ? "true" : "false");
      }.bind(this));
    }
  }, {
    key: "_setDefaultToggleClasses",
    value: function _setDefaultToggleClasses(visible) {
      _.forEach(this.toggles, function (toggle) {
        var className = toggle.className;

        if (visible === "true") {
          if (!_.includes(className, "open")) {
            toggle.className = className += " open";
          }
        } else {
          toggle.className = className.replace(/(?:^|\s)open(?!\S)/g, "");
        }
      }.bind(this));
    }
  }, {
    key: "_setToggleAriaControls",
    value: function _setToggleAriaControls() {
      _.forEach(this.toggles, function (toggle, i) {
        toggle.setAttribute("aria-controls", !_.isNull(this.dataName) ? this.dataName + "-collapsible-" + i : "collapsible-" + i);
      }.bind(this));
    }
  }, {
    key: "_setToggleAriaExpanded",
    value: function _setToggleAriaExpanded(toggle) {
      var attribute = toggle.getAttribute("aria-expanded");

      toggle.setAttribute("aria-expanded", attribute === "true" ? "false" : "true");
    }
  }, {
    key: "_setToggleClass",
    value: function _setToggleClass(toggle) {
      var className = toggle.className;

      if (_.includes(className, "open")) {
        toggle.className = className.replace(/(?:^|\s)open(?!\S)/g, "");
      } else {
        toggle.className = className += " open";
      }
    }
  }, {
    key: "_setVisibleItems",
    value: function _setVisibleItems() {
      var visibleMobile = this.config.element.getAttribute("data-visible-mobile");
      var visibleTablet = this.config.element.getAttribute("data-visible-tablet");
      var visibleDesktop = this.config.element.getAttribute("data-visible-desktop");

      this.visibleMobile = !_.isNull(visibleMobile) ? visibleMobile : "false";
      this.visibleTablet = !_.isNull(visibleTablet) ? visibleTablet : "false";
      this.visibleDesktop = !_.isNull(visibleDesktop) ? visibleDesktop : "false";
    }
  }, {
    key: "_skipTextNodes",
    value: function _skipTextNodes(el, method) {
      var element = el[method];

      while (element !== null && element.nodeType !== 1) {
        element = element.nextSibling;
      }

      return element;
    }
  }, {
    key: "_toggleClick",
    value: function _toggleClick(toggle, e) {
      e.preventDefault();

      this._setToggleAriaExpanded(toggle);
      this._setToggleClass(toggle);
      this._setBodyAriaHidden(toggle);
      this._setBodyClass(toggle);
    }
  }, {
    key: "_trackSize",
    value: function _trackSize(device, size) {
      if (this.device !== device) {
        this.device = device;

        this._setBreakpointDefaults();
      }

      this.size = size;
    }
  }]);

  return CollapsibleContentClass;
}();

module.exports = CollapsibleContentClass;
//# sourceMappingURL=collapsible_content.js.map