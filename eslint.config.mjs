import { fixupConfigRules } from "@eslint/compat";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/dist", "**/node_modules", "**/.eslintrc.cjs"],
}, ...fixupConfigRules(compat.extends("eslint:recommended", "plugin:import/recommended")), {
    plugins: {
        "unused-imports": unusedImports,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        "prefer-const": "error",
        "unused-imports/no-unused-imports": "error",
        "no-use-before-define": "error",
        "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
        "@typescript-eslint/no-explicit-any": "off",
        "react-refresh/only-export-components": ["error"],
    },
}];