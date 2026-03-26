// Block --no-verify flag to protect git hooks
let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  const i = JSON.parse(d);
  const cmd = i.tool_input?.command || '';

  if (/--no-verify/.test(cmd)) {
    console.error('[Hook] BLOCKED: --no-verify is not allowed. Fix the root cause instead.');
    process.exit(2);
  }

  console.log(d);
});
