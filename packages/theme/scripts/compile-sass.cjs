const fs = require('node:fs/promises')
const sass = require('sass-embedded')

const result = sass.compile('./packages/theme/styles/doc-content.scss')

fs.writeFile('./packages/theme/styles/doc-content.css', result.css)
