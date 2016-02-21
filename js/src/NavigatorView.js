var Component, Navigator, Reaction, StaticRenderer, Style, View, ref, reportFailure, sync;

ref = require("component"), Component = ref.Component, Style = ref.Style, View = ref.View, StaticRenderer = ref.StaticRenderer;

reportFailure = require("report-failure");

Reaction = require("reaction");

sync = require("io").sync;

Navigator = require("./Navigator");

module.exports = Component("NavigatorView", {
  propTypes: {
    navigator: Navigator.Kind,
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
    var scenes;
    scenes = sync.map(this.state.scenes.toJS(), function(scene) {
      return StaticRenderer({
        key: scene.name,
        shouldUpdate: false,
        render: scene.render
      });
    });
    return View({
      style: this.props.style,
      children: scenes
    });
  }
});

//# sourceMappingURL=../../map/src/NavigatorView.map
