// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';

export function LevelsPage() {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BOX 1: Solid Color Background with Text */}
        <Link
          to="/chao/A1"
          className="group relative grid grid-cols-1 grid-rows-3 p-6 h-52 md:h-64 rounded bg-white dark:bg-zinc-800
                    hover:shadow-md shadow-emerald-800/30 dark:hover:shadow-emerald-600/30 overflow-hidden cursor-pointer"
        >
          {/* Decorative background shape or icon */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-800/30 dark:bg-emerald-600/30 rounded-full blur-xl group-hover:scale-250 transition-transform duration-500" />

          <div className='row-span-2 flex items-end'>
            <h2 className="text-5xl font-extrabold">
              A1 <span className="text-xl">{t.courses.a1Des}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 font-semibold text-sm">
            <span>{t.courses.startLearning}</span>
            <span className="group-hover:translate-x-2 transition-transform duration-200">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/chao/A2"
          className="group relative grid grid-cols-1 grid-rows-3 p-6 h-52 md:h-64 rounded bg-white dark:bg-zinc-800
                     hover:shadow-md shadow-emerald-800/30 dark:hover:shadow-emerald-600/30 overflow-hidden cursor-pointer"
        >
          {/* Decorative background shape or icon */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-800/30 dark:bg-emerald-600/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />

          <div className='row-span-2 flex items-end'>
            <h2 className="text-5xl font-extrabold">
              A2 <span className="text-xl">{t.courses.a2Des}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 font-semibold text-sm">
            <span>{t.courses.startLearning}</span>
            <span className="group-hover:translate-x-2 transition-transform duration-200">
              →
            </span>
          </div>
        </Link>

        {/* BOX 2: Image Background with Overlay Text */}
        {/* <Link
          to="/courses/grammar"
          className="group relative flex flex-col justify-end p-6 h-52 md:h-64 rounded-2xl 
                     shadow-md hover:shadow-xl transition-all duration-300 
                     overflow-hidden cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80"
            alt="Grammar practice background"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/40 to-transparent group-hover:from-slate-950/90 transition-colors" />

          <div className="relative z-10 text-white">
            <span className="inline-block px-3 py-1 bg-tree-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              Practice
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Grammar Trees
            </h2>
            <div className="flex items-center gap-2 font-semibold text-sm mt-1 text-slate-200">
              <span>Explore Topics</span>
              <span className="group-hover:translate-x-2 transition-transform duration-200">
                →
              </span>
            </div>
          </div>
        </Link> */}

      </div>
    </div>
  );
}