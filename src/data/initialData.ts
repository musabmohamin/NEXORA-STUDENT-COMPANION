export type Role = "student" | "admin";

export type Tier = "Beginner" | "Intermediate" | "Advanced";

export type Status =
  | "Not Started"
  | "In Progress"
  | "Submitted"
  | "Under Review"
  | "Accepted"
  | "Rejected"
  | "Revision Requested"
  | "Resubmitted";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  year: number;
  program: string;
  active: boolean;
  points: number;
  streak: number;
  github: string;
  joined: string;
}

export interface Unit {
  id: string;
  title: string;
  topics: string[];
  hours: number;
}

export interface Resource {
  title: string;
  kind: "PDF" | "Video" | "Link" | "Slides";
  url: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  year: number;
  semester: "I" | "II";
  credits: number;
  level: "Core" | "Applied" | "Advanced" | "General";
  description: string;
  prerequisites: string[];
  units: Unit[];
  resources: Resource[];
  cr_hr?: number;
  ects?: number;
  lecture_hours?: number;
  lab_hours?: number;
  tutorial_hours?: number;
  category?: string;
  cover_image?: string;
  department_id?: string;
  outcomes?: string[];
}

export interface RubricCriterion {
  id: string;
  label: string;
  weight: number;
}

export interface Project {
  id: string;
  courseId: string;
  tier: Tier;
  title: string;
  brief: string;
  deadline: string;
  rubric: RubricCriterion[];
}

export interface Attachment {
  name: string;
  size: number;
}

export interface TimelineEvent {
  label: string;
  at: string;
  note?: string;
}

export interface Submission {
  id: string;
  projectId: string;
  courseId: string;
  studentId: string;
  status: Status;
  summary: string;
  techStack: string[];
  repoUrl: string;
  demoUrl: string;
  testNotes: string;
  attachments: Attachment[];
  score: number | null;
  feedback: string;
  revisions: number;
  submittedAt: string | null;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  tone: "info" | "success" | "warning";
}

export interface Post {
  id: string;
  author: string;
  title: string;
  body: string;
  tags: string[];
  at: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  at: string;
}

export interface AppDB {
  users: User[];
  courses: Course[];
  projects: Project[];
  submissions: Submission[];
  notifications: Notification[];
  posts: Post[];
  logs: AuditLog[];
  /** studentId -> courseId -> completed unit ids */
  progress: Record<string, Record<string, string[]>>;
}

const iso = (days: number) => new Date(Date.now() + days * 86400000).toISOString();

export const users: User[] = [
  { id: "u-student", name: "Meron Tesfaye", email: "student@nexoda.com", password: "student123", role: "student", year: 3, program: "Information Science", active: true, points: 1840, streak: 9, github: "meron-dev", joined: "2023-09-11" },
  { id: "u-admin", name: "Dr. Yonas Bekele", email: "admin@nexoda.com", password: "admin123", role: "admin", year: 0, program: "Department of Information Science", active: true, points: 0, streak: 0, github: "yonasb", joined: "2019-02-04" },
  { id: "u-s2", name: "Abel Girma", email: "abel@nexoda.com", password: "student123", role: "student", year: 2, program: "Information Science", active: true, points: 1420, streak: 4, github: "abelg", joined: "2024-09-10" },
  { id: "u-s3", name: "Hanan Ahmed", email: "hanan@nexoda.com", password: "student123", role: "student", year: 4, program: "Information Science", active: true, points: 2310, streak: 13, github: "hanan-a", joined: "2022-09-12" },
  { id: "u-s4", name: "Kalkidan Desta", email: "kalkidan@nexoda.com", password: "student123", role: "student", year: 1, program: "Information Science", active: true, points: 310, streak: 0, github: "kalki-d", joined: "2025-09-15" },
  { id: "u-s5", name: "Samuel Osei", email: "samuel@nexoda.com", password: "student123", role: "student", year: 3, program: "Information Science", active: false, points: 1680, streak: 2, github: "sosei", joined: "2023-09-14" },
];

