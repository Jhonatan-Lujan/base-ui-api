import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'

export default function tasks(on) {
  on(
    "file:preprocessor",
    createBundler({
      plugins: [
        NodeModulesPolyfillPlugin(),
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    })
  );
}