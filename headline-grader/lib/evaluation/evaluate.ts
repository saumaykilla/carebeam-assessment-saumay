/**
 * Evaluation script: LLM Consistency & Accuracy
 *
 * Runs a curated test set through the Gemini LLM grading engine multiple times
 * to measure consistency (mean, std dev, max difference) and accuracy against
 * expected score ranges.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' lib/evaluation/evaluate.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { gradeHeadline } from '../actions/gradeHeadline';

interface TestCase {
  category: string;
  headline: string;
  expectedCB: [number, number]; // [min, max] out of 10
  expectedEm: [number, number]; // [min, max] out of 10
  expectedBias: string; // The expected framing bias label
}

const TEST_SET: TestCase[] = [
  // ── Neutral ──
  {
    category: 'Neutral',
    headline: 'Senate Passes Budget Bill 52-48',
    expectedCB: [0, 3],
    expectedEm: [0, 3],
    expectedBias: 'neutral',
  },
  {
    category: 'Neutral',
    headline: 'Apple Reports Q3 Earnings Above Expectations',
    expectedCB: [0, 3],
    expectedEm: [0, 3],
    expectedBias: 'neutral',
  },
  {
    category: 'Neutral',
    headline: 'NASA Successfully Launches Artemis III Mission',
    expectedCB: [0, 3],
    expectedEm: [0, 3],
    expectedBias: 'neutral',
  },

  // ── Clickbait ──
  {
    category: 'Clickbait',
    headline: "You Won't Believe What This Senator Said on Live TV!",
    expectedCB: [7, 10],
    expectedEm: [2, 8],
    expectedBias: 'neutral',
  },
  {
    category: 'Clickbait',
    headline: 'This Secret Trick Will Change How You Read the News Forever',
    expectedCB: [7, 10],
    expectedEm: [1, 7],
    expectedBias: 'neutral',
  },
  {
    category: 'Clickbait',
    headline: 'SHOCKING: The Truth They Don\'t Want You to Know!',
    expectedCB: [7, 10],
    expectedEm: [3, 9],
    expectedBias: 'lean_negative', // implying conspiracy against the reader
  },

  // ── Emotionally Charged ──
  {
    category: 'Emotional',
    headline: 'Devastating Crisis Destroys Thousands of Families Overnight',
    expectedCB: [5, 10],
    expectedEm: [7, 10],
    expectedBias: 'lean_negative',
  },
  {
    category: 'Emotional',
    headline: 'Parents Slam Government After Children Left to Suffer',
    expectedCB: [3, 8],
    expectedEm: [7, 10],
    expectedBias: 'lean_negative', // framing government negatively
  },
  {
    category: 'Emotional',
    headline: 'Outrage as Millions Face Fury Over Healthcare Disaster',
    expectedCB: [4, 10],
    expectedEm: [7, 10],
    expectedBias: 'lean_negative',
  },

  // ── Mixed ──
  {
    category: 'Mixed',
    headline: 'Is the Economy Headed for a Recession?',
    expectedCB: [1, 6],
    expectedEm: [0, 5],
    expectedBias: 'neutral',
  },
  {
    category: 'Mixed',
    headline: 'Trump Slams Biden Over Border Crisis in Fiery Speech',
    expectedCB: [3, 8],
    expectedEm: [5, 10],
    expectedBias: 'lean_negative', // "slams" introduces negative framing of the entity
  },
];

// Reverting to 5 to ensure good statistical sampling for standard deviation
const RUNS_PER_HEADLINE = 5;

// Helper: Calculate standard deviation
function getStdDev(arr: number[], mean: number) {
  if (arr.length === 0) return 0;
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

// Helper: check if within range
function inRange(val: number, [min, max]: [number, number]) {
  return val >= min && val <= max;
}

async function runEvaluation() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`  HEADLINE GRADER — STATISTICAL EVALUATION (INC. BIAS)`);
  console.log(`  ${TEST_SET.length} headlines × ${RUNS_PER_HEADLINE} runs = ${TEST_SET.length * RUNS_PER_HEADLINE} total calls`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found. Add it to .env.local');
    process.exit(1);
  }

  let globalPassed = 0;
  let globalTotal = 0; // Each run checks 3 metrics (CB, EM, Bias) = 3 checks per run

  const allCbStdDevs: number[] = [];
  const allEmStdDevs: number[] = [];
  const allCbMaxDiffs: number[] = [];
  const allEmMaxDiffs: number[] = [];

  for (let i = 0; i < TEST_SET.length; i++) {
    const tc = TEST_SET[i];
    console.log(`[${i + 1}/${TEST_SET.length}] Analyzing "${tc.headline}"...`);

    const cbScores: number[] = [];
    const emScores: number[] = [];
    const biasLabels: string[] = [];
    const biasConfs: number[] = [];

    let passedCB = 0;
    let passedEm = 0;
    let passedBias = 0;

    for (let run = 1; run <= RUNS_PER_HEADLINE; run++) {
      try {
        const result = await gradeHeadline(tc.headline);
        
        const cbScore = Math.round(result.clickbait.score * 10);
        const emScore = Math.round(result.emotion.intensity * 10);
        const biasLabel = result.bias.label;
        const biasConf = result.bias.confidence;

        cbScores.push(cbScore);
        emScores.push(emScore);
        biasLabels.push(biasLabel);
        biasConfs.push(biasConf);

        if (inRange(cbScore, tc.expectedCB)) passedCB++;
        if (inRange(emScore, tc.expectedEm)) passedEm++;
        if (biasLabel === tc.expectedBias) passedBias++;

        process.stdout.write(`.` ); 
        
        // 4.5s delay for rate limiting
        await new Promise((r) => setTimeout(r, 4500));
      } catch (err: any) {
        console.log(`\n💥 Run ${run} ERROR: ${err.message}`);
      }
    }
    console.log(''); 

    if (cbScores.length === 0) continue;

    // Numerical Stats
    const cbMean = cbScores.reduce((a, b) => a + b, 0) / cbScores.length;
    const emMean = emScores.reduce((a, b) => a + b, 0) / emScores.length;
    const cbStdDev = getStdDev(cbScores, cbMean);
    const emStdDev = getStdDev(emScores, emMean);
    const cbMaxDiff = Math.max(...cbScores) - Math.min(...cbScores);
    const emMaxDiff = Math.max(...emScores) - Math.min(...emScores);

    allCbStdDevs.push(cbStdDev);
    allEmStdDevs.push(emStdDev);
    allCbMaxDiffs.push(cbMaxDiff);
    allEmMaxDiffs.push(emMaxDiff);

    // Categorical Stats
    const uniqueBiases = Array.from(new Set(biasLabels));
    const meanConf = biasConfs.reduce((a, b) => a + b, 0) / biasConfs.length;

    const cbAccuracy = (passedCB / cbScores.length) * 100;
    const emAccuracy = (passedEm / emScores.length) * 100;
    const biasAccuracy = (passedBias / biasLabels.length) * 100;
    const overallAccuracy = ((passedCB + passedEm + passedBias) / (cbScores.length * 3)) * 100;

    globalPassed += (passedCB + passedEm + passedBias);
    globalTotal += (cbScores.length * 3);

    console.log(`   Clickbait -> Mean: ${cbMean.toFixed(1)} | StdDev: ${cbStdDev.toFixed(2)} | MaxDiff: ${cbMaxDiff} | Acc: ${cbAccuracy.toFixed(0)}%`);
    console.log(`   Emotional -> Mean: ${emMean.toFixed(1)} | StdDev: ${emStdDev.toFixed(2)} | MaxDiff: ${emMaxDiff} | Acc: ${emAccuracy.toFixed(0)}%`);
    console.log(`   Pol. Bias -> Mode: ${uniqueBiases.join(', ')} | Mean Conf: ${(meanConf * 100).toFixed(0)}% | Acc: ${biasAccuracy.toFixed(0)}%`);
    console.log(`   Overall Accuracy for this headline: ${overallAccuracy.toFixed(0)}%\n`);
  }

  // ─── Summary ──────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  FINAL SUMMARY (All 3 Metrics)');
  console.log('═══════════════════════════════════════════════════════════════════');
  
  const avgCbStdDev = allCbStdDevs.reduce((a, b) => a + b, 0) / allCbStdDevs.length;
  const avgEmStdDev = allEmStdDevs.reduce((a, b) => a + b, 0) / allEmStdDevs.length;
  const avgCbMaxDiff = allCbMaxDiffs.reduce((a, b) => a + b, 0) / allCbMaxDiffs.length;
  const avgEmMaxDiff = allEmMaxDiffs.reduce((a, b) => a + b, 0) / allEmMaxDiffs.length;
  
  console.log(`  Total Evaluated: ${allCbStdDevs.length} headlines × ${RUNS_PER_HEADLINE} runs`);
  console.log('');
  console.log(`  AVERAGE CONSISTENCY (Lower is better):`);
  console.log(`    Clickbait  -> StdDev: ${avgCbStdDev.toFixed(2)} | MaxDiff: ${avgCbMaxDiff.toFixed(1)}`);
  console.log(`    Emotional  -> StdDev: ${avgEmStdDev.toFixed(2)} | MaxDiff: ${avgEmMaxDiff.toFixed(1)}`);
  console.log('');
  console.log(`  OVERALL ACCURACY:`);
  console.log(`    ${globalPassed} / ${globalTotal} scores (CB, Emotion, & Bias) matched expected ranges/labels`);
  console.log(`    Score: ${((globalPassed / globalTotal) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

runEvaluation().catch(console.error);
