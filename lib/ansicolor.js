/**
 * @typedef {
 * | 0 // all attributes off
 * | 1 // bold on
 * | 4 // underline on
 * | 5 // blink on
 * | 21 // bold off
 * | 24 // underline off
 * | 25 // blink off
 * | 30 // bloack foreground
 * | 31 // red foreground
 * | 32 // green foreground
 * | 33 // yellow foreground
 * | 34 // blue foreground
 * | 35 // magenta foreground
 * | 36 // cyan foreground
 * | 37 // white foreground
 * | 39 // default foreground
 * | 40 // black background
 * | 41 // red background
 * | 42 // green background
 * | 43 // yellow background
 * | 44 // blue background
 * | 45 // magenta background
 * | 46 // cyan background
 * | 47 // white background
 * | 49 // default background
 * | 90 // gray foreground
 * | 91 // light red foreground
 * | 92 // light green foreground
 * | 93 // light yellow foreground
 * | 94 // light blue foreground
 * | 95 // light magenta foreground
 * | 96 // light cyan foreground
 * | 97 // light white foreground
 * | 100 // gray background
 * | 101 // light red background
 * | 102 // light green background
 * | 103 // light yellow background
 * | 104 // light blue background
 * | 105 // light magenta background
 * | 106 // light cyan background
 * | 107 // light white background
 * | 'bold'
 * | 'underline'
 * | 'blink'
 * | 'red'
 * | 'green'
 * | 'yellow'
 * | 'blue'
 * | 'magenta'
 * | 'cyan'
 * | 'white'
 * | 'default'
 * | 'gray'
 * | 'light-red'
 * | 'light-green'
 * | 'light-yellow'
 * | 'light-blue'
 * | 'light-magenta'
 * | 'light-cyan'
 * | 'light-white'
 * | 'red-background'
 * | 'green-background'
 * | 'yellow-background'
 * | 'blue-background'
 * | 'magenta-background'
 * | 'cyan-background'
 * | 'white-background'
 * | 'default-background'
 * | 'gray-background'
 * | 'light-red-background'
 * | 'light-green-background'
 * | 'light-yellow-background'
 * | 'light-blue-background'
 * | 'light-magenta-background'
 * | 'light-cyan-background'
 * | 'light-white-background'
 * | number 
 * } AnsicolorAttribute
 */
export function ansicolor(/**@type {string}*/ str, /** @type {AnsicolorAttribute|AnsicolorAttribute[]} **/ attr) {
  if (global.process && !global.process.stdout.isTTY) {
    return str;
  }

  const toAnsiColorCode = (/**@type {AnsicolorAttribute}*/ attr) => {
    switch (attr) {
      case 'bold': attr = 1; break;
      case 'underline': attr = 4; break;
      case 'blink': attr = 5; break;
      case 'red': attr = 31; break;
      case 'green': attr = 32; break;
      case 'yellow': attr = 33; break;
      case 'blue': attr = 34; break;
      case 'magenta': attr = 35; break;
      case 'cyan': attr = 36; break;
      case 'white': attr = 37; break;
      case 'default': attr = 39; break;
      case 'gray': attr = 90; break;
      case 'light-red': attr = 91; break;
      case 'light-green': attr = 92; break;
      case 'light-yellow': attr = 93; break;
      case 'light-blue': attr = 94; break;
      case 'light-magenta': attr = 95; break;
      case 'light-cyan': attr = 96; break;
      case 'light-white': attr = 97; break;
      case 'red-background': attr = 41; break;
      case 'green-background': attr = 42; break;
      case 'yellow-background': attr = 43; break;
      case 'blue-background': attr = 44; break;
      case 'magenta-background': attr = 45; break;
      case 'cyan-background': attr = 46; break;
      case 'white-background': attr = 47; break;
      case 'default-background': attr = 49; break;
      case 'gray-background': attr = 100; break;
      case 'light-red-background': attr = 101; break;
      case 'light-green-background': attr = 102; break;
      case 'light-yellow-background': attr = 103; break;
      case 'light-blue-background': attr = 104; break;
      case 'light-magenta-background': attr = 105; break;
      case 'light-cyan-background': attr = 106; break;
      case 'light-white-background': attr = 107; break;
    }

    if (isNaN(attr)) return null;

    return Number(attr);
  };

  const value = Array.isArray(attr) ?
    attr.map(toAnsiColorCode).filter((it) => it !== null).join(';') :
    toAnsiColorCode(attr);

  return value ? `\x1b[${value}m${str}\x1b[0m` : str;
}