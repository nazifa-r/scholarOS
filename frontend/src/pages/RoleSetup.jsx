import React, { useEffect, useRef, useState } from "react";
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
import { apiRequest } from "../utils/api.js";

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

  const [rejectionReason, setRejectionReason] = useState("");

  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const currentStatus =
    STATUS_CONFIG[verificationStatus] || STATUS_CONFIG.not_submitted;

  /*
   * Load the user's existing verification status.
   *
   * If there is no verification record yet, the API returns 404.
   * That is treated as "Not Submitted", not as an application error.
   */
  useEffect(() => {
    let isMounted = true;

    const loadVerificationStatus = async () => {
      setIsLoadingStatus(true);
      setSubmitError("");

      try {
        const response = await apiRequest("/v1/role-verification");

        const verification = response?.data;

        if (!isMounted) {
          return;
        }

        if (verification) {
          setVerificationStatus(
            verification.status || "not_submitted"
          );

          if (verification.role) {
            setRole(verification.role);
          }

          setRejectionReason(
            verification.rejection_reason || ""
          );
        } else {
          setVerificationStatus("not_submitted");
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        /*
         * A 404 means the authenticated user has not submitted
         * a verification request yet.
         */
        if (error?.status === 404) {
          setVerificationStatus("not_submitted");
          setRejectionReason("");
        } else {
          setSubmitError(
            "Unable to load your verification status. Please refresh the page and try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingStatus(false);
        }
      }
    };

    loadVerificationStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * Clean up object URLs when the component is unmounted.
   */
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

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

  /*
   * Extract a useful message from Laravel validation/API errors.
   */
  const getApiErrorMessage = (error) => {
    const data = error?.data;

    if (!data) {
      return "Unable to submit your verification request. Please try again.";
    }

    if (data.message) {
      return data.message;
    }

    if (data.errors) {
      const firstError = Object.values(data.errors)
        .flat()
        .find(Boolean);

      if (firstError) {
        return firstError;
      }
    }

    return "Unable to submit your verification request. Please try again.";
  };

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitMessage("");
    setFileError("");

    if (!role) {
      setSubmitError("Please select your role before submitting.");
      return;
    }

    if (!selectedFile) {
      setFileError(
        "Please upload your university ID card before submitting."
      );
      return;
    }

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setFileError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("role", role);
      formData.append("id_card", selectedFile);

      const response = await apiRequest(
        "/v1/role-verification",
        {
          method: "POST",
          body: formData,
        }
      );

      const verification = response?.data;

      setVerificationStatus(
        verification?.status || "pending"
      );

      setRejectionReason(
        verification?.rejection_reason || ""
      );

      setSubmitMessage(
        response?.message ||
          "Your verification request has been submitted successfully."
      );

      /*
       * The user does not need to wait for administrator review.
       * They can continue using ScholarOS while verification is pending.
       */
      window.setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      console.error("Role verification submission failed:", error);

      setSubmitError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewVerification = () => {
    handleRemoveFile();

    setVerificationStatus("not_submitted");
    setRejectionReason("");
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
          isApproved &&
            "border-green-200 bg-green-50",
          isRejected &&
            "border-red-200 bg-red-50",
          isPending &&
            "border-amber-200 bg-amber-50"
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              isApproved &&
                "bg-green-100 text-green-700",
              isRejected &&
                "bg-red-100 text-red-700",
              isPending &&
                "bg-amber-100 text-amber-700"
            )}
          >
            {isApproved && (
              <Check className="h-4 w-4" />
            )}

            {isRejected && (
              <X className="h-4 w-4" />
            )}

            {isPending && (
              <ShieldCheck className="h-4 w-4" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "font-semibold",
                isApproved &&
                  "text-green-800",
                isRejected &&
                  "text-red-800",
                isPending &&
                  "text-amber-800"
              )}
            >
              {currentStatus.label}
            </p>

            <p
              className={cn(
                "mt-1 text-sm",
                isApproved &&
                  "text-green-700",
                isRejected &&
                  "text-red-700",
                isPending &&
                  "text-amber-700"
              )}
            >
              {currentStatus.description}
            </p>

            {isRejected && rejectionReason && (
              <div className="mt-3 rounded-lg border border-red-200 bg-white/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                  Rejection reason
                </p>

                <p className="mt-1 text-sm leading-5 text-red-700">
                  {rejectionReason}
                </p>
              </div>
            )}

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

  /*
   * While the initial GET request is running, avoid briefly showing
   * "Not Submitted" before the actual backend status is known.
   */
  if (isLoadingStatus) {
    return (
      <AuthLayout>
        <div className="w-full max-w-2xl">
          <div className="mb-5">
            <div className="h-4 w-44 animate-pulse rounded bg-slate-200/70" />
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/40 p-5 backdrop-blur-md">
            <div className="h-7 w-48 animate-pulse rounded bg-slate-200/70" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200/60" />

            <div className="mt-5 h-20 animate-pulse rounded-2xl bg-slate-200/50" />

            <div className="mt-3 h-20 animate-pulse rounded-2xl bg-slate-200/50" />
          </div>
        </div>
      </AuthLayout>
    );
  }

  const canUpload =
    verificationStatus !== "approved" &&
    verificationStatus !== "pending";

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

              /*
               * Once a request has been submitted and is pending/approved,
               * don't allow the role to be changed from this screen.
               */
              const roleLocked =
                verificationStatus === "pending" ||
                verificationStatus === "approved";

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={roleLocked}
                  onClick={() => {
                    setRole(item.id);
                    setSubmitError("");
                  }}
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200",
                    "bg-white/60 backdrop-blur-md",
                    "hover:border-blue-200 hover:bg-white/80",
                    "hover:shadow-[0_8px_25px_rgba(37,99,235,0.08)]",
                    roleLocked &&
                      "cursor-default opacity-80",
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
        {canUpload && (
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
                      {selectedFile.type ===
                      "application/pdf" ? (
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
              disabled={
                !role ||
                !selectedFile ||
                isSubmitting
              }
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

              <div className="flex-1">
                <p className="font-medium text-slate-800">
                  Verification request submitted
                </p>

                <p className="text-sm text-slate-500">
                  Your request is under review. You can continue using
                  ScholarOS while verification is pending.
                </p>
              </div>
            </div>

            <Button
              type="button"
              className="mt-3 w-full"
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              Continue to Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Approved */}
        {verificationStatus === "approved" && (
          <div className="mt-5">
            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              Continue to Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
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