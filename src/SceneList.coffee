
{ assert
  assertKind
  assertType } = require "type-utils"

Immutable = require "immutable"
Factory = require "factory"

Scene = require "./Scene"

module.exports = Factory "SceneList",

  customValues:

    scenes: get: ->
      @_scenes

    earlierScenes: get: ->
      @_earlierScenes

  initReactiveValues: ->

    activeScene: null

    _earlierScenes: Immutable.List()

    _scenes: Immutable.List()

  push: (nextScene, makeActive) ->

    assertKind nextScene, Scene
    assertType makeActive, Boolean

    assert (makeActive or nextScene.isPermanent),
      reason: "Only permanent scenes can be rendered without being made active."
      scene: nextScene
      list: this

    if nextScene is @activeScene
      return

    unless @contains nextScene

      assert (not nextScene.list?),
        reason: "Scene already belongs to another SceneList!"
        scene: nextScene
        list: this

      nextScene.list = this
      @_scenes = @_scenes.push nextScene

    if makeActive

      previousScene = @activeScene
      if previousScene?
        previousScene._onInactive yes
        @_earlierScenes = @_earlierScenes.push previousScene

      @activeScene = nextScene
      nextScene._onActive no

    return

  pop: ->

    assert @activeScene?,
      reason: "No active scene found."
      list: this

    @activeScene._onInactive no
    unless @activeScene.isPermanent
      @activeScene.list = null
      activeIndex = @_scenes.indexOf @activeScene
      @_scenes = @_scenes.splice activeIndex, 1

    nextScene = @_earlierScenes.last() or null
    @_earlierScenes = @_earlierScenes.pop()

    @activeScene = nextScene
    nextScene?._onActive yes

    return

  remove: (scene) ->
    return unless @contains scene
    return @pop() if scene.isActive
    index = @indexOf scene
    if 0 <= (index = @indexOf scene)
      scene.list = null
      @_scenes = @_scenes.splice index, 1
      if 0 <= (index = @_earlierScenes.indexOf scene)
        @_earlierScenes = @_earlierScenes.splice index, 1
    return

  indexOf: (scene) ->
    assertKind scene, Scene
    return -1 unless @contains scene
    @_scenes.indexOf scene

  contains: (scene) ->
    assertKind scene, Scene
    this is scene.list
