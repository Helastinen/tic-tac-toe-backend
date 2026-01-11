import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylisticJs from "@stylistic/eslint-plugin";

export default defineConfig([
  js.configs.recommended,
  { 
    files: ["**/*.js"],
    plugins: { 
      js,
      "@stylistic/js": stylisticJs,
    },
    extends: ["js/recommended"],
    languageOptions: { 
      globals: { ...globals.node },
      sourceType: "commonjs",
      ecmaVersion: "latest"
    },
     rules: { 
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "double"],
      "@stylistic/js/semi": ["error", "always"],
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": "off",
    },
  },
  { 
    ignores: ["dist/**","build/**"]
  }
]);
