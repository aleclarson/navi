var Component, Navigator, Reaction, Style, ref, reportFailure;

ref = require("component"), Component = ref.Component, Style = ref.Style;

reportFailure = require("report-failure");

Reaction = require("reaction");

Navigator = require("./Navigator");

module.exports = Component("NavigatorView", {
  propTypes: {
    navigator: Navigator,
    style: Style
  },
  initState: function() {
    return {
      scenes: Reaction.sync((function(_this) {
        return function() {
          return _this.props.navigator._scenes;
        };
      })(this))
    };
  },
  render: function() {
    var sceneViews;
    sceneViews = [];
    this.state.scenes.forEach(function(scene) {
      var error, sceneView;
      try {
        sceneView = scene.render({
          key: scene.id,
          scene: scene
        });
      } catch (_error) {
        error = _error;
        reportFailure(error, {
          scene: scene
        });
      }
      return sceneViews.push(sceneView);
    });
    return View({
      style: this.props.style,
      children: sceneViews
    });
  }
});

//# sourceMappingURL=../../map/src/NavigatorView.map
