// Block destructive git commands (push --force, reset --hard, etc.)
let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  const i = JSON.parse(d);
  const cmd = i.tool_input?.command || '';

  // git push --force / -f (--force-with-lease is allowed)
  if (/git\s+push\b/.test(cmd) && /\s(--force|-f)\b/.test(cmd) && !/--force-with-lease/.test(cmd)) {
    console.error('[Hook] BLOCKED: git push --force is not allowed. Use --force-with-lease instead.');
    process.exit(2);
  }

  // git reset --hard
  if (/git\s+reset\b/.test(cmd) && /--hard/.test(cmd)) {
    console.error('[Hook] BLOCKED: git reset --hard is not allowed. Use git stash or git reset --soft instead.');
    process.exit(2);
  }

  // git checkout -- . / git checkout . / git restore . (discard all changes)
  if (/git\s+checkout\s+(--\s*\.|\.(?:\s|$))/.test(cmd) || /git\s+restore\s+\./.test(cmd)) {
    console.error('[Hook] BLOCKED: Discarding all changes is not allowed. Use git stash or specify files.');
    process.exit(2);
  }

  // git clean -f / --force (force-delete untracked files)
  if (/git\s+clean\b/.test(cmd) && /\s(-[a-zA-Z]*f[a-zA-Z]*|--force)\b/.test(cmd)) {
    console.error('[Hook] BLOCKED: git clean -f is not allowed. Review untracked files manually.');
    process.exit(2);
  }

  // git branch -D (force-delete branch)
  if (/git\s+branch\s+-D\b/.test(cmd)) {
    console.error('[Hook] BLOCKED: git branch -D is not allowed. Use git branch -d for safe deletion.');
    process.exit(2);
  }

  console.log(d);
});
