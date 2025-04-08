import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 👇 Burada ek ayarları yapıyoruz:
  {
    rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "@next/next/no-img-element": "off",
    "@typescript-eslint/no-non-null-assertion": "warn"
    },
  },
];

export default eslintConfig;
