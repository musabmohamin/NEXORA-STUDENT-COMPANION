import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CaretDown,
  Check,
  X,
} from "@phosphor-icons/react";
import {
  getCourses,
  getEnrollments,
  enroll,
  unenroll,
  getUnits,
  getUnitProgress,
  toggleUnitProgress,
} from "@/services/api";
import { JIMMA_COURSES } from "@/data/curriculumData";
import type { Course } from "@/types";

interface DisplayCourse {
  id: string;
  code: string;
  title: string;
  description: string;
  cr_hr: number;
  ects: number;
  lecture_hours: number;
  lab_hours: number;
  tutorial_hours: number;
  category: string;
  prerequisites?: string;
  outcomes?: string[];
  cover_image?: string;
  semesterNumber: number;
}

export function CurriculumView({ sid, did }: { sid: string; did: string }) {
  const qc = useQueryClient();
  const { data: dbCourses } = useQuery({
    queryKey: ["co", did],
    queryFn: () => getCourses(did),
  });
  const { data: enrolls } = useQuery({
    queryKey: ["en", sid],
    queryFn: () => getEnrollments(sid),
  });

  const [expandedCourseId, setExpandedCourseId] = React.useState<string | null>(null);
  const [selectedPrereq, setSelectedPrereq] = React.useState<string | null>(null);

  // Normalise courses whether from DB or static seed
  const coursesToUse: DisplayCourse[] = React.useMemo(() => {
    if (dbCourses && dbCourses.length > 0) {
      return dbCourses.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        description: c.description || "",
        cr_hr: c.cr_hr ?? 3,
        ects: c.ects ?? 5,
        lecture_hours: c.lecture_hours ?? 3,
        lab_hours: c.lab_hours ?? 0,
        tutorial_hours: c.tutorial_hours ?? 0,
        category: c.category || "Core",
        prerequisites: c.prerequisites || "",
        outcomes: c.outcomes || [],
        cover_image: c.cover_image,
        semesterNumber: (c.sort_order ?? 0) < 20 ? 1 : 2,
      }));
    }
    return JIMMA_COURSES.map((c) => ({
      id: "seed-" + c.code,
      code: c.code,
      title: c.title,
      description: c.description,
      cr_hr: c.cr_hr,
      ects: c.ects,
      lecture_hours: c.lecture_hours,
      lab_hours: c.lab_hours,
      tutorial_hours: c.tutorial_hours,
      category: c.category,
      prerequisites: c.prerequisites ? c.prerequisites.join(", ") : "",
      outcomes: c.outcomes,
      cover_image: c.cover_image,
      semesterNumber: c.semester === "I" ? 1 : 2,
    }));
  }, [dbCourses]);

  const enrolledSet = new Set((enrolls ?? []).map((e) => e.course_id));

  const enrollMut = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "add" | "del" }) => {
      if (action === "add") await enroll(sid, id);
      else await unenroll(sid, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["en"] });
      toast.success("Enrollment status updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const semester1 = coursesToUse.filter((c) => c.semesterNumber === 1);
  const semester2 = coursesToUse.filter((c) => c.semesterNumber === 2);

  const calculateCrHr = (list: DisplayCourse[]) => list.reduce((sum, c) => sum + c.cr_hr, 0);
  const calculateECTS = (list: DisplayCourse[]) => list.reduce((sum, c) => sum + c.ects, 0);

  return (
    <div className="space-y-6">
      {/* Header and Credit Overview */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B1B3A]">Curriculum Structure</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Full semester breakdown with official Jimma University lecture, lab, and tutorial allocations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            Total CrHr: {calculateCrHr(coursesToUse)} hrs
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
            Total ECTS: {calculateECTS(coursesToUse)}
          </div>
        </div>
      </div>

      {/* Semester I Accordion Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 bg-gray-50/70 border-b border-gray-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              S1
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B1B3A]">Semester I</h3>
              <p className="text-[11px] text-gray-500 font-medium">
                {semester1.length} courses • {calculateCrHr(semester1)} Credit Hours • {calculateECTS(semester1)} ECTS
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {semester1.map((c) => (
            <CourseRowItem
              key={c.id}
              course={c}
              isEnrolled={enrolledSet.has(c.id)}
              isExpanded={expandedCourseId === c.id}
              onToggleExpand={() => setExpandedCourseId(expandedCourseId === c.id ? null : c.id)}
              onToggleEnroll={(action) => enrollMut.mutate({ id: c.id, action })}
              onSelectPrereq={(p) => setSelectedPrereq(p)}
              sid={sid}
            />
          ))}
        </div>
      </div>

      {/* Semester II Accordion Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 bg-gray-50/70 border-b border-gray-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              S2
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B1B3A]">Semester II</h3>
              <p className="text-[11px] text-gray-500 font-medium">
                {semester2.length} courses • {calculateCrHr(semester2)} Credit Hours • {calculateECTS(semester2)} ECTS
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {semester2.map((c) => (
            <CourseRowItem
              key={c.id}
              course={c}
              isEnrolled={enrolledSet.has(c.id)}
              isExpanded={expandedCourseId === c.id}
              onToggleExpand={() => setExpandedCourseId(expandedCourseId === c.id ? null : c.id)}
              onToggleEnroll={(action) => enrollMut.mutate({ id: c.id, action })}
              onSelectPrereq={(p) => setSelectedPrereq(p)}
              sid={sid}
            />
          ))}
        </div>
      </div>

      {/* Prerequisite Detail Modal */}
      {selectedPrereq && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPrereq(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Prerequisite Requirement
              </span>
              <button
                type="button"
                onClick={() => setSelectedPrereq(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-base font-bold text-[#0B1B3A]">{selectedPrereq}</h4>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              This course builds upon concepts taught in <span className="font-semibold text-gray-900">{selectedPrereq}</span>.
              Ensure you have completed or are concurrently registered for this foundational prerequisite before advancing.
            </p>
            <button
              type="button"
              onClick={() => setSelectedPrereq(null)}
              className="mt-5 w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseRowItem({
  course,
  isEnrolled,
  isExpanded,
  onToggleExpand,
  onToggleEnroll,
  onSelectPrereq,
  sid,
}: {
  course: DisplayCourse;
  isEnrolled: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleEnroll: (action: "add" | "del") => void;
  onSelectPrereq: (p: string) => void;
  sid: string;
}) {
  const lectureHours = course.lecture_hours ?? 3;
  const labHours = course.lab_hours ?? 0;
  const tutorialHours = course.tutorial_hours ?? 0;

  return (
    <div className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {course.cover_image && (
            <img
              src={course.cover_image}
              alt={course.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-2xs border border-gray-100"
            />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {course.code}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                {course.category ?? "General"}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
                {course.cr_hr ?? 3} CrHr / {course.ects ?? 5} ECTS
              </span>
              <span className="text-[10px] font-mono font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                L-{lectureHours} Lab-{labHours} Tut-{tutorialHours}
              </span>
              {course.prerequisites && (
                <button
                  type="button"
                  onClick={() => onSelectPrereq(course.prerequisites!)}
                  className="text-[10px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-100 transition-colors"
                >
                  Prereq: {course.prerequisites} ↗
                </button>
              )}
            </div>
            <h4 className="text-sm font-bold text-[#0B1B3A]">{course.title}</h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {isEnrolled ? (
            <button
              type="button"
              onClick={() => onToggleEnroll("del")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/50 transition-colors"
            >
              Drop
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleEnroll("add")}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
            >
              Enroll
            </button>
          )}

          <button
            type="button"
            onClick={onToggleExpand}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            title="Expand Units"
          >
            <CaretDown
              weight="bold"
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180 text-blue-600" : ""}`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          {course.outcomes && course.outcomes.length > 0 && (
            <div className="bg-blue-50/40 rounded-xl p-3 border border-blue-100/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Course Learning Outcomes
              </span>
              <ul className="mt-1.5 space-y-1 text-xs text-gray-600 list-disc list-inside">
                {course.outcomes.map((out, idx) => (
                  <li key={idx}>{out}</li>
                ))}
              </ul>
            </div>
          )}

          <CourseUnitsList courseId={course.id} sid={sid} isEnrolled={isEnrolled} />
        </div>
      )}
    </div>
  );
}

function CourseUnitsList({
  courseId,
  sid,
  isEnrolled,
}: {
  courseId: string;
  sid: string;
  isEnrolled: boolean;
}) {
  const qc = useQueryClient();
  const { data: units, isLoading } = useQuery({
    queryKey: ["un", courseId],
    queryFn: () => getUnits(courseId),
  });
  const { data: prog } = useQuery({
    queryKey: ["pr", sid],
    queryFn: () => getUnitProgress(sid),
  });

  const completedSet = new Set((prog ?? []).filter((p) => p.completed).map((p) => p.unit_id));

  const toggleMut = useMutation({
    mutationFn: ({ uid, c }: { uid: string; c: boolean }) => toggleUnitProgress(sid, uid, c),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pr"] }),
  });

  if (isLoading) {
    return <div className="text-xs text-gray-400 py-2">Loading syllabus units...</div>;
  }

  // HARD RULE: When units are empty: render "Course content coming soon" (no invented unit content!).
  if (!units || units.length === 0) {
    return (
      <div className="py-4 px-3 rounded-xl bg-gray-50/80 border border-dashed border-gray-200 text-center">
        <p className="text-xs text-gray-500 font-medium">Course content coming soon</p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Curriculum units and lecture modules are currently being verified by Jimma University faculty.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        Syllabus Modules
      </span>
      {units.map((u) => {
        const isDone = completedSet.has(u.id);
        return (
          <label
            key={u.id}
            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isDone
                ? "bg-emerald-50/30 border-emerald-100 text-gray-500"
                : "bg-white border-gray-200/60 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              disabled={!isEnrolled}
              checked={isDone}
              onChange={() => toggleMut.mutate({ uid: u.id, c: !isDone })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="min-w-0 flex-1">
              <span className={`text-xs font-semibold ${isDone ? "line-through text-gray-400" : "text-gray-800"}`}>
                {u.title}
              </span>
            </div>
            {isDone && <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600" />}
          </label>
        );
      })}
    </div>
  );
}

export default CurriculumView;