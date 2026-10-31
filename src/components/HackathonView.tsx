import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  ArrowSquareOut,
  DownloadSimple,
  ShareNetwork,
  Check,
  X,
} from "@phosphor-icons/react";
import {
  getAnnouncements,
  applyToAnnouncement,
  getMyApplications,
} from "@/services/api";
import { CURSOR_HACKATHON } from "@/data/curriculumData";

export function HackathonView({ sid, did }: { sid: string; did: string }) {
  const qc = useQueryClient();
  const { data: dbAnns } = useQuery({ queryKey: ["an", did], queryFn: () => getAnnouncements(did) });
  const { data: apps } = useQuery({ queryKey: ["ap", sid], queryFn: () => getMyApplications(sid) });

  const [applyDrawerOpen, setApplyDrawerOpen] = React.useState<boolean>(false);
  const [selectedHackathon, setSelectedHackathon] = React.useState<any>(null);
  const [motivation, setMotivation] = React.useState<string>("");
  const [skills, setSkills] = React.useState<string>("");
  const [teamSize, setTeamSize] = React.useState<string>("Individual / Looking for Team");

  const announcementsList = (dbAnns && dbAnns.length > 0) ? dbAnns : [
    {
      id: CURSOR_HACKATHON.id,
      title: CURSOR_HACKATHON.title,
      description: CURSOR_HACKATHON.description,
      category: CURSOR_HACKATHON.category,
      department_id: did,
      featured: true,
      external_url: CURSOR_HACKATHON.lumaUrl,
      image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
    }
  ];
  const appMap = new Map((apps ?? []).map((a) => [a.announcement_id, a]));

  const applyMut = useMutation({
    mutationFn: (annId: string) => applyToAnnouncement(sid, annId, motivation),
    onSuccess: () => {
      setApplyDrawerOpen(false);
      setMotivation("");
      qc.invalidateQueries({ queryKey: ["ap"] });
      toast.success("Application submitted successfully!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const downloadICS = (event: any) => {
    const nl = String.fromCharCode(10);
    const desc = String(event?.description ?? "").split(nl).join(" ");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//NEXORA//Jimma University//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${event?.title ?? "Hackathon"}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${event?.location || "Jimma University, Jimma"}`,
      "DTSTART:20261121T080000Z",
      "DTEND:20261122T080000Z",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const icsContent = lines.join(String.fromCharCode(10));

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cursor-hackathon-jimma.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Event added to calendar (.ics exported)");
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://lu.ma/cursor-hackathon-jimma");
    toast.success("Hackathon registration link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
        <h2 className="text-lg font-bold text-[#0B1B3A]">Campus Events & Hackathons</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Participate in national and regional innovation challenges, technical hackathons, and research symposiums.
        </p>
      </div>

      <div className="space-y-4">
        {announcementsList.map((ann) => {
          const app = appMap.get(ann.id);
          const isApplied = !!app;
          const status = app?.status ?? "Pending";

          return (
            <div
              key={ann.id}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {ann.image_url && (
                  <img
                    src={ann.image_url}
                    alt={ann.title}
                    className="w-full lg:w-64 h-44 rounded-xl object-cover shadow-2xs flex-shrink-0"
                  />
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {ann.category}
                      </span>
                      {ann.featured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/50">
                          Featured
                        </span>
                      )}
                      {isApplied && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : status === "Declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          Status: {status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[#0B1B3A]">{ann.title}</h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{ann.description}</p>

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Nov 21, 2026 (24 Hours)</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Deadline: Nov 20, 2026</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {ann.external_url && (
                        <a
                          href={ann.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-200 transition-colors flex items-center gap-1.5"
                        >
                          <span>Luma Page</span>
                          <ArrowSquareOut className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => downloadICS(ann)}
                        className="px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-600 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-gray-200"
                        title="Download .ics Calendar Event"
                      >
                        <DownloadSimple className="w-3.5 h-3.5" />
                        <span>.ics</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleShare}
                        className="px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-600 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-gray-200"
                        title="Share event link"
                      >
                        <ShareNetwork className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    </div>

                    {isApplied ? (
                      <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <Check weight="bold" className="w-3.5 h-3.5" />
                        <span>Application on File ({status})</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHackathon(ann);
                          setApplyDrawerOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs"
                      >
                        In-App Application
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-App Apply Drawer / Modal */}
      {applyDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setApplyDrawerOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Application Portal
                </span>
                <h3 className="text-base font-bold text-[#0B1B3A]">
                  Apply: {selectedHackathon?.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedHackathon) {
                  applyMut.mutate(selectedHackathon.id);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Team Formation Status
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-800"
                >
                  <option value="Individual / Looking for Team">Individual / Looking for Team</option>
                  <option value="Pre-formed Team (2-4 Members)">Pre-formed Team (2-4 Members)</option>
                  <option value="Solo Builder">Solo Builder</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Technical Skills & Tech Stack
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Python, FastAPI, UI Design"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Project Concept / Motivation Statement
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="What problem at Jimma University or Ethiopia do you intend to address in 24 hours?"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyDrawerOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applyMut.isPending}
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs disabled:opacity-60"
                >
                  {applyMut.isPending ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HackathonView;