import { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-9014156375881181';
const AD_SLOT = '2021727598';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type Props = {
  className?: string;
};

/**
 * Auto responsive display unit. Requires `adsbygoogle.js` in index.html.
 * One push() per mounted instance.
 */
export function AdSense({ className }: Props) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className ?? ''}`.trim()}
      style={{ display: 'block' }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
