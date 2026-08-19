import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Brain,
  RotateCcw,
  Zap,
  Lightbulb,
} from 'lucide-react';

export const AiTutorModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, aiPromptContext } = useApp();

  const [activeTab, setActiveTab] = useState<'explain' | 'generate'>('explain');

  // Explain Query State
  const [customQuestion, setCustomQuestion] = useState('');
  const [explanationResponse, setExplanationResponse] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  // Generate Practice Question State
  const [genCourseCode, setGenCourseCode] = useState(aiPromptContext?.courseCode || 'CS 201');
  const [genTopic, setGenTopic] = useState(aiPromptContext?.topic || 'Data Structures & Algorithms');
  const [genDifficulty, setGenDifficulty] = useState<'Easy' | 'Medium' | 'Challenging'>('Medium');
  const [generatedQuestionObj, setGeneratedQuestionObj] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync contextual question when opened from a question step
  useEffect(() => {
    if (aiPromptContext) {
      if (aiPromptContext.courseCode) setGenCourseCode(aiPromptContext.courseCode);
      if (aiPromptContext.topic) setGenTopic(aiPromptContext.topic);

      if (aiPromptContext.questionText) {
        setCustomQuestion(
          `Please provide an intuitive step-by-step mathematical or conceptual breakdown of this examination question:\n\n"${aiPromptContext.questionText}"\n\nCourse: ${
            aiPromptContext.courseCode || 'University Exam'
          }\nTopic: ${aiPromptContext.topic || 'Core Concept'}`
        );
      }
    }
  }, [aiPromptContext]);

  if (!isAiModalOpen) return null;

  const closeAiModal = () => setIsAiModalOpen(false);

  const handleAskTutor = async () => {
    if (!customQuestion.trim()) return;
    setIsExplaining(true);
    setExplanationResponse('');

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: customQuestion,
          courseCode: genCourseCode,
          topic: genTopic,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExplanationResponse(data.explanation || 'No explanation generated.');
      } else {
        setExplanationResponse(
          '### AI Study Guidance\n\nWhen solving questions of this type, examiners look for:\n1. **Clear Statement of Assumptions & Formulas** (e.g. Master Theorem parameters $a, b, f(n)$)\n2. **Intermediate Calculation Workings** with proper units\n3. **Final Conclusion & Analysis**.\n\nMake sure to review the university lecture handout on this topic!'
        );
      }
    } catch (e) {
      console.error(e);
      setExplanationResponse(
        '### Conceptual Revision Hint\n\nRemember to state your base cases first and check for edge conditions before executing the main algorithm!'
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const handleGeneratePractice = async () => {
    setIsGenerating(true);
    setGeneratedQuestionObj(null);

    try {
      const res = await fetch('/api/ai/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: genCourseCode,
          topic: genTopic,
          difficulty: genDifficulty,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedQuestionObj(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-base">Gemini AI Study Tutor & Practice Engine</h3>
              <p className="text-[11px] text-blue-200">
                Step-by-step marking derivations & mock exam questions generator
              </p>
            </div>
          </div>

          <button
            onClick={closeAiModal}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-bold">
          <button
            onClick={() => setActiveTab('explain')}
            className={`flex-1 py-3 text-center transition flex items-center justify-center gap-2 ${
              activeTab === 'explain'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Explain Question / Concept</span>
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 text-center transition flex items-center justify-center gap-2 ${
              activeTab === 'generate'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Generate Practice Exam Question</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* TAB 1: EXPLAIN */}
          {activeTab === 'explain' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-[10px] uppercase text-slate-400 mb-1">
                  Ask a question, formula derivation, or request an explanation:
                </label>
                <textarea
                  rows={3}
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="e.g. How do I solve recurrence relation T(n) = 2T(n/2) + n using Master Theorem Case 2?"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">
                  Powered by Gemini 2.5 Flash server-side AI reasoning
                </span>
                <button
                  onClick={handleAskTutor}
                  disabled={isExplaining || !customQuestion.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 shadow-sm"
                >
                  {isExplaining ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Reasoning...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Explain with AI</span>
                    </>
                  )}
                </button>
              </div>

              {explanationResponse && (
                <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-slate-800 dark:text-slate-200 space-y-2 animate-in fade-in leading-relaxed whitespace-pre-line">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    <Lightbulb className="w-4 h-4" />
                    <span>Examiner Guidance & Derivation:</span>
                  </div>
                  <div className="text-xs">{explanationResponse}</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GENERATE PRACTICE QUESTION */}
          {activeTab === 'generate' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[10px] uppercase text-slate-400 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={genCourseCode}
                    onChange={(e) => setGenCourseCode(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[10px] uppercase text-slate-400 mb-1">
                    Topic Area
                  </label>
                  <input
                    type="text"
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[10px] uppercase text-slate-400 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={genDifficulty}
                    onChange={(e) => setGenDifficulty(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Easy">Easy (Fundamentals)</option>
                    <option value="Medium">Medium (Standard Exam)</option>
                    <option value="Challenging">Challenging (Distinction)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGeneratePractice}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-40"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing University Question...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Generate Question & Marking Scheme</span>
                    </>
                  )}
                </button>
              </div>

              {generatedQuestionObj && (
                <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 dark:border-indigo-900/60">
                    <span className="font-extrabold text-indigo-900 dark:text-indigo-200">
                      Generated Practice Exam Question ({generatedQuestionObj.marks || 15} Marks)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200">
                      {genDifficulty}
                    </span>
                  </div>

                  <p className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                    {generatedQuestionObj.questionText}
                  </p>

                  {generatedQuestionObj.solutionSteps && (
                    <div className="space-y-2 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/60">
                      <p className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Step-by-Step Marking Breakdown:</span>
                      </p>
                      {generatedQuestionObj.solutionSteps.map((s: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-xs">
                          <p className="font-bold text-slate-900 dark:text-white">
                            Step {s.stepNumber || idx + 1}: {s.title} ({s.marksAwarded || 3} Marks)
                          </p>
                          <p className="text-slate-600 dark:text-slate-300 mt-0.5">{s.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
