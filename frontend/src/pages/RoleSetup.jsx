import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, GraduationCap, IdCard, UserCog } from "lucide-react";
import AuthLayout from "../layout/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import { cn } from "../utils/cn.js";

// Placeholder roles — replace with a real fetch/list once the backend
// exposes available roles (or keep static if roles are fixed).
const ROLES = [
  {
    id: "student",
    icon: GraduationCap,
    label: "Student",
    description:
      "Join projects, upload papers for review, complete tasks, and participate in discussions.",
    permissions: ["Join Projects", "Upload Papers", "Complete Tasks"],
  },
  {
    id: "faculty",
    icon: UserCog,
    label: "Faculty",
    description:
      "Create and supervise research projects, invite students, review progress, and publish papers.",
    permissions: ["Create Projects", "Invite Members", "Approve Milestones"],
  },
];

// Simple placeholder copy for the ID field — no backend/format validation yet.
const ID_FIELD_CONFIG = {
  student: {
    label: "Student ID",
    placeholder: "e.g. 2021-CS-045",
  },
  faculty: {
    label: "Faculty ID",
    placeholder: "e.g. FAC-1029",
  },
};

export default function RoleSetup() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("student");
  const [idValue, setIdValue] = useState("");
  const [idError, setIdError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const idConfig = ID_FIELD_CONFIG[selectedRole];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setIdValue("");
    setIdError("");
  };

  const handleFinish = async () => {
    if (!idValue.trim()) {
      setIdError(`Please enter your ${idConfig.label.toLowerCase()} to continue.`);
      return;
    }

    setIdError("");
    setSubmitting(true);
    // Placeholder only — no backend verification yet. Wire this up to
    // POST /api/users/role (with the ID) once that endpoint exists.
    console.log("[placeholder] selected role:", selectedRole);
    console.log("[placeholder] submitted id:", idValue);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSubmitting(false);
    navigate("/dashboard");
  };

  return (
    <AuthLayout
      title="What's your role?"
      subtitle="This sets your default permissions in ScholarOS — you can request a change later from your department admin."
      sideTitle="Let's tailor ScholarOS to your research."
      sideDescription="A couple of quick steps and your workspace will be ready — recommended papers, projects, and collaborators, matched to you."
      footerText="Step 2 of 2 —"
      footerAction={
        <button
          type="button"
          onClick={() => navigate("/interest-setup")}
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          Back
        </button>
      }
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const selected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role.id)}
                aria-pressed={selected}
                className={cn(
                  "w-full rounded-3xl border p-6 text-left transition-all",
                  selected
                    ? "border-blue-400 bg-white shadow-[0_20px_50px_rgba(37,99,235,0.15)]"
                    : "border-slate-200/80 bg-white/70 hover:-translate-y-0.5 hover:border-blue-200",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {role.label}
                      </h3>
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                          selected
                            ? "border-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {role.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="rounded-full border border-blue-200/70 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-blue-700"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <IdCard className="h-4 w-4 text-blue-600" />
            Verify your {selectedRole === "student" ? "student" : "faculty"} status
          </div>
          <p className="mb-4 text-sm leading-6 text-slate-600">
            Enter your {idConfig.label.toLowerCase()} so we can confirm your
            role. (Verification is a placeholder for now — no ID lookup
            happens yet.)
          </p>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            {idConfig.label}
          </label>
          <input
            type="text"
            value={idValue}
            onChange={(event) => {
              setIdValue(event.target.value);
              if (idError) setIdError("");
            }}
            placeholder={idConfig.placeholder}
            className={cn(
              "w-full rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3.5 text-slate-900 shadow-sm outline-none backdrop-blur-xl placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100",
              idError && "border-rose-300 focus:border-rose-300 focus:ring-rose-100",
            )}
          />
          {idError && <p className="mt-2 text-sm text-rose-600">{idError}</p>}
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/interest-setup")}
          >
            &larr; Back
          </Button>

          <Button
            type="button"
            onClick={handleFinish}
            disabled={submitting}
            className="justify-center py-3.5 text-base"
          >
            {submitting ? "Finishing…" : "Finish Setup \u2192"}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
