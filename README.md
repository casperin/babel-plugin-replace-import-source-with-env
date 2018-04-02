# Replace import source with env variable

Babel plugin to replace the source of an `import` statement with an `env`
variable. This can be useful to build multiple targets/versions from one js
file.

Think one to target **ios** and another for **android**. Or a version where you
mock the `api` in case you don't have, or need to work with, a real backend
(this happens all the time for me).

Wherever you find small differences that can be abstracted out into files.


## Install

```sh
npm install --save-dev babel-plugin-replace-import-source-with-env
```


## Example

```js
// src/index.js
import foo from "./hello{TARGET}.js";
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

You can give it more options. Here are the options with their default values.

```js
// .babelrc
{
    "plugins": [
        [
            "replace-import-source-with-env",
            {
                "identifiers": [],
                "prefix": ".",
                "postfix": "",
                "fallback": "",
                "delimiters": ["{", "}"]
            }
        ]
    ]
}
```

* `identifiers` are a must for this plugin to do anything. They should reflect
  the `env` variables. So in the above, the plugin will expect to be able to find
  a `process.env.TARGET` that is a string. If it doesn't it will use the
  fallback.
* `prefix` of the replaced string. It's the `.` preceding the env variable.
  Will not be added in case the value to be inserted is an empty string (see
  below for explanation).
* `postfix` of the replaced string. Follows same rule as `prefix`.
* `delimiters` - By default the plugin will look for `{ ... }`, but it can be
  changed to whatever you want.


### prefix and postfix insertion rules

Typically you want this behavior:

```js
// env: MOCK=mock
import api from "./api{MOCK}"
// to
import api from "./api.mock"
//                    ^ ^
//                    | `-- env variable
//                    `---- prefix
```

But if `MOCK` is not set, you want

```js
// no MOCK env
import api from "./api{MOCK}"
// to
import api from "./api"
//                    ^-- no env variable or prefix
```

To do this, we only add the prefix (and postfix) if there actually is a
non-emptly string to replace the `{MOCK}` part with.


## Licence

MIT
