import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = typeof import.meta?.url === 'string' ? fileURLToPath(import.meta.url) : '';
const __dirname = __filename ? path.dirname(__filename) : process.cwd();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// CORS & Preflight handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Normalize incoming path for serverless/Vercel environments and catch-all routes
app.use((req, res, next) => {
  if (req.query && (req.query.all || req.query.slug || req.query.path)) {
    const param = req.query.all || req.query.slug || req.query.path;
    const slug = Array.isArray(param) ? param.join('/') : String(param);
    if (slug && !req.url.includes(slug)) {
      req.url = `/${slug.replace(/^\/+/, '')}`;
    }
  }
  next();
});

// Safely handle request body across both local Node and Vercel serverless environments
app.use((req, res, next) => {
  // On Vercel, req.body is often pre-parsed by the runtime. If already parsed, skip express.json()
  if (req.body !== undefined && typeof req.body === 'object' && req.body !== null) {
    return next();
  }
  // Otherwise parse JSON body
  express.json({ limit: '1mb' })(req, res, (err) => {
    if (err) {
      console.warn('JSON parsing error in request body:', err);
      return res.status(400).json({ error: 'Invalid JSON request payload.', details: err?.message });
    }
    next();
  });
});

// Initialize Gemini SDK if API key is configured
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

function resolveGeminiModel(): string {
  const envModel = process.env.GEMINI_MODEL?.trim();
  // Valid model names must start with 'gemini-', not be an API key string, and not be deprecated gemini-2.5-flash
  if (
    envModel &&
    envModel.startsWith('gemini-') &&
    envModel !== 'gemini-2.5-flash' &&
    !envModel.includes('AQ.') &&
    envModel.length < 40
  ) {
    return envModel;
  }
  return 'gemini-3.8-flash';
}

export const GEMINI_MODEL = resolveGeminiModel();
let ai: GoogleGenAI | null = null;

