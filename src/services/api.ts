import { supabase } from "@/integrations/supabase/client";
import type {
  Profile, Department, Course, Unit, Project, Enrollment,
  UnitProgress, Submission, SubmissionVersion, Announcement,
  Application, CollaborationPost, JoinRequest, PointsTransaction,
  Notification, ChatMessage, AuditLog, Resource,
} from "@/types";

export async function getDepartments(): Promise<Department[]> {
  const { data, error } = await supabase.from("departments").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getCourses(departmentId: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("department_id", departmentId)
    .eq("status", "published")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getAllCourses(departmentId: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("department_id", departmentId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase.from("courses").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getUnits(courseId: string): Promise<Unit[]> {
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index");
  if (error) throw error;
  return data ?? [];
}

export async function getProjects(courseId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("course_id", courseId)
    .in("status", ["published", "empty"]);
  if (error) throw error;
  return data ?? [];
}

export async function getEnrollments(studentId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase.from("enrollments").select("*").eq("student_id", studentId);
  if (error) throw error;
  return data ?? [];
}

export async function enroll(studentId: string, courseId: string): Promise<Enrollment> {
  const { data, error } = await supabase
    .from("enrollments")
    .insert({ student_id: studentId, course_id: courseId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function unenroll(studentId: string, courseId: string): Promise<void> {
  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("student_id", studentId)
    .eq("course_id", courseId);
  if (error) throw error;
}

export async function getUnitProgress(studentId: string): Promise<UnitProgress[]> {
  const { data, error } = await supabase.from("unit_progress").select("*").eq("student_id", studentId);
  if (error) throw error;
  return data ?? [];
}

export async function toggleUnitProgress(studentId: string, unitId: string, completed: boolean): Promise<void> {
  if (completed) {
    const { error } = await supabase
      .from("unit_progress")
      .upsert({ student_id: studentId, unit_id: unitId, completed: true, completed_at: new Date().toISOString() }, { onConflict: "student_id,unit_id" });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("unit_progress")
      .delete()
      .eq("student_id", studentId)
      .eq("unit_id", unitId);
    if (error) throw error;
  }
}

export async function getSubmissions(studentId: string): Promise<Submission[]> {
  const { data, error } = await supabase.from("submissions").select("*").eq("student_id", studentId);
  if (error) throw error;
  return data ?? [];
}

export async function getSubmissionVersions(submissionId: string): Promise<SubmissionVersion[]> {
  const { data, error } = await supabase
    .from("submission_versions")
    .select("*")
    .eq("submission_id", submissionId)
    .order("version_number", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createOrUpdateSubmission(
  studentId: string,
  projectId: string,
  fields: Partial<Submission>
): Promise<Submission> {
  const { data: existing } = await supabase
    .from("submissions")
    .select("id")
    .eq("student_id", studentId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("submissions")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("submissions")
      .insert({ student_id: studentId, project_id: projectId, ...fields })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function submitProject(submissionId: string, fields: Partial<Submission>): Promise<void> {
  const { data: current } = await supabase.from("submissions").select("*").eq("id", submissionId).single();
  if (!current) throw new Error("Submission not found");

  const { count } = await supabase
    .from("submission_versions")
    .select("*", { count: "exact", head: true })
    .eq("submission_id", submissionId);

  await supabase.from("submission_versions").insert({
    submission_id: submissionId,
    version_number: (count ?? 0) + 1,
    github_url: fields.github_url ?? current.github_url,
    summary: fields.summary ?? current.summary,
    status: "Submitted",
  });

  const { error } = await supabase
    .from("submissions")
    .update({ ...fields, status: "Submitted", submitted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", submissionId);
  if (error) throw error;
}

export async function getAllSubmissionsForAdmin(): Promise<(Submission & { profiles: Profile; projects: Project })[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*, profiles(*), projects(*, courses(*))")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as any;
}

export async function reviewSubmission(
  submissionId: string,
  reviewerId: string,
  fields: { status: string; score?: number; feedback?: string }
): Promise<void> {
  const { error } = await supabase
    .from("submissions")
    .update({ ...fields, reviewer_id: reviewerId, updated_at: new Date().toISOString() })
    .eq("id", submissionId);
  if (error) throw error;
}

export async function getAnnouncements(departmentId?: string): Promise<Announcement[]> {
  let query = supabase.from("announcements").select("*").eq("status", "published").order("created_at", { ascending: false });
  if (departmentId) query = query.eq("department_id", departmentId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function applyToAnnouncement(studentId: string, announcementId: string, motivation: string, links?: string[]): Promise<void> {
  const { error } = await supabase.from("applications").insert({
    student_id: studentId,
    announcement_id: announcementId,
    motivation,
    links: links ?? [],
  });
  if (error) throw error;
}

export async function getMyApplications(studentId: string): Promise<Application[]> {
  const { data, error } = await supabase.from("applications").select("*").eq("student_id", studentId);
  if (error) throw error;
  return data ?? [];
}

export async function getCollaborationPosts(departmentId?: string): Promise<(CollaborationPost & { profiles: Profile })[]> {
  let query = supabase.from("collaboration_posts").select("*, profiles(*)").eq("status", "open").order("created_at", { ascending: false });
  if (departmentId) query = query.eq("department_id", departmentId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as any;
}

export async function createCollaborationPost(studentId: string, fields: { title: string; type?: string; description?: string; skills?: string[]; team_size?: number; department_id?: string }): Promise<CollaborationPost> {
  const { data, error } = await supabase
    .from("collaboration_posts")
    .insert({ student_id: studentId, ...fields })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function requestJoin(postId: string, studentId: string): Promise<void> {
  const { error } = await supabase.from("join_requests").insert({ post_id: postId, student_id: studentId });
  if (error) throw error;
}

export async function respondToJoinRequest(requestId: string, status: "accepted" | "declined"): Promise<void> {
  const { error } = await supabase.from("join_requests").update({ status }).eq("id", requestId);
  if (error) throw error;
}

export async function getPointsTransactions(studentId: string): Promise<PointsTransaction[]> {
  const { data, error } = await supabase
    .from("points_transactions")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function awardPoints(studentId: string, points: number, description: string, ruleId?: string, sourceId?: string): Promise<void> {
  const { error } = await supabase.from("points_transactions").insert({
    student_id: studentId,
    points,
    description,
    rule_id: ruleId ?? null,
    source_id: sourceId ?? null,
  });
  if (error) throw error;
}

export async function getNotifications(studentId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw error;
}

export async function getChatHistory(studentId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function saveChatMessage(studentId: string, role: "user" | "assistant", content: string): Promise<void> {
  const { error } = await supabase.from("chat_messages").insert({ student_id: studentId, role, content });
  if (error) throw error;
}

export async function getResources(courseId?: string, departmentId?: string): Promise<Resource[]> {
  let query = supabase.from("resources").select("*").order("created_at", { ascending: false });
  if (courseId) query = query.eq("course_id", courseId);
  if (departmentId) query = query.eq("department_id", departmentId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function updateProfile(userId: string, fields: Partial<Profile>): Promise<void> {
  const { error } = await supabase.from("profiles").update(fields).eq("id", userId);
  if (error) throw error;
}

export async function logAudit(adminId: string, action: string, entityType: string, entityId: string, details?: any): Promise<void> {
  await supabase.from("audit_log").insert({ admin_id: adminId, action, entity_type: entityType, entity_id: entityId, details: details ?? null });
}

export async function getAdminStats() {
  const [coursesRes, submissionsRes, appsRes, collabRes] = await Promise.all([
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("submissions").select("id, status, score").not("status", "eq", "Not Started"),
    supabase.from("applications").select("id, status"),
    supabase.from("collaboration_posts").select("id", { count: "exact", head: true }).eq("status", "open"),
  ]);
  const submissions = submissionsRes.data ?? [];
  return {
    totalCourses: coursesRes.count ?? 0,
    totalSubmissions: submissions.length,
    avgScore: submissions.length > 0 ? Math.round(submissions.reduce((a: number, s: any) => a + (s.score ?? 0), 0) / submissions.filter((s: any) => s.score != null).length) || 0 : 0,
    pendingApplications: (appsRes.data ?? []).filter((a: any) => a.status === "Pending").length,
    openCollaborations: collabRes.count ?? 0,
  };
}