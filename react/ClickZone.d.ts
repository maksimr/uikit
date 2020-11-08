/**
 * @typedef ClickZoneProps
 * @property {function} [onClickAway]
 * @property {JSX.Element} [children]
 */
/**
 * @param {ClickZoneProps} props
 * @returns {JSX.Element}
 */
export function ClickZone({ onClickAway, children }: ClickZoneProps): JSX.Element;
export type ClickZoneProps = {
    onClickAway?: Function;
    children?: JSX.Element;
};
