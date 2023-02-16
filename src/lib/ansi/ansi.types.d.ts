export interface AnsiPalette {
  foreground: string;
  background: string;
  'background-hover': string;
  'background-selected': string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  'bright-black': string;
  'bright-red': string;
  'bright-green': string;
  'bright-yellow': string;
  'bright-blue': string;
  'bright-magenta': string;
  'bright-cyan': string;
  'bright-white': string;
}

export interface AnsiPart {
  styles: Array<string>;
  text: string;
}
