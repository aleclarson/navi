
{ Style
  Children
  Component } = require "component"

emptyFunction = require "emptyFunction"

Scene = require "./Scene"

module.exports = Component "SceneView",

  propTypes:
    scene: Scene.Kind
    style: Style
    children: Children

  customValues:

    scene: get: ->
      @props.scene

  initValues: ->

    renderCount: 0

  initNativeValues: ->

    opacity: =>
      if @scene.isHidden then 0 else 1

    containerEvents: =>
      if @scene.isHiding or @scene.isHidden then "none" else "box-none"

    contentEvents: =>
      if @scene.isTouchable then "box-none" else "none"

    bkgEvents: =>
      if @scene.isTouchableBelow then "none" else "auto"

#
# Rendering
#

  componentDidMount: ->
    @scene.sceneView = this

  componentWillUnmount: ->
    @scene.sceneView = null

  render: ->

    if @renderCount > 0
      log.it "#{@scene.name}.render() #{@renderCount + 1}"

    @renderCount += 1

    bkg = View
      pointerEvents: @bkgEvents
      onStartShouldSetResponder: emptyFunction.thatReturnsTrue
      onResponderGrant: =>
        log.it "#{@scene.name}.onTouch() { background: true }" # if __DEV__
      style: [
        _.Style.Clear
        _.Style.Cover
      ]

    content = View
      pointerEvents: @contentEvents
      onStartShouldSetResponderCapture: =>
        log.it "#{@scene.name}.onTouch()" # if __DEV__
        no
      style: [
        _.Style.Clear
        _.Style.Cover
        @props.style
        transform: [
          { scale: @scene.scale }
        ]
      ]
      children: @props.children

    return View
      pointerEvents: @containerEvents
      style: [
        _.Style.Clear
        _.Style.Cover
        { @opacity }
      ]
      children: [
        bkg
        content
      ]
