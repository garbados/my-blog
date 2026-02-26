const marked = require('marked')

const renderer = new marked.Renderer()

renderer.link = function ({ href, text }) {
  return `<a target="_blank" href="${href}">${text}` + '</a>'
}

marked.use({
  breaks: true,
  renderer
})

module.exports = marked
