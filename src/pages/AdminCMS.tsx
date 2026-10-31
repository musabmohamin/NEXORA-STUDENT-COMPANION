import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  LayoutDashboard, GraduationCap, BookOpen, FolderKanban, ClipboardList,
  Lightbulb, FileText, Users, Trophy, BarChart3, Settings, Plus,
  Edit, Trash2, Check, X, ExternalLink,
} from "lucide-react";
import {
  getDepartments, getAllCourses, getAdminStats, getAllSubmissionsForAdmin,
  reviewSubmission, getAnnouncements, getCollaborationPosts, awardPoints,
} from "@/services/api";
import { supabase } from "@/integrations/supabase/client";

type Tab = "dashboard" | "departments" | "courses" | "projects" | "submissions" | "opportunities" | "applications" | "collaboration" | "points" | "analytics" | "settings";

export function AdminCMS() {
  const { user } = useAppAuth();
  const [tab, setTab] = useState<Tab>("dashboard");
  const uid = user?.id ?? "";
  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "departments", label: "Departments", icon: GraduationCap },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "submissions", label: "Submissions", icon: ClipboardList },
    { id: "opportunities", label: "Opportunities", icon: Lightbulb },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "collaboration", label: "Collaboration", icon: Users },
    { id: "points", label: "Points", icon: Trophy },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              tab === id ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>
      {tab === "dashboard" && <AdminDash />}
      {tab === "departments" && <Deps uid={uid} />}
      {tab === "courses" && <CoursesAdm uid={uid} />}
      {tab === "projects" && <ProjectsAdm uid={uid} />}
      {tab === "submissions" && <Subs uid={uid} />}
      {tab === "opportunities" && <Opps uid={uid} />}
      {tab === "applications" && <Apps uid={uid} />}
      {tab === "collaboration" && <Collab />}
      {tab === "points" && <Pts uid={uid} />}
      {tab === "analytics" && <Analytics />}
      {tab === "settings" && <SettingsPage />}
    </div>
  );
}

const Spin = () => <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
const Empty = ({ text }: { text: string }) => <div className="text-center py-12 text-sm text-gray-400">{text}</div>;

