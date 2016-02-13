var Factory, Hideable, Void, assert, ref;

ref = require("type-utils"), Void = ref.Void, assert = ref.assert;

Hideable = require("hideable");

Factory = require("factory");

module.exports = Factory("Scene", {
  optionTypes: {
    id: String,
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
    list: {
      value: null,
      didSet: function(list) {
        return this.didSetList(list);
      }
    },
    navigator: {
      value: null,
      didSet: function(navigator) {
        return this.didSetNavigator(navigator);
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
    render: {
      lazy: function() {
        return this.getComponent();
      }
    }
  },
  initFactory: function() {
    return GLOBAL.scenes = Object.create(null);
  },
  initFrozenValues: function(options) {
    return {
      id: options.id,
      level: options.level,
      scale: NativeValue(1)
    };
  },
  initValues: function() {
    return {
      list: null,
      navigator: null,
      _previousScene: null
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
    GLOBAL.scenes[this.id] = this;
    return Hideable(this, {
      isHiding: options.isHiding,
      onShow: this.onShow,
      onHide: this.onHide
    });
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
  onShow: function() {},
  onHide: function() {},
  didSetNavigator: function(navigator) {},
  didSetList: function(list) {},
  getComponent: function() {
    throw Error("Subclass must override!");
  }
});

//# sourceMappingURL=../../map/src/Scene.map
