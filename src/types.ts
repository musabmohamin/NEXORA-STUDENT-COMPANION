import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export type Profile = Tables["profiles"]["Row"];
export type Department = Tables["departments"]["Row"] & {
  is_common?: boolean | null;
};
export type AcademicYear = Tables["academic_years"]["Row"];
export type Semester = Tables["semesters"]["Row"];
export type Course = Tables["courses"]["Row"] & {
  cr_hr?: number | null;
  ects?: number | null;
  lecture_hours?: number | null;
  lab_hours?: number | null;
  tutorial_hours?: number | null;
  category?: string | null;
  cover_image?: string | null;
};
export type Unit = Tables["units"]["Row"];
export type Resource = Tables["resources"]["Row"];
export type Project = Tables["projects"]["Row"];
export type Enrollment = Tables["enrollments"]["Row"];
export type UnitProgress = Tables["unit_progress"]["Row"];
export type Submission = Tables["submissions"]["Row"];
export type SubmissionVersion = Tables["submission_versions"]["Row"];
export type SubmissionFile = Tables["submission_files"]["Row"];
export type Announcement = Tables["announcements"]["Row"];
export type Application = Tables["applications"]["Row"];
export type CollaborationPost = Tables["collaboration_posts"]["Row"];
export type JoinRequest = Tables["join_requests"]["Row"];
export type PointsRule = Tables["points_rules"]["Row"];
export type PointsTransaction = Tables["points_transactions"]["Row"];
export type Notification = Tables["notifications"]["Row"];
export type ChatMessage = Tables["chat_messages"]["Row"];
export type AuditLog = Tables["audit_log"]["Row"];

export type CourseWithUnits = Course & { units: Unit[]; projects: Project[] };
export type SubmissionWithProject = Submission & { project: Project; course: Course };
export type AnnouncementWithApps = Announcement & { applications: Application[] };
export type CollabWithRequests = CollaborationPost & { requests: JoinRequest[]; owner: Profile };

export type DashboardStats = {
  totalPoints: number;
  coursesEnrolled: number;
  unitsCompleted: number;
  unitsTotal: number;
  submissionsInProgress: number;
  submissionsSubmitted: number;
  submissionsAccepted: number;
};

export type RubricCriteria = {
  name: string;
  maxPoints: number;
  description?: string;
};

export type Rubric = {
  criteria: RubricCriteria[];
  totalPoints: number;
};

export const PROJECT_STATUSES = [
  "Not Started",
  "In Progress",
  "Submitted",
  "Under Review",
  "Revision Requested",
  "Resubmitted",
  "Accepted",
  "Rejected",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const ANNOUNCEMENT_CATEGORIES = [
  "hackathon",
  "internship",
  "scholarship",
  "competition",
  "workshop",
  "research",
  "news",
] as const;

export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];

export const COLLAB_TYPES = ["study_group", "project_team"] as const;
export type CollabType = (typeof COLLAB_TYPES)[number];