const base = (over: Partial<Submission>): Submission => ({
  id: "sub",
  projectId: "",
  courseId: "",
  studentId: "",
  status: "Not Started",
  summary: "",
  techStack: [],
  repoUrl: "",
  demoUrl: "",
  testNotes: "",
  attachments: [],
  score: null,
  feedback: "",
  revisions: 0,
  submittedAt: null,
  updatedAt: iso(-1),
  timeline: [],
  ...over,
});

export const submissions: Submission[] = [
  base({
    id: "sub-1",
    projectId: "p-ins103-b",
    courseId: "ins103",
    studentId: "u-student",
    status: "Accepted",
    summary: "A Python CLI task tracker with JSON persistence, priority sorting and a pytest suite covering the command parser.",
    techStack: ["Python", "pytest", "JSON"],
    repoUrl: "https://github.com/meron-dev/cli-task-tracker",
    demoUrl: "https://asciinema.org/a/demo",
    testNotes: "18 pytest cases, 91% line coverage, manual matrix for malformed input.",
    attachments: [{ name: "task-tracker-report.pdf", size: 412000 }],
    score: 92,
    feedback: "Clean module boundaries. Add schema validation on the storage layer next time.",
    submittedAt: iso(-24),
    updatedAt: iso(-18),
    timeline: [
      { label: "Started", at: iso(-30) },
      { label: "Submitted", at: iso(-24) },
      { label: "Under Review", at: iso(-22) },
      { label: "Accepted", at: iso(-18), note: "Score 92 / 100" },
    ],
  }),
  base({
    id: "sub-2",
    projectId: "p-ins203-b",
    courseId: "ins203",
    studentId: "u-student",
    status: "Under Review",
    summary: "Campus library schema normalised to 3NF with seed data for 240 loans and ten analytical queries.",
    techStack: ["PostgreSQL", "SQL", "dbdiagram"],
    repoUrl: "https://github.com/meron-dev/library-schema",
    testNotes: "Constraints verified with insert conflict tests on duplicate loans and orphan rows.",
    attachments: [{ name: "library-erd.png", size: 288000 }],
    submittedAt: iso(-2),
    updatedAt: iso(-2),
    timeline: [
      { label: "Started", at: iso(-8) },
      { label: "Submitted", at: iso(-2) },
      { label: "Under Review", at: iso(-2) },
    ],
  }),
  base({
    id: "sub-3",
    projectId: "p-ins301-b",
    courseId: "ins301",
    studentId: "u-student",
    status: "Revision Requested",
    summary: "Inverted index over 500 abstracts with stop word removal and boolean query evaluation.",
    techStack: ["Python", "NLTK", "Streamlit"],
    repoUrl: "https://github.com/meron-dev/inverted-index",
    demoUrl: "https://invindex-demo.streamlit.app",
    testNotes: "Query parsing tested manually; no automated relevance harness yet.",
    feedback: "Ranking section is missing BM25 output samples and the README has no evaluation numbers.",
    revisions: 1,
    submittedAt: iso(-6),
    updatedAt: iso(-3),
    timeline: [
      { label: "Started", at: iso(-12) },
      { label: "Submitted", at: iso(-6) },
      { label: "Under Review", at: iso(-5) },
      { label: "Revision Requested", at: iso(-3), note: "Add ranking evaluation" },
    ],
  }),
  base({
    id: "sub-4",
    projectId: "p-ins302-b",
    courseId: "ins302",
    studentId: "u-student",
    status: "In Progress",
    summary: "Portfolio deployment with GitHub Actions, cache headers and a custom domain.",
    techStack: ["Vite", "GitHub Actions"],
    updatedAt: iso(-1),
    timeline: [{ label: "Started", at: iso(-4) }],
  }),
  base({
    id: "sub-5",
    projectId: "p-ins203-b",
    courseId: "ins203",
    studentId: "u-s2",
    status: "Accepted",
    summary: "Normalised library schema with reservation triggers and a reporting view for overdue loans.",
    techStack: ["PostgreSQL", "SQL"],
    repoUrl: "https://github.com/abelg/library-db",
    testNotes: "Trigger tests on reservation conflicts and overdue recalculation.",
    score: 86,
    feedback: "Solid modelling. Watch out for the missing index on loan dates.",
    submittedAt: iso(-9),
    updatedAt: iso(-7),
    timeline: [
      { label: "Submitted", at: iso(-9) },
      { label: "Under Review", at: iso(-8) },
      { label: "Accepted", at: iso(-7) },
    ],
  }),
  base({
    id: "sub-6",
    projectId: "p-ins301-i",
    courseId: "ins301",
    studentId: "u-s3",
    status: "Submitted",
    summary: "BM25 ranking engine benchmarked against TF-IDF on 1,200 judged query document pairs.",
    techStack: ["Python", "NumPy", "Jupyter"],
    repoUrl: "https://github.com/hanan-a/search-ranking",
    testNotes: "Evaluation notebook plus 12 unit tests for the scorer.",
    submittedAt: iso(-1),
    updatedAt: iso(-1),
    timeline: [{ label: "Submitted", at: iso(-1) }],
  }),
];

