"use client";

import React, { useState } from "react";
import {
  Shield,
  Briefcase,
  Mail,
  Plus,
  Copy,
  Check,
  Clock,
  Loader2,
  Users as UsersIcon,
  X,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { TeamMember, Invitation, TeamClientProps } from "@/lib/types";
import { TeamInviteSchema } from "@/lib/validators";

// Define local components to match ProfileClient style without depending on broken UI libs
const Button = ({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: any) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className, ...props }: any) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
    {...props}
  />
);

export default function TeamClient({
  currentUser,
  members,
  invitations,
}: TeamClientProps) {
  const t = useTranslations("Team");
  const [isInviteExpanded, setIsInviteExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"manager" | "accountant">("manager");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [copiedInviteId, setCopiedInviteId] = useState<string | number | null>(
    null,
  );

  const router = useRouter();

  const isOwner = currentUser.orgRole === "owner";

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate invite data using schema
    const validationResult = TeamInviteSchema.safeParse({
      email,
      orgRole: role,
    });
    if (!validationResult.success) {
      showToast(validationResult.error.issues[0].message, "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send invite");
      }

      showToast(t("toast.inviteSent"), "success");
      setEmail("");
      setRole("manager");
      setIsInviteExpanded(false);
      router.refresh();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = (token: string, id: string | number) => {
    const link = `${window.location.origin}/signup?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedInviteId(id);
    setTimeout(() => setCopiedInviteId(null), 2000);
    showToast(t("toast.linkCopied"), "success");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "manager":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "accountant":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6 bg-background animate-in fade-in duration-500">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md flex items-center gap-2 animate-in slide-in-from-right-10 ${
            toast.type === "success"
              ? "bg-green-50/90 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-800 dark:text-green-100"
              : "bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h3 className="text-lg font-medium text-foreground">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-6 max-w-5xl">
        {/* Member Table */}
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-primary/10 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Member</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="group hover:bg-secondary/30 transition-colors "
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {(
                            member.firstName?.[0] || member.email[0]
                          ).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {member.firstName
                              ? `${member.firstName} ${member.lastName || ""}`
                              : t("roles.user")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize ${getRoleBadgeColor(member.orgRole || "user")}`}
                      >
                        {t(`roles.${member.orgRole || "user"}`)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        {t("active")}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {/* Actions placeholder */}
                    </td>
                  </tr>
                ))}

                {invitations.map((invite) => (
                  <tr
                    key={invite.id}
                    className="group hover:bg-muted/30 transition-colors bg-muted/5"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3 opacity-80">
                        <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground italic">
                            {t("pending")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {invite.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize border border-dashed ${getRoleBadgeColor(invite.orgRole || "user")}`}
                      >
                        {t(`roles.${invite.orgRole || "user"}`)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {t("pending")}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary"
                          onClick={() =>
                            copyLink(invite.token as string, invite.id)
                          }
                        >
                          {copiedInviteId === invite.id ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copiedInviteId === invite.id
                            ? "Copied"
                            : "Copy Link"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}

                {members.length === 0 && invitations.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-muted-foreground text-sm"
                    >
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Section */}
        {isOwner && (
          <div className="transition-all duration-300 ease-in-out">
            {!isInviteExpanded ? (
              <Button
                variant="outline"
                className="w-full border-dashed flex text-center  mx-auto text-muted-foreground hover:text-primary hover:border-primary/50 h-12  px-4"
                onClick={() => setIsInviteExpanded(true)}
              >
                <Plus className="w-4 h-4 mr-2 " />
                {t("inviteMember")}
              </Button>
            ) : (
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm animate-in slide-in-from-top-2 fade-in">
                <form
                  onSubmit={handleInvite}
                  className="flex flex-col lg:flex-row gap-4 items-center"
                >
                  {/* Email Input */}
                  <div className="flex-1 w-full relative">
                    <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("inviteModal.emailLabel")}
                      className="pl-9 h-11"
                      required
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {/* Role Selection Buttons */}
                  <div className="flex items-center bg-background/30 p-1 px-2 gap-x-2 rounded-md w-full lg:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setRole("manager")}
                      className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-sm text-sm font-medium transition-all ${role === "manager" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"}`}
                    >
                      <Briefcase className="w-4 h-4" />
                      {t("roles.manager")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("accountant")}
                      className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-sm text-sm font-medium transition-all ${role === "accountant" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"}`}
                    >
                      <Shield className="w-4 h-4" />
                      {t("roles.accountant")}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 lg:flex-none cursor-pointer h-11 px-6 min-w-30"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      {isLoading
                        ? t("inviteModal.sending")
                        : t("inviteModal.submit")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 cursor-pointer shrink-0 border border-transparent hover:border-border hover:bg-muted"
                      onClick={() => setIsInviteExpanded(false)}
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
