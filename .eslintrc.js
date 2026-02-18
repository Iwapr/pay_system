/**
 * @file .eslintrc.js
 * @description 项目 ESLint 代码规范配置文件。
 * 启用 browser/es6/node 环境，继承 eslint:recommended 规则，
 * 支持 JSX 语法，引入 react 插件并配置引号风格（双引号）和换行符（Unix LF）规则。
 * @module eslintrc
 */
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/jsx-uses-react": 2,
        "react/jsx-uses-vars": 2,
        "react/react-in-jsx-scope": 2,
        "quotes": [1, "double"],
        "linebreak-style": ["error", "unix"]
    }
};