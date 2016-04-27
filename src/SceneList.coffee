
{ assert, assertType } = require "type-utils"
{ throwFailure } = require "failure"

Immutable = require "immutable"
Factory = require "factory"

Scene = require "./Scene"

module.exports = Factory "SceneList",

  optionTypes:
    getName: Function.Maybe

  customValues:

    name: get: ->
      @_getName?()

    scenes: get: ->
      @_scenes

    sceneIds: get: ->
      @_scenes.toJS()
        .map (scene) -> scene.__id

    earlierScenes: get: ->
      @_earlierScenes

    earlierSceneIds: get: ->
      @_earlierScenes.toJS()
        .map (scene) -> scene.__id

  initFrozenValues: (options) ->

    fakeError = Error()

    _getName: options.getName

    _getStack: ->
      parse = require "parseErrorStack"
      parse fakeError

  initReactiveValues: ->

    activeScene: null

    _scenes: Immutable.List()

    _earlierScenes: Immutable.List()

  push: (nextScene, makeActive) ->

    assertType nextScene, Scene.Kind
    assertType makeActive, Boolean

    assert (makeActive or nextScene.isPermanent),
      reason: "Only permanent scenes can be rendered without being made active."
      scene: nextScene
      list: this

    if nextScene is @activeScene
      return

    unless @contains nextScene

      if nextScene.list?
        error = Error "Scene('#{nextScene.name}') already belongs to SceneList('#{nextScene.list.name}')!"
        throwFailure error, { scene: nextScene, list: this }

      nextScene.list = this
      @_scenes = @_scenes.push nextScene

    if makeActive

      earlierScene = @activeScene
      if earlierScene?
        earlierScene._onInactive yes
        @_earlierScenes = @_earlierScenes.push earlierScene

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
    assertType scene, Scene.Kind
    return -1 unless @contains scene
    @_scenes.indexOf scene

  contains: (scene) ->
    assertType scene, Scene.Kind
    this is scene.list
