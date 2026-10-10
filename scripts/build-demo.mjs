// Builds a single, self-contained HTML file of the app (dist-demo/mynexora.html) that can be
// shared as a static page: CSS and JS are inlined, routing stays in memory.
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

execSync('vite build --mode demo', { stdio: 'inherit' })

const dir = 'dist-demo/assets'
const files = readdirSync(dir)
const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(`${dir}/${f}`, 'utf8'))
const js = files.filter((f) => f.endsWith('.js')).map((f) => readFileSync(`${dir}/${f}`, 'utf8'))
if (js.length !== 1) throw new Error(`Expected one JS bundle, found ${js.length}`)

// A literal "</script" inside the bundle would end the inline script early.
const script = js[0].replace(/<\/script/gi, '<\\/script')

const html = `<title>myNexora</title>
<meta name="description" content="myNexora — employee app demo with fictional data">
<meta name="theme-color" content="#134D71">
<style>${css.join('\n')}</style>
<div id="root"></div>
<script type="module">${script}</script>
`
writeFileSync('dist-demo/mynexora.html', html)
console.log(`dist-demo/mynexora.html: ${(html.length / 1024).toFixed(0)} kB`)
