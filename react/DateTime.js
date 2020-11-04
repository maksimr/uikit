import React, { createContext, useContext } from 'react';
import { dateFilter, dateTimeLocale } from '../date';
const DateTimeLocale = createContext(dateTimeLocale);
export function DateTimeLayer({ value, children }) {
    return (React.createElement(DateTimeLocale.Provider, { value: value }, children));
}
export function useDateTimeLocale() {
    return useContext(DateTimeLocale);
}
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
export function DateTime({ date, format, timezone }) {
    const locale = useDateTimeLocale();
    return dateFilter(date, format, timezone, locale);
}
