
{ Void
  assert } = require "type-utils"

Hideable = require "hideable"
Factory = require "factory"

module.exports = Factory "Scene",

  optionTypes:
    id: String
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

    list:
      value: null
      didSet: (list) ->
        @didSetList list

    navigator:
      value: null
      didSet: (navigator) ->
        @didSetNavigator navigator

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

    render: lazy: ->
      @getComponent()

  initFactory: ->
    GLOBAL.scenes = Object.create null # if __DEV__

  initFrozenValues: (options) ->
    id: options.id
    level: options.level
    scale: NativeValue 1

  initValues: ->
    list: null
    navigator: null
    _previousScene: null

  initReactiveValues: (options) ->
    isHidden: options.isHidden
    isPermanent: options.isPermanent
    ignoreTouches: options.ignoreTouches
    ignoreTouchesBelow: options.ignoreTouchesBelow

  init: (options) ->

    GLOBAL.scenes[@id] = this # if __DEV__

    Hideable this, {
      isHiding: options.isHiding
      @onShow
      @onHide
    }

  isAbove: (scene) ->

    assert @list?,
      scene: this
      reason: "Must call 'scene.push' before 'scene.isAbove'!"

    sceneIndex = @list.indexOf scene
    (sceneIndex < 0) or (sceneIndex < @list.indexOf this)

  pop: ->
    @list?.remove this
    @navigator?.remove this unless @list?

  onShow: ->
    # Subclass can override!

  onHide: ->
    # Subclass can override!

  didSetNavigator: (navigator) ->
    # Subclass can override!

  didSetList: (list) ->
    # Subclass can override!

  getComponent: ->
    throw Error "Subclass must override!"
