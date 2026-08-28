import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronDown,
  ArrowLeft,
  Mail,
  UserRound,
  CalendarDays,
  GraduationCap,
  Maximize2,
  AlertTriangle,
  X,
  Check,
} from "lucide-react";

const initialVerificationRequests = [
  {
    id: 1,
    name: "Nusrat Jahan",
    email: "nusrat.jahan@example.com",
    role: "Student",
    submittedAt: "Aug 28, 2026",
    status: "Pending",
    idCard:
      "https://placehold.co/1200x750/eef2ff/4f46e5?text=University+ID+Card",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Faculty/Supervisor",
    submittedAt: "Aug 27, 2026",
    status: "Pending",
    idCard:
      "https://placehold.co/1200x750/f5f3ff/6d28d9?text=University+ID+Card",
  },
  {
    id: 3,
    name: "Sarah Ahmed",
    email: "sarah.ahmed@example.com",
    role: "Student",
    submittedAt: "Aug 26, 2026",
    status: "Approved",
    idCard:
      "https://placehold.co/1200x750/ecfdf5/047857?text=University+ID+Card",
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Faculty/Supervisor",
    submittedAt: "Aug 25, 2026",
    status: "Rejected",
    rejectionReason:
      "The uploaded ID card could not be verified.",
    idCard:
      "https://placehold.co/1200x750/fef2f2/be123c?text=University+ID+Card",
  },
  {
    id: 5,
    name: "Ayesha Rahman",
    email: "ayesha.rahman@example.com",
    role: "Student",
    submittedAt: "Aug 24, 2026",
    status: "Approved",
    idCard:
      "https://placehold.co/1200x750/f0fdf4/15803d?text=University+ID+Card",
  },
];

