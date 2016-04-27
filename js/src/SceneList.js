var Factory, Immutable, Scene, assert, assertType, ref, throwFailure;

ref = require("type-utils"), assert = ref.assert, assertType = ref.assertType;

throwFailure = require("failure").throwFailure;

Immutable = require("immutable");

Factory = require("factory");

Scene = require("./Scene");

module.exports = Factory("SceneList", {
  optionTypes: {
    getName: Function.Maybe
  },
  customValues: {
    name: {
      get: function() {
        return typeof this._getName === "function" ? this._getName() : void 0;
      }
    },
    scenes: {
      get: function() {
        return this._scenes;
      }
    },
    sceneIds: {
      get: function() {
        return this._scenes.toJS().map(function(scene) {
          return scene.__id;
        });
      }
    },
    earlierScenes: {
      get: function() {
        return this._earlierScenes;
      }
    },
    earlierSceneIds: {
      get: function() {
        return this._earlierScenes.toJS().map(function(scene) {
          return scene.__id;
        });
      }
    }
  },
  initFrozenValues: function(options) {
    var fakeError;
    fakeError = Error();
    return {
      _getName: options.getName,
      _getStack: function() {
        var parse;
        parse = require("parseErrorStack");
        return parse(fakeError);
      }
    };
  },
  initReactiveValues: function() {
    return {
      activeScene: null,
      _scenes: Immutable.List(),
      _earlierScenes: Immutable.List()
    };
  },
  push: function(nextScene, makeActive) {
    var earlierScene, error;
    assertType(nextScene, Scene.Kind);
    assertType(makeActive, Boolean);
    assert(makeActive || nextScene.isPermanent, {
      reason: "Only permanent scenes can be rendered without being made active.",
      scene: nextScene,
      list: this
    });
    if (nextScene === this.activeScene) {
      return;
    }
    if (!this.contains(nextScene)) {
      if (nextScene.list != null) {
        error = Error("Scene('" + nextScene.name + "') already belongs to SceneList('" + nextScene.list.name + "')!");
        throwFailure(error, {
          scene: nextScene,
          list: this
        });
      }
      nextScene.list = this;
      this._scenes = this._scenes.push(nextScene);
    }
    if (makeActive) {
      earlierScene = this.activeScene;
      if (earlierScene != null) {
        earlierScene._onInactive(true);
        this._earlierScenes = this._earlierScenes.push(earlierScene);
      }
      this.activeScene = nextScene;
      nextScene._onActive(false);
    }
  },
  pop: function() {
    var activeIndex, nextScene;
    assert(this.activeScene != null, {
      reason: "No active scene found.",
      list: this
    });
    this.activeScene._onInactive(false);
    if (!this.activeScene.isPermanent) {
      this.activeScene.list = null;
      activeIndex = this._scenes.indexOf(this.activeScene);
      this._scenes = this._scenes.splice(activeIndex, 1);
    }
    nextScene = this._earlierScenes.last() || null;
    this._earlierScenes = this._earlierScenes.pop();
    this.activeScene = nextScene;
    if (nextScene != null) {
      nextScene._onActive(true);
    }
  },
  remove: function(scene) {
    var index;
    if (!this.contains(scene)) {
      return;
    }
    if (scene.isActive) {
      return this.pop();
    }
    index = this.indexOf(scene);
    if (0 <= (index = this.indexOf(scene))) {
      scene.list = null;
      this._scenes = this._scenes.splice(index, 1);
      if (0 <= (index = this._earlierScenes.indexOf(scene))) {
        this._earlierScenes = this._earlierScenes.splice(index, 1);
      }
    }
  },
  indexOf: function(scene) {
    assertType(scene, Scene.Kind);
    if (!this.contains(scene)) {
      return -1;
    }
    return this._scenes.indexOf(scene);
  },
  contains: function(scene) {
    assertType(scene, Scene.Kind);
    return this === scene.list;
  }
});

//# sourceMappingURL=../../map/src/SceneList.map
