# Replace import source with env variable

Babel plugin to replace the source of an `import` statement with an `env`
variable. This can be useful to build multiple targets/versions from one js
file.

Think one to target **ios** and another for **android**. Or **linux** and
**windows** and **mac**.  Wherever you find small differences that can be
abstracted out into files.

## Install

```sh
npm install --save-dev babel-plugin-replace-import-source-with-env
```

## Example

```js
// src/index.js
import foo from "./hello.{TARGET}.js";
```

```sh
# Run babel with TARGET set
TARGET=android babel src/index.js -o dist/android.js
TARGET=ios babel src/index.js -o dist/ios.js
```

```js
// dist/andoid.js
import foo from "./hello.android.js";
```

```js
// dist/ios.js
import foo from "./hello.ios.js";
```

The plugin needs to be configured what to look for:

```js
// .babelrc
{
    "plugins": [
        [
            "replace-import-source-with-env",
            {
                "identifiers": ["TARGET"]
            }
        ]
    ]
}
```

## Options

You can give it two more options:

```js
// .babelrc
{
    "plugins": [
        [
            "replace-import-source-with-env",
            {
                "identifiers": ["TARGET"],  // You can of course give this as many as you like
                "lax": false,               // That's the default. `true` will silence errors
                "delimiters": ["{", "}"]    // The defaults. Should always be an array with two elements
            }
        ]
    ]
}
```

* `identifiers` are a must for this plugin to do anything. They should reflect
  the `env` variables. So in the above, the plugin will expect to be able to find
  a `process.env.WORLD` that is a string. If it doesn't it will throw an error.
* `lax` - if changed to `true`, then the plugin will ignore missing `env`s and
  just continue with the next identifier.
* `delimiters` - By default the plugin will look for `{process.env[delimiter]}`.

## Licence

MIT
