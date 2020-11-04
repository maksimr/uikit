/**
 * @typedef {import('react').CSSProperties} CSSProperties
 * @typedef PopupBaseProps
 * @property {Array<PopupDirection> | PopupDirection} [direction]
 * @property {HTMLElement} anchorNode
 * @property {HTMLElement} [parentNode]
 * @property {boolean} [resizable]
 * @property {JSX.Element} [children]
 * @typedef {PopupBaseProps & React.HTMLAttributes<HTMLElement>} PopupProps
 */
/**
 * @param {PopupProps} props
 * @returns {React.ReactPortal}
 */
export function Popup(props: PopupProps): React.ReactPortal;
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
export type PopupDirection = number;
export namespace PopupDirection {
    const BOTTOM_LEFT: number;
    const BOTTOM_RIGHT: number;
    const BOTTOM_CENTER: number;
    const TOP_LEFT: number;
    const TOP_RIGHT: number;
    const TOP_CENTER: number;
    const LEFT_TOP: number;
    const LEFT_BOTTOM: number;
    const LEFT_CENTER: number;
    const RIGHT_TOP: number;
    const RIGHT_BOTTOM: number;
    const RIGHT_CENTER: number;
}
export type CSSProperties = React.CSSProperties;
export type PopupBaseProps = {
    direction?: Array<PopupDirection> | PopupDirection;
    anchorNode: HTMLElement;
    parentNode?: HTMLElement;
    resizable?: boolean;
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
