// Warn about console.log statements in edited code
let d = "";
process.stdin.on("data", (c) => (d += c));
process.stdin.on("end", () => {
  const i = JSON.parse(d);
  const ns = i.tool_input?.new_string || "";

  const lines = ns.split("\n");
  const hasConsoleLog = lines.some((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return false;
    return /console\.log/.test(trimmed);
  });
  if (hasConsoleLog) {
    console.error(
      "[Hook] WARNING: console.log was added. Remove it if used for debugging.",
    );
  }

  console.log(d);
});
