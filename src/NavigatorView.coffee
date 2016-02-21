
{ Component, Style, View, StaticRenderer } = require "component"

reportFailure = require "report-failure"
Reaction = require "reaction"
{ sync } = require "io"

Navigator = require "./Navigator"

module.exports = Component "NavigatorView",

  propTypes:
    navigator: Navigator.Kind
    style: Style

  initState: ->

    scenes: Reaction.sync =>
      @props.navigator._scenes

  render: ->

    scenes = sync.map @state.scenes.toJS(), (scene) ->
      return StaticRenderer
        key: scene.name
        shouldUpdate: no
        render: scene.render

    return View
      style: @props.style
      children: scenes
