import { GoogleGenerativeAI } from '@google/generative-ai';
import { callGemini, parseJsonFromAi } from '../utils/gemini.js';
import { logAiUsage } from '../utils/aiLogger.js';
import ChatHistory from '../models/ChatHistory.js';

export const generateSummary = async (req, res) => {
  try {
    const { jobTitle, resumeId } = req.body;
    const prompt = `You are an expert resume writer. Write a single, highly professional resume summary paragraph for a ${jobTitle}. Keep it to exactly 3 sentences. Focus on value, strategic impact, and expertise. Return ONLY the final paragraph. Do NOT use markdown, bolding, or asterisks.`;
    const summary = await callGemini(prompt);

    await logAiUsage({
      userId: req.user._id,
      promptType: 'Summary',
      promptText: prompt,
      response: summary,
      resumeId,
      details: 'Generated Summary',
    });

    res.status(200).json({ summary });
  } catch (error) {
    console.error('AI Summary Error:', error);
    res.status(500).json({ message: error.message || 'AI generation failed' });
  }
};

export const generateBullets = async (req, res) => {
  try {
    const { notes, context, resumeId } = req.body;
    if (!notes?.trim()) {
      return res.status(400).json({ message: 'Notes are required to generate bullet points.' });
    }

    const prompt = `You are an expert resume writer. The user wrote rough notes for their ${context || 'work experience'}. Transform these notes into exactly 3 professional resume bullet points. Each bullet must start with a strong action verb, include measurable impact where possible, and be concise (one line each). Return ONLY the 3 bullet points, one per line, starting with "• ". Do NOT use markdown or asterisks.

Rough notes:
${notes}`;

    const bullets = await callGemini(prompt);

    await logAiUsage({
      userId: req.user._id,
      promptType: 'Experience',
      promptText: prompt,
      response: bullets,
      resumeId,
      details: 'Generated Bullet Points',
    });

    res.status(200).json({ bullets });
  } catch (error) {
    console.error('AI Bullets Error:', error);
    res.status(500).json({ message: error.message || 'AI generation failed' });
  }
};

export const improveText = async (req, res) => {
  try {
    const { text, fieldName, resumeId } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Text is required to improve.' });
    }

    const prompt = `You are a world-class resume editor. Review the following text from a candidate's resume field "${fieldName || 'content'}". Improve its grammar, optimize wording, rewrite weak sentences, incorporate strong action verbs, and make it ATS-friendly. Maintain a professional, clean business tone.
    
    Original text:
    "${text}"
    
    Return ONLY the final improved text. Do NOT wrap in quotes, do NOT use markdown, and do NOT use asterisks or explanation text. Just output the final polished text directly.`;

    const suggestion = await callGemini(prompt);

    await logAiUsage({
      userId: req.user._id,
      promptType: 'Review',
      promptText: prompt,
      response: suggestion,
      resumeId,
      details: 'Improved Text',
    });

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error('AI Improve Text Error:', error);
    res.status(500).json({ message: error.message || 'AI improvement failed' });
  }
};

export const optimizeLinkedIn = async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: 'Resume data is required' });
    }

    const name = resumeData.personalInfo?.fullName || 'User';
    const jobTitle = resumeData.personalInfo?.jobTitle || '';
    const skills = (resumeData.skills || []).join(', ');
    const experienceText = (resumeData.experience || [])
      .map((exp) => `${exp.position} at ${exp.company}: ${exp.description}`)
      .join('\n');

    const prompt = `You are an expert LinkedIn branding consultant. Optimize LinkedIn profile for:
    Name: ${name}, Job Title: ${jobTitle}, Skills: ${skills}
    Experience: ${experienceText}
    
    Return valid JSON only:
    {"headline":"...","summary":"...","experienceSuggestions":"..."}`;

    const rawResponse = await callGemini(prompt);
    const analysis = parseJsonFromAi(rawResponse, () => ({
      headline: `${jobTitle} | Expert in ${resumeData.skills?.[0] || 'Technology'}`,
      summary: `Results-driven ${jobTitle || 'Professional'} skilled in ${skills || 'delivering results'}.`,
      experienceSuggestions: 'Focus on metrics and business impact in your experience bullets.',
    }));

    await logAiUsage({
      userId: req.user._id,
      promptType: 'General',
      promptText: prompt,
      response: JSON.stringify(analysis),
      resumeId: resumeData._id,
      details: 'Optimized LinkedIn Profile',
    });

    res.status(200).json(analysis);
  } catch (error) {
    console.error('LinkedIn Optimizer Error:', error);
    res.status(500).json({ message: error.message || 'LinkedIn optimization failed' });
  }
};

