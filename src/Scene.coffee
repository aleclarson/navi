
{ Void
  assert } = require "type-utils"

Hideable = require "hideable"
Factory = require "factory"
Event = require "event"

module.exports = Factory "Scene",

  optionTypes:
    level: Number
    isHiding: Boolean
    isHidden: Boolean
    isPermanent: Boolean
    ignoreTouches: Boolean
    ignoreTouchesBelow: Boolean

  optionDefaults:
    isHiding: no
    isHidden: yes
    isPermanent: no
    ignoreTouches: no
    ignoreTouchesBelow: no

  customValues:

    name: get: ->
      @_getName()

    sceneView:
      value: null
      reactive: yes
      didSet: (sceneView) ->
        GLOBAL.scenes[@name] = this # if __DEV__
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

  initFactory: ->
    GLOBAL.scenes = Object.create null # if __DEV__

  initFrozenValues: (options) ->
    level: options.level
    scale: NativeValue 1

  initValues: ->
    _events: null

  initReactiveValues: (options) ->
    isHidden: options.isHidden
    isPermanent: options.isPermanent
    ignoreTouches: options.ignoreTouches
    ignoreTouchesBelow: options.ignoreTouchesBelow

  init: (options) ->

    Hideable this, {
      isHiding: options.isHiding
      show: => @_show.apply this, arguments
      hide: => @_hide.apply this, arguments
      onShowStart: => @_onShowStart.apply this, arguments
      onShowEnd: => @_onShowEnd.apply this, arguments
      onHideStart: => @_onHideStart.apply this, arguments
      onHideEnd: => @_onHideEnd.apply this, arguments
    }

  boundMethods: [
    "render"
  ]

  render: (props = {}) ->
    assertType props, Object
    props.scene = this
    try sceneView = @_component props
    catch error then reportFailure error, { props }
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

  _show: ->
    error = Error "Must override 'Scene._show'!"
    reportFailure error, { scene: this }

  _hide: ->
    error = Error "Must override 'Scene._hide'!"
    reportFailure error, { scene: this }

  _getName: ->
    error = Error "Must override 'Scene._getName'!"
    reportFailure error, { scene: this }

  # Subclass can override!
  _onShowStart: emptyFunction

  # Subclass can override!
  _onShowEnd: emptyFunction

  # Subclass can override!
  _onHideStart: emptyFunction

  # Subclass can override!
  _onHideEnd: emptyFunction

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
    reportFailure error, { scene: this }
