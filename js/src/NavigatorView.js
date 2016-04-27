var Component, Navigator, Reaction, StaticRenderer, Style, View, ref;

ref = require("component"), Component = ref.Component, Style = ref.Style, View = ref.View, StaticRenderer = ref.StaticRenderer;

Reaction = require("reaction");

Navigator = require("./Navigator");

module.exports = Component("NavigatorView", {
  propTypes: {
    navigator: Navigator.Kind,
    style: Style
  },
  initValues: function() {
    return {
      scenes: Reaction.sync((function(_this) {
        return function() {
          return _this.props.navigator._scenes;
        };
      })(this))
    };
  },
  initListeners: function() {
    return this.scenes.didSet((function(_this) {
      return function() {
        return _this.forceUpdate();
      };
    })(this));
  },
  shouldComponentUpdate: function() {
    return false;
  },
  render: function() {
    var scenes;
    scenes = [];
    this.scenes.value.forEach(function(scene) {
      if (scene._element == null) {
        scene._element = scene.render({
          key: scene.__id
        });
      }
      return scenes.push(scene._element);
    });
    return View({
      style: this.props.style,
      children: scenes
    });
  }
});

//# sourceMappingURL=../../map/src/NavigatorView.map
