const path = require('path');
const fs = require('fs');
const Latex = require('./latex');
const examples = require('./examples');

const skipEquations = process.argv.indexOf('--no-equations') !== -1;
const equationRenderer = new Latex.Renderer();

let target;

/**
 * Rewrites the fonts in the output CSS to replace them with our own.
 * Do this instead of overriding for load times and reduction in hackery.
 */
function rewriteFonts() {
  const style = path.join(target, 'css', 'style.css');
  const css = fs.readFileSync(style)
    .toString()
    .replace(/@import url\(.*?Roboto.*?\);/, `@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600|Source+Code+Pro:400,600');`)
    .replace(/Roboto/g, 'Open Sans');

  fs.writeFileSync(style, `
    ${css}

    code {
      font-family: 'Source Code Pro', monospace;
    }

    pre > code {
      padding: 0.75em 1em;
      line-height: 1.5em;
    }

    ul, ol {
      margin-bottom: 15px;
    }

    hr {
      border: 0;
      height: 2px;
      background: #f5f5f5;
      margin: 15px 0;
    }

    blockquote {
      border-left: 3px solid #eee;
      padding-left: 0.75em;
      margin-bottom: 15px;
      color: #999;
      font-size: 0.9em;
    }

    img.equation {
      box-shadow: none !important;
      margin: 0 auto;
      display: block;
    }
  `);
}

exports.onHandleHTML = ev => {
  if (skipEquations || !ev.data.fileName.startsWith('class')) {
    return;
  }

  let match;
  while ((match = (/\$example ([a-z.]+)/i.exec(ev.data.html))) !== null) {
    const example = examples[match[1]];
    if (!example) {
      throw new Error(`Could not find example ${match[1]}, try rerunning tests?`);
    }

    ev.data.html = ev.data.html.slice(0, match.index) +
      `<img class="equation" src="./image/${equationRenderer.push(example)}" alt="Equation">` +
      ev.data.html.slice(match.index + match[0].length);
  }
};

exports.onHandleTag = ev => {
  for (const tag of ev.data.tag) {
    tag.importPath = 'sylvester';
  }
};

exports.onHandleConfig = ev => {
  target = path.join(process.cwd(), ev.data.config.destination);
};

exports.onComplete = () => {
  rewriteFonts();
  console.log(`latex: rendering ${equationRenderer.length()} equations...`);
  equationRenderer.render(path.join(target, 'image'));
};
