var Children, Component, Scene, Style, emptyFunction, ref;

ref = require("component"), Style = ref.Style, Children = ref.Children, Component = ref.Component;

emptyFunction = require("emptyFunction");

Scene = require("./Scene");

module.exports = Component("SceneView", {
  propTypes: {
    scene: Scene.Kind,
    style: Style,
    children: Children
  },
  customValues: {
    scene: {
      get: function() {
        return this.props.scene;
      }
    }
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
      contentEvents: (function(_this) {
        return function() {
          if (_this.scene.isTouchable) {
            return "box-none";
          } else {
            return "none";
          }
        };
      })(this),
      bkgEvents: (function(_this) {
        return function() {
          if (_this.scene.isTouchableBelow) {
            return "none";
          } else {
            return "auto";
          }
        };
      })(this)
    };
  },
  render: function() {
    var bkg, content;
    if (this.props.DEBUG) {
      log.it("Scene(" + this.scene.id + ").render()");
    }
    bkg = View({
      pointerEvents: this.bkgEvents,
      onStartShouldSetResponder: emptyFunction.thatReturnsTrue,
      onResponderGrant: (function(_this) {
        return function() {
          return log.it("Scene('" + _this.scene.id + "').onBkgTouch()");
        };
      })(this),
      style: [_.Style.Clear, _.Style.Cover]
    });
    content = View({
      pointerEvents: this.contentEvents,
      onStartShouldSetResponderCapture: (function(_this) {
        return function() {
          log.it("Scene('" + _this.scene.id + "').onTouch()");
          return false;
        };
      })(this),
      style: [
        _.Style.Clear, _.Style.Cover, this.props.style, {
          transform: [
            {
              scale: this.scene.scale
            }
          ]
        }
      ],
      children: this.props.children
    });
    return View({
      pointerEvents: this.containerEvents,
      style: [
        _.Style.Clear, _.Style.Cover, {
          opacity: this.opacity
        }
      ],
      children: [bkg, content]
    });
  }
});

//# sourceMappingURL=../../map/src/SceneView.map
