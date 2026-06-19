import React from "react"
import { cn } from "@/lib/utils"
import type { LLMScores } from "@/lib/actions/gradeHeadline"

export interface GradeResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  analysis: LLMScores;
}

// ─── Circular Score Ring ──────────────────────────────────────────────
const CircularScore = ({ score, maxScore = 10 }: { score: number; maxScore?: number }) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(maxScore, score)) / maxScore;
  const filledLength = circumference * fraction;
  const gapLength = circumference - filledLength;

  let strokeColor = "#22c55e"; // green
  let textColor = "text-green-500";
  if (fraction > 0.6) {
    strokeColor = "#ef4444";
    textColor = "text-red-500";
  } else if (fraction > 0.3) {
    strokeColor = "#eab308";
    textColor = "text-yellow-500";
  }
  if (score === 0) {
    textColor = "text-ink/50";
  }

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" className="text-ink/10" strokeWidth="3" />
        {score > 0 && (
          <circle
            cx="32" cy="32" r={radius} fill="none" stroke={strokeColor} strokeWidth="3"
            strokeDasharray={`${filledLength} ${gapLength}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease-out" }}
          />
        )}
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center font-sans font-bold text-xl", textColor)}>
        {score}
      </span>
    </div>
  );
}

// ─── Label Badge ─────────────────────────────────────────────────────
const LabelBadge = ({ label }: { label: string }) => {
  return (
    <span className="inline-flex items-center px-2 py-1 bg-ink/10 text-ink text-xs font-mono font-bold uppercase rounded">
      {label.replace(/_/g, ' ')}
    </span>
  );
}

// ─── Score Row ────────────────────────────────────────────────────────
const ScoreRow = ({ title, score, label }: { title: string; score: number; label: string }) => (
  <div className="flex justify-between items-center mb-8 last:mb-0">
    <div className="flex-1 pr-6">
      <h4 className="font-sans font-bold text-xl uppercase tracking-tight text-ink mb-2">{title}</h4>
      <LabelBadge label={label} />
    </div>
    <CircularScore score={score} />
  </div>
);

// ─── Bias Badge ──────────────────────────────────────────────────────
const BiasBadge = ({ label, confidence }: { label: string; confidence: number }) => {
  let confidenceColor = "bg-ink/30";
  if (confidence > 0.8) confidenceColor = "bg-green-500";
  else if (confidence > 0.5) confidenceColor = "bg-yellow-500";

  return (
    <div className="mb-8">
      <h4 className="font-sans font-bold text-xl uppercase tracking-tight text-ink mb-2">Framing Bias</h4>
      <div className="flex items-center gap-3">
        <span className="px-4 py-2 bg-ink text-background font-sans font-bold uppercase text-sm">
          {label.replace(/_/g, ' ')}
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={cn("w-3 h-3 rounded-full", confidenceColor)} />
            <span className="text-xs font-mono text-ink/70 uppercase">
              {Math.round(confidence * 100)}% confidence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export const GradeResults = React.forwardRef<HTMLDivElement, GradeResultsProps>(
  ({ className, analysis, ...props }, ref) => {
    // Map 0.0-1.0 to 0-10 for display
    const clickbait10 = Math.round(analysis.clickbait.score * 10);
    const emotion10 = Math.round(analysis.emotion.intensity * 10);

    return (
      <div
        ref={ref}
        className={cn("mt-6 animate-in fade-in slide-in-from-top-4 duration-300", className)}
        {...props}
      >
        <ScoreRow 
          title="Clickbait" 
          score={clickbait10} 
          label={analysis.clickbait.label} 
        />
        
        <ScoreRow 
          title="Emotional Tone" 
          score={emotion10} 
          label={analysis.emotion.label} 
        />
        
        <BiasBadge 
          label={analysis.bias.label} 
          confidence={analysis.bias.confidence} 
        />
      </div>
    );
  }
);
GradeResults.displayName = "GradeResults";
