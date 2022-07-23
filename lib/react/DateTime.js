import React, { createContext, useContext } from 'react';
import { strftime, dateTimeLocale } from '../date';

const DateTimeLocale = createContext(/**@type {import('../date').DateTimeLocale}*/(dateTimeLocale));

/**
 * @typedef DateTimeProviderProps
 * @property {import('../date').DateTimeLocale} value
 * @property {React.ReactNode} [children]
 */
/**
 * @param {DateTimeProviderProps} props
 * @returns {JSX.Element}
 */
export function DateTimeProvider({ value, children }) {
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
 * @returns {import('react').ReactElement}
 */
export function DateTime({ date, format, timezone }) {
  const locale = useDateTimeLocale();
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
  return /**@type {import('react').ReactElement}*/(/**@type {unknown}*/(
    strftime(date, format, timezone, locale)
  ));
}
