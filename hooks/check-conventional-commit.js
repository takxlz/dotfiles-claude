// Validate Conventional Commits format on git commit
let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  const i = JSON.parse(d);
  const cmd = i.tool_input?.command || '';

  // Skip non-commit commands
  if (!/git\s+commit\b/.test(cmd)) {
    console.log(d);
    return;
  }

  // Extract commit message (-m "..." / -m '...' / HEREDOC format)
  // Only the first -m flag is validated as the subject line
  let msg = '';

  // HEREDOC format: git commit -m "$(cat <<'EOF'\n...\nEOF\n)"
  const heredocMatch = cmd.match(/<<['"]?EOF['"]?\s*\n([\s\S]*?)\nEOF/);
  if (heredocMatch) {
    msg = heredocMatch[1].trim().split('\n')[0];
  }

  // -m "..." or -m '...' format
  if (!msg) {
    const msgMatch = cmd.match(/-m\s+(?:"([^"]*?)"|'([^']*?)')/);
    if (msgMatch) {
      msg = (msgMatch[1] || msgMatch[2] || '').trim();
    }
  }

  // Skip if no message found (editor will open for -m-less commits and --amend)
  if (!msg) {
    console.log(d);
    return;
  }

  // Validate Conventional Commits format
  // type(scope)!: description / type!: description / type: description
  const types = ['fix', 'feat', 'test', 'docs', 'refactor', 'chore', 'perf', 'ci', 'style', 'build', 'revert'];
  const pattern = new RegExp(`^(${types.join('|')})(\\([a-zA-Z0-9_-]+\\))?!?:\\s.+`);

  if (!pattern.test(msg)) {
    console.error(`[Hook] BLOCKED: Commit message does not follow Conventional Commits format.`);
    console.error(`  Expected: <type>(<scope>): <description>`);
    console.error(`  Types: ${types.join(', ')}`);
    console.error(`  Got: "${msg}"`);
    process.exit(2);
  }

  console.log(d);
});
