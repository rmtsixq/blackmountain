// Copies the Vite build into Vercel's Build Output API folder. npm runs this
// from the package root; INIT_CWD is wherever Vercel started the build, which
// may be a subfolder if the project's Root Directory points there.
import fs from 'node:fs'
import path from 'node:path'

const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const dist = path.join(root, 'dist')
const targets = new Set([root, process.env.INIT_CWD || root])

for (const dir of targets) {
  const out = path.join(dir, '.vercel/output')
  fs.rmSync(out, { recursive: true, force: true })
  fs.mkdirSync(out, { recursive: true })
  fs.cpSync(dist, path.join(out, 'static'), { recursive: true })
  fs.writeFileSync(path.join(out, 'config.json'), JSON.stringify({ version: 3 }))
  if (dir !== root) fs.cpSync(dist, path.join(dir, 'dist'), { recursive: true })
  console.log('Vercel output written to', out)
}
