// Auto-format files after edits (prettier/ruff/rustfmt)
const { execFileSync } = require('child_process');

let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  const i = JSON.parse(d);
  const p = i.tool_input?.file_path || '';

  try {
    if (/\.(ts|tsx|js|jsx|json|css|md)$/.test(p)) {
      execFileSync('npx', ['prettier', '--write', p], { stdio: 'pipe', timeout: 10000 });
    } else if (/\.py$/.test(p)) {
      execFileSync('ruff', ['format', p], { stdio: 'pipe', timeout: 10000 });
    } else if (/\.rs$/.test(p)) {
      execFileSync('rustfmt', [p], { stdio: 'pipe', timeout: 10000 });
    }
  } catch (e) {
    // フォーマッタが未インストールの場合は無視
  }

  console.log(d);
});
