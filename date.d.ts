/**
 * @typedef DateParseOptions
 * @property {Date} [previousDate]
 * @property {string} [timezone] Parse date string in the specific timezone to the date in local timezone
 * @property {object} [dateTimeLocale]
 */
/**
 * @param {string} dateStr
 * @param {string} format
 * @param {DateParseOptions} [options]
 * @returns {Date|null}
 */
export function parse(dateStr: string, format: string, options?: DateParseOptions): Date | null;
/**
 * @param {Date|number} date
 * @param {string|function} [format]
 * @param {string} [timezone]
 * @param {object} [locale]
 * @returns {string|number|Date|*}
 */
export function dateFilter(date: Date | number, format?: string | Function, timezone?: string, locale?: object): string | number | Date | any;
/**
 * @param {Date} date
 * @param {string} timezone
 * @param {boolean=} reverse
 * @returns {Date}
 */
export function convertTimezoneToLocal(date: Date, timezone: string, reverse?: boolean | undefined): Date;
export namespace dateTimeLocale {
    const ERANAMES: string[];
    const ERAS: string[];
    const AMPMS: string[];
    const DAY: string[];
    const SHORTDAY: string[];
    const MONTH: string[];
    const SHORTMONTH: string[];
    const STANDALONEMONTH: string[];
    const FIRSTDAYOFWEEK: number;
    const WEEKENDRANGE: number[];
    const fullDate: string;
    const longDate: string;
    const medium: string;
    const mediumDate: string;
    const mediumTime: string;
    const short: string;
    const shortDate: string;
    const shortTime: string;
}
export type DateParseOptions = {
    previousDate?: Date;
    /**
     * Parse date string in the specific timezone to the date in local timezone
     */
    timezone?: string;
    dateTimeLocale?: object;
};
