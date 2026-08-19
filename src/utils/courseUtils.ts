/**
 * Utility functions for cleaning and formatting course data.
 */

/**
 * Strips any trailing level designations from course titles
 * (e.g. "Data Structures Level 200", "Calculus - Level 100", "Programming (Level 300)", "Physics [Level 400]")
 */
export const cleanCourseTitle = (title?: string): string => {
  if (!title) return '';
  return title
    .replace(/\s*[-–—/:([]*\s*(?:Level|Lvl|L)\s*\d{3}\s*[)\]]*\s*$/i, '')
    .trim();
};