export const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeData, jobDescription, difficulty, role, previousQuestions } = req.body;
    const jobTitle = resumeData?.personalInfo?.jobTitle || role || 'Software Engineer';
    const skills = (resumeData?.skills || []).join(', ') || 'General technical skills';
    const descText = jobDescription || `General ${jobTitle} role`;

    const diffLabel = difficulty || 'Medium';
    let difficultyFocus = "";
    if (diffLabel.toLowerCase() === 'easy' || diffLabel.toLowerCase() === 'beginner') {
      difficultyFocus = "Focus on basic concepts and core definitions appropriate for a beginner candidate.";
    } else if (diffLabel.toLowerCase() === 'hard' || diffLabel.toLowerCase() === 'advanced') {
      difficultyFocus = "Focus on advanced concepts, high-level architectures, deep troubleshooting, and complex engineering problems.";
    } else {
      difficultyFocus = "Focus on practical, hands-on, day-to-day work experience and scenario-based questions.";
    }

    let avoidSection = "";
    if (previousQuestions && Array.isArray(previousQuestions) && previousQuestions.length > 0) {
      avoidSection = `\nCRITICAL: Do NOT generate or repeat any of the following questions (or very similar ones):\n- ${previousQuestions.join('\n- ')}`;
    }

    const prompt = `You are a senior technical interviewer. Generate exactly 10 interview questions for a ${jobTitle} candidate.
    Skills: ${skills}
    Job context: ${descText}
    Difficulty: ${diffLabel}. ${difficultyFocus}${avoidSection}

    Return ONLY a JSON array of exactly 10 objects with keys:
    - "question": the interview question text
    - "category": HR, Technical, or Behavioral
    - "difficulty": Easy, Medium, or Hard
    - "tips": concise advice on how a candidate should approach answering the question
    - "answer": an exemplar, high-quality sample response
    - "explanation": a detailed explanation of the core concepts tested by this question and why the answer is correct

    Return ONLY the raw JSON array. Do NOT wrap in markdown \`\`\`json blocks.`;

    const rawResponse = await callGemini(prompt);
    const questions = parseJsonFromAi(rawResponse, () => [
      {
        question: `Why are you interested in this ${jobTitle} role?`,
        category: 'HR',
        difficulty: diffLabel,
        tips: 'Connect your personal growth, goals, and interest in their tech stack or product directly to the company mission.',
        answer: 'I am excited about this role because your team is solving complex scaling challenges that align with my interest in high-performance architectures. I have been following your product releases, and I see a strong overlap between your stack and my expertise in full-stack development, making this a perfect place to contribute and grow.',
        explanation: 'This question assesses candidate alignment, motivation, and cultural fit with the team and company mission.',
      },
      {
        question: `Tell me about yourself and your journey in technology.`,
        category: 'HR',
        difficulty: diffLabel,
        tips: 'Keep it to 2-3 minutes. Highlight key career milestones, projects, and your current motivation.',
        answer: 'I started my journey building web applications and quickly fell in love with backend scalability. Over the past few years, I have built production applications, designed databases, and integrated modern APIs. Currently, I am focused on creating highly optimized applications and am looking to apply my skills to a challenging engineering team.',
        explanation: 'This question evaluates communication skills and tracks technical career progress and key milestones.',
      },
      {
        question: `Where do you see your career going in the next three to five years?`,
        category: 'HR',
        difficulty: diffLabel,
        tips: 'Show ambition and a desire to master technical skills while contributing to the team growth.',
        answer: 'In the next few years, I aim to become a technical leader, mastering system design, cloud architecture, and mentoring junior engineers. I want to build deep domain expertise in web scale architectures and continue contributing to open-source systems.',
        explanation: 'Tests long-term vision, self-motivation, stability, and growth mindset in alignment with team scope.',
      },
      {
        question: `Explain a system you built using ${skills.split(',')[0] || 'your core stack'}. How did you handle scale?`,
        category: 'Technical',
        difficulty: diffLabel,
        tips: 'Cover architecture, database design, caching, trade-offs, and measurable outcomes.',
        answer: 'I built a collaborative project platform where I used database optimization, connection pooling, and Redis caching. By offloading hot queries to a cache layer and indexing search columns, I reduced API response latency by 40% and successfully supported concurrent user operations under high load tests.',
        explanation: 'Evaluates system design skills, architectural understanding, database optimizations, and caching mechanisms.',
      },
      {
        question: `What is the difference between synchronous and asynchronous execution? When would you use each?`,
        category: 'Technical',
        difficulty: diffLabel,
        tips: 'Focus on non-blocking event loops, thread allocation, and performance characteristics in web contexts.',
        answer: 'Synchronous execution blocks the thread until the current task finishes, making it suitable for quick, CPU-bound computations. Asynchronous execution is non-blocking, delegating tasks like I/O and DB queries to the background. We use async code for API requests, network calls, and database operations to maximize thread throughput.',
        explanation: 'Verifies knowledge of event loop execution models, concurrency, thread blocking, and asynchronous optimizations.',
      },
      {
        question: `How do you approach database optimization and indexing?`,
        category: 'Technical',
        difficulty: diffLabel,
        tips: 'Mention EXPLAIN plans, index types (B-Tree, Hash), read/write trade-offs, and normalized schemas.',
        answer: 'I start by analyzing slow queries using database EXPLAIN plans. I index columns that are frequently used in WHERE clauses, JOIN conditions, and sorting orders. However, I make sure not to over-index as it degrades write performance. I also optimize by normalization, database clustering, or denormalizing when read performance is bottlenecked.',
        explanation: 'Analyzes index implementations (B-Trees), query profiling, write vs read performance, and structural normalization.',
      },
      {
        question: `How do you ensure application security and prevent injection attacks?`,
        category: 'Technical',
        difficulty: diffLabel,
        tips: 'Discuss SQL injection, parameterized queries, CSRF tokens, input validation, and secure cookie headers.',
        answer: 'I prevent SQL injection by using ORMs and parameterized queries, ensuring raw inputs are never concatenated. For cross-site scripting (XSS), I sanitize inputs and set Content Security Policies. I secure cookies using HttpOnly and Secure flags, and enforce authorization checks on every endpoint.',
        explanation: 'Evaluates knowledge of common web security threats (OWASP Top 10) and application mitigation techniques.',
      },
      {
        question: 'Describe a conflict with a teammate and how you resolved it.',
        category: 'Behavioral',
        difficulty: diffLabel,
        tips: 'Use the STAR method: Situation, Task, Action, Result. Highlight empathy, objective data, and collaborative alignment.',
        answer: 'Situation: We had a debate on using SQL vs NoSQL for a new feature. Task: We needed to align on the database model quickly. Action: I scheduled a brief technical sync where we listed pros/cons, focusing on data relationships and write performance. Result: We agreed on SQL for relational safety. The project shipped on time with clear structure.',
        explanation: 'Evaluates emotional intelligence, conflict resolution, collaborative workflow, and objective debate alignment.',
      },
      {
        question: 'Tell me about a time you failed on a task or project, and what you learned.',
        category: 'Behavioral',
        difficulty: diffLabel,
        tips: 'Be honest. Highlight taking responsibility, quick recovery, and long-term systemic learning.',
        answer: 'Situation: I pushed a database update that temporarily broke production queries due to a missing index. Task: Restore service immediately. Action: I rolled back the change, ran query profiling, added the index, and tested on staging. Result: Uptime restored. I established a new rule requiring query plan reviews for all database migrations.',
        explanation: 'Checks self-awareness, accountability, recovery actions, and constructive lessons taken from failures.',
      },
      {
        question: 'Describe a project with an extremely tight deadline and how you delivered it.',
        category: 'Behavioral',
        difficulty: diffLabel,
        tips: 'Detail task prioritization, scope management, status updates, and sustainable sprint planning.',
        answer: 'Situation: We had 48 hours to launch an emergency hotfix for a client integrations bug. Task: Redevelop the API mapping module. Action: I narrowed the scope to the core bug, updated stakeholders, and worked with peer developers in reviews. Result: The integration hotfix was launched within 36 hours with zero data loss.',
        explanation: 'Measures prioritization under pressure, scope management, team communication, and execution speed.',
      },
    ]);

    await logAiUsage({
      userId: req.user._id,
      promptType: 'Interview',
      promptText: prompt,
      response: JSON.stringify(questions),
      resumeId: resumeData?._id,
      details: 'Generated Interview Questions',
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error('Interview Questions Error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate interview questions' });
  }
};

