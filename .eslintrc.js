module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": ["eslint:recommended"],
    "parserOptions": {
        "ecmaVersion": 2016
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double",
            { "avoidEscape": true }
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": ["error", {"allow": ["warn", "error"]}]
    }
};
