
{ Style
  Children
  Component } = require "component"

emptyFunction = require "emptyFunction"
flattenStyle = require "flattenStyle"
Reaction = require "reaction"

Scene = require "./Scene"

module.exports = Component "SceneView",

  propTypes:
    scene: Scene.Kind
    style: Style
    children: Children
    bkgStyle: Style

  customValues:

    scene: get: ->
      @props.scene

  initValues: ->

    renderCount: 0 # TODO: if isDev

  initNativeValues: ->

    opacity: =>
      if @scene.isHidden then 0 else 1

    containerEvents: =>
      if @scene.isHiding or @scene.isHidden then "none" else "box-none"

    contentEvents: Reaction =>
      if @scene.isTouchable then "box-none" else "none"

    bkgEvents: Reaction =>
      if @scene.isTouchableBelow then "none" else "auto"

#
# Rendering
#

  componentDidMount: ->
    @scene.sceneView = this

  componentWillUnmount: ->
    @scene._element = null
    @scene.sceneView = null

  render: ->

    if @renderCount > 0
      log.it "#{@scene.__id}.render() #{@renderCount + 1}"

    @renderCount += 1

    bkg = View
      style: [ _.Style.Clear, _.Style.Cover, @props.bkgStyle ]
      pointerEvents: @bkgEvents
      onStartShouldSetResponder: emptyFunction.thatReturnsTrue
      # onResponderGrant: =>
      #   log.it "#{@scene.__id}.onTouch() { background: true }" # if __DEV__

    contentStyle = flattenStyle [
      _.Style.Cover
      _.Style.Clear
      @props.style
    ]

    contentStyle.transform ?= []
    contentStyle.transform.push { scale: @scene.scale }

    content = View
      style: contentStyle
      children: @props.children
      pointerEvents: @contentEvents
      # onStartShouldSetResponderCapture: =>
      #   log.it "#{@scene.__id}.onTouch()" # if __DEV__
      #   no

    return View
      style: [ _.Style.Clear, _.Style.Cover, { @opacity } ]
      children: [ bkg, content ]
      pointerEvents: @containerEvents