export const chatCoach = async (req, res) => {
  try {
    const { messages, mode } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    let systemInstruction = `You are HireCraft's elite career coach and resume expert. Give brief, actionable advice on resumes, interviews, LinkedIn, and career growth. Use bullet points when helpful.`;

    const activeMode = mode || 'student'; // Default to Student Mode
    
    if (activeMode === 'beginner' || activeMode === 'student') {
      systemInstruction += ` You are working with a student/beginner candidate, so simplify your language:
- Use simple English.
- Always explain technical terms (e.g. ATS, Portfolio, STAR method, SEO, etc.) in a simple way. E.g. ATS: "ATS is software companies use to scan resumes." Portfolio: "A portfolio is your online professional website."
- Use very short paragraphs.
- Provide concrete examples.
- Deliver step-by-step answers.`;
    } else {
      systemInstruction += ` You are working with a professional candidate, so provide sophisticated, metrics-driven, industry-standard guidance and strategic advice.`;
    }

    const contents = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      { role: 'model', parts: [{ text: "I'm your HireCraft Career Coach. How can I help you today?" }] },
    ];

    messages.forEach((msg) => {
      const role = msg.role === 'assistant' || msg.role === 'model' || msg.sender === 'ai' ? 'model' : 'user';
      contents.push({
        role,
        parts: [{ text: msg.content || msg.text || '' }],
      });
    });

    const reply = await callGemini('', { contents });
    const updatedMessages = [...messages, { role: 'assistant', content: reply }];

    await ChatHistory.findOneAndUpdate(
      { user: req.user._id },
      { messages: updatedMessages },
      { upsert: true, new: true }
    );

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Career Coach Chat Error:', error);
    res.status(500).json({ message: error.message || 'Chat assistant error' });
  }
};

