import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppAuth } from "@/context/AuthContext";
import {
  House,
  BookOpen,
  Kanban,
  Lightbulb,
  Users,
  Trophy,
  ChatCircle,
  Gear,
  SignOut,
  CaretDown,
  GraduationCap,
  SquaresFour,
  ClipboardText,
  ChartBar,
  FileText,
  Lightning,
  Flame,
  Check,
  List,
  X,
} from "@phosphor-icons/react";
import type { Department } from "@/types";

const studentLinks = [
  { to: "/student/dashboard", label: "Overview", icon: House },
  { to: "/student/courses", label: "Curriculum", icon: BookOpen },
  { to: "/student/projects", label: "Projects", icon: Kanban },
  { to: "/student/opportunities", label: "Hackathons", icon: Lightbulb, badge: "Live" },
  { to: "/student/collaborate", label: "Study Hub", icon: Users },
  { to: "/student/achievements", label: "Badges", icon: Trophy },
  { to: "/student/assistant", label: "AI Tutor", icon: ChatCircle },
];

const adminLinks = [
  { to: "/admin", label: "Command", icon: SquaresFour },
  { to: "/admin/departments", label: "Departments", icon: GraduationCap },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/projects", label: "Projects", icon: Kanban },
  { to: "/admin/submissions", label: "Submissions", icon: ClipboardText },
  { to: "/admin/opportunities", label: "Events", icon: Lightbulb },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/collaboration", label: "Collab", icon: Users },
  { to: "/admin/points", label: "Points", icon: Trophy },
  { to: "/admin/analytics", label: "Analytics", icon: ChartBar },
  { to: "/admin/settings", label: "Config", icon: Gear },
];

export function Navigation() {
  const { profile, activeDepartment, departments, setActiveDepartment, signOut, isAdmin } = useAppAuth();
  const navigate = useNavigate();
  const [deptOpen, setDeptOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const links = isAdmin ? adminLinks : studentLinks;

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDeptOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 select-none">
      {/* Main top bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0B1B3A] rounded-lg flex items-center justify-center shadow-sm">
            <Lightning weight="fill" className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm text-[#0B1B3A] tracking-tight">NEXORA</span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
              {isAdmin ? "Admin" : "JU Portal"}
            </span>
          </div>
          {!isAdmin && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/50 ml-2" title="Daily study streak">
              <Flame weight="fill" className="w-3 h-3 text-amber-500 animate-pulse" />
              <span>4d</span>
            </div>
          )}
        </div>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {links.map(({ to, label, icon: Icon, badge }: any) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0B1B3A] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    weight={isActive ? "fill" : "regular"}
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-blue-400" : "text-gray-400"
                    }`}
                  />
                  <span>{label}</span>
                  {badge && (
                    <span
                      className={`text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: Department switcher + User */}
        <div className="flex items-center gap-2">
          {/* Department Switcher */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setDeptOpen(!deptOpen)}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200/60 text-left text-xs font-semibold text-[#0B1B3A]"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
              <span className="max-w-[120px] truncate">
                {activeDepartment?.name ?? "Select Dept"}
              </span>
              <CaretDown
                weight="bold"
                className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                  deptOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            {deptOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-gray-200/90 rounded-xl shadow-xl z-50 p-1.5 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Enrolled Curricula
                </div>
                {departments.map((d: Department) => {
                  const isSelected = activeDepartment?.id === d.id;
                  const isComingSoon = d.status === "coming_soon";
                  return (
                    <button
                      key={d.id}
                      disabled={isComingSoon}
                      onClick={() => {
                        if (!isComingSoon) {
                          setActiveDepartment(d);
                          setDeptOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left my-0.5 ${
                        isSelected
                          ? "bg-blue-600 text-white font-semibold shadow-xs"
                          : isComingSoon
                          ? "opacity-60 cursor-not-allowed hover:bg-transparent text-gray-400"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <GraduationCap weight={isSelected ? "fill" : "regular"} className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{d.name}</span>
                      </div>
                      {isSelected ? (
                        <Check weight="bold" className="w-3.5 h-3.5 flex-shrink-0" />
                      ) : isComingSoon ? (
                        <span className="text-[9px] uppercase tracking-wider bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded border border-gray-200">
                          Soon
                        </span>
                      ) : d.is_common ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100/70 text-blue-700 px-1.5 py-0.5 rounded">
                          Common
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50 border border-gray-100">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
              {(profile?.full_name ?? profile?.email ?? "U").charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-[#0B1B3A] max-w-[80px] truncate">
              {profile?.full_name || profile?.email || "User"}
            </span>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
            title="Sign Out"
          >
            <SignOut weight="bold" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            type="button"
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {/* Mobile department switcher */}
          <div className="mb-3 pb-3 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Program</p>
            <div className="flex flex-wrap gap-1">
              {departments.map((d: Department) => {
                const isSelected = activeDepartment?.id === d.id;
                const isComingSoon = d.status === "coming_soon";
                return (
                  <button
                    key={d.id}
                    disabled={isComingSoon}
                    onClick={() => {
                      if (!isComingSoon) {
                        setActiveDepartment(d);
                        setMobileOpen(false);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : isComingSoon
                        ? "opacity-50 cursor-not-allowed text-gray-400"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>

          {links.map(({ to, label, icon: Icon, badge }: any) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#0B1B3A] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon weight={isActive ? "fill" : "regular"} className="w-4 h-4" />
                  <span>{label}</span>
                  {badge && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navigation;
