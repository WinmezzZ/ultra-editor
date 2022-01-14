import { useThemeConfig } from '@docusaurus/theme-common';
import { useEffect, useState } from 'react';

export function useColorTheme() {
  const {
    colorMode: { defaultMode },
  } = useThemeConfig();
  const [theme, setTheme] = useState(defaultMode);

  useEffect(() => {
    const targetNode = document.documentElement;
    const config = { attributes: true };

    const callback = function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          const newTheme = targetNode.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

          setTheme(newTheme);
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}
