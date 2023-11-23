# esm-cjs-playground

Goals:

- Source written in TypeScript
- `./src` is compiled 1-to-1 in `./dist`
- CJS has `.js` extension and lives in `./dist`
- ESM has `.mjs` and lives in `./dist/esm`
- `package.json` has as few export maps as possible, so you don't have to
  constantly add to it when adding new files.

## Testing

This builds the project and runs a series of tests:

```sh
./script/build
```
