import React, { useState, useEffect } from "react";
import "../styles/Onboarding.css";
import { useTheme } from "../ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

export default function OnboardingDetails() {
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];
  const navigate = useNavigate();
  const location = useLocation();

  // get data from first step (or default if user came directly)
  const step1Data = location.state || {
    area: "",
    timePerWeek: "",
    workStatus: "",
    experience: "",
  };

  const [isMuted, setIsMuted] = useState(false);
  const toggleMute = () => setIsMuted((prev) => !prev);

  // Load from localStorage if it exists, otherwise use defaults
  const [experience, setExperience] = useState(() => {
    const saved = localStorage.getItem("onboarding_experience");
    return saved || step1Data.experience || "";
  });

  const [horizon, setHorizon] = useState(() => {
    const saved = localStorage.getItem("onboarding_horizon");
    return saved || "";
  });

  const [pace, setPace] = useState(() => {
    const saved = localStorage.getItem("onboarding_pace");
    return saved || "";
  });

  const [constraints, setConstraints] = useState(() => {
    const saved = localStorage.getItem("onboarding_constraints");
    return saved || "";
  });

  const [motivation, setMotivation] = useState(() => {
    const saved = localStorage.getItem("onboarding_motivation");
    return saved || "";
  });

  // Save to localStorage whenever any state changes
  useEffect(() => {
    localStorage.setItem("onboarding_experience", experience);
  }, [experience]);

  useEffect(() => {
    localStorage.setItem("onboarding_horizon", horizon);
  }, [horizon]);

  useEffect(() => {
    localStorage.setItem("onboarding_pace", pace);
  }, [pace]);

  useEffect(() => {
    localStorage.setItem("onboarding_constraints", constraints);
  }, [constraints]);

  useEffect(() => {
    localStorage.setItem("onboarding_motivation", motivation);
  }, [motivation]);

  const handleBack = () => {
    // Keep the data in localStorage, navigate back
    navigate("/Onboarding", { 
      state: {
        area: step1Data.area,
        timePerWeek: step1Data.timePerWeek,
        workStatus: step1Data.workStatus,
        experience: step1Data.experience,
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("oculis_user_id");

    const profilePayload = {
      userId,
      ...step1Data, // area, timePerWeek, workStatus, (possibly old experience)
      experience, // override with current experience selection
      horizon,
      pace,
      constraints,
      motivation,
    };

    try {
      const res = await fetch("http://localhost:4000/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        console.error("Profile save error:", data.error);
        return;
      }

      // Clear onboarding data from localStorage after successful save
      localStorage.removeItem("onboarding_experience");
      localStorage.removeItem("onboarding_horizon");
      localStorage.removeItem("onboarding_pace");
      localStorage.removeItem("onboarding_constraints");
      localStorage.removeItem("onboarding_motivation");

      navigate("/dream-input");
    } catch (err) {
      console.error("Network or server error:", err);
    }
  };

  const isDisabled =
    !experience ||
    !horizon ||
    !pace ||
    motivation.trim().length < 10;

  return (
    <div
      className="onb-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      <Navbar
        currentStyle={currentStyle}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />

      <main className="onb-main-single">
        <section className="onb-card-single">
          <h1 className="onb-title-big">Tune the roadmap to you</h1>

          <form className="onb-form-simpler" onSubmit={handleSubmit}>
            {/* Time horizon */}
            <label className="onb-field-large">
              <span>How far into the future is this dream?</span>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
              >
                <option value="">Choose one</option>
                <option value="1-3">1–3 months</option>
                <option value="3-6">3–6 months</option>
                <option value="6-12">6–12 months</option>
                <option value="12+">More than 1 year</option>
              </select>
            </label>

            {/* Preferred pace */}
            <label className="onb-field-large">
              <span>What kind of pace feels right?</span>
              <div className="onb-pill-row">
                {[
                  { id: "slow", label: "Slow & steady" },
                  { id: "balanced", label: "Balanced" },
                  { id: "intense", label: "Intense push" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={
                      "onb-pill" +
                      (pace === opt.id ? " onb-pill-active" : "")
                    }
                    onClick={() => setPace(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </label>

            {/* Constraints */}
            <label className="onb-field-large">
              <span>Any limits Oculis should respect? (optional)</span>
              <textarea
                rows={2}
                placeholder="Example: I can't work late nights; I have exams next month."
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </label>

            {/* Motivation */}
            <label className="onb-field-large">
              <span>In 1–2 sentences, why does this dream matter to you?</span>
              <textarea
                rows={3}
                placeholder="This helps keep your roadmap aligned with your 'why'."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
              />
            </label>

            <div className="onb-submit-row onb-submit-row-two">
              <Button
                type="button"
                className="onb-back-btn"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="onb-continue-btn"
                disabled={isDisabled}
              >
                Finish
              </Button>
            </div>
            <p className="onb-small-note">Step 2 of 2</p>
          </form>
        </section>
      </main>
    </div>
  );
}
