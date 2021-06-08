/**
 * Returns black or white for the text color depending on the input background
 * color.
 * @param backgroundColor
 */
import { common } from '@material-ui/core/colors';
import { ArgumentError } from '../../shared/errors';

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  if (hex.match(/#[0-9a-fA-F]{6}/i)) {
    // Background color is like #123456
    return {
      r: parseInt(hex.substr(1, 2), 16),
      g: parseInt(hex.substr(3, 2), 16),
      b: parseInt(hex.substr(5, 2), 16),
    };
  }
  if (hex.match(/#[0-9a-fA-F]{3}/i)) {
    // Background color is like #135
    const r = hex.substr(1, 1);
    const g = hex.substr(1, 1);
    const b = hex.substr(1, 1);
    return {
      r: parseInt(r + r, 16),
      g: parseInt(g + g, 16),
      b: parseInt(b + b, 16),
    };
  }
  throw new ArgumentError('Argument is no hex color');
}

/**
 * Returns black or white as foreground color depending on the background
 * color.
 *
 * Implements idea from {@link https://www.w3.org/TR/AERT/#color-contrast}
 * ("Ensure that foreground and background color combinations provide
 * sufficient contrast...")
 * @param backgroundColor color for that a contrast color should be returned
 * @returns foregroundColor color that can be used as foreground or text color
 * @throws {@link ArgumentError} if backgroundColor is not a hex string
 */
export default function getTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  return brightness > 125 ? common.black : common.white;
}
