var defaultOptions = {
    strict: false,
    prefix: ".",
    postfix: "",
    fallback: "",
    delimiters: ["{", "}"],
    identifiers: []
}

module.exports = function ({types : t}) {
    return {
        visitor: {
            ImportDeclaration(path, state) {
                var identifiers = state.opts.identifiers || defaultOptions.identifiers,
                    dels = state.opts.delimiters || defaultOptions.delimiters,
                    strict = state.opts.strict || defaultOptions.strict,
                    prefix = state.opts.prefix || defaultOptions.prefix,
                    postfix = state.opts.postfix || defaultOptions.postfix,
                    fallback = state.opts.fallback || defaultOptions.fallback,
                    value = path.node.source.value, // the last part of: import x from './y'
                    substitute, ident, identPad, replacement, transforms

                for (ident of identifiers) {
                    identPad = dels[0] + ident + dels[1]

                    if (!value.includes(identPad)) {
                        continue
                    }

                    replacement = process.env[ident]
                    if (replacement === "undefined" || replacement == null) {
                        if (strict) {
                            throw new Error("I am missing env variable: " + ident)
                        }
                        replacement = fallback
                    }

                    if (replacement !== "") {
                        replacement = prefix + replacement + postfix
                    }

                    value = value.split(identPad).join(replacement)
                    substitute = true
                }

                if (!substitute) {
                    return
                }

                transforms = path.node.specifiers.map(specifier => {
                    return t.importDeclaration(
                        [specifier],
                        t.stringLiteral(value)
                    )
                })

                path.replaceWithMultiple(transforms)
            }
        }
    }
}
