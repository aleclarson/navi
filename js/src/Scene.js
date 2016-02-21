var Event, Factory, Hideable, Void, assert, ref;

ref = require("type-utils"), Void = ref.Void, assert = ref.assert;

Hideable = require("hideable");

Factory = require("factory");

Event = require("event");

module.exports = Factory("Scene", {
  optionTypes: {
    level: Number,
    isHiding: Boolean,
    isHidden: Boolean,
    isPermanent: Boolean,
    ignoreTouches: Boolean,
    ignoreTouchesBelow: Boolean
  },
  optionDefaults: {
    isHiding: false,
    isHidden: true,
    isPermanent: false,
    ignoreTouches: false,
    ignoreTouchesBelow: false
  },
  customValues: {
    name: {
      get: function() {
        return this._getName();
      }
    },
    sceneView: {
      value: null,
      reactive: true,
      didSet: function(sceneView) {
        GLOBAL.scenes[this.name] = this;
        return this._didSetSceneView.call(this, sceneView);
      }
    },
    list: {
      value: null,
      reactive: true,
      didSet: function(list) {
        return this._didSetList.call(this, list);
      }
    },
    navigator: {
      value: null,
      reactive: true,
      didSet: function(navigator) {
        return this._didSetNavigator.call(this, navigator);
      }
    },
    isActive: {
      get: function() {
        var ref1;
        return this === ((ref1 = this.list) != null ? ref1.activeScene : void 0);
      }
    },
    isTouchable: {
      get: function() {
        if (this.ignoreTouches) {
          return false;
        }
        if (this.isActive || this.isPermanent) {
          return true;
        }
        if (this.list == null) {
          return true;
        }
        if (this.isAbove(this.list.activeScene)) {
          return true;
        }
        return this.list.activeScene.isTouchableBelow;
      }
    },
    isTouchableBelow: {
      get: function() {
        return !this.ignoreTouchesBelow;
      }
    },
    _component: {
      lazy: function() {
        return this._getComponent();
      }
    }
  },
  initFactory: function() {
    return GLOBAL.scenes = Object.create(null);
  },
  initFrozenValues: function(options) {
    return {
      level: options.level,
      scale: NativeValue(1)
    };
  },
  initValues: function() {
    return {
      _events: null
    };
  },
  initReactiveValues: function(options) {
    return {
      isHidden: options.isHidden,
      isPermanent: options.isPermanent,
      ignoreTouches: options.ignoreTouches,
      ignoreTouchesBelow: options.ignoreTouchesBelow
    };
  },
  init: function(options) {
    return Hideable(this, {
      isHiding: options.isHiding,
      show: (function(_this) {
        return function() {
          return _this._show.apply(_this, arguments);
        };
      })(this),
      hide: (function(_this) {
        return function() {
          return _this._hide.apply(_this, arguments);
        };
      })(this),
      onShowStart: (function(_this) {
        return function() {
          return _this._onShowStart.apply(_this, arguments);
        };
      })(this),
      onShowEnd: (function(_this) {
        return function() {
          return _this._onShowEnd.apply(_this, arguments);
        };
      })(this),
      onHideStart: (function(_this) {
        return function() {
          return _this._onHideStart.apply(_this, arguments);
        };
      })(this),
      onHideEnd: (function(_this) {
        return function() {
          return _this._onHideEnd.apply(_this, arguments);
        };
      })(this)
    });
  },
  boundMethods: ["render"],
  render: function(props) {
    var error, sceneView;
    if (props == null) {
      props = {};
    }
    assertType(props, Object);
    props.scene = this;
    try {
      sceneView = this._component(props);
    } catch (_error) {
      error = _error;
      reportFailure(error, {
        props: props
      });
    }
    return sceneView;
  },
  isAbove: function(scene) {
    var sceneIndex;
    assert(this.list != null, {
      scene: this,
      reason: "Must call 'scene.push' before 'scene.isAbove'!"
    });
    sceneIndex = this.list.indexOf(scene);
    return (sceneIndex < 0) || (sceneIndex < this.list.indexOf(this));
  },
  pop: function() {
    var ref1, ref2;
    if ((ref1 = this.list) != null) {
      ref1.remove(this);
    }
    if (this.list == null) {
      return (ref2 = this.navigator) != null ? ref2.remove(this) : void 0;
    }
  },
  _show: function() {
    var error;
    error = Error("Must override 'Scene._show'!");
    return reportFailure(error, {
      scene: this
    });
  },
  _hide: function() {
    var error;
    error = Error("Must override 'Scene._hide'!");
    return reportFailure(error, {
      scene: this
    });
  },
  _getName: function() {
    var error;
    error = Error("Must override 'Scene._getName'!");
    return reportFailure(error, {
      scene: this
    });
  },
  _onShowStart: emptyFunction,
  _onShowEnd: emptyFunction,
  _onHideStart: emptyFunction,
  _onHideEnd: emptyFunction,
  _onActive: emptyFunction,
  _onInactive: emptyFunction,
  _didSetSceneView: emptyFunction,
  _didSetList: emptyFunction,
  _didSetNavigator: emptyFunction,
  _getComponent: function() {
    var error;
    error = Error("Must override 'Scene._getComponent'!");
    return reportFailure(error, {
      scene: this
    });
  }
});

//# sourceMappingURL=../../map/src/Scene.map
