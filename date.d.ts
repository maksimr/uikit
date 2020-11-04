/**
 * @param {Date|number} date
 * @param {string|function} [format]
 * @param {string} [timezone]
 * @param {object} [locale]
 * @returns {string|number|Date|*}
 */
export function dateFilter(date: Date | number, format?: string | Function, timezone?: string, locale?: object): string | number | Date | any;
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
