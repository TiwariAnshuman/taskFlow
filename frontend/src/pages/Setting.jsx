import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Save,
  Loader2,
  LockKeyhole,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import AppShell from "../components/layout/AppShell";
import Modal from "../components/ui/Modal";
import Button, { IconButton } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Feedback";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// ---------------------------------------------------------
// Presentational section wrapper
// ---------------------------------------------------------

function SettingsSection({
  title,
  description,
  danger = false,
  children,
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border bg-[#16191F] ${
        danger ? "border-[#EF4444]/20" : "border-[#252A33]"
      }`}
    >
      <div className="border-b border-inherit px-5 py-4">
        <h2 className="text-base font-semibold tracking-[-0.01em]">
          {title}
        </h2>

        <p className="mt-0.5 text-[13px] text-[#A1A7B3]">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function SectionFooter({ children }) {
  return (
    <div className="flex justify-end border-t border-[#252A33] bg-[#111318]/50 px-5 py-3.5">
      {children}
    </div>
  );
}

function PasswordToggle({ shown, onToggle, label }) {
  return (
    <IconButton
      icon={shown ? EyeOff : Eye}
      label={shown ? `Hide ${label}` : `Show ${label}`}
      onClick={onToggle}
      className="h-8 w-8"
      iconSize={16}
    />
  );
}

function Settings() {
  const { user, logout, fetchCurrentUser } = useAuth();
  const navigate = useNavigate();

  // =========================
  // PROFILE STATE
  // =========================

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // =========================
  // PASSWORD STATE
  // =========================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  // =========================
  // DELETE ACCOUNT STATE
  // =========================

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [deletingAccount, setDeletingAccount] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  // =========================
  // LOAD USER NAME
  // =========================

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================
  // PROFILE UPDATE
  // =========================

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    setProfileSuccess("");
    setProfileError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setProfileError("Name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setProfileError(
        "Name must be at least 2 characters."
      );
      return;
    }

    try {
      setSaving(true);

      await api.patch("/auth/me", {
        name: trimmedName,
      });

      await fetchCurrentUser();

      setProfileSuccess(
        "Profile updated successfully."
      );

      setTimeout(() => {
        setProfileSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error.response?.data || error.message
      );

      setProfileError(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError(
        "Current password is required."
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        "New password is required."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setPasswordError(
        "Please confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(
        "Password changed successfully."
      );

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Hide passwords again
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setTimeout(() => {
        setPasswordSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error.response?.data || error.message
      );

      setPasswordError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =========================
  // CLEAR PASSWORD MESSAGE
  // =========================

  const clearPasswordMessage = () => {
    if (passwordError) {
      setPasswordError("");
    }

    if (passwordSuccess) {
      setPasswordSuccess("");
    }
  };

  // =========================
  // OPEN DELETE MODAL
  // =========================

  const openDeleteModal = () => {
    setDeleteError("");
    setShowDeleteModal(true);
  };

  // =========================
  // CLOSE DELETE MODAL
  // =========================

  const closeDeleteModal = () => {
    if (deletingAccount) {
      return;
    }

    setDeleteError("");
    setShowDeleteModal(false);
  };

  // =========================
  // DELETE ACCOUNT
  // =========================

  const handleDeleteAccount = async () => {
    setDeleteError("");

    try {
      setDeletingAccount(true);

      await api.delete("/auth/me");

      // Remove token and user from frontend state
      logout();

      // Send user back to login
      navigate("/login");
    } catch (error) {
      console.error(
        "DELETE ACCOUNT ERROR:",
        error.response?.data || error.message
      );

      setDeleteError(
        error.response?.data?.message ||
          "Unable to delete your account."
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <AppShell>

      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="mb-8">
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[32px]">
          Settings
        </h1>

        <p className="mt-1.5 text-sm text-[#A1A7B3]">
          Manage your account and security preferences.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">

        {/* =====================================================
            PROFILE
        ===================================================== */}

        <SettingsSection
          title="Profile"
          description="Your personal information on TaskFlow."
        >
          <form onSubmit={handleSaveChanges}>
            <div className="space-y-4 px-5 py-5">

              {/* NAME */}

              <Field label="Name" htmlFor="name">
                <Input
                  id="name"
                  type="text"
                  icon={User}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setProfileSuccess("");
                    setProfileError("");
                  }}
                  placeholder="Enter your name"
                />
              </Field>

              {/* EMAIL */}

              <Field
                label="Email"
                htmlFor="email"
                hint="Email changes are not available yet."
              >
                <Input
                  id="email"
                  type="email"
                  icon={Mail}
                  value={user?.email || ""}
                  disabled
                />
              </Field>

              {/* USER ID */}

              <Field label="User ID" htmlFor="userId">
                <Input
                  id="userId"
                  type="text"
                  icon={Shield}
                  value={user?.id || user?._id || ""}
                  disabled
                  className="font-mono text-xs"
                />
              </Field>

              {/* PROFILE SUCCESS */}

              {profileSuccess && (
                <Alert tone="success">{profileSuccess}</Alert>
              )}

              {/* PROFILE ERROR */}

              {profileError && (
                <Alert>{profileError}</Alert>
              )}
            </div>

            {/* SAVE FOOTER */}

            <SectionFooter>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} aria-hidden="true" />
                    Save Changes
                  </>
                )}
              </Button>
            </SectionFooter>
          </form>
        </SettingsSection>

        {/* =====================================================
            SECURITY / CHANGE PASSWORD
        ===================================================== */}

        <SettingsSection
          title="Security"
          description="Update the password you use to sign in."
        >
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4 px-5 py-5">

              {/* CURRENT PASSWORD */}

              <Field
                label="Current password"
                htmlFor="currentPassword"
              >
                <Input
                  id="currentPassword"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  icon={LockKeyhole}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    clearPasswordMessage();
                  }}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  right={
                    <PasswordToggle
                      shown={showCurrentPassword}
                      label="current password"
                      onToggle={() =>
                        setShowCurrentPassword(
                          (previous) => !previous
                        )
                      }
                    />
                  }
                />
              </Field>

              {/* NEW PASSWORD */}

              <Field
                label="New password"
                htmlFor="newPassword"
                hint="Password must be at least 6 characters."
              >
                <Input
                  id="newPassword"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  icon={LockKeyhole}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearPasswordMessage();
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  right={
                    <PasswordToggle
                      shown={showNewPassword}
                      label="new password"
                      onToggle={() =>
                        setShowNewPassword(
                          (previous) => !previous
                        )
                      }
                    />
                  }
                />
              </Field>

              {/* CONFIRM PASSWORD */}

              <Field
                label="Confirm new password"
                htmlFor="confirmPassword"
              >
                <Input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  icon={LockKeyhole}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearPasswordMessage();
                  }}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  right={
                    <PasswordToggle
                      shown={showConfirmPassword}
                      label="confirm password"
                      onToggle={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                    />
                  }
                />
              </Field>

              {/* PASSWORD SUCCESS */}

              {passwordSuccess && (
                <Alert tone="success">{passwordSuccess}</Alert>
              )}

              {/* PASSWORD ERROR */}

              {passwordError && (
                <Alert>{passwordError}</Alert>
              )}
            </div>

            {/* PASSWORD BUTTON */}

            <SectionFooter>
              <Button
                type="submit"
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Shield size={16} aria-hidden="true" />
                    Change Password
                  </>
                )}
              </Button>
            </SectionFooter>
          </form>
        </SettingsSection>

        {/* =====================================================
            SESSION
        ===================================================== */}

        <SettingsSection
          title="Session"
          description="Manage your current session."
        >
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                Sign out
              </p>

              <p className="mt-0.5 text-[13px] text-[#A1A7B3]">
                Sign out of your TaskFlow account on this device.
              </p>
            </div>

            <Button
              variant="secondary"
              icon={LogOut}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </SettingsSection>

        {/* =====================================================
            DANGER ZONE
        ===================================================== */}

        <SettingsSection
          danger
          title="Danger Zone"
          description="Permanent actions that can't be undone."
        >
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                Delete account
              </p>

              <p className="mt-0.5 text-[13px] text-[#A1A7B3]">
                Permanently delete your TaskFlow account and associated data.
              </p>
            </div>

            <Button
              variant="dangerOutline"
              icon={Trash2}
              onClick={openDeleteModal}
            >
              Delete Account
            </Button>
          </div>
        </SettingsSection>
      </div>

      {/* =========================================================
          DELETE ACCOUNT CONFIRMATION MODAL
      ========================================================= */}

      {showDeleteModal && (
        <Modal
          size="md"
          icon={AlertTriangle}
          iconTone="red"
          title="Delete your account?"
          description="This action cannot be undone."
          closeLabel="Close delete account modal"
          onClose={closeDeleteModal}
          closeDisabled={deletingAccount}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={closeDeleteModal}
                disabled={deletingAccount}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} aria-hidden="true" />
                    Delete Account
                  </>
                )}
              </Button>
            </>
          }
        >
          <p className="text-sm leading-6 text-[#A1A7B3]">
            Your TaskFlow account will be permanently
            deleted along with your associated tasks.
          </p>

          <div className="mt-4 rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/[0.05] px-4 py-3">
            <p className="text-xs font-medium text-[#F87171]">
              The following data will be deleted:
            </p>

            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-[#A1A7B3]">
              <li>Your account information</li>
              <li>Your password credentials</li>
              <li>All tasks created by your account</li>
            </ul>
          </div>

          {/* DELETE ERROR */}

          {deleteError && (
            <Alert className="mt-4">{deleteError}</Alert>
          )}
        </Modal>
      )}
    </AppShell>
  );
}

export default Settings;