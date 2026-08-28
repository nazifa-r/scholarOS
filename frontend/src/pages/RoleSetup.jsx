import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import AuthLayout from "../layout/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

const ALLOWED_FILE_EXTENSIONS = ".jpg,.jpeg,.png,.pdf";

const ROLES = [
  {
    id: "student",
    title: "Student",
    description:
      "I am a student looking to collaborate, learn, and contribute to research.",
  },
  {
    id: "faculty",
    title: "Faculty / Supervisor",
    description:
      "I am a faculty member or supervisor looking to lead and collaborate on research.",
  },
];

const STATUS_CONFIG = {
  not_submitted: {
    label: "Not Submitted",
    description:
      "Upload your university ID card and submit it for verification.",
  },
  pending: {
    label: "Pending Verification",
    description:
      "Your ID card has been submitted and is waiting for administrator review.",
  },
  approved: {
    label: "Approved",
    description: "Your role has been successfully verified.",
  },
  rejected: {
    label: "Rejected",
    description:
      "Your verification request was not approved. You can upload a new ID card and try again.",
  },
};

export default function RoleSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [role, setRole] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [verificationStatus, setVerificationStatus] =
    useState("not_submitted");

  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStatus = STATUS_CONFIG[verificationStatus];

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (file) => {
    if (!file) {
      return "Please select an ID card file.";
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Unsupported file type. Please upload a JPG, PNG, or PDF file.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File is too large. Please upload a file smaller than 5 MB.";
    }

    return "";
  };

  const handleFileSelection = (file) => {
    setFileError("");
    setSubmitError("");
    setSubmitMessage("");

    const validationError = validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setFilePreview(null);
      setFileError(validationError);
      return;
    }

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFileSelection(file);
    }

    event.target.value = "";
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFileSelection(file);
    }
  };

  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setSelectedFile(null);
    setFilePreview(null);
    setFileError("");
    setSubmitError("");
    setSubmitMessage("");
  };

  const handleReplaceFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitMessage("");

    if (!role) {
      setSubmitError("Please select your role before submitting.");
      return;
    }

    if (!selectedFile) {
      setFileError("Please upload your university ID card before submitting.");
      return;
    }

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setFileError(validationError);
      return;
    }

    /*
     * Frontend-only implementation for Issue #1.
     * The actual API request will be implemented
     * in the role verification backend issue.
     */
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setVerificationStatus("pending");

      setSubmitMessage(
        "Your verification request has been submitted successfully."
      );
    } catch (error) {
      setSubmitError(
        "Unable to submit your verification request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewVerification = () => {
    handleRemoveFile();
    setVerificationStatus("not_submitted");
    setSubmitMessage("");
    setSubmitError("");
  };

  const renderStatus = () => {
    if (verificationStatus === "not_submitted") {
      return null;
    }

    const isApproved = verificationStatus === "approved";
    const isRejected = verificationStatus === "rejected";
    const isPending = verificationStatus === "pending";

    return (
      <div
        className={cn(
          "mt-5 rounded-xl border p-3",
          isApproved && "border-green-200 bg-green-50",
          isRejected && "border-red-200 bg-red-50",
          isPending && "border-amber-200 bg-amber-50"
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              isApproved && "bg-green-100 text-green-700",
              isRejected && "bg-red-100 text-red-700",
              isPending && "bg-amber-100 text-amber-700"
            )}
          >
            {isApproved && <Check className="h-4 w-4" />}
            {isRejected && <X className="h-4 w-4" />}
            {isPending && <ShieldCheck className="h-4 w-4" />}
          </div>

          <div className="min-w-0">
            <p
              className={cn(
                "font-semibold",
                isApproved && "text-green-800",
                isRejected && "text-red-800",
                isPending && "text-amber-800"
              )}
            >
              {currentStatus.label}
            </p>

            <p
              className={cn(
                "mt-1 text-sm",
                isApproved && "text-green-700",
                isRejected && "text-red-700",
                isPending && "text-amber-700"
              )}
            >
              {currentStatus.description}
            </p>

            {isRejected && (
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                onClick={handleStartNewVerification}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Upload New ID Card
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/interest-setup")}
          className="mb-5 inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to research interests
        </button>

        {/* Role Selection */}
        <section>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Select your role
          </h1>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Choose the role that best describes your position at your
            institution.
          </p>

          <div className="mt-3 grid gap-2.5">
            {ROLES.map((item) => {
              const isSelected = role === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setRole(item.id);
                    setSubmitError("");
                  }}
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200",
                    "bg-white/60 backdrop-blur-md",
                    "hover:border-blue-200 hover:bg-white/80",
                    "hover:shadow-[0_8px_25px_rgba(37,99,235,0.08)]",
                    isSelected &&
                      "border-blue-300 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-500/10 shadow-[0_8px_30px_rgba(79,70,229,0.12)] ring-1 ring-blue-200"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    {/* Glass radio */}
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                        isSelected
                          ? "border-blue-400 bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 shadow-[0_4px_12px_rgba(59,130,246,0.25)]"
                          : "border-slate-300 bg-white/70"
                      )}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ID Card Upload */}
        {verificationStatus !== "approved" &&
          verificationStatus !== "pending" && (
            <section className="mt-5">
              <h2 className="text-base font-semibold text-slate-900">
                Upload your university ID card
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Upload a clear image or document showing your name,
                institution, and role-related information.
              </p>

              {!selectedFile ? (
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "mt-3 flex min-h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-all",
                    "border-slate-300 bg-white/40",
                    "hover:border-blue-300 hover:bg-blue-50/20",
                    isDragging &&
                      "border-blue-400 bg-blue-50/40 shadow-[0_8px_25px_rgba(37,99,235,0.08)]"
                  )}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Upload className="h-5 w-5" />
                  </div>

                  <p className="font-medium text-slate-700">
                    Drag & drop your ID card here
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    or{" "}
                    <span className="font-medium text-blue-600">
                      browse files
                    </span>
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    JPG, JPEG, PNG or PDF • Maximum 5 MB
                  </p>
                </button>
              ) : (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white/60 p-3 backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    {filePreview ? (
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <img
                          src={filePreview}
                          alt="ID card preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                        {selectedFile.type === "application/pdf" ? (
                          <FileText className="h-7 w-7 text-violet-500" />
                        ) : (
                          <ImageIcon className="h-7 w-7 text-blue-500" />
                        )}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-800">
                        {selectedFile.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatFileSize(selectedFile.size)}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="!px-3 !py-1.5 !text-xs"
                          onClick={handleReplaceFile}
                        >
                          <RotateCcw className="mr-2 h-3.5 w-3.5" />
                          Replace
                        </Button>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {fileError && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {fileError}
                </p>
              )}

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Make sure the ID card is clear and all important information
                is readable. Do not upload unrelated documents.
              </p>
            </section>
          )}

        {/* Verification Status */}
        {renderStatus()}

        {/* Success Message */}
        {submitMessage && (
          <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {submitMessage}
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Submit */}
        {verificationStatus === "not_submitted" && (
          <div className="mt-5">
            <Button
              type="button"
              className="w-full"
              size="lg"
              disabled={!role || !selectedFile || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit for Verification
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="mt-2 text-center text-xs text-slate-400">
              Your ID card will be reviewed by an administrator before your
              role is verified.
            </p>
          </div>
        )}

        {/* Pending */}
        {verificationStatus === "pending" && (
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600" />

              <div>
                <p className="font-medium text-slate-800">
                  Verification request submitted
                </p>

                <p className="text-sm text-slate-500">
                  You can continue once your verification has been reviewed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_FILE_EXTENSIONS}
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>
    </AuthLayout>
  );
}