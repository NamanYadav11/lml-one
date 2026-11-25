import { Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { brandProps } from './mark.js';

export { Fragment };
export const jsx = (type, props, key) => _jsx(type, brandProps(type, props), key);
export const jsxs = (type, props, key) => _jsxs(type, brandProps(type, props), key);
