import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  BookOpen,
  Award,
  GraduationCap,
  Users,
} from 'lucide-react';
import studentsStudying from '../../assets/images/students_studying_library_1787008551703.jpg';
import studentsCelebrating from '../../assets/images/students_celebrating_results_1787008563746.jpg';
import studentsLecture from '../../assets/images/students_lecture_learning_1787008575437.jpg';

interface Slide {
  id: string;
  image: string;
  badge: string;
  badgeIcon: React.ElementType;
  badgeColor: string;
  title: string;
  subtitle: string;
  stat: string;
  statLabel: string;
}

const SLIDES: Slide[] = [
  {
    id: 'studying',
    image: studentsStudying,
    badge: 'Focused Collaborative Study',
    badgeIcon: BookOpen,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    title: 'Comprehensive Past Papers & Step-by-Step Solutions',
    subtitle:
      'Students in university libraries preparing with verified marking schemes, mathematical proofs, and examiner grading insights.',
    stat: '100%',
    statLabel: 'Verified Marking Schemes',
  },
  {
    id: 'celebrating',
    image: studentsCelebrating,
    badge: 'Academic Distinction & High GPA',
    badgeIcon: Award,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    title: 'Celebrating Top Exam Results & Portal Scores',
    subtitle:
      'Achieve First Class honors and top grade points with structured revision guides and semester exam predictions across all Ghanaian campuses.',
    stat: '3.8+',
    statLabel: 'Average Target GPA',
  },
  {
    id: 'lecture',
    image: studentsLecture,
    badge: 'Interactive Campus Learning',
    badgeIcon: GraduationCap,
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    title: 'Hardcopy Digitization & Real Exam Archives',
    subtitle:
      'From lecture auditorium tutorials to mobile revision, access authentic semester examinations with reconstructed vector diagrams.',
    stat: '20+',
    statLabel: 'Ghanaian Universities',
  },
];

export const CarouselSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Relaxed auto-advance timer (7.5 seconds) for smooth, non-hurried reading
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-800/80 bg-[#12131A] group transition-all duration-700"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Aspect Ratio Container */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
        {/* Slides Images with Silky Smooth Dissolve Transition */}
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1200 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10 filter-none'
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-10000 ease-out transform"
              />
              {/* Refined Gradient Overlays for optimal text contrast and soft blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D12] via-[#0C0D12]/70 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0C0D12]/85 via-[#0C0D12]/40 to-transparent" />
            </div>
          );
        })}

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8 lg:p-10 text-white">
          <div className="max-w-2xl space-y-3 transition-all duration-700 ease-out">
            {/* Badge */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-colors duration-500 ${currentSlide.badgeColor}`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{currentSlide.badge}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-gray-300 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                <Users className="w-3 h-3 text-indigo-400" />
                <span>
                  {currentSlide.stat} {currentSlide.statLabel}
                </span>
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {currentSlide.title}
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed line-clamp-2 sm:line-clamp-none max-w-xl drop-shadow-xs">
              {currentSlide.subtitle}
            </p>
          </div>
        </div>

        {/* Carousel Navigation Buttons (Left / Right) */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-indigo-600 text-white backdrop-blur-md border border-white/15 transition-all opacity-80 group-hover:opacity-100 active:scale-95 shadow-xl"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-indigo-600 text-white backdrop-blur-md border border-white/15 transition-all opacity-80 group-hover:opacity-100 active:scale-95 shadow-xl"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Play/Pause Toggle & Indicators Top Right */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white backdrop-blur-md border border-white/10 text-xs transition"
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-4 right-4 sm:right-8 z-30 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-700 ${
                idx === currentIndex ? 'w-6 bg-indigo-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          <span className="text-[10px] text-gray-300 font-mono ml-1">
            0{currentIndex + 1}/0{SLIDES.length}
          </span>
        </div>
      </div>
    </div>
  );
};
