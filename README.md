# Replace import source with env variable

Babel plugin to replace the source of an `import` statement with an `env`
variable.

## Example

```js
// your/code.js
import foo from "./hello.{WORLD}.js";

// Run babel with WORLD set
WORLD=mundo babel your/code.js -o your/output.js

// your/output.js
import foo from "./hello.mundo.js";
```

The plugin needs to be configured what to look for:

```json
{
    "plugins": [
        [
            "replace-import-source-with-env",
            {
                "identifiers": ["WORLD"],
                "lax": false,
                "delimiters": ["{", "}"]
            }
        ]
    ]
}
```

## Licence

MIT
