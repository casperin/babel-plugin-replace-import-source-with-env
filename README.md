# Replace import source with env variable

Babel plugin to replace the source of an `import` statement with an `env`
variable.

## Example

```js
// your/code.js
import foo from "./hello.{WORLD}.js";
```

```sh
# Run babel with WORLD set
WORLD=mundo babel your/code.js -o your/output.js
```

```js
// your/output.js
import foo from "./hello.mundo.js";
```

The plugin needs to be configured what to look for:

```js
{
    "plugins": [
        [
            "replace-import-source-with-env",
            {
                "identifiers": ["WORLD"], // Look at example above
                "lax": false, // That's the default
                "delimiters": ["{", "}"] // Also the defaults
            }
        ]
    ]
}

## Options

* `identifiers` are a must for this plugin to do anything. They should reflect
  the `env` variables. So in the above, the plugin will expect to be able to find
  a `process.env.WORLD` that is a string. If it doesn't it will throw an error.
* `lax` - if changed to `true`, then the plugin will ignore missing `env`s and
  just continue with the next identifier.
* `delimiters` - By default the plugin will look for `{process.env[delimiter]}`.

```

## Licence

MIT