export const evaluateMockInterview = async (req, res) => {
  try {
    const { question, answer, role } = req.body;
    if (!question || !answer) return res.status(400).json({ message: 'Question and answer required.' });

    const prompt = `Evaluate this ${role || 'Software Engineering'} interview answer.
    Question: "${question}"
    Answer: "${answer}"
    
    Return ONLY JSON: {"score":8,"feedback":"...","improvement":"...","strengths":[],"weaknesses":[]}`;

    const rawResponse = await callGemini(prompt);
    const evaluation = parseJsonFromAi(rawResponse, () => ({
      score: 5,
      feedback: 'Could not fully evaluate. Try adding more specific examples.',
      improvement: 'Include metrics and concrete outcomes.',
      strengths: [],
      weaknesses: [],
    }));

    await logAiUsage({
      userId: req.user._id,
      promptType: 'Interview',
      promptText: prompt,
      response: JSON.stringify(evaluation),
      details: 'Mock Interview Evaluated',
    });

    res.status(200).json(evaluation);
  } catch (error) {
    console.error('Mock Interview Error:', error);
    res.status(500).json({ message: error.message || 'Evaluation failed' });
  }
};

export const analyzeSkillGap = async (req, res) => {
  try {
    const { dreamRole, currentSkills } = req.body;
    const prompt = `Skill gap analysis for ${dreamRole}. Current skills: ${currentSkills || 'None'}.
    Return JSON: {"missingSkills":[],"learningOrder":[],"certifications":[],"estimatedMonths":6}`;

    const rawResponse = await callGemini(prompt);
    const analysis = parseJsonFromAi(rawResponse, () => ({
      missingSkills: [],
      learningOrder: [],
      certifications: [],
      estimatedMonths: 0,
    }));

    await logAiUsage({
      userId: req.user._id,
      promptType: 'Skills',
      promptText: prompt,
      response: JSON.stringify(analysis),
      details: `Skill Gap Analysis for ${dreamRole}`,
    });

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Analysis failed' });
  }
};

