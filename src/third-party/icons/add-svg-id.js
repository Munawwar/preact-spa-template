// node.js script to add id to svg and remove fill attribute.
// (this is to allow the icon to be used from within a <use> tag)
// Usage: node add-svg-id.js <path to svg file or directory>
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const process = require('process');

const id = 'id';

const applySVGAttributes = (() => {
  const startTagRegex =
    /^\s*<svg((?:\s+[^\s/>"'=]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/i;
  const attrRegex =
    /\s+([^\s/>"'=]+)(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^>\s]+)))?/g;

  /**
   * @param {string} html
   * @param {{ [attr: string]: string | number | undefined | null }} overrideAttributes
   * @returns
   */
  return function applySVGAttributes(html, overrideAttributes) {
    const match = html.match(startTagRegex);
    if (!match) {
      return '';
    }

    const attributes = {};
    let attrMatch;
    // find attributes
    attrRegex.lastIndex = 0; // reset from previous use
    while ((attrMatch = attrRegex.exec(match[1]))) {
      let attrValue = attrMatch[2] || attrMatch[3] || attrMatch[4] || '';
      attributes[attrMatch[1]] = attrValue;
    }

    Object.entries(overrideAttributes).forEach(([key, value]) => {
      if (value === null) {
        delete attributes[key];
      } else if (value !== undefined) {
        attributes[key] = value;
      }
    });

    // serialize svg again
    const rest = html.slice(match[0].length);
    const svgAttr = Object.entries(attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    return `<svg${svgAttr ? ` ${svgAttr}` : ''}>${rest}`;
  };
})();

if (!process.argv[2]) {
  console.error(
    "You didn't specify a directory. node clean-svgs.js path/to/folder"
  );
  exit();
}

function cleanSvg(filePath) {
  const svgContent = fs.readFileSync(filePath, 'utf8');
  const newSvgContent = applySVGAttributes(svgContent, {
    // width: null,
    // height: null,
    fill: null,
    id,
  });

  if (!newSvgContent) {
    console.warn('Could not parse', filePath);
  } else if (newSvgContent !== svgContent) {
    fs.writeFileSync(filePath, newSvgContent, 'utf8');
    console.log('done', filePath);
  } else {
    console.log('already clean', filePath);
  }
}

const arg = process.argv[2];
if (!fs.existsSync(arg)) {
  console.error("directory/file doesn't exists");
  exit();
}

const stats = fs.lstatSync(arg);
if (stats.isDirectory()) {
  const files = fs.readdirSync(arg);

  files.forEach((filePath) => {
    if (!filePath.toLowerCase().endsWith('.svg')) return;
    cleanSvg(path.join(arg, filePath));
  });
} else if (stats.isFile()) {
  cleanSvg(arg);
} else {
  console.log('Unknown error');
}
