'use strict';

const Bluebird = require('bluebird'); // eslint-disable-line import/order
const path = require('path');
const os = require('os');
const cp = require('child_process');

const fs = Bluebird.promisifyAll(require('fs'));
const rimraf = Bluebird.promisify(require('rimraf'));

const tmpFileBaseName = '';

function exec(command, options) {
  return new Promise((resolve, reject) => {
    cp.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`error executing ${command}: ${stderr.toString() || stdout.toString()}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

function leftPad(str, length, padder) {
  str = String(str);
  while (str.length < length) {
    str = padder + str;
  }
  return str;
}

function hasPrecisionGreaterThan(number, amount) {
  const raised = Math.pow(10, amount) * number;
  return Math.abs(Math.floor(raised) - raised) > 1e-6;
}

function anyHavePrecisionGreaterThan(numbers, amount) {
  if (typeof numbers === 'number') {
    return hasPrecisionGreaterThan(numbers, amount);
  }
  if (numbers instanceof Array) {
    return numbers.some(n => anyHavePrecisionGreaterThan(n, amount));
  }

  return false;
}

function symbolToTex(data, rounding) {
  if (typeof data === 'string') {
    return data;
  }

  if (typeof data === 'number') {
    return hasPrecisionGreaterThan(data, rounding) ? data.toFixed(rounding) : String(data);
  }

  if (data === null || typeof data === 'boolean') {
    return `\\mathbf{${data}}`;
  }

  if (data instanceof Array) {
    if (data[0] instanceof Array) {
      data = data.map(row => row.map(r => symbolToTex(r, rounding)).join(' & '));
    }

    return `\\begin{bmatrix}
      ${data.map(r => symbolToTex(r, rounding)).join('\\\\\n')}
    \\end{bmatrix}`;
  }

  return '\\left\\{' +
    Object.keys(data)
      .map(key => `\\mathrm{${key}\\!:}\\,${symbolToTex(data[key], rounding)}`)
      .join(', ') +
    '\\right\\}';
}

const startBlock = `\\begin{sylvEquation}`;
const endBlock = `\\end{sylvEquation}`;

class Renderer {
  constructor() {
    this._equations = [];
    this._prefix = 'equation-';
    this._format = 'png';
    this._precision = 2;
  }

  /**
   * Adds a new equation to be rendered and returns the filename it'll be
   * rendered to in the renderer's base directory.
   * @param  {Object[]} example
   * @return {String}
   */
  push(example) {
    this._equations.push(
      example
        .map(eg => {
          const approx = anyHavePrecisionGreaterThan(eg.retValue, this._precision);
          return symbolToTex(eg.callee) +
            `\\!\\!{.}\\mathrm{${symbolToTex(eg.method)}}` +
            `(${eg.args.map(symbolToTex).join(', ')})&` +
            (approx ? '\\approx' : '=') +
            symbolToTex(eg.retValue, this._precision);
        })
        .join('\\\\\n')
    );

    return `${this._prefix}${leftPad(this.length() - 1, 4, 0)}.${this._format}`;
  }

  /**
   * Returns the number of equations to be rendered.
   * @return {Number}
   */
  length() {
    return this._equations.length;
  }

  /**
   * Renders all equations into the target directory. Internals of this method
   * are inspired by http://tex.stackexchange.com/a/287501.
   * @param  {String} dir
   * @return {Promise}
   */
  render(dir) {
    if (this._equations.length === 0) {
      return Bluebird.resolve();
    }

    const tmpdir = path.join(os.tmpdir(), `${tmpFileBaseName}${Math.random()}`);
    const targetFmt = path.join(dir, `${this._prefix}%04d.${this._format}`);
    const content = `
      \\documentclass[multi={sylvEquation}]{standalone}
      \\usepackage{amsmath}
      \\newenvironment{sylvEquation}
        {$\\displaystyle\\begin{aligned}}
        {\\end{aligned}$}
      \\begin{document}
      ${startBlock}${this._equations.join(endBlock + startBlock)}${endBlock}
      \\end{document}
    `;

    return fs.mkdirAsync(tmpdir)
      .then(() => fs.writeFileAsync(path.join(tmpdir, 'input.tex'), content))
      .then(() => exec('pdflatex -interaction nonstopmode input.tex', { cwd: tmpdir }))
      .then(() => exec(`convert -density 144 -trim input.pdf -quality 100 ${targetFmt}`, { cwd: tmpdir }))
      .finally(() => rimraf(tmpdir));
  }
}

exports.Renderer = Renderer;
