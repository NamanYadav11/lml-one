/* The name is always the wordmark, never typed: every visible "LML" becomes the logo.
   Applied to string children of host elements at JSX creation time. */
import { jsx } from 'react/jsx-runtime';
import { LMLD } from '../paths.js';

const SKIP = new Set(['svg', 'path', 'text', 'textarea', 'input', 'script', 'style', 'title', 'option']);
const RE = /\bLML\b/;

const mark = i => jsx('svg', { className: 'lm', viewBox: '306 180 809 315', role: 'img', 'aria-label': 'LML', children: jsx('path', { d: LMLD }) }, 'lm' + i);

function brandString(s) {
  if (!RE.test(s)) return s;
  const out = [];
  s.split(/\bLML\b/).forEach((p, i) => { if (i) out.push(mark(i)); if (p) out.push(p); });
  return out;
}

function brandNode(c) {
  if (typeof c === 'string') return brandString(c);
  if (Array.isArray(c)) return c.map(brandNode);
  return c;
}

export function brandProps(type, props) {
  if (typeof type !== 'string' || SKIP.has(type) || props == null || props.children == null) return props;
  const children = brandNode(props.children);
  return children === props.children ? props : { ...props, children };
}
