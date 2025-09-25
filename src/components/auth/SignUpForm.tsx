import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { showToast } from "../utils/showToast";

// ✅ Zod Schema
const signUpSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().min(1, "Please select a role"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),
  address: z.string().min(1, "Address is required"),
  img: z.any().optional(),
});

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (values) => {
    if (!isChecked) {
      alert("You must accept the Terms & Conditions to sign up.");
      return;
    }

    try {
      const formData = new FormData();

      for (const key in values) {
        if (key === "img") {
          if (values.img && values.img.length > 0) {
            formData.append("img", values.img[0]); // ✅ send first file
          }
        } else {
          formData.append(key, values[key]);
        }
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/auth/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      showToast(res.data.message || "Signup Success");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showToast(err.response?.data?.message || "Signup Failed", "error");
      }
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full min-h-screen lg:overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col justify-center flex-1 w-full max-w-2xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 sm:p-8">
          <div className="mb-6 text-center sm:text-left">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to create an account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <Label>
                  Full Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  register={register}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  register={register}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    register={register}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <Label>
                  Role<span className="text-error-500">*</span>
                </Label>
                <select
                  {...register("role")}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="">Select Role</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label>
                  Phone<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  register={register}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <Label>
                  Address<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  register={register}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Profile Image */}
              <div className="sm:col-span-2">
                <Label>Profile Image</Label>
                <input
                  type="file"
                  {...register("img")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-800 dark:file:text-gray-300"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            {/* <div className="flex items-start gap-3 mt-6">
              <Checkbox
                className="w-5 h-5 mt-1"
                checked={isChecked}
                onChange={setIsChecked}
              />
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                By creating an account you agree to the{" "}
                <span className="text-gray-800 dark:text-white/90">
                  Terms and Conditions
                </span>{" "}
                and{" "}
                <span className="text-gray-800 dark:text-white">
                  Privacy Policy
                </span>
              </p>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center w-full px-4 py-3 mt-6 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 text-center">
            <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
