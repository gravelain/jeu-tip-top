import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Configurations recommandées pour JavaScript et React
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      // Ajout des globales pour Node.js et le navigateur
      globals: {
        ...globals.node,
        ...globals.browser,
        MSApp: "readonly", // Résolution de l'erreur liée à MSApp
      },
    },
    // Utiliser "ignores" pour exclure les fichiers non pertinents
    ignores: [
      "build/", // Exclure les fichiers générés
      "node_modules/", // Exclure les dépendances externes
    ],
  },
  {
    // Analyse des fichiers ciblés
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      // Désactivation ou ajustement des règles selon vos besoins
      "react/react-in-jsx-scope": "off", // Pas nécessaire avec React 17+
      "react/prop-types": "off", // Si vous utilisez TypeScript ou un autre typage
      "no-prototype-builtins": "warn", // Avertir mais ne pas bloquer
      "no-cond-assign": ["error", "except-parens"], // Éviter les assignations dans les conditions sauf entre parenthèses
      "no-empty": "warn", // Avertir sur les blocs vides
      "no-unused-vars": ["warn"], // Transformé en avertissement pour les variables inutilisées
      "valid-typeof": "error", // Corrige les comparaisons invalides de typeof
      "no-fallthrough": "error", // Assurer un "break" entre chaque case
      "no-useless-escape": "warn", // Avertir sur les échappements inutiles
      "getter-return": "error", // Forcer un retour dans les getters
      "no-control-regex": "error", // Empêcher les caractères de contrôle dans les regex
    },
    settings: {
      react: {
        version: "detect", // Détecte automatiquement la version de React
      },
    },
  },
  {
    // Règles spécifiques pour les tests
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
  },
];