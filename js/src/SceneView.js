var Children, Component, Reaction, Scene, Style, emptyFunction, flattenStyle, ref;

ref = require("component"), Style = ref.Style, Children = ref.Children, Component = ref.Component;

emptyFunction = require("emptyFunction");

flattenStyle = require("flattenStyle");

Reaction = require("reaction");

Scene = require("./Scene");

module.exports = Component("SceneView", {
  propTypes: {
    scene: Scene.Kind,
    style: Style,
    children: Children,
    bkgStyle: Style
  },
  customValues: {
    scene: {
      get: function() {
        return this.props.scene;
      }
    }
  },
  initValues: function() {
    return {
      renderCount: 0
    };
  },
  initNativeValues: function() {
    return {
      opacity: (function(_this) {
        return function() {
          if (_this.scene.isHidden) {
            return 0;
          } else {
            return 1;
          }
        };
      })(this),
      containerEvents: (function(_this) {
        return function() {
          if (_this.scene.isHiding || _this.scene.isHidden) {
            return "none";
          } else {
            return "box-none";
          }
        };
      })(this),
      contentEvents: Reaction((function(_this) {
        return function() {
          if (_this.scene.isTouchable) {
            return "box-none";
          } else {
            return "none";
          }
        };
      })(this)),
      bkgEvents: Reaction((function(_this) {
        return function() {
          if (_this.scene.isTouchableBelow) {
            return "none";
          } else {
            return "auto";
          }
        };
      })(this))
    };
  },
  componentDidMount: function() {
    return this.scene.sceneView = this;
  },
  componentWillUnmount: function() {
    this.scene._element = null;
    return this.scene.sceneView = null;
  },
  render: function() {
    var bkg, content, contentStyle;
    if (this.renderCount > 0) {
      log.it(this.scene.__id + ".render() " + (this.renderCount + 1));
    }
    this.renderCount += 1;
    bkg = View({
      style: [_.Style.Clear, _.Style.Cover, this.props.bkgStyle],
      pointerEvents: this.bkgEvents,
      onStartShouldSetResponder: emptyFunction.thatReturnsTrue
    });
    contentStyle = flattenStyle([_.Style.Cover, _.Style.Clear, this.props.style]);
    if (contentStyle.transform == null) {
      contentStyle.transform = [];
    }
    contentStyle.transform.push({
      scale: this.scene.scale
    });
    content = View({
      style: contentStyle,
      children: this.props.children,
      pointerEvents: this.contentEvents
    });
    return View({
      style: [
        _.Style.Clear, _.Style.Cover, {
          opacity: this.opacity
        }
      ],
      children: [bkg, content],
      pointerEvents: this.containerEvents
    });
  }
});

//# sourceMappingURL=../../map/src/SceneView.map
