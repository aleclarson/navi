
{ Component, Style } = require "component"

reportFailure = require "report-failure"
Reaction = require "reaction"

Navigator = require "./Navigator"

module.exports = Component "NavigatorView",

  propTypes:
    navigator: Navigator
    style: Style

  initState: ->

    scenes: Reaction.sync =>
      @props.navigator._scenes

  render: ->

    sceneViews = []

    @state.scenes.forEach (scene) ->
      try sceneView = scene.render { key: scene.id, scene }
      catch error then reportFailure error, { scene }
      sceneViews.push sceneView

    return View
      style: @props.style
      children: sceneViews
