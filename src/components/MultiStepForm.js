"use client";

import Image from "next/image";
import { useState } from "react";
import FormButton from "./FormButton";
import FormInput from "./FormInput";

export default function eMultiStepForm() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    profileImage: "",
    profileImagePreview: "",
  });

  function handleInputChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;

    setFormData({
      ...formData,
      [inputName]: inputValue,
    });
  }

  function handleProfileImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setFormData((currentFormData) => ({
        ...currentFormData,
        profileImage: file.name,
        profileImagePreview: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleNext(event) {
    event.preventDefault();
    setError("");

    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.username) {
        setError("Please fill all fields.");
        return;
      }   

      setStep(2);
    }

    if (step === 2) {
      if (
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill all fields.");
        return;
      }

      if (!formData.email.includes("@")) {
        setError("Please provide a valid email address.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setStep(3);
    }

    if (step === 3) {
      if (!formData.birthDate || !formData.profileImage) {
        setError("Please fill all fields.");
        return;
      }

      setIsSubmitted(true);
    }
  }

  function handleBack() {
    setError("");
    setIsSubmitted(false);

    if (step > 1) {
      setStep(step - 1);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f4] px-5 py-10">
      <form
        onSubmit={handleNext}
        className="relative flex min-h-108.5 w-full max-w-82.5 flex-col rounded bg-white px-6 py-7 shadow-sm"
      >
        <Image
          src="/pinelogo.png"
          alt="Pine logo"
          width={44}
          height={32}
          priority
          className="absolute left-6 top-7 h-8 w-auto object-contain"
        />

        <h1 className="mt-12 text-lg font-semibold leading-none text-[#111214]">
          Join Us!😎
        </h1>
        <p className="mt-2 text-[11px] leading-4 text-slate-400">
          Please provide all current information accurately.
        </p>

        {isSubmitted ? (
          <div className="mt-10 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Thanks! Your information has been submitted.
          </div>
        ) : (
          <div className="mt-7 space-y-3">
            {step === 1 && (
              <>
                <FormInput
                  label="First name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <p className="text-[10px] text-red-500">First name cannot contain special characters or numbers.</p>
                <FormInput
                  label="Last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                <p className="text-[10px] text-red-500">Last name cannot contain special characters or numbers.</p>
                <FormInput
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <p className="text-[10px] text-red-500">This username is already taken. Please choose another one.</p>
              </>
            )}

            {step === 2 && (
              <>
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Phone number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </>
            )}

            {step === 3 && (
              <>
                <FormInput
                  label="Date of birth"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
                <p className="text-[10px] text-red-500">Please select a date.</p>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold text-[#111214]">
                    Profile image <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleProfileImageChange}
                  />

                  <span className="relative flex h-41 cursor-pointer flex-col items-center justify-center overflow-hidden rounded bg-[#f7f7f8] text-center text-xs text-[#111214] transition hover:bg-slate-100">
                    {formData.profileImagePreview ? (
                      <Image
                        src={formData.profileImagePreview}
                        alt="Profile preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <span className="mb-3 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                          <Image
                            src="/image.svg"
                            alt="Add image icon"
                            width={16}
                            height={16}
                            className="text-[#111214]"
                          />
                        </span>
                        <span>Add image</span>
                      </>
                    )}
                  </span>
                </label>
              </>
            )}

            {error && <p className="text-[10px] text-red-500">{error}</p>}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-7">
          {step > 1 && (
            <FormButton onClick={handleBack} variant="light" className="w-20">
              ‹ Back
            </FormButton>
          )}

          <FormButton
            type="submit"
            disabled={isSubmitted}
            className="flex-1"
          >
            {step === 3 ? "Submit" : "Continue"} {step}/3 ›
          </FormButton>
        </div>
      </form>
    </main>
  );
}
