import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import stylisticPlugin from '@stylistic/eslint-plugin';
import markdownPlugin from '@eslint/markdown';
import * as mdx from 'eslint-plugin-mdx'; // 引入新安装的插件

export default [
  {
    ignores: ['.docusaurus', 'build', 'node_modules'],
  },

  // 1. JS / TS / JSX / TSX 文件 (主逻辑)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': typescriptPlugin,
      tailwindcss: tailwindPlugin,
      stylistic: stylisticPlugin,
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'tailwindcss/no-custom-classname': 'off',
    },
  },

  // 2. 纯 Markdown 文件 (.md) - 使用 @eslint/markdown
  {
    files: ['**/*.md'],
    plugins: {
      markdown: markdownPlugin,
    },
    processor: 'markdown/markdown',
  },

  // 3. MDX 文件 (.mdx) - 使用 eslint-plugin-mdx
  {
    files: ['**/*.mdx'],
    ...mdx.flat, // 自动配置 parser 和 processor
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true, // 同时也 lint 代码块
      languageMapper: {},
    }),
    rules: {
      ...mdx.flat.rules,
      'react/jsx-no-undef': 'off', // MDX 中有时全局组件不需引入
    },
  },

  // 4. Markdown/MDX 内的代码块 (虚拟文件覆盖)
  {
    // 匹配 .md 或 .mdx 中的代码块
    files: ['**/*.{md,mdx}/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react: reactPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/jsx-no-undef': 'off',
    },
  },
];
