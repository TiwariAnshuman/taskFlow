import {
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

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.token;

      console.log("TOKEN RECEIVED:", token);

      localStorage.setItem("token", token);

      console.log(
        "TOKEN FROM LOCAL STORAGE:",
        localStorage.getItem("token")
      );

      console.log("JWT saved successfully");

      // Navigate to dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your workspace."
      footer={
        <>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="rounded font-medium text-[#A78BFA] transition-colors duration-150 hover:text-[#C4B5FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/50"
          >
            Create one
          </button>
        </>
      }
    >
      {/* Error */}
      {error && <Alert className="mb-5">{error}</Alert>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Email */}
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
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
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;