export const generateRoadmap = async (req, res) => {
  try {
    const { role } = req.body;
    const prompt = `Career roadmap to become a ${role || 'Software Engineer'}.
    Return JSON: {"months3":[],"months6":[],"months12":[]}`;

    const rawResponse = await callGemini(prompt);
    const roadmap = parseJsonFromAi(rawResponse, () => ({ months3: [], months6: [], months12: [] }));

    await logAiUsage({
      userId: req.user._id,
      promptType: 'General',
      promptText: prompt,
      response: JSON.stringify(roadmap),
      details: 'Generated Career Roadmap',
    });

    res.status(200).json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Roadmap generation failed' });
  }
};

export const generateProjects = async (req, res) => {
  try {
    const { category, level } = req.body;
    const prompt = `Suggest 3 portfolio projects for ${level || 'Intermediate'} ${category || 'Web Development'} developer.
    Return JSON array: [{"title":"","description":"","features":[],"technologies":[],"difficulty":""}]`;

    const rawResponse = await callGemini(prompt);
    const projects = parseJsonFromAi(rawResponse, () => []);

    await logAiUsage({
      userId: req.user._id,
      promptType: 'Project',
      promptText: prompt,
      response: JSON.stringify(projects),
      details: 'Generated Project Ideas',
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Project generation failed' });
  }
};

export const generateAchievement = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ message: 'Input required.' });

    const prompt = `Convert this into a strong resume achievement with action verbs and impact.
    Input: "${input}"
    Output ONLY the improved sentence. No markdown.`;

    const achievement = await callGemini(prompt);
    res.status(200).json({ achievement });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Achievement generation failed' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.findOne({ user: req.user._id });
    if (!history) {
      return res.status(200).json({ messages: [] });
    }
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch chat history' });
  }
};

export const handleChat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'API Key missing from backend .env file! Add GEMINI_API_KEY from Google AI Studio.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Custom "Executive Recruiter" System Instructions
    const systemInstruction = `You are HireCraft's elite Executive Recruiter and AI Career Coach. You have decades of experience placing top-tier talent (Software Engineers, Product Managers, Designers, Marketers) at Fortune 500 companies and high-growth startups. Your advice is direct, tactical, and result-oriented. Focus on quantifiable achievements, ATS optimization, and executive branding. Respond professionally, and use structured formatting or bullet points when appropriate.`;

    const userMessage = messages[messages.length - 1];
    const previousMessages = messages.slice(0, -1);

    // Format previous messages for Gemini SDK (strictly alternating starting with user)
    const formattedHistory = [];
    let expectedRole = 'user';

    for (const msg of previousMessages) {
      const role = (msg.role === 'user' || msg.sender === 'user') ? 'user' : 'model';
      if (role === expectedRole) {
        formattedHistory.push({
          role,
          parts: [{ text: msg.content || msg.text || '' }]
        });
        expectedRole = expectedRole === 'user' ? 'model' : 'user';
      } else if (formattedHistory.length > 0) {
        const last = formattedHistory[formattedHistory.length - 1];
        if (last.role === role) {
          last.parts[0].text += '\n' + (msg.content || msg.text || '');
        }
      }
    }

    const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let reply = '';
    let lastError = null;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemInstruction
        });

        const chat = model.startChat({
          history: formattedHistory
        });

        const result = await chat.sendMessage(userMessage.content || userMessage.text || '');
        reply = result.response.text();
        
        if (reply) {
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini Chat] ${modelName} failed:`, err.message);
      }
    }

    if (!reply) {
      throw new Error(lastError?.message || 'All Gemini models failed to generate response.');
    }

    const cleanReply = reply.trim();

    // Standardize roles to database schema (user/assistant) and append model reply
    const updatedMessages = messages.map(msg => ({
      role: (msg.role === 'user' || msg.sender === 'user') ? 'user' : 'assistant',
      content: msg.content || msg.text || ''
    }));
    
    // Ensure we don't duplicate the assistant response if it was already added
    const hasLastAssistant = updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'assistant';
    if (!hasLastAssistant) {
      updatedMessages.push({ role: 'assistant', content: cleanReply });
    }

    await ChatHistory.findOneAndUpdate(
      { user: req.user._id },
      { messages: updatedMessages },
      { upsert: true, new: true }
    );

    res.status(200).json({ reply: cleanReply });
  } catch (error) {
    console.error('Career Coach Chat Error:', error);
    res.status(500).json({ message: error.message || 'Chat assistant error' });
  }
};
