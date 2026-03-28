"use client";

import Link from "next/link";
import { useState } from "react";

export default function RoleSelectionPage() {
  const [role, setRole] = useState<"seeker" | "volunteer">("seeker");

  return (
    <div className="fixed inset-0 bg-surface font-body text-on-surface flex flex-col w-full max-w-[390px] md:max-w-full mx-auto overflow-hidden overscroll-none">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-surface/80 backdrop-blur-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            volunteer_activism
          </span>
          <h1 className="font-headline font-extrabold text-xl tracking-tight text-primary">
            Pomocna Polska
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col justify-center h-full px-8 pt-16 pb-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #e2beba 1px, transparent 0)",
            backgroundSize: "24px 24px",
            opacity: 0.1,
          }}
        />
        <div className="max-w-md mx-auto relative z-10 w-full">
          <section className="mb-10 text-center md:text-left">
            <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-2 tracking-tight">
              Kim jesteś?
            </h2>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              Możesz to zmienić w dowolnym momencie.
            </p>
          </section>

          <div className="space-y-4">
            {/* Help seeker */}
            <div
              onClick={() => setRole("seeker")}
              className={`group relative flex items-center justify-between p-6 bg-surface-container-lowest rounded-[24px] cursor-pointer transition-all ${
                role === "seeker"
                  ? "border-2 border-primary shadow-lg"
                  : "border-2 border-transparent hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    role === "seeker"
                      ? "bg-primary-fixed text-primary"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">
                    front_hand
                  </span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">
                    Potrzebuję pomocy
                  </h3>
                  <p className="text-sm text-on-surface-variant font-medium">
                    Szukam wsparcia w codzienności.
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  role === "seeker"
                    ? "border-primary bg-primary"
                    : "border-outline-variant"
                }`}
              >
                {role === "seeker" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>

            {/* Volunteer */}
            <div
              onClick={() => setRole("volunteer")}
              className={`group relative flex items-center justify-between p-6 bg-surface-container-lowest rounded-[24px] cursor-pointer transition-all ${
                role === "volunteer"
                  ? "border-2 border-primary shadow-lg"
                  : "border-2 border-transparent hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    role === "volunteer"
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">
                    Chcę pomagać
                  </h3>
                  <p className="text-sm text-on-surface-variant font-medium">
                    Chcę dzielić się swoim czasem.
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  role === "volunteer"
                    ? "border-primary bg-primary"
                    : "border-outline-variant"
                }`}
              >
                {role === "volunteer" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="fixed bottom-0 left-0 w-full px-8 pb-10 pt-6 bg-surface/90 backdrop-blur-md z-50 w-full max-w-[390px] md:max-w-full mx-auto right-0">
        <div className="max-w-md mx-auto">
          <Link
            href={`/register?role=${role}`}
            className="block w-full py-5 bg-primary text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 focus:ring-4 focus:ring-primary-fixed text-center"
          >
            Kontynuuj
          </Link>
          <p className="text-center mt-4 text-xs text-on-surface-variant font-medium">
            Krok 3 z 5
          </p>
        </div>
      </footer>
    </div>
  );
}
