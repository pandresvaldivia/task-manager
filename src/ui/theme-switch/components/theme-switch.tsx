'use theme';

import { MoonIcon, SunIcon } from '@/ui/shared/components/icons/solid';
import { Switch } from '@/ui/switch/components/switch';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(
    function setCurrentTheme() {
      setIsDarkMode(theme === 'dark');
    },
    [theme],
  );

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className='flex items-center justify-center gap-6 text-medium-grey py-4 ml-6 bg-light-grey dark:bg-very-dark-grey rounded-md'>
      <SunIcon height='20' width='20' className='size-5' />
      <Switch isChecked={isDarkMode} onCheckedChange={handleThemeChange} />
      <MoonIcon height='16' width='16' className='size-4' />
    </div>
  );
}
