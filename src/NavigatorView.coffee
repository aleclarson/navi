
{ Component, Style, View, StaticRenderer } = require "component"

Reaction = require "reaction"

Navigator = require "./Navigator"

module.exports = Component "NavigatorView",

  propTypes:
    navigator: Navigator.Kind
    style: Style

  initValues: ->

    scenes: Reaction.sync =>
      @props.navigator._scenes

  initListeners: ->

    @scenes.didSet =>
      @forceUpdate()

  shouldComponentUpdate: ->
    return no

  render: ->

    scenes = []
    @scenes.value.forEach (scene) ->
      scene._element ?= scene.render { key: scene.__id }
      scenes.push scene._element

    return View
      style: @props.style
      children: scenes
