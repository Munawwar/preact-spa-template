import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { publicURLPath } from './paths.js'
import http from 'node:http';
import { exec as preactIsoUrlPatternMatch } from 'preact-iso/router'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 5173;

const app = express()
// we need to create a server ourselves if we want to use HMR server
const server = http.createServer(app);

let vite
let clientSideManagedRoutes;
let viteProdManifest;
// On local, use vite's middlewares
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: {
        server,
      }
    },
    appType: 'custom',
    base: '/',
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  app.use(compression())
  app.use(
    publicURLPath,
    express.static(path.resolve(__dirname, 'dist'), {
      maxAge: '1w',
      index: false,
    })
  )
  clientSideManagedRoutes = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dist/routes.json'), 'utf-8'))
  viteProdManifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dist/.vite/manifest.json'), 'utf-8'))
}

app.use('*', async (req, res, next) => {
  try {
    const url = req.originalUrl;

    let template
    let html;
    if (!isProduction) {
      // Always read fresh template in development
      template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      html = template.replace('<!-- ssr-head-placeholder -->', '')
    } else {
      template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8')
      // TODO: preload mode JS and add fetches
      const {
        title,
        Component: entryFileName
      } = clientSideManagedRoutes.find((route) => preactIsoUrlPatternMatch(req.path, route.path, { params: {} })) || {};
      const manifestEntry = viteProdManifest[entryFileName];
      const preloadJS = (manifestEntry?.imports || [])
        .concat(manifestEntry?.file)
        .filter(file => file && !file.endsWith('.html')) // why are .html files in manifest imports list?
        .map((file) => `${publicURLPath}/${file}`);
      const preloadCSS = (manifestEntry?.css || [])
        .map((file) => `${publicURLPath}/${file}`);
      html = template.replace('<!-- ssr-head-placeholder -->', [
        title ? `<title>${title}</title>` : '',
        ...preloadJS.map((js) => `<link rel="modulepreload" crossorigin href="${js}">`),
        preloadCSS.map((css) => `<link rel="stylesheet" crossorigin href="${css}" as="style">`),
      ].join('\n'))
    }

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

server.listen(PORT, 'localhost')
server.on('listening', () => {
  console.log(`Listening on http://localhost:${PORT}`)
})