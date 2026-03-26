// Warn about console.log statements in edited code
let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  const i = JSON.parse(d);
  const ns = i.tool_input?.new_string || '';

  if (/console\.log/.test(ns)) {
    console.error('[Hook] WARNING: console.log was added. Remove it if used for debugging.');
  }

  console.log(d);
});
