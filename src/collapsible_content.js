const _    = require("lodash/core");
_.includes = require("lodash/includes");

const ViewportDetectionClass = require("viewport-detection-es6");
const viewport = new ViewportDetectionClass();

class CollapsibleContentClass {
  constructor(config = {}, init = true) {
    this.config = _.defaults(config,
      { bodyContainerClass: "collapsible-content-body" },
      { itemContainerClass: "collapsible-content-item" },
      { toggleContainerClass: "collapsible-content-toggle" }
    );

    if(init) {
      this._initViewport();
      this._init();
    }
  }

  render() {
    this._getItems();
    this._getToggles();
    this._getBodies();
    this._setBreakpointDefaults();
  }

  _addToggleClickListeners() {
    _.forEach(this.toggles, function(toggle) {
      toggle.addEventListener("click", this._toggleClick.bind(this, toggle), false);
    }.bind(this));
  }

  _getBodies() {
    _.forEach(this.items, function(item) {
      this.bodies.push(item.querySelector("." + this.config.bodyContainerClass));
    }.bind(this));

    this._setBodyClasses();
  }

  _getItems() {
    let dataParent;
    let items = this.config.element.querySelectorAll("." + this.config.itemContainerClass);

    _.forEach(items, function(item) {
      dataParent = item.getAttribute("data-parent");

      if(dataParent === this.dataName) {
        this.items.push(item);
      }
    }.bind(this));

    this._setVisibleItems();
  }

  _getToggles() {
    _.forEach(this.items, function(item) {
      this.toggles.push(item.querySelector("." + this.config.toggleContainerClass));
    }.bind(this));

    this._setToggleAriaControls();
    this._addToggleClickListeners();
  }

  _init() {
    this.bodies = [];
    this.items = [];
    this.toggles = [];
    this.dataName = this.config.element.getAttribute("data-name");
    this.render();
  }

  _initViewport() {
    this.device = viewport.getDevice();
    this.size = viewport.windowSize();
    viewport.trackSize(this._trackSize.bind(this));
  }

  _setBodyAriaHidden(toggle) {
    let body = this._skipTextNodes(toggle.nextSibling, "nextSibling");
    let attribute = body.getAttribute("aria-hidden");

    body.setAttribute("aria-hidden", (attribute === "true") ? "false" : "true");
  }

  _setBodyClass(toggle) {
    let body = this._skipTextNodes(toggle.nextSibling, "nextSibling");
    let className = body.className;

    if(_.includes(className, "open")) {
      body.className = className.replace(/(?:^|\s)open(?!\S)/g, "");
    } else {
      body.className = className += " open";
    }
  }

  _setBodyClasses() {
    _.forEach(this.bodies, function(body, i) {
      body.className += (!_.isNull(this.dataName)) ? " " + this.dataName + "-collapsible-" + i : " collapsible-" + i;
    }.bind(this));
  }

  _setBreakpointDefaults() {
    switch(this.device) {
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

  _setDefaultBodyAriaHiddens(visible) {
    _.forEach(this.bodies, function(body) {
      body.setAttribute("aria-hidden", (visible === "true") ? "false" : "true");
    }.bind(this));
  }

  _setDefaultBodyClasses(visible) {
    _.forEach(this.bodies, function(body) {
      let className = body.className;

      if(visible === "true") {
        if(!_.includes(className, "open")) {
          body.className = className += " open";
        }
      } else {
        body.className = className.replace(/(?:^|\s)open(?!\S)/g, "");
      }
    }.bind(this));
  }

  _setDefaults(visible) {
    this._setDefaultToggleAriaExpandeds(visible);
    this._setDefaultToggleClasses(visible);
    this._setDefaultBodyAriaHiddens(visible);
    this._setDefaultBodyClasses(visible);
  }

  _setDefaultToggleAriaExpandeds(visible) {
    _.forEach(this.toggles, function(toggle) {
      toggle.setAttribute("aria-expanded", (visible === "true") ? "true" : "false");
    }.bind(this));
  }

  _setDefaultToggleClasses(visible) {
    _.forEach(this.toggles, function(toggle) {
      let className = toggle.className;

      if(visible === "true") {
        if(!_.includes(className, "open")) {
          toggle.className = className += " open";
        }
      } else {
        toggle.className = className.replace(/(?:^|\s)open(?!\S)/g, "");
      }
    }.bind(this));
  }

  _setToggleAriaControls() {
    _.forEach(this.toggles, function(toggle, i) {
      toggle.setAttribute("aria-controls", (!_.isNull(this.dataName)) ? this.dataName + "-collapsible-" + i : "collapsible-" + i);
    }.bind(this));
  }

  _setToggleAriaExpanded(toggle) {
    let attribute = toggle.getAttribute("aria-expanded");

    toggle.setAttribute("aria-expanded", (attribute === "true") ? "false" : "true");
  }

  _setToggleClass(toggle) {
    let className = toggle.className;

    if(_.includes(className, "open")) {
      toggle.className = className.replace(/(?:^|\s)open(?!\S)/g, "");
    } else {
      toggle.className = className += " open";
    }
  }

  _setVisibleItems() {
    let visibleMobile = this.config.element.getAttribute("data-visible-mobile");
    let visibleTablet = this.config.element.getAttribute("data-visible-tablet");
    let visibleDesktop = this.config.element.getAttribute("data-visible-desktop");

    this.visibleMobile = (!_.isNull(visibleMobile)) ? visibleMobile : "false";
    this.visibleTablet = (!_.isNull(visibleTablet)) ? visibleTablet : "false";
    this.visibleDesktop = (!_.isNull(visibleDesktop)) ? visibleDesktop : "false";
  }

  _skipTextNodes(el, method) {
    let element = el[method];

    while(element !== null && element.nodeType !== 1) {
      element = element.nextSibling;
    }

    return element;
  }

  _toggleClick(toggle, e) {
    e.preventDefault();

    this._setToggleAriaExpanded(toggle);
    this._setToggleClass(toggle);
    this._setBodyAriaHidden(toggle);
    this._setBodyClass(toggle);
  }

  _trackSize(device, size) {
    if(this.device !== device) {
      this.device = device;

      this._setBreakpointDefaults();
    }

    this.size = size;
  }
}

module.exports = CollapsibleContentClass;