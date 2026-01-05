// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import query from "@tanstack/eslint-plugin-query";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      query,
      prettier,
    },

    extends: [
      js.configs.recommended, // JS best practices
      reactHooks.configs.flat.recommended, // Hooks rules
      reactPlugin.configs.flat.recommended, // React best practices
      prettierConfig, // Disable conflicting ESLint rules
    ],

    rules: {
      // React Refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // TanStack Query rules
      ...query.configs["flat/recommended"].rules,

      // Prettier: show formatting issues as ESLint errors
      "prettier/prettier": "error",

      // React rules
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-undef": "error",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
      "react-hooks/set-state-in-effect": "warn",

      // General JS rules
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
]);

// import js from "@eslint/js";
// import globals from "globals";
// import react from "eslint-plugin-react";
// import reactHooks from "eslint-plugin-react-hooks";
// import reactRefresh from "eslint-plugin-react-refresh";
// import { defineConfig, globalIgnores } from "eslint/config";
// import pluginQuery from "@tanstack/eslint-plugin-query";

// export default defineConfig([
//   globalIgnores(["dist"]),

//   // Add TanStack Query config here ⬇️ outside rules
//   pluginQuery.configs["flat/recommended"],

//   {
//     files: ["**/*.{js,jsx}"],
//     extends: [
//       js.configs.recommended,
//       reactHooks.configs.flat.recommended,
//       reactRefresh.configs.vite,
//     ],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: "latest",
//         ecmaFeatures: { jsx: true },
//         sourceType: "module",
//       },
//     },
//     plugins: {
//       react,
//       reactHooks,
//       reactRefresh,
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...react.configs.recommended.rules,
//       ...reactHooks.configs.recommended.rules,
//       "react/jsx-no-undef": "error",
//       "react/react-in-jsx-scope": "off",
//       "react/prop-types": "off",
//       "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
//       "react/jsx-uses-react": "off",
//       "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],

//       "react-refresh/only-export-components": [
//         "warn",
//         { allowConstantExport: true },
//       ],
//     },
//   },
// ]);
