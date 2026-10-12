import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import type { Exercise, LessonDetail } from '../types/api';
import { LessonService } from '../api/lesson.service';
import { useLanguage } from '../context/LanguageContext';

export function LessonPage() {
  // State for fetched lesson data
  const { levelId, lessonId } = useParams<{ levelId: string; lessonId: string }>();
  const parsedId = Number(lessonId);

  const { t } = useLanguage();
  
  // console.log(parsedId, isNaN(parsedId));
  // Redirect to Home if levelId is invalid or greater than 80
  if (!levelId || isNaN(parsedId) || parsedId > 80 || parsedId < 1) {
    console.log("In")
    return <Navigate to="/chao/A1/1" replace />;
  }

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // const navigate = useNavigate();

  // Lesson progression state
  // Current material index (0, 1, or 2)
  const [materialIdx, setMaterialIdx] = useState<number>(0);
  // User answers per exercise: { [exerciseId]: string }
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  // Feedback state for each exercise: { [exerciseId]: boolean }
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, boolean>>({});
  // Set of completed material IDs
  const [learnedMaterialIds, setLearnedMaterialIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await LessonService.getLessonById(lessonId ?? '1');
        setLesson(data);
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
      } finally {
        setLoading(false);
      }

    };

    fetchLesson();
  }, [lessonId]);

  const currentMaterial = lesson?.materials[materialIdx];
  const exercises = currentMaterial?.exercises || [];

    // Handle option selection for current exercise
  // const handleSelectOption = (optionIndex: number) => {
  //   setSelectedAnswers((prev) => ({
  //     ...prev,
  //     [materialIdx]: optionIndex,
  //   }));
  // };

  // // Next / Previous Navigation
  // const handleNext = () => {
  //   if (materialIdx < totalSteps - 1) {
  //     setmaterialIdx((prev) => prev + 1);
  //   }
  // };

  // const handlePrev = () => {
  //   if (materialIdx > 0) {
  //     setmaterialIdx((prev) => prev - 1);
  //   }
  // };

  // const handleSaveProgress = async () => {
  //   const baseUrl = import.meta.env.VITE_API_BASE_URL;

  //   await fetch(`${baseUrl}/user-progress/lessons/${lessonId}`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       completed: isCompleted,
  //       proficiencyScore: proficiencyScore,
  //     }),
  //   });

  //   navigate(`/chao/levels/${levelId}`);
  // };

  // 2. Frontend Answer Verification
  const handleCheckExercise = (exercise: Exercise) => {
    const input = userAnswers[exercise.id] || '';
    
    // Case-insensitive & trimmed comparison against backend correctAnswer
    const isCorrect = input.trim().toLowerCase() === exercise?.correctAnswer?.trim().toLowerCase();

    setExerciseStatus((prev) => ({
      ...prev,
      [exercise.id]: isCorrect,
    }));
  };

  // Check if ALL exercises in current material are answered correctly
  const isCurrentMaterialCompleted =
    exercises.length > 0 && exercises.every((ex) => exerciseStatus[ex.id] === true);

  // 3. Save Progress via Axios & Advance Material
  const handleCompleteMaterial = async () => {
    if (!isCurrentMaterialCompleted || !currentMaterial) return;

    const updatedLearned = [...new Set([...learnedMaterialIds, currentMaterial.id])];

    try {
      setIsSaving(true);

      // Axios call to save progress in backend
      // await axios.post(`/api/materials/${currentMaterial.id}/complete`, {
      //   materialId: currentMaterial.id,
      //   lessonId: lessonData.lessonId,
      // });

      setLearnedMaterialIds(updatedLearned);

      // Advance to next material if available
      if (materialIdx < lesson.materials.length - 1) {
        setMaterialIdx((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to save material progress:', err);
      alert('Failed to save progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">{t.lesson.loading}</div>;
  if (!lesson) return <div className="p-8 text-center text-red-500">Lesson not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header & Progress Bar */}
      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-row w-full justify-between">
          <span className="text font-semibold text-emerald-800 dark:text-emerald-600 uppercase">L{lessonId}: {lesson.title}</span>
          <span>
            <span className='font-semibold text-emerald-800 dark:text-emerald-600'>{materialIdx}</span> / {lesson.materials.length} <span className='text-emerald-800 dark:text-emerald-600'>♠</span>
          </span>
        </div>
        {/* Step Progress Track */}
        <div className="felx flex-row flex-nowrap w-full h-2 justify-end bg-white dark:bg-zinc-800 rounded overflow-hidden">
          <div
            className="rounded h-2 bg-emerald-800 dark:bg-emerald-600"
            style={{ width: `${((materialIdx + 0) / lesson.materials.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Material Card */}
      {lesson.materials.map((mat) => (
        <div key={mat.id} className='bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-900 rounded p-3'>
          {/* Vocabulary Notes */}
          <div className="rounded mb-3 px-3 border border-slate-900 dark:border-zinc-200">
            <input
            type="checkbox"
            id={`vocab-toggle-${mat.id}`}
            className="peer hidden"
            />
            <label
              htmlFor={`vocab-toggle-${mat.id}`}
              className="flex items-center justify-between w-full py-2 font-semibold peer-checked:[&_span.arrow]:rotate-180 text-slate-900 dark:text-zinc-200 cursor-pointer"
            >
              <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-200 mb-1">
              {t.lesson.vocabulary}
              </h4>
              <span className="arrow inline-block text-sm transition-transform">▼</span>
            </label>
            
            <table className="hidden peer-checked:block border-t py-3 border-slate-900 dark:border-zinc-200 text-sm text-slate-900 dark:text-slate-200 whitespace-pre-line">
              <tbody>
                {mat.vocabularies.map((vocab) => (
                  <tr key={vocab.id}>
                    <td className='pr-1'>{vocab.lemma} </td>
                    <td>{vocab.translations["en"]}</td>
                  </tr>
                  // <p key={vocab.id} className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{vocab.lemma}: {vocab.translations["en"]}</p>
                ))}
              </tbody>
            </table>
          </div>

          {/* Material Notes */}
          {/* <div className="mb-6 p-4 rounded-xl bg-tree-50 dark:bg-tree-950/40 border border-tree-100 dark:border-tree-900"> */}
          <div className="rounded mb-3 px-3 border border-slate-900 dark:border-zinc-200">
            <h4 className="text-lg font-bold py-2 text-slate-900 dark:text-zinc-200 mb-1">
              {mat.title}
            </h4>
            <p className="text-sm border-t py-3 border-slate-900 dark:border-zinc-200 text-slate-900 dark:text-zinc-200 whitespace-pre-line">
              {mat.note ? mat.note.replace(/\\n/g, '\n') : ''}
            </p>
          </div>

          {/* Exercises List: Need to be repaired */}
          <div className="rounded mb-3 px-3 border border-slate-900 dark:border-zinc-200">
            <input
            type="checkbox"
            id={`exercises-toggle-${mat.id}`}
            className="peer hidden"
            />

            <label
              htmlFor={`exercises-toggle-${mat.id}`}
              className="flex items-center justify-between w-full py-2 font-semibold peer-checked:[&_span.arrow]:rotate-180 text-slate-900 dark:text-zinc-200 cursor-pointer"
            >
              <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-200 mb-1">
             {t.lesson.exercises}
              </h4>
              <div>
                ♠
                <span className="arrow inline-block text-sm transition-transform pl-2">▼</span>
              </div>
            </label>

            {/* <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Exercises</h4> */}
            <div className="hidden peer-checked:block border-t py-3 border-slate-900 dark:border-zinc-200">
              {mat.exercises.map((ex, index) => {
                const status = exerciseStatus[ex.id];
                return (
                  <div
                    key={ex.id}
                    className="space-y-3 pb-3"
                  >
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {index + 1}. {ex.prompt}
                    </p>

                    {/* TRANSLATION_INPUT Type */}
                    {ex.type === 'TRANSLATION_INPUT' && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type Slovak translation..."
                          value={userAnswers[ex.id] || ''}
                          onChange={(e) =>
                            setUserAnswers((prev) => ({ ...prev, [ex.id]: e.target.value }))
                          }
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-canvas-dark text-sm outline-none focus:border-tree-500"
                        />
                        <button
                          onClick={() => handleCheckExercise(ex)}
                          className="px-4 py-2 bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-900 text-white font-semibold text-xs rounded-lg transition-colors"
                        >
                          {t.lesson.check}
                        </button>
                      </div>
                    )}

                    {/* Verification Result Feedback */}
                    {status !== undefined && (
                      <p
                        className={`text-xs font-bold ${
                          status ? 'text-tree-600 dark:text-tree-400' : 'text-red-500'
                        }`}
                      >
                        {status ? `${t.lesson.correct}` : `${t.lesson.tryAgain}`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            
          </div>
        </div> 
      ))}
        {/* Material Notes */}
        {/* <div className="mb-6 p-4 rounded-xl bg-tree-50 dark:bg-tree-950/40 border border-tree-100 dark:border-tree-900">
          <h3 className="text-lg font-bold text-tree-900 dark:text-tree-300 mb-1">
            {currentMaterial?.title}
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
            {currentMaterial?.note}
          </p>
        </div> */}

        {/* Exercises List */}
        {/* <div className="space-y-5">
          <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Exercises</h4>

          {exercises.map((ex, index) => {
            const status = exerciseStatus[ex.id];

            return (
              <div
                key={ex.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-3"
              >
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {index + 1}. {ex.prompt}
                </p>

                {ex.type === 'TRANSLATION_INPUT' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type Slovak translation..."
                      value={userAnswers[ex.id] || ''}
                      onChange={(e) =>
                        setUserAnswers((prev) => ({ ...prev, [ex.id]: e.target.value }))
                      }
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-canvas-dark text-sm outline-none focus:border-tree-500"
                    />
                    <button
                      onClick={() => handleCheckExercise(ex)}
                      className="px-4 py-2 bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-900 text-white font-semibold text-xs rounded-lg transition-colors"
                    >
                      Check
                    </button>
                  </div>
                )}

                {status !== undefined && (
                  <p
                    className={`text-xs font-bold ${
                      status ? 'text-tree-600 dark:text-tree-400' : 'text-red-500'
                    }`}
                  >
                    {status ? '✓ Correct!' : '✕ Try again.'}
                  </p>
                )}
              </div>
            );
          })}
        </div> */}

        {/* Save / Next Footer */}
        {/* <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            {isCurrentMaterialCompleted
              ? 'All 3 correct! Click below to complete.'
              : 'Complete all 3 exercises correctly to advance.'}
          </span>

          <button
            onClick={handleCompleteMaterial}
            disabled={!isCurrentMaterialCompleted || isSaving}
            className="px-5 py-2.5 rounded-xl bg-tree-500 hover:bg-tree-600 disabled:opacity-40 text-white font-bold transition-all shadow-md text-sm"
          >
            {isSaving ? 'Saving...' : 'Complete Material & Save 💾'}
          </button>
        </div> */}

      {/* </div> */}
    </div>
  );
}

