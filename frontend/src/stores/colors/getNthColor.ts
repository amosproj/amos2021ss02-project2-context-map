import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '@material-ui/core/colors';

// Imported manually since color "common" is no real color.
/**
 * Contains all colors palettes.
 */
export const colorPalettes = [
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
] as { [shade: number]: string }[];
/**
 * Contains all wanted shades in a particular order to achieve a good
 * color distribution.
 */
const shades = [500, 900, 200, 800, 300, 700, 400, 600];
/**
 * Number of different colors
 */
export const nAvailableColors = colorPalettes.length * shades.length;

/**
 * Returns the n-th available color.
 * Reiterates the available colors if all colors are used.
 * @returns color as hex-string (i.e. '#ABCDEF')
 */
export default function getNthColor(n: number): string {
  // eslint-disable-next-line no-param-reassign -- make it positive
  while (n < 0) n += nAvailableColors;
  // eslint-disable-next-line no-param-reassign
  n %= nAvailableColors;

  const colorBase = colorPalettes[n % colorPalettes.length];
  const colorShade =
    shades[Math.floor(n / colorPalettes.length) % shades.length];

  return colorBase[colorShade];
}
