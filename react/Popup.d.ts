/**
 * @typedef {import('react').CSSProperties} CSSProperties
 * @typedef PopupBaseProps
 * @property {PopupDirection} [direction]
 * @property {HTMLElement} [anchorNode]
 * @property {HTMLElement} [parentNode]
 * @property {boolean} [resizable]
 * @property {CSSProperties} [style]
 * @property {JSX.Element} [children]
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
export namespace PopupDirection {
    const BOTTOM_LEFT: string;
    const BOTTOM_RIGHT: string;
    const TOP_LEFT: string;
    const TOP_RIGHT: string;
    const LEFT_TOP: string;
    const LEFT_BOTTOM: string;
    const RIGHT_TOP: string;
    const RIGHT_BOTTOM: string;
}
export type CSSProperties = React.CSSProperties;
export type PopupBaseProps = {
    direction?: PopupDirection;
    anchorNode?: HTMLElement;
    parentNode?: HTMLElement;
    resizable?: boolean;
    style?: CSSProperties;
    children?: JSX.Element;
};
export type PopupProps = PopupBaseProps & React.HTMLAttributes<HTMLElement>;
export type PopupProviderProps = {
    value: {
        parentNode: HTMLElement;
    };
    children?: JSX.Element;
};
import React from "react";
