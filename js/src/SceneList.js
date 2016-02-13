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
    }
  },
  initReactiveValues: function() {
    return {
      activeScene: null,
      _scenes: Immutable.List()
    };
  },
  push: function(nextScene, makeActive) {
    assertKind(nextScene, Scene);
    assertType(makeActive, Boolean);
    assert(makeActive || nextScene.isPermanent, {
      reason: "Only permanent scenes can be rendered without being made active.",
      scene: nextScene,
      list: this
    });
    if (nextScene === this.activeScene) {
      nextScene.isHiding = false;
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
      nextScene._previousScene = this.activeScene;
      nextScene.isHiding = false;
      this.activeScene = nextScene;
    }
  },
  pop: function() {
    var activeIndex, nextScene;
    assert(this.activeScene != null, {
      reason: "No active scene found.",
      list: this
    });
    nextScene = this.activeScene._previousScene;
    this.activeScene._previousScene = null;
    if (!this.activeScene.isPermanent) {
      this.activeScene.list = null;
      activeIndex = this._scenes.indexOf(this.activeScene);
      this._scenes = this._scenes.splice(activeIndex, 1);
    }
    if (nextScene != null) {
      this.activeScene = nextScene;
    } else {
      this.activeScene = null;
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
    if (index < 0) {
      return;
    }
    this._scenes = this._scenes.splice(index, 1);
    scene.list = null;
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
