export function DateTimeLayer({ value, children }: {
    value: any;
    children: any;
}): JSX.Element;
export function useDateTimeLocale(): {
    ERANAMES: string[];
    ERAS: string[];
    AMPMS: string[];
    DAY: string[];
    SHORTDAY: string[];
    MONTH: string[];
    SHORTMONTH: string[];
    STANDALONEMONTH: string[];
    FIRSTDAYOFWEEK: number;
    WEEKENDRANGE: number[];
    fullDate: string;
    longDate: string;
    medium: string;
    mediumDate: string;
    mediumTime: string;
    short: string;
    shortDate: string;
    shortTime: string;
};
/**
 * @typedef DateTimeProps
 * @property {Date|number} date
 * @property {string} [format]
 * @property {string} [timezone]
 */
/**
 * @param {DateTimeProps} props
 * @returns {JSX.Element}
 */
export function DateTime({ date, format, timezone }: DateTimeProps): JSX.Element;
export type DateTimeProps = {
    date: Date | number;
    format?: string;
    timezone?: string;
};
