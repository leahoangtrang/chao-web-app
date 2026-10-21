// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import type  { LessonSummary, Unit } from '../types/api';
import { LessonService } from '../api/lesson.service';
import { useLanguage } from '../context/LanguageContext';
import { ProgressService } from '../api/progress.service';

export function LevelUnitsPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedMaterialIds, setCompletedMaterialIds] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  // console.log(levelId, levelId?.toLowerCase(), levelId?.toLowerCase() !== 'a1')
  if (!levelId || (levelId.toLowerCase() !== 'a1') || !(levelId.toLowerCase() !== 'a2')) {
    return <Navigate to="/chao/A1" replace />;
  }

  // Fetch user's completed materials on page load
  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const data = await ProgressService.fetchProgress();
         const stringIds = data.map(id => String(id));
          setCompletedMaterialIds(new Set(stringIds));
      } catch (error) {
        console.error("Failed to load user progress", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await LessonService.getUnitsByLevel(levelId ?? 'A1');
        if (Array.isArray(data)) {
            const sorted = [...data].sort((a, b) => a.unitOrder - b.unitOrder);
            setUnits(sorted);
          } else {
            console.error('Expected array from backend but got:', data);
            setUnits([]);
          }
      } catch (error) {
        console.error('Failed to fetch units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();  
  }, [levelId]);

  if (loading) return <div className="p-8 text-center">{t.units.loading}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl text-center font-extrabold mb-6 text-emerald-800 dark:text-emerald-600">{levelId?.toUpperCase()}</h1>

      {/* MOBILE VIEW: 1-Column Collapsible Accordion (< 768px) */}
      <div className="block md:hidden">
        {units.map((unit) => (
          <div key={unit.id} className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-900 rounded p-2 shadow-sm">
            <input
              type="checkbox"
              id={`mobile-toggle-${unit.id}`}
              className="peer hidden"
            />

            <label
              htmlFor={`mobile-toggle-${unit.id}`}
              className="flex items-center justify-between w-full px-3 py-2 font-semibold peer-checked:[&_span.arrow]:rotate-180 text-slate-900 dark:text-zinc-200 cursor-pointer"
            >
              <span>{t.units.unit} {unit.unitOrder}: {unit.title}</span>
              <span className="arrow inline-block text-sm transition-transform">▼</span>
            </label>
            {/* <h2 className="text-xl font-bold text-gray-800 mb-3">{unit.title}</h2> */}

            {/* Lessons */}
            <div className="hidden peer-checked:block border-t border-neutral-200 dark:border-neutral-900 px-3">
              <LessonsList lessons={unit.lessons} levelId={levelId?? 'A1'} completedMaterialIds={completedMaterialIds}/>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW: Multi-Column Non-Collapsible Grid (>= 768px) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <div
            key={`desktop-${unit.id}`}
            className="border border-neutral-200 dark:border-neutral-900 rounded bg-white dark:bg-zinc-800 p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border">
                  Unit {unit.unitOrder}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-200 pb-3 border-b border-neutral-200 dark:border-neutral-900">
                {unit.title}
              </h3>

              {/* Lessons are permanently visible on desktop */}
              <LessonsList lessons={unit.lessons} levelId={levelId ?? 'A1'} completedMaterialIds={completedMaterialIds}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper: Calculate lesson progress details
  const getLessonProgress = (lesson: LessonSummary, completedMaterialIds: Set<string>) => {
    const materials = lesson.materials || [];
    const totalMaterials = materials.length;
    
    // if (totalMaterials === 0) return { completedCount: 0, total: 0, percentage: 0, isFinished: false };
    if (totalMaterials === 0) return { percentage: 0, isFinished: false };

    const completedCount = materials.filter(m => completedMaterialIds.has(String(m.id))).length;
    const percentage = (completedCount / totalMaterials) * 100;
    const isFinished = completedCount === totalMaterials;

    // return { completedCount, total: totalMaterials, percentage, isFinished };
    return { percentage, isFinished };
  };

// Reusable Lessons List Component
function LessonsList({ lessons, levelId, completedMaterialIds }: { lessons: LessonSummary[], levelId :string, completedMaterialIds: Set<string>}) {
  if (!lessons || lessons.length === 0) {
    return (
      <p className="text-sm italic p-3">
        No lessons in this unit yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-200 dark:divide-neutral-900">
      {lessons.map((lesson) => {
        const { percentage, isFinished } = getLessonProgress(lesson, completedMaterialIds);
        return(
        <li key={lesson.id}>
          <Link 
            to={`/chao/${levelId}/${lesson.id}`}
            className="font-medium text-slate-900 dark:text-zinc-200 hover:text-emerald-800 dark:hover:text-emerald-600 flex items-center justify-between p-3"
          >
            
            <h3>{lesson.title}</h3>
            {isFinished ? (<div> ♠</div>): (
              <div className="flex flex-col flex-nowrap justify-end w-1.5 h-4.5 bg-neutral-200 dark:bg-neutral-900 rounded overflow-hidden">
                <div className="rounded bg-emerald-800/70 dark:bg-emerald-600 " style={{ height: `${percentage}%` }}></div>
              </div>
            )}
          </Link>
        </li>
        );
      })}
    </ul>
  );
}



