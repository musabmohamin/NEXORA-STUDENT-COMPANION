import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  BookOpen,
  Kanban,
  Lightbulb,
  Trophy,
  CaretRight,
  House,
  Flame,
  GraduationCap,
  Sparkle,
  Check,
} from "@phosphor-icons/react";
import {
  getCourses,
  getEnrollments,
  getUnitProgress,
  getProjects,
  getSubmissions,
  createOrUpdateSubmission,
  submitProject,
  getPointsTransactions,
} from "@/services/api";
import { EduCanvas } from "@/components/EduCanvas";
import { CurriculumView } from "@/components/CurriculumView";
import { HackathonView } from "@/components/HackathonView";
import { JIMMA_COURSES } from "@/data/curriculumData";
import type { Project } from "@/types";

type Tab = "dashboard" | "courses" | "projects" | "opportunities" | "achievements";

export function StudentPortal() {
  const { user, activeDepartment } = useAppAuth();
  const [tab, setTab] = React.useState<Tab>("dashboard");
  const sid = user?.id;
  const did = activeDepartment?.id;

  if (!sid || !did) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please select a curriculum program to view the academic workspace.
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: House },
    { id: "courses", label: "Curriculum & Courses", icon: BookOpen },
    { id: "projects", label: "Projects & Labs", icon: Kanban },
    { id: "opportunities", label: "Hackathons & Events", icon: Lightbulb, badge: "New" },
    { id: "achievements", label: "Badges & Ranks", icon: Trophy },
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      <EduCanvas />
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-3 flex-wrap gap-3">
          <div className="flex gap-1.5 overflow-x-auto py-1">
            {tabs.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                type="button"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  tab === id
                    ? "bg-[#0B1B3A] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-200/70"
                }`}
              >
                <Icon weight={tab === id ? "fill" : "regular"} className="w-4 h-4" />
                <span>{label}</span>
                {badge && (
                  <span className="text-[9px] uppercase tracking-wider bg-blue-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200/60 shadow-2xs">
            <GraduationCap weight="bold" className="w-4 h-4 text-blue-600" />
            <span>{activeDepartment?.name}</span>
          </div>
        </div>

        {tab === "dashboard" && (
          <DashboardView
            sid={sid}
            did={did}
            onNavigateCourses={() => setTab("courses")}
            onNavigateHackathon={() => setTab("opportunities")}
          />
        )}
        {tab === "courses" && <CurriculumView sid={sid} did={did} />}
        {tab === "projects" && <ProjectsView sid={sid} did={did} />}
        {tab === "opportunities" && <HackathonView sid={sid} did={did} />}
        {tab === "achievements" && <AchievementsView sid={sid} />}
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD VIEW ---------------- */
function DashboardView({
  sid,
  did,
  onNavigateCourses,
  onNavigateHackathon,
}: {
  sid: string;
  did: string;
  onNavigateCourses: () => void;
  onNavigateHackathon: () => void;
}) {
  const { data: enrolls } = useQuery({ queryKey: ["en", sid], queryFn: () => getEnrollments(sid) });
  const { data: prog } = useQuery({ queryKey: ["pr", sid], queryFn: () => getUnitProgress(sid) });
  const { data: pts } = useQuery({ queryKey: ["po", sid], queryFn: () => getPointsTransactions(sid) });
  const { data: dbCourses } = useQuery({ queryKey: ["co", did], queryFn: () => getCourses(did) });

  const totalPoints = (pts ?? []).reduce((acc, t) => acc + t.points, 120);
  const unitsCompleted = (prog ?? []).filter((p) => p.completed).length;
  const enrolledCount = enrolls?.length ?? 0;

  const activeCourse = (dbCourses && dbCourses.length > 0)
    ? dbCourses[0]
    : {
        code: JIMMA_COURSES[0].code,
        title: JIMMA_COURSES[0].title,
        description: JIMMA_COURSES[0].description,
        cr_hr: JIMMA_COURSES[0].cr_hr,
        ects: JIMMA_COURSES[0].ects,
        category: JIMMA_COURSES[0].category,
      };

  return (
    <div className="space-y-6">
      {/* Continue Learning Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#0B1B3A] via-[#102B5E] to-[#1E3A8A] text-white p-6 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-semibold text-blue-200 mb-2.5">
              <Sparkle weight="fill" className="w-3.5 h-3.5 text-blue-300" />
              <span>Continue Academic Progress</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {activeCourse.title} ({activeCourse.code})
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-blue-100/90 line-clamp-2">
              {activeCourse.description}
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-blue-200">
              <span>{activeCourse.cr_hr ?? 3} Credit Hours</span>
              <span>•</span>
              <span>{activeCourse.ects ?? 5} ECTS</span>
              <span>•</span>
              <span>{activeCourse.category ?? "Core"}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onNavigateCourses}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Open Course Syllabus</span>
              <CaretRight weight="bold" className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateHackathon}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-xs text-white transition-all flex items-center justify-center gap-2"
            >
              <Lightbulb weight="fill" className="w-4 h-4 text-amber-300" />
              <span>Cursor Hackathon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Count-Up Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
            <span>Daily Streak</span>
            <Flame weight="fill" className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0B1B3A]">4</span>
            <span className="text-xs font-bold text-amber-600">days streak</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-4/5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
            <span>Honor Points</span>
            <Trophy weight="fill" className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0B1B3A]">{totalPoints}</span>
            <span className="text-xs font-semibold text-green-600">+25 this week</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full w-3/4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
            <span>Enrolled Courses</span>
            <BookOpen weight="fill" className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0B1B3A]">{enrolledCount}</span>
            <span className="text-xs font-medium text-gray-500">active terms</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full w-1/2" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
            <span>Completed Units</span>
            <Check weight="bold" className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0B1B3A]">{unitsCompleted}</span>
            <span className="text-xs font-medium text-gray-500">lessons read</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full w-2/5" />
          </div>
        </div>
      </div>

      {/* Cursor Hackathon Jimma Quick Spotlight */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Lightbulb weight="fill" className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/50">
                Official Hackathon
              </span>
              <span className="text-xs text-gray-500">Nov 21, 2026 • Jimma University</span>
            </div>
            <h3 className="text-base font-bold text-[#0B1B3A] mt-1">
              Cursor Hackathon Jimma — 24-Hour Build Event
            </h3>
            <p className="text-xs text-gray-600 mt-0.5 max-w-xl">
              24 hours of AI-assisted engineering with Cursor. Build, ship, and compete for tech prizes.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateHackathon}
          type="button"
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
        >
          <span>View Event & In-App Apply</span>
          <CaretRight weight="bold" className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- PROJECTS & LABS VIEW ---------------- */
function ProjectsView({ sid, did }: { sid: string; did: string }) {
  const qc = useQueryClient();
  const { data: enrolls } = useQuery({ queryKey: ["en", sid], queryFn: () => getEnrollments(sid) });
  const { data: subs } = useQuery({ queryKey: ["su", sid], queryFn: () => getSubmissions(sid) });
  const { data: courses } = useQuery({ queryKey: ["co", did], queryFn: () => getCourses(did) });

  const enrolledIds = new Set((enrolls ?? []).map((e) => e.course_id));
  const activeCourses = (courses ?? []).filter((c) => enrolledIds.has(c.id));
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(
    activeCourses.length > 0 ? activeCourses[0].id : null
  );

  const { data: projects } = useQuery({
    queryKey: ["pj", selectedCourseId],
    queryFn: () => getProjects(selectedCourseId!),
    enabled: !!selectedCourseId,
  });

  const subMap = new Map((subs ?? []).map((s) => [s.project_id, s]));

  if (activeCourses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center shadow-2xs">
        <Kanban className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-gray-700">No active course enrollments</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Enroll in courses from the Curriculum tab to view assigned labs, practical rubrics, and project deliverables.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
        <h2 className="text-lg font-bold text-[#0B1B3A]">Course Projects & Lab Deliverables</h2>
        <div className="flex gap-2 mt-4 flex-wrap">
          {activeCourses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCourseId === c.id
                  ? "bg-[#0B1B3A] text-white shadow-2xs"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/60"
              }`}
            >
              {c.code} — {c.title}
            </button>
          ))}
        </div>
      </div>

      {selectedCourseId && (
        <div className="space-y-3">
          {!projects || projects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center text-xs text-gray-400">
              No projects or laboratory rubrics assigned for this course yet.
            </div>
          ) : (
            projects.map((p) => (
              <ProjectItemCard
                key={p.id}
                p={p}
                s={subMap.get(p.id)}
                sid={sid}
                onDone={() => qc.invalidateQueries({ queryKey: ["su"] })}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ProjectItemCard({
  p,
  s,
  sid,
  onDone,
}: {
  p: Project;
  s: any;
  sid: string;
  onDone: () => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [gh, setGh] = React.useState(s?.github_url ?? "");
  const [demo, setDemo] = React.useState(s?.demo_url ?? "");
  const [summary, setSummary] = React.useState(s?.summary ?? "");

  const saveMut = useMutation({
    mutationFn: (submit?: boolean) =>
      createOrUpdateSubmission(sid, p.id, { github_url: gh, demo_url: demo, summary }).then((sub) =>
        submit ? submitProject(sub.id, { github_url: gh, demo_url: demo, summary }) : null
      ),
    onSuccess: (_, submit) => {
      setIsEditing(false);
      onDone();
      toast.success(submit ? "Project submitted for faculty review" : "Submission draft saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const status = s?.status ?? "Not Started";

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {p.level}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#0B1B3A]">{p.title ?? `${p.level} Project`}</h4>
          <p className="text-xs text-gray-600 mt-1">{p.requirements}</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
          {status}
        </span>
      </div>

      {s?.feedback && (
        <div className="bg-amber-50 rounded-xl p-3 mb-3 text-xs text-amber-900 border border-amber-200/60">
          <span className="font-bold">Faculty Review: </span>
          {s.feedback}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <input
            value={gh}
            onChange={(e) => setGh(e.target.value)}
            placeholder="GitHub repository URL"
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-500"
          />
          <input
            value={demo}
            onChange={(e) => setDemo(e.target.value)}
            placeholder="Live Demo / Deployment URL (optional)"
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-500"
          />
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Project summary & technical architecture notes..."
            rows={2}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => saveMut.mutate(false)}
              className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => saveMut.mutate(true)}
              className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs"
            >
              Submit for Review
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          {s ? "Update Deliverables ↗" : "Start Project Submission →"}
        </button>
      )}
    </div>
  );
}

/* ---------------- ACHIEVEMENTS VIEW ---------------- */
function AchievementsView({ sid }: { sid: string }) {
  const { data: pts } = useQuery({
    queryKey: ["po", sid],
    queryFn: () => getPointsTransactions(sid),
  });

  const total = (pts ?? []).reduce((a, t) => a + t.points, 120);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0B1B3A]">Academic Recognition & Honors</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Earned through verified coursework milestones, peer collaboration, and hackathon participation.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-blue-600">{total}</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Honor Score</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Point History Ledger
        </h3>
        {!pts || pts.length === 0 ? (
          <div className="text-xs text-gray-400 py-6 text-center">
            No transactions yet. Complete course modules or submit projects to earn points!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pts.map((t) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{t.description}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600">+{t.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentPortal;