module.exports = function ({types : t}) {
    return {
        visitor: {
            ImportDeclaration(path, state) {
                var identifiers = state.opts.identifiers || [],
                    prefix = state.opts.prefix || ".",
                    postfix = state.opts.postfix || "",
                    fallback = state.opts.fallback || "",
                    dels = state.opts.delimiters || ["{", "}"],
                    value = path.node.source.value, // the last part of: import x from './y'
                    ident, identPad, replacement, transforms

                for (ident of identifiers) {
                    identPad = dels[0] + ident + dels[1]

                    if (!value.includes(identPad)) {
                        continue
                    }

                    replacement = process.env[ident]

                    if (replacement === "undefined" || replacement == null) {
                        replacement = fallback
                    }

                    if (replacement !== "") {
                        replacement = prefix + replacement + postfix
                    }

                    value = value.split(identPad).join(replacement)
                }

                if (value === path.node.source.value) {
                    return
                }

                transforms = path.node.specifiers.map(function (specifier) {
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
