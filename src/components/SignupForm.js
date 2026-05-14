"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialFormData = {
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
};

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
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
      return;
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
        setError("Please enter a valid email address.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setStep(3);
      return;
    }

    if (!formData.birthDate || !formData.profileImage) {
      setError("Please fill all fields.");
      return;
    }

    setIsSubmitted(true);
    router.push("/");
  }

  function handleBack() {
    setError("");

    if (step > 1) {
      setStep(step - 1);
    }
  }

  function handleStartOver() {
    setFormData(initialFormData);
    setStep(1);
    setError("");
    setIsSubmitted(false);
  }

  return (
    <main className="signup-page">
      <form className="signup-panel" onSubmit={handleNext}>
        <Image
          src="/pinelogo.png"
          alt="Pinecone logo"
          width={44}
          height={32}
          priority
          className="signup-logo"
        />

        <h1>Join Us!😎</h1>
        <p className="signup-intro">
          Please provide all current information accurately.
        </p>

        {isSubmitted ? (
          <div className="signup-success">
            <h2>You are all set 🔥</h2>
            <p>Your sign up information has been submitted.</p>
            <button type="button" onClick={handleStartOver}>
              Start over
            </button>
          </div>
        ) : (
          <>
            <div className="signup-fields">
              {step === 1 && (
                <>
                  <FormField
                    label="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <p className="field-message">
                    First name cannot contain special characters or numbers.
                  </p>
                  <FormField
                    label="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <p className="field-message">
                    Last name cannot contain special characters or numbers.
                  </p>
                  <FormField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <p className="field-message">
                    This username is already taken. Please choose another one.
                  </p>
                </>
              )}

              {step === 2 && (
                <>
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Phone number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <FormField
                    label="Date of birth"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                  <p className="field-message">Please select a date.</p>
                  <label className="image-upload">
                    <span>
                      Profile image <b>*</b>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                    />
                    <span className="image-upload-box">
                      {formData.profileImagePreview ? (
                        <Image
                          src={formData.profileImagePreview}
                          alt="Profile preview"
                          fill
                          unoptimized
                          className="profile-preview"
                        />
                      ) : (
                        <>
                          <span className="add-image-icon">
                            <Image
                              src="/image.svg"
                              alt=""
                              width={16}
                              height={16}
                            />
                          </span>
                          <span>Add image</span>
                        </>
                      )}
                    </span>
                  </label>
                </>
              )}
            </div>

            {error && <p className="signup-error">{error}</p>}

            <div className="signup-controls">
              {step > 1 && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleBack}
                >
                  ‹ Back
                </button>
              )}
              <button type="submit" className="primary-button signup-submit">
                {step === 3 ? "Submit" : "Continue"} {step}/3 ›
              </button>
            </div>
          </>
        )}
      </form>
    </main>
  );
}

function FormField({ label, name, type = "text", value, onChange }) {
  return (
    <label className="form-field">
      <span>
        {label} <b>*</b>
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
      />
    </label>
  );
}
