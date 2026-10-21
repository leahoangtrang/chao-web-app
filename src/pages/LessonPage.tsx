// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import type { Exercise, LessonDetail, Material } from '../types/api';
import { LessonService } from '../api/lesson.service';
import { ProgressService } from '../api/progress.service';
import { useAuth } from '../context/AuthContext';

export function LessonPage() {
  // State for fetched lesson data
  const { levelId, lessonId } = useParams<{ levelId: string; lessonId: string }>();
  const parsedId = Number(lessonId);

  if (!levelId || isNaN(parsedId) || parsedId > 80 || parsedId < 1) {
    return <Navigate to="/chao/A1/1" replace />;
  }

  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchLesson = async () => {
        try {
            const data = await LessonService.getLessonById(lessonId ?? '1');
            setLesson(data);
        } catch (error) {
            console.error('Failed to fetch lesson:', error);
        } finally {
            setLoading(false);
        }};

        fetchLesson();
    }, [lessonId]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                // Convert IDs to strings to match material.id type safely
                const data = await ProgressService.fetchProgress();
                const stringIds = data.map(id => String(id));
                setCompletedMaterials(new Set(stringIds));
            } catch (error) {
                console.error("Failed to load user progress", error);
            };
        }
        
      fetchProgress();
    }, []);

  // State to hold user answers: { [exerciseId]: string | string[] | { [key]: value } }
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  // State to hold verification status: { [exerciseId]: boolean }
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, boolean>>({});
  // Track which material IDs have already sent a completion request to the backend
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set());

  // Check handler for individual exercises
  const handleCheckExercise = (ex : Exercise) => {
    const userAnswer = userAnswers[ex.id];
    let isCorrect = false;

    if (ex.type === 'TRANSLATION_INPUT') {
      isCorrect = (userAnswer || '').trim().toLowerCase() === (ex.correctAnswer || '').trim().toLowerCase();
    } else if (ex.type === 'MULTIPLE_CHOICE') {
      isCorrect = userAnswer === ex.correctAnswer;
    } else if (ex.type === 'MATCHING') {
      const userPairs = userAnswer || {};
      const targetPairs = ex.pairs || {};
      const keys = Object.keys(targetPairs);
      
      isCorrect = keys.length > 0 && keys.every(key => userPairs[key] === targetPairs[key]);
    }

    setExerciseStatus(prev => ({ ...prev, [ex.id]: isCorrect }));
  };

  // Helper: Check if a material is finished (either from database history OR current session answers)
  const isMaterialFinished = (material: Material) => {
    if (completedMaterials.has(String(material.id))) return true;
    if (!material.exercises || material.exercises.length === 0) return false;
    return material.exercises.every(ex => exerciseStatus[ex.id] === true);
  };

  // Calculate overall progress across all materials in the lesson
  const totalMaterials = lesson?.materials.length;
  const finishedCount = lesson?.materials.filter(mat => isMaterialFinished(mat)).length;
  const progressPercentage = totalMaterials? ((finishedCount? finishedCount : 0) / totalMaterials) * 100 : 0;

  // Effect: When a material becomes finished, trigger backend progress save (if not already saved)
  useEffect(() => {
    lesson?.materials.forEach(material => {
      if (isMaterialFinished(material) && !completedMaterials.has(material.id)) {
        // Mark locally as sent so it doesn't spam requests on re-render
        setCompletedMaterials(prev => new Set(prev).add(material.id));
        if (isAuthenticated) {
            try {
                ProgressService.saveProgress(material.id)
            } catch (error) {
                console.error("Failed to save material progress", error);
            }
        }
      }
    });
  }, [exerciseStatus, lesson?.materials, completedMaterials]);

  if (loading) return <div className="p-8 text-center text-gray-500">{t.lesson.loading}</div>;
  if (!lesson) return <div className="p-8 text-center text-red-500">Lesson not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header & Progress Bar */}
      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-row w-full justify-between">
          <span className="text font-semibold text-emerald-800 dark:text-emerald-600 uppercase">L{lessonId}: {lesson.title}</span>
          <span>
            <span className='font-semibold text-emerald-800 dark:text-emerald-600'>{finishedCount}</span> / {totalMaterials} <span className='text-emerald-800 dark:text-emerald-600'>♠</span>
          </span>
        </div>
        {/* Step Progress Track */}
        <div className="felx flex-row flex-nowrap w-full h-2 justify-end bg-white dark:bg-zinc-800 rounded overflow-hidden">
          <div
            className="rounded h-2 bg-emerald-800 dark:bg-emerald-600"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div> 

      {/* Loop through each Material in the Lesson */}
      {(lesson?.materials || []).map((material) => {
        
        // Group exercises by type for THIS specific material
        const groupedExercises = (material?.exercises || []).reduce((acc : any, exercise : Exercise) => {
          const type = exercise.type;
          if (!type) return acc;
          if (!acc[type]) acc[type] = [];
          acc[type].push(exercise);
          return acc;
        }, {});

        return (
          <div 
            key={material.id} 
            className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-900 rounded p-3"
          >
            {/* Vocabulary Notes */}
            <div className="rounded mb-3 px-3 border border-slate-900 dark:border-zinc-200">
                <input
                type="checkbox"
                id={`vocab-toggle-${material.id}`}
                className="peer hidden"
                />
                <label
                htmlFor={`vocab-toggle-${material.id}`}
                className="flex items-center justify-between w-full py-2 font-semibold peer-checked:[&_span.arrow]:rotate-180 text-slate-900 dark:text-zinc-200 cursor-pointer"
                >
                <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-200 mb-1">
                {t.lesson.vocabulary}
                </h4>
                <span className="arrow inline-block text-sm transition-transform">▼</span>
                </label>
                
                <table className="hidden peer-checked:block border-t py-3 border-slate-900 dark:border-zinc-200 text-sm text-slate-900 dark:text-slate-200 whitespace-pre-line">
                <tbody>
                    {material.vocabularies.map((vocab) => (
                    <tr key={vocab.id}>
                        <td className='pr-1'>{vocab.lemma} </td>
                        <td>{vocab.translations[ language==="SK"? "en" : language ]}</td>
                    </tr>
                    // <p key={vocab.id} className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{vocab.lemma}: {vocab.translations["en"]}</p>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Material Notes */}
            <div className="rounded mb-3 px-3 border border-slate-900 dark:border-zinc-200">
                <h4 className="text-lg font-bold py-2 text-slate-900 dark:text-zinc-200 mb-1">
                {material.title}
                </h4>
                <p className="text-sm border-t py-3 border-slate-900 dark:border-zinc-200 text-slate-900 dark:text-zinc-200 whitespace-pre-line">
                {material.note ? material.note.replace(/\\n/g, '\n') : ''}
                </p>
            </div>

            {/* Exercises List */}
            <div className="rounded mb-3 px-3 border border-slate-900 dark:border-zinc-200">
                <input
                type="checkbox"
                id={`exercises-toggle-${material.id}`}
                className="peer hidden"
                />

                <label
                htmlFor={`exercises-toggle-${material.id}`}
                className="flex items-center justify-between w-full py-2 font-semibold peer-checked:[&_span.arrow]:rotate-180 text-slate-900 dark:text-zinc-200 cursor-pointer"
                >
                <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-200 mb-1">
                {t.lesson.exercises}
                </h4>
                <div>
                  <span className={`${isMaterialFinished(material) ? "text-emerald-800 dark:text-emerald-600" : ""}`}>♠</span>
                  <span className="arrow inline-block text-sm transition-transform ml-2">▼</span>
                </div>
                </label>

            {/* Render Exercises Grouped by Type within this Material */}
            {Object.entries(groupedExercises).map(([type, exercises] : any, exerciseId :number) => (
              <div key={type} className="hidden peer-checked:block border-t py-3 border-slate-900 dark:border-zinc-200">
                <h3 className="text-xs font-bold uppercase">
                  Exercise {exerciseId + 1} 
                </h3> {/* {t.} */}

                {exercises.map((ex : Exercise, index : any) => {
                  const status = exerciseStatus[ex.id];

                  return (
                    <div 
                      key={ex.id} 
                      className="space-y-3 pb-4"
                    >
                      <p className="text-sm text-slate-900 dark:text-zinc-200">
                        {index + 1}. {ex.prompt}
                      </p>

                      {/* TRANSLATION_INPUT Type */}
                      {ex.type === 'TRANSLATION_INPUT' && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type Slovak translation..." //{t.}
                            value={userAnswers[ex.id] || ''}
                            onChange={(e) =>
                              setUserAnswers((prev) => ({ ...prev, [ex.id]: e.target.value }))
                            }
                            className="flex-1 px-3 py-2 rounded border border-neutral-400 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-emerald-500"
                          />
                          <button
                            onClick={() => handleCheckExercise(ex)}
                            className="px-4 py-2 text-white bg-neutral-900 text-xs rounded"
                          >
                            {t?.lesson?.check || 'Check'}
                          </button>
                        </div>
                      )}

                      {/* MULTIPLE_CHOICE Type */}
                      {ex.type === 'MULTIPLE_CHOICE' && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ex.options?.map((option, optIdx) => {
                              const isSelected = userAnswers[ex.id] === option;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => setUserAnswers((prev) => ({ ...prev, [ex.id]: option }))}
                                  className={`p-2.5 text-left text-sm rounded border transition-all ${
                                    isSelected
                                      ? 'border-emerald-500 text-emerald-500 bg-white dark:bg-zinc-800'
                                      : 'border-neutral-400 bg-white dark:bg-zinc-800 '
                                  }`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => handleCheckExercise(ex)}
                            disabled={!userAnswers[ex.id]}
                            className="px-4 py-2 text-white bg-neutral-900 text-xs rounded"
                          >
                            {t?.lesson?.check || 'Check'}
                          </button>
                        </div>
                      )}

                      {/* MATCHING Type */}
                      {ex.type === 'MATCHING' && ex.pairs && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(ex.pairs).map(([leftKey, rightValue], pairIdx) => (
                              <React.Fragment key={pairIdx}>
                                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-sm font-medium flex items-center">
                                  {leftKey}
                                </div>
                                <select
                                  value={userAnswers[ex.id]?.[leftKey] || ''}
                                  onChange={(e) => {
                                    const currentMap = userAnswers[ex.id] || {};
                                    setUserAnswers((prev) => ({
                                      ...prev,
                                      [ex.id]: { ...currentMap, [leftKey]: e.target.value }
                                    }));
                                  }}
                                  className="p-2 rounded border border-neutral-400 bg-white dark:bg-zinc-800"
                                >
                                  <option value="">-- Select match --</option>
                                  {Object.values(ex?.pairs ?? {}).map((val, vIdx) => (
                                    <option key={vIdx} value={val}>
                                      {val}
                                    </option>
                                  ))}
                                </select>
                              </React.Fragment>
                            ))}
                          </div>
                          <button
                            onClick={() => handleCheckExercise(ex)}
                            className="px-4 py-2 text-white bg-neutral-900 text-xs rounded"
                          >
                            {t?.lesson?.check || 'Check'}
                          </button>
                        </div>
                      )}

                      {/* Verification Result Feedback */}
                      {status !== undefined && (
                        <p
                          className={`text-xs font-bold pt-1 ${
                            status ? 'text-emerald-800 dark:text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {status ? (t?.lesson?.correct || 'Correct!') : (t?.lesson?.tryAgain || 'Incorrect, try again!')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        );
      })}
    </div>
  );
}