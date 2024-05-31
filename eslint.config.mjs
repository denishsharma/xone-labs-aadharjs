import antfu from "@antfu/eslint-config";

export default antfu({
    stylistic: {
        indent: 4,
        quotes: "double",
        semi: true,
    },
    rules: {
        "style/array-bracket-newline": ["error", { multiline: true }],
        "style/function-call-argument-newline": ["error", "consistent"],
        "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
        "style/max-statements-per-line": ["error", { max: 2 }],
        "antfu/if-newline": "off",
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "import/order": [
            "error",
            {
                "newlines-between": "always",
                "groups": [["external"], ["parent", "internal", "builtin", "sibling", "index"], "object", "type"],
                "alphabetize": { order: "asc", caseInsensitive: true },
            },
        ],
        "import/newline-after-import": ["error", { count: 1 }],
    },
    yaml: false,
    jsonc: true,
});
