const SCRIPT_MARKER = 'data-adsbygoogle-app';

/** Must match the publisher ID in AdSense and `data-ad-client` on each unit. */
export const ADSENSE_CLIENT_ID = 'ca-pub-9014156375881181';

let scriptPromise: Promise<void> | null = null;

/**
 * Loads `adsbygoogle.js` once and resolves when the script has executed.
 * Inline queue in index.html must run first: `window.adsbygoogle = window.adsbygoogle || []`.
 */
export function loadAdsenseScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    window.adsbygoogle = window.adsbygoogle || [];

    const existing = document.querySelector<HTMLScriptElement>(
      `script[${SCRIPT_MARKER}]`,
    );
    if (existing) {
      const finish = () => resolve();
      if (existing.dataset.loaded === '1') {
        queueMicrotask(finish);
        return;
      }
      existing.addEventListener('load', () => {
        existing.dataset.loaded = '1';
        finish();
      });
      existing.addEventListener('error', finish);
      return;
    }

    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT_ID)}`;
    s.setAttribute(SCRIPT_MARKER, '1');
    s.addEventListener('load', () => {
      s.dataset.loaded = '1';
      resolve();
    });
    s.addEventListener('error', () => resolve());
    document.head.appendChild(s);
  });

  return scriptPromise;
}
