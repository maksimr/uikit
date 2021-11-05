const MILLISECONDS_PER_SEC = 1000;
const MILLISECONDS_PER_MIN = MILLISECONDS_PER_SEC * 60;
const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MIN * 60;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;

/**
 * @typedef DurationOptions
 * @property {number} [days]
 * @property {number} [hours]
 * @property {number} [minutes]
 * @property {number} [seconds]
 * @property {number} [milliseconds]
 */
export class Duration {
  /**
   * @param {DurationOptions|number} options Duration description or timestamp
   */
  static of(options) {
    options = typeof options === 'number' ? { milliseconds: options } : options;
    return new Duration(options);
  }

  constructor(
    /** @type {DurationOptions} */
    {
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
      milliseconds = 0
    }
  ) {

    /**@type {number}*/
    this.value =
      days * MILLISECONDS_PER_DAY +
      hours * MILLISECONDS_PER_HOUR +
      minutes * MILLISECONDS_PER_MIN +
      seconds * MILLISECONDS_PER_SEC +
      milliseconds;
  }

  /**
   * @description The number of milliseconds spanned by this Duration
   * @returns {number}
   */
  get inMilliseconds() {
    return this.in(1);
  }

  /**
   * @description The number of whole seconds spanned by this Duration
   * @returns {number}
   */
  get inSeconds() {
    return this.in(MILLISECONDS_PER_SEC);
  }

  /**
   * @description The number of whole minutes spanned by this Duration
   * @returns {number}
   */
  get inMinutes() {
    return this.in(MILLISECONDS_PER_MIN);
  }

  /**
   * @description The number of whole hours spanned by this Duration
   * @returns {number}
   */
  get inHours() {
    return this.in(MILLISECONDS_PER_HOUR);
  }

  /**
   * @description The number of whole days spanned by this Duration
   * @returns {number}
   */
  get inDays() {
    return this.in(MILLISECONDS_PER_DAY);
  }

  /**
   * @description Whether this Duration is negative
   * @returns {boolean}
   */
  get isNegative() {
    return this.value < 0;
  }

  /**
   * @description Creates a new Duration representing the absolute length of this Duration
   * @returns {Duration}
   */
  abs() {
    return Duration.of(Math.abs(this.value));
  }

  /**
   * @description Compares this Duration to other, returning zero if the values are equal
   * @param {Duration} other
   * @returns {number}
   */
  compareTo(other) {
    return this.value - other.value;
  }

  /**
   * @param {number} unit 
   * @returns {number}
   */
  in(unit) {
    return Math.floor(this.value / unit);
  }

  /**
   * @returns {number}
   */
  valueOf() {
    return this.value;
  }
}