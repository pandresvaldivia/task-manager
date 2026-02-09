import { Theme } from '../interfaces/theme';

export function isDarkTheme(theme?: string) {
  return theme === Theme.DARK;
}
