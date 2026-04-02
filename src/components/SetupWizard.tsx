"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getConfig, saveConfig } from "@/lib/api-client";

export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [goalCount, setGoalCount] = useState(3);
  const [goalNames, setGoalNames] = useState<string[]>([]);
  const [levels, setLevels] = useState(5);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const cfg = await getConfig();
      if (cfg) {
        setIsEditing(true);
        setGoalCount(cfg.goals.length);
        setGoalNames(cfg.goals);
        setLevels(cfg.levels);
        setStep(0);
      } else {
        setStep(1);
      }
      setLoaded(true);
    }
    load();
  }, []);

  function handleGoalCountNext() {
    setGoalNames((prev) => {
      const next = Array.from({ length: goalCount }, (_, i) => prev[i] || "");
      return next;
    });
    setStep(2);
  }

  function handleNameChange(index: number, value: string) {
    setGoalNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleFinish() {
    setSaving(true);
    await saveConfig({ goals: goalNames, levels });
    router.push("/tracker");
  }

  function startFresh() {
    setGoalCount(3);
    setGoalNames([]);
    setLevels(5);
    setStep(1);
  }

  function editExisting() {
    setStep(1);
  }

  const canProceedStep2 = goalNames.every((n) => n.trim().length > 0);

  if (!loaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Progress dots (only show during wizard steps) */}
        {step >= 1 && (
          <div className="flex justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-white"
                    : s < step
                      ? "w-2 bg-white/50"
                      : "w-2 bg-white/15"
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 0: Edit menu (only for existing configs) */}
        {step === 0 && isEditing && (
          <div className="animate-fade-in" key="step0">
            <h1 className="text-2xl font-bold text-center mb-2">
              Indstillinger
            </h1>
            <p className="text-muted text-center mb-10 text-sm">
              Hvad vil du ændre?
            </p>

            <div className="space-y-3 mb-8">
              <button
                onClick={editExisting}
                className="w-full h-16 rounded-2xl glass flex items-center px-5 gap-4 active:scale-[0.97] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium">Rediger tracker</div>
                  <div className="text-xs text-muted">Tilpas mål og niveauer</div>
                </div>
              </button>

              <button
                onClick={startFresh}
                className="w-full h-16 rounded-2xl glass flex items-center px-5 gap-4 active:scale-[0.97] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium">Start forfra</div>
                  <div className="text-xs text-muted">Nulstil alt og begynd på ny</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => router.push("/tracker")}
              className="w-full h-14 rounded-2xl glass font-medium active:scale-[0.97] transition-transform text-muted"
            >
              Tilbage til tracker
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in" key="step1">
            <h1 className="text-2xl font-bold text-center mb-2">
              Hvor mange mål?
            </h1>
            <p className="text-muted text-center mb-10 text-sm">
              Vælg antal mål du vil spore
            </p>

            <div className="flex items-center justify-center gap-6 mb-12">
              <button
                onClick={() => setGoalCount(Math.max(1, goalCount - 1))}
                className="w-14 h-14 rounded-full glass flex items-center justify-center text-2xl font-light active:scale-90 transition-transform"
              >
                -
              </button>
              <span className="text-6xl font-bold tabular-nums w-20 text-center">
                {goalCount}
              </span>
              <button
                onClick={() => setGoalCount(Math.min(12, goalCount + 1))}
                className="w-14 h-14 rounded-full glass flex items-center justify-center text-2xl font-light active:scale-90 transition-transform"
              >
                +
              </button>
            </div>

            <div className="flex gap-3">
              {isEditing && (
                <button
                  onClick={() => setStep(0)}
                  className="h-14 px-6 rounded-2xl glass font-medium active:scale-[0.97] transition-transform"
                >
                  Tilbage
                </button>
              )}
              <button
                onClick={handleGoalCountNext}
                className="flex-1 h-14 rounded-2xl bg-white text-black font-semibold text-lg active:scale-[0.97] transition-transform"
              >
                Næste
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in" key="step2">
            <h1 className="text-2xl font-bold text-center mb-2">
              Navngiv dine mål
            </h1>
            <p className="text-muted text-center mb-8 text-sm">
              Giv hvert mål et kort navn
            </p>

            <div className="space-y-3 mb-10">
              {goalNames.map((name, i) => (
                <input
                  key={i}
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  placeholder={`Mål ${i + 1}`}
                  className="w-full h-14 px-5 rounded-2xl glass text-white placeholder:text-white/25 text-lg outline-none focus:border-white/20 transition-colors"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="h-14 px-6 rounded-2xl glass font-medium active:scale-[0.97] transition-transform"
              >
                Tilbage
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="flex-1 h-14 rounded-2xl bg-white text-black font-semibold text-lg active:scale-[0.97] transition-transform disabled:opacity-30 disabled:active:scale-100"
              >
                Næste
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in" key="step3">
            <h1 className="text-2xl font-bold text-center mb-2">
              Antal niveauer
            </h1>
            <p className="text-muted text-center mb-10 text-sm">
              Hvor mange niveauer vil du score på? (1–{levels})
            </p>

            <div className="flex items-center justify-center gap-6 mb-12">
              <button
                onClick={() => setLevels(Math.max(2, levels - 1))}
                className="w-14 h-14 rounded-full glass flex items-center justify-center text-2xl font-light active:scale-90 transition-transform"
              >
                -
              </button>
              <span className="text-6xl font-bold tabular-nums w-20 text-center">
                {levels}
              </span>
              <button
                onClick={() => setLevels(Math.min(10, levels + 1))}
                className="w-14 h-14 rounded-full glass flex items-center justify-center text-2xl font-light active:scale-90 transition-transform"
              >
                +
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="h-14 px-6 rounded-2xl glass font-medium active:scale-[0.97] transition-transform"
              >
                Tilbage
              </button>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex-1 h-14 rounded-2xl bg-white text-black font-semibold text-lg active:scale-[0.97] transition-transform disabled:opacity-50"
              >
                {saving ? "Gemmer..." : isEditing ? "Gem ændringer" : "Start tracking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
