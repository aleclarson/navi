var Factory, Immutable, Scene, assert, assertKind, assertType, ref;

ref = require("type-utils"), assert = ref.assert, assertKind = ref.assertKind, assertType = ref.assertType;

Immutable = require("immutable");

Factory = require("factory");

Scene = require("./Scene");

module.exports = Factory("SceneList", {
  customValues: {
    scenes: {
      get: function() {
        return this._scenes;
      }
    },
    earlierScenes: {
      get: function() {
        return this._earlierScenes;
      }
    }
  },
  initReactiveValues: function() {
    return {
      activeScene: null,
      _earlierScenes: Immutable.List(),
      _scenes: Immutable.List()
    };
  },
  push: function(nextScene, makeActive) {
    var previousScene;
    assertKind(nextScene, Scene);
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
      assert(nextScene.list == null, {
        reason: "Scene already belongs to another SceneList!",
        scene: nextScene,
        list: this
      });
      nextScene.list = this;
      this._scenes = this._scenes.push(nextScene);
    }
    if (makeActive) {
      previousScene = this.activeScene;
      if (previousScene != null) {
        previousScene._onInactive(true);
        this._earlierScenes = this._earlierScenes.push(previousScene);
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
    assertKind(scene, Scene);
    if (!this.contains(scene)) {
      return -1;
    }
    return this._scenes.indexOf(scene);
  },
  contains: function(scene) {
    assertKind(scene, Scene);
    return this === scene.list;
  }
});

//# sourceMappingURL=../../map/src/SceneList.map
