import type { Options } from 'tsup'
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions'

export const tsup: Options = {
  entry: ['src/**/*.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],

  // BS package authors shouldn't really have to worry about:
  // downstream-packages 100% works with this set to false, but attw blows up
  // with https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/FalseExportDefault
  // Actually, `cjsInterop: true` seems to work around that.
  splitting: true,
  // Without this, tsup builds .mjs files that import without an extension, thus
  // not working in downstream-project.
  // I don't want to use it as it creates files out of the blue with
  // `splitting: true`, and with `splitting: false` it doubles up code by
  // inlining imports.
  bundle: true,
  // Fix for attw warning `🤨 CJS default export`.
  cjsInterop: true,

  // So, the magical incantation of building a CJS + ESM combo from a directory
  // of TypeScript files, a process that has worked for most of a decade, seems
  // to be:
  // So tsup generates valid code:
  // bundle: true,
  // So tsup doesn't double up code by inlining imports that still exist as
  // separate files:
  // splitting: true,
  // So attw doesn't flip it's lid:
  // cjsInterop: true,

  dts: true,

  // `rm -rf` ain't hard.
  clean: false,

  minify: false,
  skipNodeModulesBundle: true,
  watch: false,
  target: 'es2020',

  esbuildPlugins: [esbuildPluginFilePathExtensions()],
}
