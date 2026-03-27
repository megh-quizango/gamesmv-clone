import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_AD_CLIENT = 'ca-pub-9014156375881181';
/** Quiz Store unit — matches working project */
const DEFAULT_AD_SLOT = '2021727598';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export type AdSenseProps = {
  className?: string;
  style?: React.CSSProperties;
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  /** Reserve space (e.g. sidebar 250px vs default 280px) */
  placeholderHeight?: string;
};

function placeholderForFormat(
  adFormat: AdSenseProps['adFormat'],
  override?: string,
): string {
  if (override) return override;
  if (adFormat === 'vertical') return '600px';
  if (adFormat === 'horizontal') return '90px';
  return '280px';
}

/**
 * Display ad: lazy-load via IntersectionObserver, retry until adsbygoogle + width ready.
 * Requires queue init + adsbygoogle.js in index.html.
 */
export function AdSense({
  className,
  style,
  adSlot,
  adFormat = 'auto',
  placeholderHeight,
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const pushedRef = useRef(false);
  const visibleRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const retryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const finalAdSlot = adSlot ?? DEFAULT_AD_SLOT;
  const containerHeight = placeholderForFormat(adFormat, placeholderHeight);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    };
  }, []);

  const loadAd = useCallback(() => {
    if (pushedRef.current || !adRef.current) return;

    const width = adRef.current.offsetWidth;
    if (width === 0) {
      setTimeout(loadAd, 200);
      return;
    }

    const tryPush = (): boolean => {
      try {
        const w = window as Window & { adsbygoogle?: Array<Record<string, unknown>> };
        if (typeof w.adsbygoogle === 'undefined') return false;
        w.adsbygoogle = w.adsbygoogle || [];
        w.adsbygoogle.push({});
        return true;
      } catch {
        return false;
      }
    };

    if (tryPush()) {
      pushedRef.current = true;
      setTimeout(() => setIsLoaded(true), 800);
      return;
    }

    let attempts = 0;
    retryIntervalRef.current = setInterval(() => {
      attempts++;
      if (tryPush()) {
        if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
        pushedRef.current = true;
        setTimeout(() => setIsLoaded(true), 800);
      } else if (attempts >= 25) {
        if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
        setIsLoaded(true);
      }
    }, 200);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;
    const el = adRef.current;
    if (!el) return;

    let cancelled = false;
    let scriptPoll: ReturnType<typeof setInterval> | null = null;

    const setupObserver = () => {
      if (cancelled) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !visibleRef.current) {
              visibleRef.current = true;
              setIsVisible(true);
              setTimeout(() => loadAd(), 100);
            }
          });
        },
        { rootMargin: '50px', threshold: 0.1 },
      );
      observerRef.current.observe(el);
    };

    if (typeof window.adsbygoogle !== 'undefined') {
      setupObserver();
    } else {
      scriptPoll = setInterval(() => {
        if (cancelled) return;
        if (typeof window.adsbygoogle !== 'undefined') {
          if (scriptPoll) clearInterval(scriptPoll);
          scriptPoll = null;
          setupObserver();
        }
      }, 100);
    }

    return () => {
      cancelled = true;
      if (scriptPoll) clearInterval(scriptPoll);
      if (observerRef.current && el) {
        observerRef.current.unobserve(el);
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [isMounted, loadAd]);

  useEffect(() => {
    if (!isVisible && isMounted && typeof window !== 'undefined') {
      const fallbackTimer = setTimeout(() => {
        if (!pushedRef.current && adRef.current) {
          const width = adRef.current.offsetWidth;
          if (width > 0) {
            visibleRef.current = true;
            setIsVisible(true);
            setTimeout(() => loadAd(), 100);
          }
        }
      }, 2000);
      return () => clearTimeout(fallbackTimer);
    }
  }, [isVisible, isMounted, loadAd]);

  if (!isMounted) {
    return (
      <div
        className={cn('relative flex w-full items-center justify-center', className)}
        style={{
          height: containerHeight,
          minHeight: containerHeight,
          ...style,
        }}
      >
        <span className="absolute text-xs text-neutral-400">Loading ad…</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={adRef}
        className={cn('relative flex w-full items-center justify-center', className)}
        style={{
          height: containerHeight,
          minHeight: containerHeight,
          ...style,
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: containerHeight,
            minHeight: containerHeight,
          }}
          data-ad-client={DEFAULT_AD_CLIENT}
          data-ad-slot={finalAdSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
        {!isLoaded && (
          <span className="absolute text-xs text-neutral-400">Loading ad…</span>
        )}
      </div>
    </div>
  );
}
