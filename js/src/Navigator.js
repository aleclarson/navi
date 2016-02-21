var Factory, Immutable, Scene, SceneList, assertKind, inArray, isType, ref;

ref = require("type-utils"), isType = ref.isType, assertKind = ref.assertKind;

Immutable = require("immutable");

inArray = require("in-array");

Factory = require("factory");

SceneList = require("./SceneList");

Scene = require("./Scene");

module.exports = Factory("Navigator", {
  customValues: {
    scenes: {
      get: function() {
        return this._scenes.toJS().map(function(scene) {
          return scene.name;
        });
      }
    },
    visibleScenes: {
      get: function() {
        return this._scenes.toJS().filter(function(scene) {
          return !scene.isHidden;
        }).map(function(scene) {
          return scene.name;
        });
      }
    }
  },
  initValues: function() {
    return {
      _sceneNames: Object.create(null)
    };
  },
  initReactiveValues: function() {
    return {
      _scenes: Immutable.List()
    };
  },
  contains: function(scene) {
    return this._sceneNames[scene.name] != null;
  },
  insert: function(scene) {
    var i, index, insertedScene, len, ref1, scenes;
    if (isType(scene, Array)) {
      ref1 = (scenes = scene);
      for (i = 0, len = ref1.length; i < len; i++) {
        scene = ref1[i];
        this.insert(scene);
      }
      return;
    }
    assertKind(scene, Scene);
    if (this.contains(scene)) {
      return false;
    }
    index = 0;
    while (true) {
      insertedScene = this._scenes.get(index);
      if (insertedScene == null) {
        break;
      }
      if (scene.level < insertedScene.level) {
        break;
      }
      index += 1;
    }
    this._scenes = this._scenes.splice(index, 0, scene);
    this._sceneNames[scene.name] = true;
    scene.navigator = this;
    return true;
  },
  remove: function(scene) {
    var index;
    assertKind(scene, Scene);
    if (!this.contains(scene)) {
      return false;
    }
    index = this._scenes.indexOf(scene);
    this._scenes = this._scenes.splice(index, 1);
    delete this._sceneNames[scene.name];
    scene.navigator = null;
    return true;
  },
  searchBelow: function(target) {
    var scenes, validSceneLists;
    assertKind(target, Scene);
    validSceneLists = [null];
    if (target.list != null) {
      validSceneLists.push(target.list);
    }
    scenes = [];
    this._scenes.forEach(function(scene) {
      if (scene === target) {
        return false;
      }
      if (inArray(validSceneLists, scene.list)) {
        scenes.push(scene);
      }
      return true;
    });
    return scenes;
  }
});

//# sourceMappingURL=../../map/src/Navigator.map