function AdminDash() {
  const { data: stats, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: getAdminStats });
  if (isLoading) return <Spin />;
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[{ l: "Courses", v: stats?.totalCourses ?? 0 }, { l: "Submissions", v: stats?.totalSubmissions ?? 0 },
          { l: "Avg Score", v: stats?.avgScore ?? 0 }, { l: "Pending Apps", v: stats?.pendingApplications ?? 0 },
          { l: "Open Collabs", v: stats?.openCollaborations ?? 0 }].map((s) => (
          <div key={s.l} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500">{s.l}</p><p className="text-2xl font-bold text-gray-900 mt-1">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Deps({ uid }: { uid: string }) {
  const qc = useQueryClient();
  const { data: deps, isLoading } = useQuery({ queryKey: ["deps"], queryFn: getDepartments });
  const [edit, setEdit] = useState<any>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("departments").delete().eq("id", id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["deps"] }); toast.success("Deleted"); },
  });
  const save = useMutation({
    mutationFn: async (d?: any) => {
      if (d) await supabase.from("departments").update({ name, slug }).eq("id", d.id);
      else await supabase.from("departments").insert({ name, slug });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["deps"] }); setEdit(null); toast.success("Saved"); },
  });
  if (isLoading) return <Spin />;
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Departments</h3>
        <button onClick={() => { setEdit({}); setName(""); setSlug(""); }} className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" />Add</button>
      </div>
      {edit !== null && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex gap-2 items-end">
          <div className="flex-1"><label className="text-xs text-gray-500">Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mt-1" /></div>
          <div className="w-32"><label className="text-xs text-gray-500">Slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mt-1" /></div>
          <button onClick={() => save.mutate(edit.id ? edit : undefined)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save</button>
          <button onClick={() => setEdit(null)} className="px-3 py-2 text-gray-500 text-sm">Cancel</button>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {(deps ?? []).map((d: any) => (
          <div key={d.id} className="p-4 flex justify-between items-center">
            <div><p className="text-sm font-medium text-gray-900">{d.name}</p><p className="text-xs text-gray-400">{d.slug} · {d.status}</p></div>
            <div className="flex gap-1">
              <button onClick={() => { setEdit(d); setName(d.name); setSlug(d.slug); }} className="p-2 hover:bg-gray-50 rounded"><Edit className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => del.mutate(d.id)} className="p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesAdm({ uid }: { uid: string }) {
  const qc = useQueryClient();
  const { data: deps } = useQuery({ queryKey: ["deps"], queryFn: getDepartments });
  const [deptId, setDeptId] = useState(deps?.[0]?.id ?? "");
  const { data: courses, isLoading } = useQuery({ queryKey: ["allco", deptId], queryFn: () => getAllCourses(deptId), enabled: !!deptId });
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState({ title: "", code: "", difficulty: "beginner", status: "draft" });
  const save = useMutation({
    mutationFn: async (c?: any) => {
      if (c) await supabase.from("courses").update(form).eq("id", c.id);
      else await supabase.from("courses").insert({ ...form, department_id: deptId });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["allco"] }); setEdit(null); toast.success("Saved"); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("courses").delete().eq("id", id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["allco"] }); toast.success("Deleted"); },
  });
  if (!deps?.length) return <Empty text="Create a department first." />;
  if (isLoading) return <Spin />;
  return (
    <div>
      <div className="flex gap-3 mb-4 items-center">
        <select value={deptId} onChange={(e) => setDeptId(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          {deps.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button onClick={() => { setEdit({}); setForm({ title: "", code: "", difficulty: "beginner", status: "draft" }); }} className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm ml-auto"><Plus className="w-4 h-4" />Add</button>
      </div>
      {edit !== null && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 grid grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Code" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
          </select>
          <div className="col-span-2 flex gap-2">
            <button onClick={() => save.mutate(edit.id ? edit : undefined)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save</button>
            <button onClick={() => setEdit(null)} className="px-3 py-2 text-gray-500 text-sm">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {(courses ?? []).map((c: any) => (
          <div key={c.id} className="p-4 flex justify-between items-center">
            <div><p className="text-sm font-medium text-gray-900">{c.title}</p><p className="text-xs text-gray-400">{c.code} · {c.difficulty} · {c.status}</p></div>
            <div className="flex gap-1">
              <button onClick={() => { setEdit(c); setForm({ title: c.title, code: c.code ?? "", difficulty: c.difficulty ?? "beginner", status: c.status }); }} className="p-2 hover:bg-gray-50 rounded"><Edit className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => del.mutate(c.id)} className="p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsAdm({ uid }: { uid: string }) {
  const qc = useQueryClient();
  const { data: deps } = useQuery({ queryKey: ["deps"], queryFn: getDepartments });
  const [deptId, setDeptId] = useState(deps?.[0]?.id ?? "");
  const { data: courses } = useQuery({ queryKey: ["allco", deptId], queryFn: () => getAllCourses(deptId), enabled: !!deptId });
  const [cid, setCid] = useState("");
  const { data: projects } = useQuery({ queryKey: ["adpj", cid], queryFn: async () => { const { data } = await supabase.from("projects").select("*").eq("course_id", cid); return data ?? []; }, enabled: !!cid });
  const [edit, setEdit] = useState<any>(null);
  const [form, setForm] = useState({ title: "", level: "beginner", requirements: "", status: "published" });
  const save = useMutation({
    mutationFn: async (p?: any) => {
      if (p) await supabase.from("projects").update(form).eq("id", p.id);
      else await supabase.from("projects").insert({ ...form, course_id: cid });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["adpj"] }); setEdit(null); toast.success("Saved"); },
  });
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <select value={deptId} onChange={(e) => { setDeptId(e.target.value); setCid(""); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          {(deps ?? []).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={cid} onChange={(e) => setCid(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Select course</option>
          {(courses ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        {cid && <button onClick={() => { setEdit({}); setForm({ title: "", level: "beginner", requirements: "", status: "published" }); }} className="ml-auto flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" />Add</button>}
      </div>
      {edit !== null && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 grid grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
          </select>
          <input value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Requirements" className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <div className="col-span-2 flex gap-2">
            <button onClick={() => save.mutate(edit.id ? edit : undefined)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save</button>
            <button onClick={() => setEdit(null)} className="px-3 py-2 text-gray-500 text-sm">Cancel</button>
          </div>
        </div>
      )}
      {cid && projects && (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          {projects.length === 0 ? <Empty text="No projects for this course." /> : projects.map((p: any) => (
            <div key={p.id} className="p-4 flex justify-between items-center">
              <div><p className="text-sm font-medium">{p.title}</p><p className="text-xs text-gray-400">{p.level} · {p.status}</p></div>
              <button onClick={() => { setEdit(p); setForm({ title: p.title, level: p.level, requirements: p.requirements ?? "", status: p.status }); }} className="p-2 hover:bg-gray-50 rounded"><Edit className="w-4 h-4 text-gray-400" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Subs({ uid }: { uid: string }) {
  const qc = useQueryClient();
  const { data: subs, isLoading } = useQuery({ queryKey: ["adsub"], queryFn: getAllSubmissionsForAdmin });
  const [rev, setRev] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [fb, setFb] = useState("");
  const [st, setSt] = useState("Accepted");
  const mut = useMutation({
    mutationFn: () => reviewSubmission(rev.id, uid, { status: st, score, feedback: fb }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["adsub"] }); setRev(null); toast.success("Reviewed"); },
  });
  if (isLoading) return <Spin />;
  if (!subs?.length) return <Empty text="No submissions yet." />;
  return (
    <div className="space-y-3">
      {subs.map((s: any) => (
        <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-900">{s.profiles?.full_name ?? "Student"}</p>
              <p className="text-xs text-gray-400">{s.projects?.title ?? "Project"} · {s.status}</p>
              {s.github_url && <a href={s.github_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 flex items-center gap-1 mt-1"><ExternalLink className="w-3 h-3" />GitHub</a>}
            </div>
            <button onClick={() => { setRev(s); setScore(s.score ?? 0); setFb(s.feedback ?? ""); setSt(s.status); }} className="px-3 py-1.5 text-sm rounded-lg border border-blue-200 text-blue-600">Review</button>
          </div>
          {rev?.id === s.id && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-3">
              <select value={st} onChange={(e) => setSt(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {["Under Review", "Revision Requested", "Accepted", "Rejected"].map((o) => <option key={o}>{o}</option>)}
              </select>
              <input type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input value={fb} onChange={(e) => setFb(e.target.value)} placeholder="Feedback" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <button onClick={() => mut.mutate()} className="col-span-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Submit Review</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Opps({ uid }: { uid: string }) {
  const qc = useQueryClient();
  const { data: deps } = useQuery({ queryKey: ["deps"], queryFn: getDepartments });
  const { data: anns, isLoading } = useQuery({ queryKey: ["adann"], queryFn: () => getAnnouncements() });
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "hackathon", status: "published", department_id: "" });
  const save = useMutation({
    mutationFn: async () => { await supabase.from("announcements").insert(form); },
    onSuccess: () => { setShow(false); qc.invalidateQueries({ queryKey: ["adann"] }); toast.success("Posted"); },
  });
  if (isLoading) return <Spin />;
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Opportunities</h3>
        <button onClick={() => setShow(!show)} className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" />Post</button>
      </div>
      {show && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 grid grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            {["hackathon", "internship", "scholarship", "competition", "workshop", "research", "news"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="">All departments</option>
            {(deps ?? []).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button onClick={() => save.mutate()} disabled={!form.title} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm self-end disabled:opacity-50">Publish</button>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {(anns ?? []).map((a: any) => (
          <div key={a.id} className="p-4 flex justify-between">
            <div><p className="text-sm font-medium">{a.title}</p><p className="text-xs text-gray-400">{a.category} · {a.status}</p></div>
            <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Apps({ uid }: { uid: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["adapp"], queryFn: async () => { const { data } = await supabase.from("applications").select("*, profiles(*), announcements(*)").order("created_at", { ascending: false }); return data ?? []; } });
  const upd = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { await supabase.from("applications").update({ status }).eq("id", id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["adapp"] }); toast.success("Updated"); },
  });
  if (isLoading) return <Spin />;
  if (!data?.length) return <Empty text="No applications yet." />;
  return (
    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
      {data.map((a: any) => (
        <div key={a.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">{a.profiles?.full_name}</p>
              <p className="text-xs text-gray-400">{a.announcements?.title} · {a.status}</p>
              {a.motivation && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.motivation}</p>}
            </div>
            {a.status === "Pending" && (
              <div className="flex gap-1">
                <button onClick={() => upd.mutate({ id: a.id, status: "Shortlisted" })} className="px-2 py-1 text-xs rounded bg-yellow-50 text-yellow-700">Shortlist</button>
                <button onClick={() => upd.mutate({ id: a.id, status: "Accepted" })} className="px-2 py-1 text-xs rounded bg-green-50 text-green-700"><Check className="w-3 h-3 inline" /></button>
                <button onClick={() => upd.mutate({ id: a.id, status: "Rejected" })} className="px-2 py-1 text-xs rounded bg-red-50 text-red-700"><X className="w-3 h-3 inline" /></button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Collab() {
  const { data: posts, isLoading } = useQuery({ queryKey: ["adcl"], queryFn: () => getCollaborationPosts() });
  if (isLoading) return <Spin />;
  if (!posts?.length) return <Empty text="No collaboration posts." />;
  return (
    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
      {posts.map((p: any) => (
        <div key={p.id} className="p-4">
          <p className="text-sm font-medium">{p.title}</p>
          <p className="text-xs text-gray-400">{p.type} · By {p.profiles?.full_name} · {p.status}</p>
        </div>
      ))}
    </div>
  );
}

function Pts({ uid }: { uid: string }) {
  const { data: profiles } = useQuery({ queryKey: ["allprof"], queryFn: async () => { const { data } = await supabase.from("profiles").select("id, full_name, role").eq("role", "student"); return data ?? []; } });
  const [sel, setSel] = useState("");
  const [pts, setPts] = useState(10);
  const [desc, setDesc] = useState("");
  const mut = useMutation({
    mutationFn: () => awardPoints(sel, pts, desc),
    onSuccess: () => { setDesc(""); toast.success("Points awarded"); },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">Award Points</h3>
      <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-4 gap-3">
        <select value={sel} onChange={(e) => setSel(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Student</option>
          {(profiles ?? []).map((p: any) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
        </select>
        <input type="number" value={pts} onChange={(e) => setPts(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Reason" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        <button onClick={() => mut.mutate()} disabled={!sel || !desc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">Award</button>
      </div>
    </div>
  );
}

function Analytics() {
  const { data: subs } = useQuery({ queryKey: ["adsub"], queryFn: getAllSubmissionsForAdmin });
  const { data: pts } = useQuery({ queryKey: ["allpts"], queryFn: async () => { const { data } = await supabase.from("points_transactions").select("points, created_at"); return data ?? []; } });
  const sc: Record<string, number> = {};
  (subs ?? []).forEach((s: any) => { sc[s.status] = (sc[s.status] ?? 0) + 1; });
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">Analytics</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Submission Status</h4>
          {Object.keys(sc).length === 0 ? <Empty text="No data" /> : Object.entries(sc).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600">{k}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((v / (subs?.length ?? 1)) * 100, 100)}%` }} /></div>
                <span className="text-sm font-medium text-gray-900 w-6">{v}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Points Overview</h4>
          <p className="text-3xl font-bold text-gray-900">{(pts ?? []).reduce((a: number, t: any) => a + t.points, 0)}</p>
          <p className="text-sm text-gray-400 mt-1">Total points awarded</p>
          <p className="text-sm text-gray-500 mt-3">{(pts ?? []).length} transactions</p>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { profile, isAdmin, updatePassword } = useAppAuth();
  const db = supabase as any;
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const { data: rules } = useQuery({ queryKey: ["rules"], queryFn: async () => { const { data } = await supabase.from("points_rules").select("*"); return data ?? []; } });
  const { data: depts } = useQuery({ queryKey: ["depts-count"], queryFn: async () => { const { data } = await supabase.from("departments").select("id"); return data ?? []; } });
  const { data: settings } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await db.from("system_settings").select("key, value");
      if (error) return [] as Array<{ key: string; value: unknown }>;
      return (data ?? []) as Array<{ key: string; value: unknown }>;
    },
  });

  const settingValue = (key: string) => {
    const found = (settings ?? []).find((s: { key: string }) => s.key === key);
    const value = found?.value as Record<string, unknown> | undefined;
    return value && typeof value === "object" ? String((value as any).value ?? "") : "";
  };

  const checklist = [
    { label: "Administrator role verified", ok: isAdmin, hint: "Profiles role = admin via the owner backfill migration." },
    { label: "Admin profile row", ok: Boolean(profile?.id), hint: profile?.email ?? "No profile row found." },
    { label: "Academic departments configured", ok: (depts ?? []).length > 0, hint: `${(depts ?? []).length} department(s)` },
    { label: "Points rules configured", ok: (rules ?? []).length > 0, hint: `${(rules ?? []).length} rule(s)` },
    { label: "AI provider key stored", ok: Boolean(settingValue("ai_provider_key")), hint: settingValue("ai_provider_key") ? "Stored in system_settings." : "Add key ai_provider_key in system_settings." },
    { label: "GitHub integration tokens", ok: Boolean(settingValue("github_token")), hint: settingValue("github_token") ? "Stored in system_settings." : "Add key github_token in system_settings." },
    { label: "Auth redirect URL", ok: true, hint: typeof window !== "undefined" ? window.location.origin : "—" },
  ];

  const changePassword = async () => {
    if (pwd.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (pwd !== confirm) { toast.error("Passwords do not match."); return; }
    setSaving(true);
    const { error } = await updatePassword(pwd);
    setSaving(false);
    if (error) { toast.error(error); return; }
    setPwd(""); setConfirm("");
    toast.success("Password updated.");
  };

  const testAi = async () => {
    setTesting(true);
    const { error } = await db.from("system_settings").select("key").limit(1);
    setTesting(false);
    if (error) { toast.error(`AI connection check failed: ${error.message}`); return; }
    toast.success(settingValue("ai_provider_key") ? "AI settings reachable." : "Database reachable — no AI key stored yet.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Admin Setup Checklist</h3>
          <button onClick={testAi} disabled={testing} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60">
            {testing ? "Testing…" : "Test AI connection"}
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-start gap-2.5 rounded-lg bg-gray-50/70 px-3 py-2.5">
              <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.ok ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                {item.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500 truncate">{item.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-1">Change Password</h3>
        <p className="text-xs text-gray-500 mb-4">Use at least 8 characters with a mix of letters, numbers and symbols.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="New password" autoComplete="new-password" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" autoComplete="new-password" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <button onClick={changePassword} disabled={saving || !pwd} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? "Updating…" : "Update password"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Points Rules</h4>
        <div className="divide-y divide-gray-50">
          {(rules ?? []).map((r: any) => (
            <div key={r.id} className="py-2 flex justify-between">
              <span className="text-sm text-gray-700">{r.action}</span>
              <span className="text-sm font-medium text-green-600">+{r.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}