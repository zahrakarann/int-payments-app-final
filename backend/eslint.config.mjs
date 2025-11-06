import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import jest from "eslint-plugin-jest";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, 
      },
    },
    plugins: {
      react,
      jest,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...jest.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
]);