export function getAIClient(): GoogleGenAI | null {
  const rawKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!rawKey || typeof rawKey !== 'string') {
    return null;
  }
  const currentKey = rawKey.trim().replace(/^["']|["']$/g, '');
  if (!currentKey || currentKey === '' || currentKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!ai) {
    try {
      ai = new GoogleGenAI({
        apiKey: currentKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log(`Gemini AI Provider initialized successfully with model ${GEMINI_MODEL} (AI Mode enabled).`);
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client, falling back to Demo Mode:', err);
      ai = null;
    }
  }
  return ai;
}

// Initialize on load if key is available
getAIClient();

// Timeout helper to guarantee responsiveness even under network latency
function callWithTimeout<T>(promise: Promise<T>, timeoutMs: number = 45000): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('AI provider request timed out')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

// Safe Gemini generation with timeout and automatic model quota fallback
async function generateContentSafely(params: {
  contents: any;
  config?: any;
  preferredModel?: string;
  timeoutMs?: number;
}) {
  const client = getAIClient();
  if (!client) throw new Error('Gemini AI is not initialized.');

  // Candidate models in preference order (valid names only)
  const candidateModels = [
    params.preferredModel,
    GEMINI_MODEL,
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-3-flash-preview',
  ].filter((m, idx, arr): m is string =>
    Boolean(
      m &&
      typeof m === 'string' &&
      m.startsWith('gemini-') &&
      m !== 'gemini-2.5-flash' &&
      !m.includes('AQ.') &&
      m.length < 40 &&
      arr.indexOf(m) === idx
    )
  );

  let lastError: any = null;
  for (const modelName of candidateModels) {
    try {
      return await callWithTimeout(
        client.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        }),
        params.timeoutMs || 45000
      );
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} failed (${err?.status || err?.message || 'error'}), attempting next fallback model...`);
    }
  }
  throw lastError;
}

// ============================================================================
// 1. DETERMINISTIC NLP ENGINE (DEMO MODE)
// ============================================================================
function deterministicAnalysis(text: string) {
  const lower = text.toLowerCase();

  const themes: string[] = [];
  const possibleStressIndicators: string[] = [];
  let possibleMood = 'Reflective';
  const confidence = 'Demo estimate (deterministic local analysis)';

  if (
    lower.includes('exam') ||
    lower.includes('test') ||
    lower.includes('midterm') ||
    lower.includes('study') ||
    lower.includes('grade') ||
    lower.includes('quiz')
  ) {
    themes.push('Academic workload & exams');
    possibleStressIndicators.push('Upcoming evaluative pressures');
  }
  if (
    lower.includes('deadline') ||
    lower.includes('project') ||
    lower.includes('assignment') ||
    lower.includes('homework') ||
    lower.includes('presentation')
  ) {
    themes.push('Coursework deadlines');
    possibleStressIndicators.push('Time-sensitive deliverables');
  }
  if (
    lower.includes('tired') ||
    lower.includes('sleep') ||
    lower.includes('exhausted') ||
    lower.includes('drained') ||
    lower.includes('insomnia') ||
    lower.includes('awake')
  ) {
    themes.push('Physical fatigue / sleep rhythms');
    possibleStressIndicators.push('Low energy reserves');
  }
  if (
    lower.includes('alone') ||
    lower.includes('friend') ||
    lower.includes('roommate') ||
    lower.includes('family') ||
    lower.includes('relationship') ||
    lower.includes('isolated')
  ) {
    themes.push('Social & interpersonal balance');
  }

  if (
    lower.includes('anxious') ||
    lower.includes('panic') ||
    lower.includes('nervous') ||
    lower.includes('worried') ||
    lower.includes('stress')
  ) {
    possibleMood = 'Stressed';
    possibleStressIndicators.push('Emotional tension noted in phrasing');
  } else if (
    lower.includes('overwhelm') ||
    lower.includes('too much') ||
    lower.includes('drowning')
  ) {
    possibleMood = 'Overwhelmed';
    possibleStressIndicators.push('Cognitive load saturation');
  } else if (
    lower.includes('happy') ||
    lower.includes('good') ||
    lower.includes('proud') ||
    lower.includes('accomplished') ||
    lower.includes('calm') ||
    lower.includes('relaxed')
  ) {
    possibleMood = 'Calm';
  } else if (
    lower.includes('sad') ||
    lower.includes('down') ||
    lower.includes('low') ||
    lower.includes('cry')
  ) {
    possibleMood = 'Low';
    possibleStressIndicators.push('Persistent melancholy tone');
  }

  if (themes.length === 0) {
    themes.push('Daily routine & general reflection');
  }
  if (possibleStressIndicators.length === 0) {
    possibleStressIndicators.push('No acute stressors indicated');
  }

  let reflectionSuggestion =
    'Take a pause and ask yourself: What is one small, manageable action that could give you 10 minutes of relief today?';
  if (possibleMood === 'Stressed' || possibleMood === 'Overwhelmed') {
    reflectionSuggestion =
      'When multiple demands pile up, which single item is actually within your control right now? Would stepping away for a glass of water help reset your breathing?';
  } else if (possibleMood === 'Calm') {
    reflectionSuggestion =
      'Notice what supported this calm feeling today so you can return to it when future weeks feel heavier.';
  } else if (possibleMood === 'Low') {
    reflectionSuggestion =
      'Be gentle with yourself today. What is one quiet kindness you can offer your mind right now?';
  }

  return {
    possibleMood,
    themes,
    possibleStressIndicators,
    summary: `The reflection suggests focus on ${themes.join(' and ')}. Direct personal names and identifying references are omitted.`,
    reflectionSuggestion,
    uncertaintyNote: 'This is an AI-generated interpretation, not a diagnosis.',
    confidence,
    source: 'demo-analyzer' as const,
    mode: 'demo' as const,
  };
}

// Deterministic PII Scrubber for Demo Mode
function deterministicPrivacyTransformation(text: string, studentToken: string = 'Student #03') {
  const redactionsFound: { type: string; original: string; replacement: string; explanation: string }[] = [];
  let scrubbed = text;

  // Regex patterns for common student PII
  const namePatterns = [
    /\b(Rahul(\s+Sharma)?)\b/gi,
    /\b(Aisha(\s+Patel)?)\b/gi,
    /\b(Carlos(\s+Mendez)?)\b/gi,
    /\b(Priya(\s+Verma)?)\b/gi,
    /\b(Alex(\s+Sharma)?)\b/gi,
    /\b(Sarah|David|Emily|Prof\w*\s+[A-Z][a-z]+|Dr\.\s+[A-Z][a-z]+)\b/gi,
  ];

  namePatterns.forEach((pat) => {
    const matches = text.match(pat);
    if (matches) {
      matches.forEach((m) => {
        if (!redactionsFound.some((r) => r.original.toLowerCase() === m.toLowerCase())) {
          const replacement = '[REDACTED: PERSON_NAME]';
          redactionsFound.push({
            type: 'Personal Name',
            original: m,
            replacement,
            explanation: 'Direct identity identifier removed to protect student and peer privacy.',
          });
          scrubbed = scrubbed.replace(new RegExp(m, 'g'), replacement);
        }
      });
    }
  });

  // Dorms & campus addresses
  const dormMatch = text.match(/\b(Dorm\s+[0-9A-Z]+|Room\s+[0-9]+|West\s+Hall|Maple\s+Tower|Campus\s+Apt\s+[0-9]+)\b/gi);
  if (dormMatch) {
    dormMatch.forEach((dm) => {
      if (!redactionsFound.some((r) => r.original === dm)) {
        const replacement = '[REDACTED: RESIDENCE_LOCATION]';
        redactionsFound.push({
          type: 'Campus Residence',
          original: dm,
          replacement,
          explanation: 'Physical residence removed to prevent location correlation.',
        });
        scrubbed = scrubbed.replace(new RegExp(dm, 'g'), replacement);
      }
    });
  }

  // Course numbers & departments
  const courseMatch = text.match(/\b(CS\s*101|BIO\s*204|CHEM\s*202|MATH\s*314|ECON\s*401|Biochem\s+lab|Econometrics)\b/gi);
  if (courseMatch) {
    courseMatch.forEach((cm) => {
      if (!redactionsFound.some((r) => r.original === cm)) {
        const replacement = '[REDACTED: COURSE_IDENTIFIER]';
        redactionsFound.push({
          type: 'Course Code',
          original: cm,
          replacement,
          explanation: 'Specific class codes generalized to protect cohort anonymity.',
        });
        scrubbed = scrubbed.replace(new RegExp(cm, 'g'), replacement);
      }
    });
  }

  // Email and student ID patterns
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (emailMatch) {
    emailMatch.forEach((em) => {
      const replacement = '[REDACTED: EMAIL_ADDRESS]';
      redactionsFound.push({
        type: 'Email Address',
        original: em,
        replacement,
        explanation: 'Direct electronic contact removed.',
      });
      scrubbed = scrubbed.replace(new RegExp(em, 'g'), replacement);
    });
  }

  const idMatch = text.match(/\b([0-9]{6,10}|S[0-9]{6,8})\b/gi);
  if (idMatch) {
    idMatch.forEach((idm) => {
      const replacement = '[REDACTED: STUDENT_ID]';
      redactionsFound.push({
        type: 'Student ID Number',
        original: idm,
        replacement,
        explanation: 'Institutional database ID scrubbed.',
      });
      scrubbed = scrubbed.replace(new RegExp(idm, 'g'), replacement);
    });
  }

  // Abstract themes and synthesize mentor summary
  const lower = text.toLowerCase();
  let theme = 'Academic Workload & Evaluative Pressure';
  let trendDirection = 'Elevated Evaluative Pressure';
  let mentorSafeSummary = `Student token ${studentToken} reflects significant workload stress tied to impending evaluations. Rest intervals may be disrupted.`;
  let suggestedMentorReachout =
    '“Hi there, I noticed this is a heavy exam week for several cohorts. Just wanted to let you know that our drop-in mentor hours and study support desks are open if you need a breather or study strategy advice.”';

  if (lower.includes('haven') || lower.includes('slept') || lower.includes('insomnia') || lower.includes('exhausted')) {
    theme = 'Severe Rest Debt & Senior Project Strain';
    trendDirection = 'Sleep & Energy Depletion';
    mentorSafeSummary = `Student token ${studentToken} shows indicators of sleep deprivation linked to capstone or major project milestones.`;
    suggestedMentorReachout =
      '“Hello! With major milestones underway, please make sure you protect your rest hours. Even a short reset makes a big difference—feel free to stop by if breaking down deliverables would help.”';
  } else if (lower.includes('isolated') || lower.includes('alone') || lower.includes('crying') || lower.includes('chai')) {
    theme = 'Social Adjustment & Peer Connection';
    trendDirection = 'Social Support Transition';
    mentorSafeSummary = `Student token ${studentToken} notes interpersonal adjustment dynamics on campus with positive peer support touchpoints.`;
    suggestedMentorReachout =
      '“Hi! Hope your week is finding its rhythm. Campus wellness and peer-mentorship sessions are running on Wednesday if you want a warm space to connect.”';
  } else if (lower.includes('relaxed') || lower.includes('calm') || lower.includes('good') || lower.includes('prepared')) {
    theme = 'Healthy Study-Life Equilibrium';
    trendDirection = 'Stable / Positive Momentum';
    mentorSafeSummary = `Student token ${studentToken} indicates steady balance and manageable academic pacing this cycle.`;
    suggestedMentorReachout =
      '“Great to see your steady pace this week! Keep prioritizing the routines that are working well for you.”';
  }

  return {
    originalCharCount: text.length,
    redactedCharCount: scrubbed.length,
    redactionsFound,
    redactedTextPreview: scrubbed,
    themes: [theme],
    trendDirection,
    mentorSafeSummary,
    suggestedMentorReachout,
    uncertaintyNote:
      'Summary is an automated thematic extraction. Raw personal journal text is cryptographically isolated and never shared with mentors.',
    source: 'demo-analyzer' as const,
    mode: 'demo' as const,
  };
}

// ============================================================================
// 2. API ROUTES
// ============================================================================

// Status & Health Check
app.get(['/api/status', '/status', '/api', '/api/'], (req, res) => {
  const client = getAIClient();
  const mode = client ? 'ai' : 'demo';
  res.json({
    status: 'ok',
    mode,
    geminiConfigured: Boolean(client),
    activeProvider: client ? `Google Gemini (${GEMINI_MODEL}) (Server-Side)` : 'Deterministic Local Engine (Demo Mode)',
    timestamp: new Date().toISOString(),
  });
});

// Analyze Journal Reflection endpoint (Mood, Stress, Themes, Reflection Suggestion)
app.post(['/api/analyze-reflection', '/analyze-reflection'], async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Journal text is required for analysis.' });
    }

    const sanitizedText = text.slice(0, 3000);
    const client = getAIClient();

    // AI Mode: If Gemini is initialized, request structured output
    if (client) {
      try {
        const response = await generateContentSafely({
          preferredModel: GEMINI_MODEL,
          contents: `You are the analytical engine for Sahayak, an educational mental wellness platform for college students.
Analyze this synthetic or student journal reflection and extract structured, privacy-preserving wellness themes.

STRICT SAFETY AND PRIVACY DIRECTIVES:
1. NEVER diagnose mental health conditions (do NOT diagnose Major Depressive Disorder, Generalized Anxiety Disorder, PTSD, ADHD, etc.).
2. NEVER mention or output personal names, phone numbers, email addresses, student IDs, or dorm numbers.
3. Treat all outputs as educational estimates. Include the exact uncertainty note: "This is an AI-generated interpretation, not a diagnosis."
4. Provide a warm, gentle, open-ended question that encourages self-reflection.

Journal text:
"""
${sanitizedText}
"""`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                possibleMood: {
                  type: Type.STRING,
                  description: 'Estimated mood label such as Stressed, Overwhelmed, Calm, Reflective, or Hopeful',
                },
                themes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '1 to 3 overarching themes (e.g. Academic Workload, Sleep Habits, Social Balance)',
                },
                possibleStressIndicators: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '1 to 3 non-clinical stress indicators observed in phrasing (e.g. Evaluative pressure)',
                },
                summary: {
                  type: Type.STRING,
                  description: 'A neutral, 1-2 sentence description of observed themes without repeating diary details',
                },
                reflectionSuggestion: {
                  type: Type.STRING,
                  description: 'A gentle, low-risk, open-ended reflection question',
                },
                uncertaintyNote: {
                  type: Type.STRING,
                  description: 'Must equal: "This is an AI-generated interpretation, not a diagnosis."',
                },
                confidence: {
                  type: Type.STRING,
                  description: 'Confidence qualifier, e.g. "Contextual AI estimate"',
                },
              },
              required: [
                'possibleMood',
                'themes',
                'possibleStressIndicators',
                'summary',
                'reflectionSuggestion',
                'uncertaintyNote',
              ],
            },
          },
          timeoutMs: 18000,
        });

        const raw = response.text?.trim();
        if (raw) {
          const parsed = JSON.parse(raw);
          return res.json({
            possibleMood: parsed.possibleMood || 'Reflective',
            themes: parsed.themes || ['General Reflection'],
            possibleStressIndicators: parsed.possibleStressIndicators || ['None identified'],
            summary: parsed.summary || 'Contextual pattern analyzed.',
            reflectionSuggestion:
              parsed.reflectionSuggestion || 'What is one kind thought you can offer yourself right now?',
            uncertaintyNote: 'This is an AI-generated interpretation, not a diagnosis.',
            confidence: parsed.confidence || 'Contextual AI estimate',
            source: GEMINI_MODEL,
            mode: 'ai',
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to deterministic analyzer:', geminiError);
      }
    }

    // Demo Mode fallback
    const result = deterministicAnalysis(sanitizedText);
    return res.json(result);
  } catch (error) {
    console.error('Error analyzing reflection:', error);
    res.status(500).json({ error: 'Internal reflection analysis error.' });
  }
});

// Privacy-Aware Summary Generation endpoint
app.post(['/api/privacy-summary', '/privacy-summary'], async (req, res) => {
  try {
    const { text, studentToken = 'Student #03' } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required for privacy transformation.' });
    }

    const sanitizedText = text.slice(0, 3000);
    const client = getAIClient();

    // AI Mode: Use Gemini to identify PII, redact, and generate mentor-safe abstracted briefing
    if (client) {
      try {
        const response = await generateContentSafely({
          preferredModel: GEMINI_MODEL,
          contents: `You are the privacy redaction and abstraction engine for Sahayak.
Transform this student journal entry into a Mentor-Safe Briefing.

CRITICAL PRIVACY & REDACTION RULES:
1. REDACTION: Identify any Personally Identifiable Information (PII) including personal names, emails, phone numbers, student ID numbers, course codes (e.g. CS101, CHEM202), and specific dorm/residence locations.
2. ZERO RAW SENTENCES: The mentor-safe summary must be COMPLETELY REWRITTEN in neutral third-person. NEVER copy or leak raw student sentences into the mentor summary.
3. THEMES: Extract 1-2 generalized student life themes (e.g. "Academic Workload & Evaluative Pressure").
4. SUGGESTED MENTOR REACHOUT: Propose a gentle, non-intrusive, supportive message a mentor could send without revealing they read any specific private sentences.
5. NEVER DIAGNOSE any clinical condition.

Text to transform:
"""
${sanitizedText}
"""`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                redactionsFound: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      original: { type: Type.STRING },
                      replacement: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ['type', 'original', 'replacement', 'explanation'],
                  },
                },
                redactedTextPreview: {
                  type: Type.STRING,
                  description: 'The text with all PII replaced with [REDACTED: ...]',
                },
                themes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                trendDirection: {
                  type: Type.STRING,
                  description: 'e.g. "Elevated Evaluative Pressure" or "Stable / Positive Momentum"',
                },
                mentorSafeSummary: {
                  type: Type.STRING,
                  description: 'High-level abstracted 1-2 sentence description with zero raw diary text',
                },
                suggestedMentorReachout: {
                  type: Type.STRING,
                  description: 'A gentle, supportive reachout message prompt for the mentor',
                },
              },
              required: [
                'redactionsFound',
                'redactedTextPreview',
                'themes',
                'trendDirection',
                'mentorSafeSummary',
                'suggestedMentorReachout',
              ],
            },
          },
          timeoutMs: 18000,
        });

        const raw = response.text?.trim();
        if (raw) {
          const parsed = JSON.parse(raw);
          return res.json({
            originalCharCount: sanitizedText.length,
            redactedCharCount: parsed.redactedTextPreview?.length || sanitizedText.length,
            redactionsFound: parsed.redactionsFound || [],
            redactedTextPreview: parsed.redactedTextPreview || sanitizedText,
            themes: parsed.themes || ['Academic Workload'],
            trendDirection: parsed.trendDirection || 'Elevated Evaluative Pressure',
            mentorSafeSummary: parsed.mentorSafeSummary || `Student token ${studentToken} reflects workload pressure.`,
            suggestedMentorReachout:
              parsed.suggestedMentorReachout ||
              '“Hi! Just checking in to see how your week is going. Our mentor desk is open if you need any study pacing tips.”',
            uncertaintyNote:
              'Summary is an automated thematic extraction. Raw personal journal text is cryptographically isolated and never shared with mentors.',
            source: GEMINI_MODEL,
            mode: 'ai',
          });
        }
      } catch (geminiError) {
        console.warn('Gemini privacy transformation failed, falling back to deterministic engine:', geminiError);
      }
    }

    // Demo Mode fallback
    const result = deterministicPrivacyTransformation(sanitizedText, studentToken);
    return res.json(result);
  } catch (error) {
    console.error('Error generating privacy summary:', error);
    res.status(500).json({ error: 'Internal privacy transformation error.' });
  }
});

// Mood Pattern Insights endpoint (Optional reflection on self-reported check-in history)
app.post(['/api/mood-insights', '/mood-insights'], async (req, res) => {
  try {
    const { history } = req.body;
    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'Valid history array of mood check-ins is required.' });
    }

    const recentItems = history.slice(-14);
    const client = getAIClient();

    // AI Mode: Call Gemini with structured schema
    if (client) {
      try {
        const historyText = recentItems
          .map(
            (h: { date?: string; moodLabel?: string; label?: string; moodScore?: number; score?: number; emotions?: string[]; note?: string }) =>
              `- Date: ${h.date || 'Recent'}, Mood: ${h.moodLabel || h.label || 'Check-in'} (${h.moodScore || h.score || 3}/5), Emotions: ${(h.emotions || []).join(', ') || 'None recorded'}, Note: ${h.note || 'None'}`
          )
          .join('\n');

        const prompt = `You are the Sahayak Wellness Pattern Guide.
Given this student's self-reported mood check-in history over the past 1-2 weeks:
${historyText}

TASK:
Generate an optional, gentle reflection about patterns or changes in their self-reported rhythm.

CRITICAL SAFETY & PRIVACY RULES:
1. Do NOT diagnose, predict psychological crises, or label clinical disorders.
2. Clearly mention which recorded check-ins or dates support your observation.
3. Ask a gentle, optional question that encourages self-reflection (e.g. "Your last few check-ins differ from earlier records. Would you like to reflect on what has changed?").
4. Keep ordinary calculations deterministic; explain observations clearly and concisely.
5. End with the statement: "This is an optional observation based on self-reported logs, not a clinical evaluation."`;

        const response = await generateContentSafely({
          preferredModel: GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                observation: {
                  type: Type.STRING,
                  description: 'A gentle 1-2 sentence description of observed self-reported rhythm changes',
                },
                supportingDates: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Specific dates or check-ins that support this observation',
                },
                reflectionQuestion: {
                  type: Type.STRING,
                  description: 'An open-ended, gentle question inviting self-reflection',
                },
                suggestedAction: {
                  type: Type.STRING,
                  description: 'A low-stakes wellness practice or gentle routine suggestion',
                },
                uncertaintyNote: {
                  type: Type.STRING,
                  description: 'Educational disclaimer stating this is not a clinical assessment',
                },
              },
              required: ['observation', 'supportingDates', 'reflectionQuestion', 'uncertaintyNote'],
            },
          },
          timeoutMs: 18000,
        });

        const raw = response.text?.trim();
        if (raw) {
          const parsed = JSON.parse(raw);
          return res.json({
            observation: parsed.observation,
            supportingDates: parsed.supportingDates || [],
            reflectionQuestion: parsed.reflectionQuestion,
            suggestedAction: parsed.suggestedAction || 'Consider taking a 5-minute pause between your afternoon classes.',
            uncertaintyNote: parsed.uncertaintyNote || 'This is an optional observation based on self-reported logs, not a clinical evaluation.',
            source: GEMINI_MODEL,
            mode: 'ai',
          });
        }
      } catch (geminiError) {
        console.warn('Gemini mood insights failed, falling back to deterministic engine:', geminiError);
      }
    }

    // Demo Mode fallback
    const n = recentItems.length;
    const splitIndex = Math.max(1, Math.floor(n / 2));
    const earlier = recentItems.slice(0, splitIndex);
    const recent = recentItems.slice(splitIndex);

    const getScore = (item: { moodScore?: number; score?: number }) => item.moodScore || item.score || 3;
    const earlierAvg = earlier.reduce((a, b) => a + getScore(b), 0) / earlier.length;
    const recentAvg = recent.reduce((a, b) => a + getScore(b), 0) / recent.length;
    const diff = Number((recentAvg - earlierAvg).toFixed(1));

    const supportingDates = [
      ...earlier.slice(-2).map((h: { date?: string }) => h.date || 'Earlier check-ins'),
      ...recent.slice(-2).map((h: { date?: string }) => h.date || 'Recent check-ins'),
    ];

    let observation = 'Your self-reported rhythm has maintained a steady, even balance over the past two weeks.';
    let reflectionQuestion = 'What daily habits or routines have helped you stay anchored lately?';
    let suggestedAction = 'Keep continuing the micro-breaks and regular evening sleep schedule you have maintained.';

    if (diff <= -0.6) {
      observation = `Your last ${recent.length} check-ins average ${recentAvg.toFixed(1)}/5, which differs from your earlier baseline of ${earlierAvg.toFixed(1)}/5.`;
      reflectionQuestion = 'Your last few check-ins reflect a lower rhythm than earlier records. Would you like to reflect on what has shifted in your workload or rest?';
      suggestedAction = 'Try scheduling one guilt-free 30-minute block tonight without academic tasks.';
    } else if (diff >= 0.6) {
      observation = `Your recent check-ins reflect a noticeable upward lift (averaging ${recentAvg.toFixed(1)}/5 compared to ${earlierAvg.toFixed(1)}/5 earlier).`;
      reflectionQuestion = 'What positive factors or supportive connections have contributed to your energy lately?';
      suggestedAction = 'Note down one thing that went well this week so you can return to it on harder days.';
    }

    return res.json({
      observation,
      supportingDates,
      reflectionQuestion,
      suggestedAction,
      uncertaintyNote: 'This is an optional observation based on self-reported logs, not a clinical evaluation.',
      source: 'demo-analyzer',
      mode: 'demo',
    });
  } catch (error) {
    console.error('Error generating mood pattern insights:', error);
    res.status(500).json({ error: 'Internal mood pattern insights error.' });
  }
});

// AI Reflection Companion Chat endpoint
app.post(['/api/chat-companion', '/chat-companion', '/api', '/'], async (req, res, next) => {
  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      if (req.path === '/' || req.path === '/api' || req.path === '/api/') {
        return next();
      }
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const trimmedMsg = message.trim().slice(0, 3000);

    const lower = trimmedMsg.toLowerCase();
    const isCrisis =
      /\b(suicid|kill(ing)?\s+myself|end(ing)?\s+(my\s+life|it\s+all)|want\s+to\s+die|hurt(ing)?\s+myself|harm(ing)?\s+myself|give\s+up\s+completely|giving\s+up\s+completely|hang(ing)?\s+myself)\b/i.test(
        lower
      );

    const client = getAIClient();

    // AI Mode: If Gemini is initialized, generate dynamic response
    if (client) {
      try {
        const systemInstruction = `You are Sahayak AI Companion, an intelligent, helpful, conversational assistant available to college students.

Your primary responsibility is to understand the student's actual question and provide the most relevant, accurate, and useful response you can.

You are not restricted to mental wellness topics. Students may ask about academics, technology, everyday problems, relationships, general knowledge, personal development, and other appropriate subjects.

RESPONSE RULES:

1. Understand the specific question before answering. Never respond with a generic mental wellness message when the user has asked a different question.

2. Generate a fresh, contextually relevant answer for every message. Never reuse a fixed response merely because a question was received.

3. Answer simple questions directly and concisely. For complex questions, provide a detailed, structured explanation with examples and actionable steps.

4. When appropriate, use headings, numbered steps, bullet points, examples, comparisons, and summaries to make long answers easier to understand.

5. Use the conversation history to understand references such as 'explain that again', 'give an example', or 'what should I do next?'.

6. Ask a clarifying question only when necessary. Otherwise, make reasonable assumptions and provide a useful answer.

7. Be honest about uncertainty. Never invent facts, sources, capabilities, or actions.

8. Match the student's language and level of understanding. Explain technical concepts clearly without being condescending.

9. When discussing emotions or personal difficulties, be empathetic and nonjudgmental. Do not diagnose mental health conditions or claim to replace a qualified professional.

10. Do not turn every conversation into therapy. Be a capable general-purpose assistant that can also provide supportive mental wellness guidance when relevant.

11. If a question requires current information that you cannot verify, explain the limitation instead of presenting outdated information as current.

12. Do not automatically reveal private conversation content to mentors or other users.

13. If the student describes immediate danger, respond with supportive, safety-focused guidance and encourage contacting a trusted person or appropriate local emergency support:
    - India: Tele-MANAS (14416 or 1800-891-4416) or KIRAN (1800-599-0019)
    - US/Canada: 988 Suicide & Crisis Lifeline (call/text 988)
    - Emergency dispatch: 112 (India) or 911 (US)

14. Never claim that you searched the web, accessed an external account, or performed an action unless that capability was actually used.

Your goal is to provide answers that directly address the user's intent, with the depth, accuracy, empathy, and clarity appropriate to each question.`;

        // Format conversation history for Gemini multi-turn chat
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history)) {
          for (const h of history.slice(-16)) {
            if (!h || typeof h.text !== 'string' || !h.text.trim()) continue;
            const role: 'user' | 'model' =
              h.role === 'user' || h.sender === 'student' ? 'user' : 'model';
            const cleanText = h.text.trim();

            if (contents.length === 0) {
              if (role === 'user') {
                contents.push({ role: 'user', parts: [{ text: cleanText }] });
              }
              // Skip leading model turns to ensure conversations start with user
            } else {
              const lastTurn = contents[contents.length - 1];
              if (lastTurn.role === role) {
                lastTurn.parts[0].text += `\n\n${cleanText}`;
              } else {
                contents.push({ role, parts: [{ text: cleanText }] });
              }
            }
          }
        }

        // Gemini multi-turn requires the first turn to be 'user'
        while (contents.length > 0 && contents[0].role !== 'user') {
          contents.shift();
        }

        // Append the student's current message
        if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
          contents[contents.length - 1].parts[0].text += `\n\n${trimmedMsg}`;
        } else {
          contents.push({ role: 'user', parts: [{ text: trimmedMsg }] });
        }

        const response = await generateContentSafely({
          preferredModel: GEMINI_MODEL,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
          timeoutMs: 45000,
        });

        let reply = response.text?.trim();
        if (!reply && response.candidates?.[0]?.content?.parts) {
          reply = response.candidates[0].content.parts
            .map((p: any) => p.text)
            .filter(Boolean)
            .join('\n')
            .trim();
        }

        if (!reply) {
          const finishReason = response.candidates?.[0]?.finishReason;
          if (finishReason === 'SAFETY') {
            reply =
              'I am unable to answer this specific query due to safety considerations. Please feel free to ask another question or rephrase your inquiry.';
          } else {
            throw new Error('Gemini API returned an empty response.');
          }
        }

        return res.json({
          reply,
          source: GEMINI_MODEL,
          mode: 'ai',
          isCrisis,
        });
      } catch (geminiError: any) {
        console.error('Gemini companion chat error:', geminiError);
        return res.status(502).json({
          error: 'Gemini service temporarily unavailable.',
          details:
            geminiError?.message ||
            'Error communicating with Google Gemini API. Please check your network and retry your message.',
        });
      }
    }

    // Offline Demo Mode only (when no GEMINI_API_KEY is configured)
    if (isCrisis) {
      return res.json({
        reply:
          'I hear how much pain you are carrying right now, and I want you to know that you do not have to walk through this alone. Because I am an AI companion and not a medical or emergency service, please connect with someone who can support you right now. You can reach free, confidential 24/7 support at 988 (US/Canada) or 14416 / 1800-891-4416 (Tele-MANAS, India), or reach emergency services (112 / 911) immediately.',
        isCrisis: true,
        source: 'Demo Mode Engine',
        mode: 'demo',
      });
    }

    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server.',
      details: 'Please set the GEMINI_API_KEY secret on the server to enable real-time dynamic Gemini chat responses.',
    });
  } catch (error: any) {
    console.error('Error in chat companion endpoint:', error);
    res.status(500).json({ error: 'Internal companion chat error.', details: error?.message });
  }
});

// Export app for Vercel Serverless Function entry point
export { app };
export default app;

// Setup Vite in development or serve static in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sahayak full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

// In serverless environments (like Vercel), the runtime manages execution and routing
if (!process.env.VERCEL) {
  startServer();
}
