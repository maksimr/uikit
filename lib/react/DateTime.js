import React, { createContext, useContext } from 'react';
import { dateFilter, dateTimeLocale } from '../date';

const DateTimeLocale = createContext(/**@type {import('../date').DateTimeLocale}*/(dateTimeLocale));

/**
 * @typedef DateTimeLayerProps
 * @property {import('../date').DateTimeLocale} value
 * @property {React.ReactNode} [children]
 */
/**
 * @param {DateTimeLayerProps} props
 * @returns {JSX.Element}
 */
export function DateTimeLayer({ value, children }) {
  return (
    <DateTimeLocale.Provider value={value}>
      {children}
    </DateTimeLocale.Provider>
  );
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
