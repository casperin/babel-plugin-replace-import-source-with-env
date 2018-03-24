const babel = require("babel-core")
const tape = require("tape")

function transform (code, opt) {
    return babel.transform(code, {
        plugins: [['./src', opt]]
    }).code
}

const tests = [
    {
        input: `import x from "./foo";`,
        output: `import x from "./foo";`,
        envs: [],
        options: {
            identifiers: ['not_found']
        },
        description: "No substitution"
    },

    {
        input: `import x from "./foo/bar.{x}.js";`,
        output: `import x from "./foo/bar.hello.js";`,
        envs: [
            ['x', 'hello']
        ],
        options: {
            identifiers: ['x']
        },
        description: "Base test - one sub"
    },

    {
        input: `import { foo } from "bar.{x}.{y}.js";`,
        output: `import { foo } from "bar.a.b.js";`,
        envs: [
            ['x', 'a'],
            ['y', 'b']
        ],
        options: {
            identifiers: ['x', 'y']
        },
        description: "Two replaces"
    },

    {
        input: `import { foo } from "bar.{x}.{y}.js";`,
        output: `import { foo } from "bar.a.{y}.js";`,
        envs: [
            ['x', 'a'],
            ['y', 'b']
        ],
        options: {
            identifiers: ['x']
        },
        description: "Missing identifier"
    },

    {
        input: `import { foo } from "bar.{x}.{y}.js";`,
        output: `import { foo } from "bar.a.{y}.js";`,
        envs: [
            ['x', 'a'],
        ],
        options: {
            identifiers: ['x', 'y'],
            lax: true
        },
        description: "Missing env variable with lax = true"
    },

    {
        input: `import { foo } from "bar.{x}.js";\nconst a = 1;`,
        output: `import { foo } from "bar.a.js";\n\nconst a = 1;`,
        envs: [
            ['x', 'a'],
        ],
        options: {
            identifiers: ['x']
        },
        description: "Other types of code should not confuse the lib"
    },

    {
        input: `import { k } from "baz.{x}.js";\nimport { s } from "baz.{x}.{y}.js";\nconst a = 1;`,
        output: `import { k } from "baz.a.js";\nimport { s } from "baz.a.b.js";\n\nconst a = 1;`,
        envs: [
            ['x', 'a'],
            ['y', 'b']
        ],
        options: {
            identifiers: ['x', 'y']
        },
        description: "Multiple lines"
    },

    {
        input: `import x from "./foo/bar.#[x].js";`,
        output: `import x from "./foo/bar.hello.js";`,
        envs: [
            ['x', 'hello']
        ],
        options: {
            identifiers: ['x'],
            delimiters: ['#[', ']']
        },
        description: "Change delimiters"
    }
]

tests.forEach(test => {
    tape(test.description, t => {
        test.envs.forEach(env => process.env[env[0]] = env[1])
        const actual = transform(test.input, test.options)
        t.equal(actual, test.output, "input should match output")
        t.end()
        test.envs.forEach(env => process.env[env[0]] = undefined)
    })
})

