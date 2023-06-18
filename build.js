const { build } = require("esbuild");

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  target: "es2016",
  outfile: "dist/index.js"
}).then(() => console.log("⚡ Done"));
