// Block creation of files larger than 800 lines
const MAX_LINES = 800;

let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  const i = JSON.parse(d);
  const c = i.tool_input?.content || '';
  const lines = c.split('\n').length;

  if (lines > MAX_LINES) {
    console.error(`[Hook] BLOCKED: File exceeds ${MAX_LINES} lines (${lines} lines). Split into smaller modules.`);
    process.exit(2);
  }

  console.log(d);
});
