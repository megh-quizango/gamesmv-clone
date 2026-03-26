import { useLayoutEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-9014156375881181';
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
 * Auto responsive display unit. Requires queue init + adsbygoogle.js in index.html.
 * useLayoutEffect runs after the <ins> is in the DOM; one push() per mounted instance.
 */
export function AdSense({ className }: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useLayoutEffect(() => {
    if (!insRef.current || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className ?? ''}`.trim()}
      style={{ display: 'block' }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
