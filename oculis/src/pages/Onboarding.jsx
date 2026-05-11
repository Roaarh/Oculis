// src/pages/Onboarding.jsx
import React, { useState, useEffect } from "react";
import "../styles/Onboarding.css";
import { useTheme } from "../ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

export default function Onboarding() {
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];
  const navigate = useNavigate();
  const location = useLocation();

  const [isMuted, setIsMuted] = useState(false);
  const toggleMute = () => setIsMuted((prev) => !prev);

  // Always start fresh: clear any previous onboarding draft
  useEffect(() => {
    localStorage.removeItem("onboarding_area");
    localStorage.removeItem("onboarding_timePerWeek");
    localStorage.removeItem("onboarding_workStatus");
    localStorage.removeItem("onboarding_experience");
  }, []);

  // Load step 1 data from state (if coming back from step 2), otherwise empty
  const incomingData = location.state || {};

  const [area, setArea] = useState(incomingData.area || "");
  const [timePerWeek, setTimePerWeek] = useState(
    incomingData.timePerWeek || ""
  );
  const [workStatus, setWorkStatus] = useState(
    incomingData.workStatus || ""
  );
  const [experience, setExperience] = useState(
    incomingData.experience || ""
  );

  const handleNext = (e) => {
    e.preventDefault();

    const step1Data = {
      area,
      timePerWeek,
      workStatus,
      experience,
    };

    navigate("/onboarding-details", { state: step1Data });
  };

  const isDisabled = !area || !timePerWeek || !workStatus || !experience;

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
          <h1 className="onb-title-big">Tell Oculis where you are</h1>

          <form className="onb-form-simpler" onSubmit={handleNext}>
            {/* Focus area */}
            <label className="onb-field-large">
              <span>What are you mainly focusing on right now?</span>
              <div className="onb-pill-row">
                {["Study", "Career", "Health", "Skills", "Other"].map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={
                        "onb-pill" +
                        (area === opt ? " onb-pill-active" : "")
                      }
                      onClick={() => setArea(opt)}
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            </label>

            {/* Work / study status */}
            <label className="onb-field-large">
              <span>What best describes your current situation?</span>
              <select
                value={workStatus}
                onChange={(e) => setWorkStatus(e.target.value)}
              >
                <option value="">Choose one</option>
                <option value="student">Student</option>
                <option value="full-time">Working full‑time</option>
                <option value="part-time">Working part‑time</option>
                <option value="freelance">Freelance / self‑employed</option>
                <option value="other">Other</option>
              </select>
            </label>

            {/* Time per week */}
            <label className="onb-field-large">
              <span>How many hours per week can you give this?</span>
              <select
                value={timePerWeek}
                onChange={(e) => setTimePerWeek(e.target.value)}
              >
                <option value="">Choose one</option>
                <option value="lt3">Less than 3 hours</option>
                <option value="3-5">3–5 hours</option>
                <option value="5-10">5–10 hours</option>
                <option value="gt10">More than 10 hours</option>
              </select>
            </label>

            {/* Experience level */}
            <label className="onb-field-large">
              <span>How experienced do you feel in this area?</span>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Choose one</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>

            <div className="onb-submit-row">
              <Button
                type="submit"
                className="onb-continue-btn"
                disabled={isDisabled}
              >
                Next
              </Button>
              <p className="onb-small-note">Step 1 of 2</p>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
