import { useEffect, useCallback, useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { GameIconImg } from '@/components/shared/GameIconImg';
import { getRepresentativeIconForCategorySlug } from '@/lib/category-filter';

/** Full CATEGORY drawer — order matches reference layout */
const SIDEBAR_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'running', label: 'Run' },
  { slug: 'talking', label: 'Talking' },
  { slug: 'gta', label: 'GTA' },
  { slug: 'impostor', label: 'Impostor' },
  { slug: 'girl', label: 'Girl' },
  { slug: 'lego', label: 'LEGO' },
  { slug: 'cars', label: 'Cars' },
  { slug: 'stickman', label: 'Stickman' },
  { slug: 'antistress', label: 'Antistress' },
  { slug: 'io', label: '.IO' },
  { slug: 'horror', label: 'Horror' },
  { slug: 'survival', label: 'Survival' },
  { slug: 'sports', label: 'Sports' },
  { slug: 'angry-birds', label: 'Angry Birds' },
];

/** Desktop top strip — direct links to category pages (not ALL) */
const TOP_NAV_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'lego', label: 'LEGO' },
  { slug: 'running', label: 'Run' },
  { slug: 'talking', label: 'Talking' },
  { slug: 'girl', label: 'Girl' },
  { slug: 'gta', label: 'GTA' },
  { slug: 'impostor', label: 'Impostor' },
  { slug: 'cars', label: 'Cars' },
  { slug: 'stickman', label: 'Stickman' },
];

function categoryHref(slug: string): string {
  return `/category/${slug}`;
}

export function Navbar() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const iconBySlug = useMemo(() => {
    const slugs = new Set<string>();
    SIDEBAR_CATEGORIES.forEach((c) => slugs.add(c.slug));
    TOP_NAV_CATEGORIES.forEach((c) => slugs.add(c.slug));
    const m = new Map<string, string | null>();
    slugs.forEach((slug) => {
      m.set(slug, getRepresentativeIconForCategorySlug(slug));
    });
    return m;
  }, []);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen, closeSidebar]);

  const goCategory = (href: string) => {
    setLocation(href);
    closeSidebar();
  };

  return (
    <header>
      <div className="container">
        <div className="branch">
          <Link href="/">
            <span className="logo-text">Puno <span>PlayStore</span></span>
          </Link>
        </div>

        <nav className="header-nav-cats">
          {TOP_NAV_CATEGORIES.map(({ slug, label }) => {
            const icon = iconBySlug.get(slug) ?? null;
            return (
              <Link key={slug} href={categoryHref(slug)} className="header-nav-cats__trigger">
                {icon ? (
                  <GameIconImg src={icon} title={label} width={24} height={24} />
                ) : (
                  <span className="header-nav-cats__fallback" aria-hidden>
                    {label.charAt(0)}
                  </span>
                )}
                <p>{label}</p>
              </Link>
            );
          })}
          <button
            type="button"
            className="header-nav-cats__trigger header-nav-cats__trigger--all"
            onClick={openSidebar}
          >
            <p>ALL &gt;</p>
          </button>
        </nav>

        <div className="mbtn">
          <button
            type="button"
            className="header-hamburger"
            aria-label="Open categories"
            aria-expanded={sidebarOpen}
            onClick={openSidebar}
          >
            <span className="header-hamburger__line" />
            <span className="header-hamburger__line" />
            <span className="header-hamburger__line" />
          </button>
        </div>
      </div>

      <div
        className={`category-drawer${sidebarOpen ? ' category-drawer--open' : ''}`}
        aria-hidden={!sidebarOpen}
      >
        <div className="category-drawer__sheet">
          <aside
            className="category-drawer__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-drawer-title"
          >
            <h2 id="category-drawer-title" className="category-drawer__title">
              CATEGORY
            </h2>
            <nav className="category-drawer__list">
              {SIDEBAR_CATEGORIES.map(({ slug, label }) => {
                const href = categoryHref(slug);
                const icon = iconBySlug.get(slug) ?? null;
                return (
                  <button
                    key={slug}
                    type="button"
                    className="category-drawer__row"
                    onClick={() => goCategory(href)}
                  >
                    <span className="category-drawer__row-icon">
                      {icon ? (
                        <GameIconImg src={icon} title={label} />
                      ) : (
                        <span className="category-drawer__fallback">{label.charAt(0)}</span>
                      )}
                    </span>
                    <span className="category-drawer__row-label">{label}</span>
                    <span className="category-drawer__row-chevron" aria-hidden>
                      &gt;
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
          <button type="button" className="category-drawer__close" aria-label="Close menu" onClick={closeSidebar}>
            <span aria-hidden>×</span>
          </button>
        </div>
        <div className="category-drawer__scrim" onClick={closeSidebar} aria-hidden />
      </div>
    </header>
  );
}
