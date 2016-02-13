
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

  initReactiveValues: ->

    activeScene: null

    _scenes: Immutable.List()

  push: (nextScene, makeActive) ->

    assertKind nextScene, Scene
    assertType makeActive, Boolean

    assert (makeActive or nextScene.isPermanent),
      reason: "Only permanent scenes can be rendered without being made active."
      scene: nextScene
      list: this

    if nextScene is @activeScene
      nextScene.isHiding = no
      return

    unless @contains nextScene

      assert (not nextScene.list?),
        reason: "Scene already belongs to another SceneList!"
        scene: nextScene
        list: this

      nextScene.list = this
      @_scenes = @_scenes.push nextScene

    if makeActive
      nextScene._previousScene = @activeScene
      nextScene.isHiding = no
      @activeScene = nextScene

    return

  pop: ->

    assert @activeScene?,
      reason: "No active scene found."
      list: this

    nextScene = @activeScene._previousScene

    @activeScene._previousScene = null

    unless @activeScene.isPermanent
      @activeScene.list = null
      activeIndex = @_scenes.indexOf @activeScene
      @_scenes = @_scenes.splice activeIndex, 1

    if nextScene?
      @activeScene = nextScene

    else
      @activeScene = null

    return

  remove: (scene) ->
    return unless @contains scene
    return @pop() if scene.isActive
    index = @indexOf scene
    return if index < 0
    @_scenes = @_scenes.splice index, 1
    scene.list = null
    return

  indexOf: (scene) ->
    assertKind scene, Scene
    return -1 unless @contains scene
    @_scenes.indexOf scene

  contains: (scene) ->
    assertKind scene, Scene
    this is scene.list
