import { readFile, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const theme = JSON.parse(await readFile(new URL('packages/theme/package.json', root), 'utf8'))

// release-it has already bumped the publishable package via its npm plugin.
// Keep the repository and private docs package on that same version.
for (const path of ['package.json', 'packages/docs/package.json']) {
  const file = new URL(path, root)
  const manifest = JSON.parse(await readFile(file, 'utf8'))
  manifest.version = theme.version
  await writeFile(file, `${JSON.stringify(manifest, null, 2)}\n`)
}
