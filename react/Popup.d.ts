/**
 * @typedef {import('react').CSSProperties} CSSProperties
 * @typedef PopupBaseProps
 * @property {PopupDirection} [direction]
 * @property {HTMLElement} [anchorNode]
 * @property {HTMLElement} [parentNode]
 * @property {boolean} [resizable]
 * @property {CSSProperties} [style]
 * @property {JSX.Element|string} [children]
 * @typedef {PopupBaseProps & React.HTMLAttributes<HTMLElement>} PopupProps
 */
/**
 * @param {PopupProps} props
 * @returns {React.ReactPortal|JSX.Element}
 */
export function Popup(props: PopupProps): React.ReactPortal | JSX.Element;
/**
 * @param {PopupProps} props
 * @returns {React.ReactPortal}
 */
export function PopupPortal({ direction, anchorNode, parentNode, resizable, style, children, ...restProps }: PopupProps): React.ReactPortal;
/**
 * @typedef PopupProviderProps
 * @property {{parentNode: HTMLElement}} value
 * @property {JSX.Element} [children]
 */
/**
 * @param {PopupProviderProps} props
 * @returns {JSX.Element}
 */
export function PopupProvider({ value, children }: PopupProviderProps): JSX.Element;
export type PopupDirection = string;
/**
 * @enum {string}
 */
export const PopupDirection: {
    BOTTOM_LEFT: string;
    BOTTOM_RIGHT: string;
    TOP_LEFT: string;
    TOP_RIGHT: string;
    LEFT_TOP: string;
    LEFT_BOTTOM: string;
    RIGHT_TOP: string;
    RIGHT_BOTTOM: string;
};
export type CSSProperties = React.CSSProperties;
export type PopupBaseProps = {
    direction?: PopupDirection;
    anchorNode?: HTMLElement;
    parentNode?: HTMLElement;
    resizable?: boolean;
    style?: CSSProperties;
    children?: JSX.Element | string;
};
export type PopupProps = PopupBaseProps & React.HTMLAttributes<HTMLElement>;
export type PopupProviderProps = {
    value: {
        parentNode: HTMLElement;
    };
    children?: JSX.Element;
};
import React from "react";
