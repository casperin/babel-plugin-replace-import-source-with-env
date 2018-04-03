module.exports = function({ types: t }) {
    return {
        visitor: {
            ImportDeclaration(path, state) {
                var identifiers = state.opts.identifiers || [],
                    prefix = state.opts.prefix || ".",
                    postfix = state.opts.postfix || "",
                    fallback = state.opts.fallback || "",
                    dels = state.opts.delimiters || ["{", "}"],
                    value = path.node.source.value, // the last part of: import x from './y'
                    ident,
                    identPad,
                    replacement

                for (ident of identifiers) {
                    identPad = dels[0] + ident + dels[1]

                    if (!value.includes(identPad)) {
                        continue
                    }

                    replacement = (process.env[ident] || fallback).trim()

                    if (replacement !== "") {
                        replacement = prefix + replacement + postfix
                    }

                    value = value.split(identPad).join(replacement)
                }

                if (value === path.node.source.value) {
                    return
                }

                path.replaceWith(
                    t.importDeclaration(
                        path.node.specifiers,
                        t.stringLiteral(value)
                    )
                )
            }
        }
    }
}
