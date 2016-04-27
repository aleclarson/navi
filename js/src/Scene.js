var Event, Factory, Hideable, assert, emptyFunction, throwFailure;

throwFailure = require("failure").throwFailure;

assert = require("type-utils").assert;

emptyFunction = require("emptyFunction");

Hideable = require("hideable");

Factory = require("factory");

Event = require("event");

GLOBAL.scenes = Object.create(null);

module.exports = Factory("Scene", {
  optionTypes: {
    level: Number,
    isHidden: Boolean,
    isPermanent: Boolean,
    ignoreTouches: Boolean,
    ignoreTouchesBelow: Boolean
  },
  optionDefaults: {
    isHidden: true,
    isPermanent: false,
    ignoreTouches: false,
    ignoreTouchesBelow: false
  },
  customValues: {
    level: {
      get: function() {
        return this._level;
      },
      set: function(newLevel, oldLevel) {
        var navigator;
        if (newLevel === oldLevel) {
          return;
        }
        this._level = newLevel;
        navigator = this.navigator;
        if (!navigator) {
          return;
        }
        navigator.remove(this);
        return navigator.insert(this);
      }
    },
    sceneView: {
      value: null,
      reactive: true,
      didSet: function(sceneView) {
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
        var ref;
        return this === ((ref = this.list) != null ? ref.activeScene : void 0);
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
  initFrozenValues: function(options) {
    return {
      scale: NativeValue(1)
    };
  },
  initValues: function() {
    return {
      _cachedElement: null
    };
  },
  initReactiveValues: function(options) {
    return {
      _level: options.level,
      isHidden: options.isHidden,
      isPermanent: options.isPermanent,
      ignoreTouches: options.ignoreTouches,
      ignoreTouchesBelow: options.ignoreTouchesBelow
    };
  },
  init: function(options) {
    return global.scenes[this.__id] = this;
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
      throwFailure(error, {
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
    var ref, ref1;
    if ((ref = this.list) != null) {
      ref.remove(this);
    }
    if (this.list == null) {
      return (ref1 = this.navigator) != null ? ref1.remove(this) : void 0;
    }
  },
  _onActive: emptyFunction,
  _onInactive: emptyFunction,
  _didSetSceneView: emptyFunction,
  _didSetList: emptyFunction,
  _didSetNavigator: emptyFunction,
  _getComponent: function() {
    var error;
    error = Error("Must override 'Scene._getComponent'!");
    return throwFailure(error, {
      scene: this
    });
  }
});

//# sourceMappingURL=../../map/src/Scene.map
