import React from "react";

/**
 * Brand Identity Motif 2 (R-07 & R-31 Written Purpose):
 * Custom thin vector twin-ribbon wave ("River / Connection") pairing Chinese Red (var(--color-crimson))
 * and Brand Gold (var(--color-gold)) to bridge Deep Blue (#08354d) architectural bands and Ivory surfaces,
 * directly derived from the official EGYPT CHINA FOR ASA stationery and book cover identity board.
 */
export function RiverRibbon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-5 sm:h-7 block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 18C240 4 480 26 720 14C960 2 1200 22 1440 10"
          stroke="var(--color-crimson)"
          strokeWidth="2.5"
        />
        <path
          d="M0 23C240 9 480 31 720 19C960 7 1200 27 1440 15"
          stroke="var(--color-gold)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

/**
 * Bespoke Domain-Specific Industrial SVG Icons (R-04 Written Purpose):
 * Custom technical line diagrams representing polymer terpolymer structure, UV solar shielding,
 * spectrophotometer ΔE calibration, and multi-layer co-extrusion capstock geometry.
 */
export function PolymerMoleculeIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon
        points="16,4 26,10 26,22 16,28 6,22 6,10"
        stroke="var(--color-navy)"
        strokeWidth="1.75"
      />
      <circle cx="16" cy="4" r="2.5" fill="var(--color-crimson)" />
      <circle cx="26" cy="10" r="2.5" fill="var(--color-gold)" />
      <circle cx="26" cy="22" r="2.5" fill="var(--color-navy)" />
      <circle cx="16" cy="28" r="2.5" fill="var(--color-gold)" />
      <circle cx="6" cy="22" r="2.5" fill="var(--color-crimson)" />
      <circle cx="6" cy="10" r="2.5" fill="var(--color-navy)" />
      <circle cx="16" cy="16" r="3" stroke="var(--color-gold)" strokeWidth="1.75" />
    </svg>
  );
}

export function ColorCalibrationGaugeIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 24A11 11 0 0 1 27 24"
        stroke="var(--color-navy)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M9 24A7 7 0 0 1 23 24"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <line
        x1="16"
        y1="24"
        x2="21"
        y2="14"
        stroke="var(--color-crimson)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="24" r="2.5" fill="var(--color-navy)" />
      <rect x="4" y="26" width="24" height="2" fill="var(--color-navy)" />
    </svg>
  );
}

export function UvSunShieldIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="11" cy="10" r="4" stroke="var(--color-gold)" strokeWidth="1.75" />
      <line x1="11" y1="3" x2="11" y2="5" stroke="var(--color-gold)" strokeWidth="1.5" />
      <line x1="4" y1="10" x2="6" y2="10" stroke="var(--color-gold)" strokeWidth="1.5" />
      <path
        d="M16 11L26 15V21C26 25.5 21.5 28.5 16 30C10.5 28.5 6 25.5 6 21V15L16 11Z"
        stroke="var(--color-navy)"
        strokeWidth="1.75"
      />
      <path
        d="M11 19L15 23L22 16"
        stroke="var(--color-crimson)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExtrusionLayersIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 11L16 6L28 11L16 16L4 11Z"
        stroke="var(--color-crimson)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M4 17L16 22L28 17"
        stroke="var(--color-gold)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M4 22L16 27L28 22"
        stroke="var(--color-navy)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CorrosionShieldIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 4L26 8V16C26 22.2 21.6 26.8 16 29C10.4 26.8 6 22.2 6 16V8L16 4Z"
        stroke="var(--color-navy)"
        strokeWidth="1.75"
      />
      <path
        d="M16 11C16 11 12.5 15 12.5 17.8C12.5 19.8 14.1 21.4 16 21.4C17.9 21.4 19.5 19.8 19.5 17.8C19.5 15 16 11 16 11Z"
        stroke="var(--color-gold)"
        strokeWidth="1.75"
      />
      <line
        x1="10"
        y1="22"
        x2="22"
        y2="10"
        stroke="var(--color-crimson)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ColorSwatchesGridIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="6" height="20" rx="1.5" fill="var(--swatch-black)" />
      <rect x="11" y="6" width="6" height="20" rx="1.5" fill="var(--swatch-red)" />
      <rect x="18" y="6" width="6" height="20" rx="1.5" fill="var(--swatch-orange)" />
      <rect x="25" y="6" width="4" height="20" rx="1.5" fill="var(--swatch-blue)" />
      <rect
        x="3"
        y="5"
        width="26"
        height="22"
        rx="2"
        stroke="var(--color-navy)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ProductionStageDiagram({ step }: { step: string }) {
  return (
    <svg
      width="88"
      height="64"
      viewBox="0 0 88 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="84"
        height="60"
        rx="4"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      {step === "01" && (
        <>
          <polygon points="22,14 66,14 54,36 34,36" stroke="var(--color-gold-bright)" strokeWidth="2" />
          <rect x="34" y="36" width="20" height="12" stroke="var(--color-on-navy)" strokeWidth="1.75" />
          <circle cx="38" cy="24" r="2.5" fill="var(--color-crimson)" />
          <circle cx="46" cy="22" r="2.5" fill="var(--color-gold-bright)" />
          <circle cx="50" cy="28" r="2.5" fill="var(--color-on-navy)" />
        </>
      )}
      {step === "02" && (
        <>
          <rect x="16" y="22" width="56" height="20" rx="3" stroke="var(--color-gold-bright)" strokeWidth="2" />
          <path d="M22 32C26 26 30 38 34 32C38 26 42 38 46 32C50 26 54 38 58 32C62 26 66 38 66 32" stroke="var(--color-crimson)" strokeWidth="2" />
        </>
      )}
      {step === "03" && (
        <>
          <rect x="14" y="20" width="28" height="24" rx="2" stroke="var(--color-gold-bright)" strokeWidth="2" />
          <polygon points="42,24 54,28 54,36 42,40" stroke="var(--color-on-navy)" strokeWidth="1.75" />
          <line x1="54" y1="30" x2="76" y2="30" stroke="var(--color-crimson)" strokeWidth="3" />
          <line x1="54" y1="34" x2="76" y2="34" stroke="var(--color-gold-bright)" strokeWidth="3" />
        </>
      )}
      {step === "04" && (
        <>
          <circle cx="32" cy="24" r="9" stroke="var(--color-gold-bright)" strokeWidth="2" />
          <circle cx="56" cy="40" r="9" stroke="var(--color-gold-bright)" strokeWidth="2" />
          <path d="M14 32H74" stroke="var(--color-crimson)" strokeWidth="2.5" />
        </>
      )}
      {step === "05" && (
        <>
          <rect x="20" y="16" width="48" height="32" rx="3" stroke="var(--color-gold-bright)" strokeWidth="2" />
          <polyline points="28,36 38,26 48,34 60,22" stroke="var(--color-crimson)" strokeWidth="2.2" />
          <circle cx="60" cy="22" r="3" fill="var(--color-gold-bright)" />
        </>
      )}
      {step === "06" && (
        <>
          <rect x="24" y="16" width="40" height="28" rx="2" stroke="var(--color-gold-bright)" strokeWidth="2" />
          <line x1="24" y1="26" x2="64" y2="26" stroke="var(--color-crimson)" strokeWidth="2" />
          <rect x="18" y="46" width="52" height="6" stroke="var(--color-on-navy)" strokeWidth="1.75" />
        </>
      )}
    </svg>
  );
}
