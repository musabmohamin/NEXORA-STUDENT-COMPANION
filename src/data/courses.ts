import type { Course } from "./initialData";
import { JIMMA_COURSES } from "./curriculumData";

export const courses: Course[] = JIMMA_COURSES.map((c) => {
  const id = c.code.toLowerCase().replace(/\s+/g, "-");
  return {
    id,
    code: c.code,
    title: c.title,
    department_id: c.departmentSlug === "freshman" ? "00000000-0000-4000-8000-0000000000d1" : "00000000-0000-4000-8000-0000000000d2",
    year: c.year,
    semester: c.semester,
    credits: c.cr_hr,
    cr_hr: c.cr_hr,
    ects: c.ects,
    lecture_hours: c.lecture_hours,
    lab_hours: c.lab_hours,
    tutorial_hours: c.tutorial_hours,
    category: c.category,
    level: c.category,
    description: c.description,
    prerequisites: c.prerequisites,
    outcomes: c.outcomes,
    cover_image: c.cover_image,
    units: c.units?.map((u) => ({
      id: u.id,
      title: u.title,
      topics: u.topics,
      hours: u.hours,
    })) || [],
    resources: [],
  };
});
