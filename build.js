import { minify } from 'html-minifier-terser';
import CleanCSS from 'clean-css';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const css = readFileSync('style.css', 'utf8');
const html = readFileSync('index.html', 'utf8');

const minCSS = new CleanCSS({ level: 2 }).minify(css).styles;
const htmlWithCSS = html.replace(
  '<link rel="stylesheet" href="style.css">',
  `<style>${minCSS}</style>`
);

const minHTML = await minify(htmlWithCSS, {
  collapseWhitespace: true,
  removeComments: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  minifyJS: true,
});

mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', minHTML);

const origBytes = Buffer.byteLength(html) + Buffer.byteLength(css);
const finalBytes = Buffer.byteLength(minHTML);
console.log(`src: ${origBytes}B → dist: ${finalBytes}B (${Math.round((1 - finalBytes / origBytes) * 100)}% smaller)`);
