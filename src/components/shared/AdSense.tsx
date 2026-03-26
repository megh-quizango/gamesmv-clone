import { useEffect, useRef } from 'react';

import { ADSENSE_CLIENT_ID, loadAdsenseScript } from '@/lib/adsense-loader';
const AD_SLOT = '2021727598';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type Props = {
  className?: string;
};

/**
 * Responsive display unit. Script loads once, then each instance pushes after load
 * (avoids races with async head scripts and React Strict Mode double-mount).
 */
export function AdSense({ className }: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    let cancelled = false;

    loadAdsenseScript().then(() => {
      if (cancelled || pushed.current || !insRef.current) return;
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* ignore */
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className ?? ''}`.trim()}
      style={{ display: 'block', minWidth: 320, minHeight: 50 }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={AD_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
