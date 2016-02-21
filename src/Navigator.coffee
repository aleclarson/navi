
{ isType, assertKind } = require "type-utils"

Immutable = require "immutable"
inArray = require "in-array"
Factory = require "factory"

SceneList = require "./SceneList"
Scene = require "./Scene"

module.exports = Factory "Navigator",

  customValues:

    scenes: get: ->
      @_scenes.toJS()
        .map (scene) -> scene.name

    visibleScenes: get: ->
      @_scenes.toJS()
        .filter (scene) -> not scene.isHidden
        .map (scene) -> scene.name

  initValues: ->
    _sceneNames: Object.create null

  initReactiveValues: ->
    _scenes: Immutable.List()

  contains: (scene) ->
    @_sceneNames[scene.name]?

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

    @_sceneNames[scene.name] = yes

    scene.navigator = this

    return yes

  remove: (scene) ->

    assertKind scene, Scene

    unless @contains scene
      return no

    index = @_scenes.indexOf scene

    @_scenes = @_scenes.splice index, 1

    delete @_sceneNames[scene.name]

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
