#!/usr/bin/env node
/**
 * 実装コード保護フック
 *
 * EditまたはWriteツール実行前に、対象ファイルが実装コードかどうかをチェックし、
 * 保護対象ディレクトリ配下の場合はブロックする。
 *
 * Exit codes:
 * - 0: 許可（ツール実行を継続）
 * - 2: ブロック（ツール実行を中止、stderrがClaudeに表示される）
 */

const path = require('path');

// 保護対象のディレクトリ（実装コード）
const PROTECTED_DIRS = [
  'components',
  'pages',
  'server',
  'composables',
  'stores',
  'layouts',
  'plugins',
  'middleware',
  'assets',
  'public',
  'app',
  'src',
  'utils',
  'lib',
];

// 許可対象のディレクトリ（仕様・テスト・設定）
const ALLOWED_DIRS = [
  'docs',
  'tests',
  '.claude',
  'node_modules',
];

// 許可対象のファイルパターン
const ALLOWED_FILES = [
  '.md',           // ドキュメント
  '.json',         // 設定ファイル
  '.yaml',         // 設定ファイル
  '.yml',          // 設定ファイル
  '.config.ts',    // 設定ファイル
  '.config.js',    // 設定ファイル
  'package.json',
  'tsconfig.json',
  'nuxt.config.ts',
  'tailwind.config.js',
  'vitest.config.ts',
  'playwright.config.ts',
];

/**
 * 許可対象のファイルかどうかをチェック
 */
function isAllowedFile(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');
  const fileName = path.basename(filePath);

  // 許可対象ディレクトリ配下かチェック
  for (const allowedDir of ALLOWED_DIRS) {
    if (parts.includes(allowedDir)) {
      return true;
    }
  }

  // 許可対象ファイルパターンかチェック
  for (const pattern of ALLOWED_FILES) {
    if (fileName.endsWith(pattern) || fileName === pattern) {
      return true;
    }
  }

  return false;
}

/**
 * 保護対象のファイルかどうかをチェック
 */
function isProtectedFile(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');

  for (const protectedDir of PROTECTED_DIRS) {
    if (parts.includes(protectedDir)) {
      return { isProtected: true, protectedDir };
    }
  }

  return { isProtected: false, protectedDir: '' };
}

/**
 * メイン処理
 */
async function main() {
  // stdinからJSON入力を読み取る
  let inputData;
  try {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    const input = Buffer.concat(chunks).toString('utf-8');
    inputData = JSON.parse(input);
  } catch (e) {
    console.error(`Error: Invalid JSON input: ${e.message}`);
    process.exit(1);
  }

  const toolInput = inputData.tool_input || {};
  const filePath = toolInput.file_path || '';

  // ファイルパスがない場合はスキップ
  if (!filePath) {
    process.exit(0);
  }

  // 許可対象ファイルの場合はスキップ
  if (isAllowedFile(filePath)) {
    process.exit(0);
  }

  // 保護対象ファイルかチェック
  const { isProtected, protectedDir } = isProtectedFile(filePath);

  if (isProtected) {
    const warnMsg = `
================================================================================
  WARNING: Implementation file change detected
================================================================================

File: ${filePath}

This file is in a protected directory: '${protectedDir}/'

Please ensure you have followed the proper development process:

  1. Create a plan          -> docs/plans/
  2. Define requirements    -> docs/requirements/
  3. Create test scenarios  -> docs/test/
  4. Implement              -> Use developer agent

If this is a minor change (typo fix, comment, formatting), ensure it does
not affect specifications.

Proceeding with the change...
================================================================================
`;
    console.error(warnMsg);
    process.exit(0); // 警告のみ、ブロックしない
  }

  // 保護対象外のファイル
  process.exit(0);
}

main();
