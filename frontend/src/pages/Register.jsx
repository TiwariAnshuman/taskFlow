import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
    <main className="flex min-h-screen items-center justify-center bg-[#11100E] px-6 py-10 text-[#F5F5F4]">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 bg-[#F59E0B]" />

            <div>
              <p className="text-lg font-bold tracking-tight">
                TASKFLOW
              </p>

              <p className="text-[10px] tracking-[0.25em] text-[#78716C]">
                PRODUCTIVITY SYSTEM
              </p>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account.
          </h1>

          <p className="mt-2 text-sm text-[#A8A29E]">
            Start organizing your work with TaskFlow.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-900/50 bg-green-950/30 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#D6D3D1]"
            >
              Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57534E]"
              />

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                disabled={loading}
                className="w-full rounded-lg border border-[#302D29] bg-[#191816] py-3 pl-10 pr-4 text-sm text-[#F5F5F4] outline-none transition placeholder:text-[#57534E] focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#D6D3D1]"
            >
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57534E]"
              />

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full rounded-lg border border-[#302D29] bg-[#191816] py-3 pl-10 pr-4 text-sm text-[#F5F5F4] outline-none transition placeholder:text-[#57534E] focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#D6D3D1]"
            >
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57534E]"
              />

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                disabled={loading}
                className="w-full rounded-lg border border-[#302D29] bg-[#191816] py-3 pl-10 pr-11 text-sm text-[#F5F5F4] outline-none transition placeholder:text-[#57534E] focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] transition hover:text-[#F5F5F4] disabled:cursor-not-allowed"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-3 text-sm font-semibold text-[#11100E] transition hover:bg-[#D97706] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Login */}
        <p className="mt-8 text-center text-sm text-[#78716C]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-[#F59E0B] transition hover:text-[#FBBF24]"
          >
            Sign in
          </button>
        </p>

        {/* Footer */}
        <p className="mt-12 text-center font-mono text-[10px] tracking-wider text-[#44403C]">
          TASKFLOW / V1.0
        </p>

      </div>
    </main>
  );
}

export default Register;