export const progress: AppDB["progress"] = {
  "u-student": {
    ins101: ["ins101-u1", "ins101-u2"],
    ins103: ["ins103-u1", "ins103-u2", "ins103-u3"],
    ins203: ["ins203-u1", "ins203-u2"],
    ins301: ["ins301-u1"],
    ins302: ["ins302-u1"],
    ins102: ["ins102-u1"],
    ins201: ["ins201-u1"],
  },
  "u-s2": { ins101: ["ins101-u1"], ins102: ["ins102-u1", "ins102-u2"], ins203: ["ins203-u1", "ins203-u2", "ins203-u3"] },
  "u-s3": { ins301: ["ins301-u1", "ins301-u2", "ins301-u3"], ins302: ["ins302-u1"], ins401: ["ins401-u1"], ins402: ["ins402-u1"] },
  "u-s4": { ins101: ["ins101-u1"] },
};

export const notifications: Notification[] = [
  { id: "n1", title: "Revision requested", body: "Information Retrieval: Inverted Index Builder needs ranking evaluation before resubmission.", at: iso(-3), read: false, tone: "warning" },
  { id: "n2", title: "Jimma Cursor Hackathon is open", body: "Team registration closes in six days. Build track details are in the Community hub.", at: iso(-1), read: false, tone: "info" },
  { id: "n3", title: "Submission accepted", body: "Programming Fundamentals: CLI Task Tracker scored 92 / 100.", at: iso(-18), read: true, tone: "success" },
];

export const posts: Post[] = [
  { id: "c1", author: "Hanan Ahmed", title: "Looking for a retrieval teammate", body: "I am building a BM25 plus embeddings comparison for the Capstone. Need someone comfortable with evaluation notebooks and report writing.", tags: ["Capstone", "IR"], at: iso(-1) },
  { id: "c2", author: "Abel Girma", title: "Database study circle, Thursdays", body: "Weekly two hour session on query plans and normalisation exercises in the library lab. Bring your own laptop.", tags: ["Study Group", "Databases"], at: iso(-4) },
  { id: "c3", author: "Meron Tesfaye", title: "Jimma Cursor Hackathon team forming", body: "Two slots left. Focus is an offline first library catalogue for rural schools. Stack is flexible, we start with a scoping call.", tags: ["Hackathon", "Teams"], at: iso(-2) },
];

export const logs: AuditLog[] = [
  { id: "l1", actor: "Dr. Yonas Bekele", action: "Published rubric weights for INS301 Intermediate", at: iso(-2) },
  { id: "l2", actor: "System", action: "Deadline extension applied to INS203 Beginner for 3 students", at: iso(-5) },
  { id: "l3", actor: "Dr. Yonas Bekele", action: "Accepted submission sub-1 (CLI Task Tracker) with score 92", at: iso(-18) },
];

export const demoAccounts = {
  student: { email: "student@nexoda.com", password: "student123" },
  admin: { email: "admin@nexoda.com", password: "admin123" },
};

export const hackathon = {
  title: "Jimma Cursor Hackathon 2026",
  window: "Registration closes in 6 days",
  blurb: "A 48 hour build sprint for offline first information tools. Teams of three, any stack, judged on impact and evidence.",
  tracks: ["Offline first catalogues", "Assistive reading tools", "Campus data dashboards"],
};