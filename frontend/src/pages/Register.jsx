import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import { IconButton } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Feedback";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        formData
      );

      console.log(
        "REGISTER RESPONSE:",
        response.data
      );

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Start organizing your work with TaskFlow."
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded font-medium text-[#A78BFA] transition-colors duration-150 hover:text-[#C4B5FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/50"
          >
            Sign in
          </button>
        </>
      }
    >
      {/* Error */}
      {error && <Alert className="mb-5">{error}</Alert>}

      {/* Success */}
      {success && (
        <Alert tone="success" className="mb-5">
          {success}
        </Alert>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Name */}
        <Field label="Name" htmlFor="name">
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            icon={User}
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            disabled={loading}
          />
        </Field>

        {/* Email */}
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={loading}
          />
        </Field>

        {/* Password */}
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            disabled={loading}
            right={
              <IconButton
                icon={showPassword ? EyeOff : Eye}
                label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                disabled={loading}
                className="h-8 w-8"
                iconSize={16}
              />
            }
          />
        </Field>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Register;