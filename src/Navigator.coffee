
{ isType, assertKind } = require "type-utils"

Immutable = require "immutable"
inArray = require "in-array"
Factory = require "factory"

SceneList = require "./SceneList"
Scene = require "./Scene"

module.exports = Factory "Navigator",

  customValues:

    sceneIds: get: ->
      @_scenes.toJS()
        .map (scene) -> scene.__id

    visibleSceneIds: get: ->
      @_scenes.toJS()
        .filter (scene) -> not scene.isHidden
        .map (scene) -> scene.__id

  initValues: ->
    _sceneIds: Object.create null

  initReactiveValues: ->
    _scenes: Immutable.List()

  contains: (scene) ->
    @_sceneIds[scene.__id]?

  insert: (scene) ->

    if isType scene, Array
      @insert scene for scene in (scenes = scene)
      return

    assertKind scene, Scene

    if @contains scene
      return no

    index = 0

    loop
      insertedScene = @_scenes.get index
      break unless insertedScene?
      break if scene.level < insertedScene.level
      index += 1

    @_scenes = @_scenes.splice index, 0, scene

    @_sceneIds[scene.__id] = yes

    scene.navigator = this

    return yes

  remove: (scene) ->

    assertKind scene, Scene

    unless @contains scene
      return no

    index = @_scenes.indexOf scene

    @_scenes = @_scenes.splice index, 1

    delete @_sceneIds[scene.__id]

    scene.navigator = null

    return yes

  searchBelow: (target) ->

    assertKind target, Scene

    validSceneLists = [ null ]

    validSceneLists.push target.list if target.list?

    scenes = []

    @_scenes.forEach (scene) ->
      return no if scene is target
      scenes.push scene if inArray validSceneLists, scene.list
      return yes

    scenes
