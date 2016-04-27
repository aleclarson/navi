
{ throwFailure } = require "failure"
{ assert } = require "type-utils"

emptyFunction = require "emptyFunction"
Hideable = require "hideable"
Factory = require "factory"
Event = require "event"

GLOBAL.scenes = Object.create null # if __DEV__

module.exports = Factory "Scene",

  optionTypes:
    level: Number
    isHidden: Boolean
    isPermanent: Boolean
    ignoreTouches: Boolean
    ignoreTouchesBelow: Boolean

  optionDefaults:
    isHidden: yes
    isPermanent: no
    ignoreTouches: no
    ignoreTouchesBelow: no

  customValues:

    level:
      get: -> @_level
      set: (newLevel, oldLevel) ->
        return if newLevel is oldLevel
        @_level = newLevel
        { navigator } = this
        return unless navigator
        navigator.remove this
        navigator.insert this

    sceneView:
      value: null
      reactive: yes
      didSet: (sceneView) ->
        @_didSetSceneView.call this, sceneView

    list:
      value: null
      reactive: yes
      didSet: (list) ->
        @_didSetList.call this, list

    navigator:
      value: null
      reactive: yes
      didSet: (navigator) ->
        @_didSetNavigator.call this, navigator

    isActive: get: ->
      this is @list?.activeScene

    isTouchable: get: ->
      return no if @ignoreTouches
      return yes if @isActive or @isPermanent
      return yes unless @list?
      return yes if @isAbove @list.activeScene
      return @list.activeScene.isTouchableBelow

    isTouchableBelow: get: ->
      not @ignoreTouchesBelow

    _component: lazy: ->
      @_getComponent()

  initFrozenValues: (options) ->

    scale: NativeValue 1

  initValues: ->

    _cachedElement: null

  initReactiveValues: (options) ->

    _level: options.level

    isHidden: options.isHidden

    isPermanent: options.isPermanent

    ignoreTouches: options.ignoreTouches

    ignoreTouchesBelow: options.ignoreTouchesBelow

  init: (options) ->
    global.scenes[@__id] = this # if __DEV__

  boundMethods: [
    "render"
  ]

  render: (props = {}) ->
    assertType props, Object
    props.scene = this
    try sceneView = @_component props
    catch error then throwFailure error, { props }
    sceneView

  isAbove: (scene) ->

    assert @list?,
      scene: this
      reason: "Must call 'scene.push' before 'scene.isAbove'!"

    sceneIndex = @list.indexOf scene
    (sceneIndex < 0) or (sceneIndex < @list.indexOf this)

  pop: ->
    @list?.remove this
    @navigator?.remove this unless @list?

  # Subclass can override!
  _onActive: emptyFunction

  # Subclass can override!
  _onInactive: emptyFunction

  # Subclass can override!
  _didSetSceneView: emptyFunction

  # Subclass can override!
  _didSetList: emptyFunction

  # Subclass can override!
  _didSetNavigator: emptyFunction

  _getComponent: ->
    error = Error "Must override 'Scene._getComponent'!"
    throwFailure error, { scene: this }
