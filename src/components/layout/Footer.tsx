import React from 'react';

const LINKS = ['Sobre Nosotros', 'Soporte Técnico', 'Blog', 'Términos y Condiciones'];

const SOCIALS: { name: string; path: string }[] = [
  {
    name: 'Facebook',
    path: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z',
  },
  {
    name: 'Twitter',
    path: 'M23 4.6a9.3 9.3 0 0 1-2.6.7 4.6 4.6 0 0 0 2-2.5 9.2 9.2 0 0 1-2.9 1.1 4.6 4.6 0 0 0-7.8 4.2A13 13 0 0 1 2.3 3.3a4.6 4.6 0 0 0 1.4 6.1 4.6 4.6 0 0 1-2.1-.6v.1a4.6 4.6 0 0 0 3.7 4.5 4.6 4.6 0 0 1-2 .1 4.6 4.6 0 0 0 4.3 3.2A9.2 9.2 0 0 1 1 18.6 13 13 0 0 0 8 20.7c8.4 0 13-7 13-13v-.6A9.3 9.3 0 0 0 23 4.6Z',
  },
  {
    name: 'LinkedIn',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-900 border-t border-white/10 text-frost-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" aria-label="Enlaces del pie de página">
          {LINKS.map((label) => (
            <a key={label} href="#" className="hover:text-white transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href="#"
              aria-label={s.name}
              className="text-frost-300 hover:text-white hover:-translate-y-0.5 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 py-3 text-center text-[11px] text-frost-500">
        © {new Date().getFullYear()} RefriHero · Formación técnica en refrigeración y climatización
      </div>
    </footer>
  );
};
