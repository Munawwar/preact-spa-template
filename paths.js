import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
// if you use a CDN on prod, set this to full base URL (e.g. https://cdn.domain.com/) on prod.
// Leave it as '/public' on local.
const publicURLPath = '/public';
const publicDirectoryRelative = 'dist/'
const publicDirectory = `${root}/${publicDirectoryRelative}`

export {
  root,
  publicDirectory,
  publicDirectoryRelative,
  publicURLPath,
}
