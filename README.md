
# navi v1.0.0 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

```coffee
{ Navigator, NavigatorView, Scene, SceneView } = require "navi"

# TODO Add example!
```

#### SceneView

Axioms about the `SceneView` include:

- The wrapper view always uses `{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }`! This is important for uniform scaling.

- The `style` prop is applied to the "child of the wrapper view" (a.k.a. the `contentView`).
