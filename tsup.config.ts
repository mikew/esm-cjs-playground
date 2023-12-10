import { defineConfig, type Options } from 'tsup'

const sharedOptions: Options = {
  entry: ['src'],
  splitting: false,
  bundle: true,
  sourcemap: false,
  clean: false,
  // target: 'node12',
  platform: 'node',
  // shims: true,
  dts: true,
  cjsInterop: true,
  esbuildPlugins: [
    // This plugin probably changes the meaning of some of the word vomit above,
    // I haven't tested every permutation yet.
    // This isn't needed if you're comfortable with the magical incantation
    // above, plus this plugin chokes when using tsconfig paths.
    rewriteImportsPlugin({
      esmExtension: '.mjs',
      cjsExtension: '',
    }),
  ],
}

export default defineConfig([
  {
    format: 'esm',
    outDir: 'dist/esm',
    target: 'node20',
    ...sharedOptions,
  },
  {
    format: 'cjs',
    outDir: 'dist/cjs',
    target: 'node12',
    ...sharedOptions,
  },
])

import fs from 'fs'
import path from 'path'
import type { Plugin } from 'esbuild'
import type { Format } from 'tsup'

const VALID_IMPORT_EXTENSIONS = [
  '.js',
  '.jsx',
  '.cjs',
  '.cjsx',
  '.mjs',
  '.mjsx',

  '.ts',
  '.tsx',
  '.cts',
  '.ctsx',
  '.mts',
  '.mtsx',
]

function rewriteImportsPlugin(options: {
  esmExtension: string
  cjsExtension: string
}) {
  const plugin: Plugin = {
    name: 'add-mjs',
    setup(build) {
      const currentBuildFormat: Format | null =
        build.initialOptions.define?.TSUP_FORMAT === '"cjs"'
          ? 'cjs'
          : build.initialOptions.define?.TSUP_FORMAT === '"esm"'
            ? 'esm'
            : null

      if (currentBuildFormat == null) {
        return
      }

      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === 'import-statement') {
          if (!args.path.match(/(^#|\.\/)/)) {
            return
          }

          const desiredExtension =
            currentBuildFormat === 'cjs'
              ? options.cjsExtension
              : currentBuildFormat === 'esm'
                ? options.esmExtension
                : null

          if (desiredExtension == null) {
            return
          }

          let finalName = `${args.path}${desiredExtension}`
          let exactMatch: string | null = null

          for (const ext of VALID_IMPORT_EXTENSIONS) {
            if (
              fs.existsSync(path.join(args.resolveDir, `${args.path}${ext}`))
            ) {
              exactMatch = `${args.path}${ext}`
              break
            }
          }

          if (!exactMatch) {
            finalName = `${args.path}/index${desiredExtension}`
          }

          return { path: finalName, external: true }
        }
      })
    },
  }

  return plugin
}