const statusConfig = {
  Pending: {
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Approved: {
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Rejected: {
    icon: XCircle,
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${config.className}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

function SummaryCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {label}
          </p>

          <p className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-3">
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        <Icon size={14} />

        <span className="text-[9px] font-bold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-1.5 break-words text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function ActionModal({
  type,
  request,
  rejectionReason,
  setRejectionReason,
  onCancel,
  onConfirm,
  processing,
}) {
  const isReject = type === "reject";

  const trimmedReason = rejectionReason.trim();

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isReject
                  ? "bg-rose-50 text-rose-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {isReject ? (
                <AlertTriangle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                {isReject
                  ? "Reject verification request?"
                  : "Approve verification request?"}
              </h3>

              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                {isReject
                  ? `Please provide a reason for rejecting ${request.name}'s verification request.`
                  : `Are you sure you want to approve ${request.name}'s verification request?`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--bg-page)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {isReject && (
          <div className="mt-5">
            <label
              htmlFor="rejection-reason"
              className="mb-2 block text-xs font-bold text-[var(--text-primary)]"
            >
              Rejection reason
              <span className="ml-1 text-rose-500">*</span>
            </label>

            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(event.target.value)
              }
              placeholder="Explain why this verification request is being rejected..."
              rows={4}
              disabled={processing}
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-3 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-rose-300 focus:ring-2 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-[10px] text-[var(--text-muted)]">
                A clear reason helps the user understand what needs to
                be corrected.
              </p>

              <span className="shrink-0 text-[10px] text-[var(--text-muted)]">
                {rejectionReason.length}/500
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 text-xs font-bold text-[var(--text-primary)] transition hover:bg-[var(--bg-card)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={
              processing ||
              (isReject && !trimmedReason)
            }
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
              isReject
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {processing ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Processing...
              </>
            ) : isReject ? (
              <>
                <XCircle size={14} />
                Confirm Rejection
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Confirm Approval
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerificationDashboard() {
  const [verificationRequests, setVerificationRequests] = useState(
    initialVerificationRequests
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const [actionModal, setActionModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

  const [feedback, setFeedback] = useState(null);

  const totalRequests = verificationRequests.length;

  const pendingRequests = verificationRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedRequests = verificationRequests.filter(
    (request) => request.status === "Approved"
  ).length;

  const rejectedRequests = verificationRequests.filter(
    (request) => request.status === "Rejected"
  ).length;

  const filteredRequests = useMemo(() => {
    return verificationRequests.filter((request) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        request.name.toLowerCase().includes(query) ||
        request.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        request.status === statusFilter;

      const matchesRole =
        roleFilter === "All" ||
        request.role === roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [
    verificationRequests,
    searchQuery,
    statusFilter,
    roleFilter,
  ]);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsImageExpanded(false);
    setFeedback(null);
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
    setIsImageExpanded(false);
    setActionModal(null);
    setRejectionReason("");
  };

  const openApproveModal = () => {
    if (!selectedRequest || selectedRequest.status !== "Pending") {
      return;
    }

    setActionModal("approve");
    setRejectionReason("");
  };

  const openRejectModal = () => {
    if (!selectedRequest || selectedRequest.status !== "Pending") {
      return;
    }

    setActionModal("reject");
    setRejectionReason("");
  };

  const closeActionModal = () => {
    if (processingAction) {
      return;
    }

    setActionModal(null);
    setRejectionReason("");
  };

  const handleApprove = async () => {
    if (!selectedRequest || selectedRequest.status !== "Pending") {
      return;
    }

    setProcessingAction(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const updatedRequest = {
      ...selectedRequest,
      status: "Approved",
      rejectionReason: null,
    };

    setVerificationRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === selectedRequest.id
          ? updatedRequest
          : request
      )
    );

    setSelectedRequest(updatedRequest);
    setActionModal(null);
    setProcessingAction(false);
    setRejectionReason("");

    setFeedback({
      type: "success",
      message: `${selectedRequest.name}'s verification request has been approved.`,
    });
  };

  const handleReject = async () => {
    const trimmedReason = rejectionReason.trim();

    if (
      !selectedRequest ||
      selectedRequest.status !== "Pending" ||
      !trimmedReason
    ) {
      return;
    }

    setProcessingAction(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const updatedRequest = {
      ...selectedRequest,
      status: "Rejected",
      rejectionReason: trimmedReason,
    };

    setVerificationRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === selectedRequest.id
          ? updatedRequest
          : request
      )
    );

    setSelectedRequest(updatedRequest);
    setActionModal(null);
    setProcessingAction(false);
    setRejectionReason("");

    setFeedback({
      type: "success",
      message: `${selectedRequest.name}'s verification request has been rejected.`,
    });
  };

  /*
   * --------------------------------------------------------------------------
   * DETAIL VIEW
   * --------------------------------------------------------------------------
   */

  if (selectedRequest) {
    return (
      <div className="mx-auto w-full max-w-[1400px] space-y-6">
        {/* Feedback */}
        {feedback && (
          <div
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700"
            role="status"
          >
            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0"
            />

            <div className="flex-1">
              <p className="text-xs font-bold">
                Verification updated
              </p>

              <p className="mt-0.5 text-xs leading-5">
                {feedback.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="shrink-0 rounded-lg p-1 transition hover:bg-emerald-100"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Back Button */}
        <button
          type="button"
          onClick={handleCloseDetails}
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={16} />
          Back to verification requests
        </button>

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
              <ShieldCheck size={13} />
              Verification Request
            </div>

            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {selectedRequest.name}
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Review the submitted university ID card and verification
              information.
            </p>
          </div>

          <StatusBadge status={selectedRequest.status} />
        </div>

        {/* Main Detail Layout */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* ID Card Preview */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                  University ID Card
                </h3>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Review the uploaded identification document.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsImageExpanded(true)}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-3 text-xs font-bold text-[var(--text-primary)] transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Maximize2 size={14} />

                <span className="hidden sm:inline">
                  Expand
                </span>
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-page)]">
              <button
                type="button"
                onClick={() => setIsImageExpanded(true)}
                className="group block w-full cursor-zoom-in"
              >
                <img
                  src={selectedRequest.idCard}
                  alt={`${selectedRequest.name} university ID card`}
                  className="h-auto max-h-[620px] w-full object-contain transition duration-300 group-hover:scale-[1.01]"
                />
              </button>
            </div>

            <p className="mt-3 text-center text-[10px] text-[var(--text-muted)]">
              Click the image or Expand to view the ID card.
            </p>
          </section>

          {/* Request Information */}
          <aside className="space-y-4">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <UserRound size={15} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                    User Information
                  </h3>

                  <p className="text-[10px] text-[var(--text-muted)]">
                    Submitted account details
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <DetailItem
                  icon={UserRound}
                  label="Name"
                  value={selectedRequest.name}
                />

                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={selectedRequest.email}
                />

                <DetailItem
                  icon={GraduationCap}
                  label="Role"
                  value={selectedRequest.role}
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Submitted"
                  value={selectedRequest.submittedAt}
                />

                <DetailItem
                  icon={ShieldCheck}
                  label="Status"
                  value={selectedRequest.status}
                />
              </div>
            </section>

            {/* Rejection Reason */}
            {selectedRequest.status === "Rejected" &&
              selectedRequest.rejectionReason && (
                <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <div className="flex items-center gap-2 text-rose-700">
                    <XCircle size={16} />

                    <h3 className="text-sm font-extrabold">
                      Rejection Reason
                    </h3>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-rose-700/80">
                    {selectedRequest.rejectionReason}
                  </p>
                </section>
              )}

            {/* Actions */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                Verification Actions
              </h3>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Review the request before taking an action.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  type="button"
                  onClick={openApproveModal}
                  disabled={
                    selectedRequest.status !== "Pending"
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCircle2 size={15} />
                  Approve
                </button>

                <button
                  type="button"
                  onClick={openRejectModal}
                  disabled={
                    selectedRequest.status !== "Pending"
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <XCircle size={15} />
                  Reject
                </button>
              </div>

              {selectedRequest.status !== "Pending" && (
                <div className="mt-3 rounded-xl bg-[var(--bg-page)] p-3">
                  <div className="flex items-start gap-2">
                    <ShieldCheck
                      size={14}
                      className="mt-0.5 shrink-0 text-[var(--text-muted)]"
                    />

                    <p className="text-[10px] leading-4 text-[var(--text-muted)]">
                      This request has already been reviewed.
                      Verification actions are unavailable.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </aside>
        </div>

        {/* Expanded Image Modal */}
        {isImageExpanded && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setIsImageExpanded(false)}
          >
            <div
              className="relative flex max-h-[95vh] max-w-[1100px] items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={selectedRequest.idCard}
                alt={`${selectedRequest.name} university ID card enlarged`}
                className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />

              <button
                type="button"
                onClick={() => setIsImageExpanded(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                aria-label="Close ID card preview"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Action Modal */}
        {actionModal && (
          <ActionModal
            type={actionModal}
            request={selectedRequest}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            onCancel={closeActionModal}
            onConfirm={
              actionModal === "approve"
                ? handleApprove
                : handleReject
            }
            processing={processingAction}
          />
        )}
      </div>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * REQUEST LIST
   * --------------------------------------------------------------------------
   */

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      {/* Feedback */}
      {feedback && (
        <div
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700"
          role="status"
        >
          <CheckCircle2
            size={17}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            <p className="text-xs font-bold">
              Verification updated
            </p>

            <p className="mt-0.5 text-xs leading-5">
              {feedback.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="shrink-0 rounded-lg p-1 transition hover:bg-emerald-100"
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Page Heading */}
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
          <ShieldCheck size={13} />
          Role Verification
        </div>

        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Verification Requests
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
          Review and manage Student and Faculty/Supervisor role
          verification requests submitted by users.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          label="Total Requests"
          value={totalRequests}
          icon={ShieldCheck}
        />

        <SummaryCard
          label="Pending"
          value={pendingRequests}
          icon={Clock3}
        />

        <SummaryCard
          label="Approved"
          value={approvedRequests}
          icon={CheckCircle2}
        />

        <SummaryCard
          label="Rejected"
          value={rejectedRequests}
          icon={XCircle}
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search by name or email..."
              className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <SlidersHorizontal
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-10 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--bg-page)] pl-9 pr-9 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 sm:w-[150px]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
            </div>

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
                className="h-10 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-3 pr-9 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 sm:w-[180px]"
              >
                <option value="All">All Roles</option>
                <option value="Student">Student</option>
                <option value="Faculty/Supervisor">
                  Faculty/Supervisor
                </option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Request List */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-page)]/70">
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  User
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Role
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Submitted
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--bg-page)]/60"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-extrabold text-indigo-600">
                        {request.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                          {request.name}
                        </p>

                        <p className="truncate text-xs text-[var(--text-muted)]">
                          {request.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      {request.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {request.submittedAt}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleViewRequest(request)}
                      className="inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-3 text-xs font-bold text-[var(--text-primary)] transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-[var(--border)] md:hidden">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-extrabold text-indigo-600">
                    {request.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                      {request.name}
                    </p>

                    <p className="truncate text-xs text-[var(--text-muted)]">
                      {request.email}
                    </p>
                  </div>
                </div>

                <StatusBadge status={request.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[var(--bg-page)] p-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                    Role
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[var(--text-secondary)]">
                    {request.role}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                    Submitted
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[var(--text-secondary)]">
                    {request.submittedAt}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleViewRequest(request)}
                className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-page)] text-xs font-bold text-[var(--text-primary)] transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Eye size={14} />
                View Request
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-page)] text-[var(--text-muted)]">
              <Search size={20} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-[var(--text-primary)]">
              No verification requests found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-[var(--text-muted)]">
              Try adjusting your search or filter to find a
              verification request.
            </p>
          </div>
        )}
      </div>

      {/* Mock Data Notice */}
      <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 px-4 py-3">
        <p className="text-xs text-indigo-700">
          <span className="font-bold">Development mode:</span>{" "}
          Verification requests are currently using mock data. This
          interface is structured for future Admin API integration.
        </p>
      </div>
    </div>
  );
}