/**
 * @typedef {import('react').CSSProperties} CSSProperties
 * @typedef StickyProps
 * @property {function} [onSticky]
 * @property {CSSProperties} [style]
 * @property {number} [throttleDuration]
 * @property {JSX.Element|string} [children]
 * @typedef {StickyProps & React.HTMLAttributes<HTMLElement>} PopupProps
 */
/**
 * @param {StickyProps} props
 * @returns {JSX.Element}
 */
export function Sticky({ children, onSticky, style, throttleDuration, ...props }: StickyProps): JSX.Element;
export type CSSProperties = React.CSSProperties;
export type StickyProps = {
    onSticky?: Function;
    style?: CSSProperties;
    throttleDuration?: number;
    children?: JSX.Element | string;
};
export type PopupProps = StickyProps & React.HTMLAttributes<HTMLElement>;
import React = require("react");
