import User from '../models/User.js';
import PlacementBookmark from '../models/PlacementBookmark.js';
import PlacementHistory from '../models/PlacementHistory.js';
import DailyChallenge from '../models/DailyChallenge.js';
import { callGemini, parseJsonFromAi } from '../utils/gemini.js';

// Get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * @desc    Generate placement practice questions using Gemini AI
 * @route   POST /api/placement-prep/generate
 * @access  Private
 */
export const generateQuestions = async (req, res, next) => {
  try {
    const { category, subcategory, difficulty, count = 10, company, mode } = req.body;

    if (!category || !subcategory || !difficulty) {
      return res.status(400).json({ status: 'error', message: 'Category, subcategory, and difficulty are required.' });
    }

    const companyPrompt = company 
      ? `Ensure the questions match the typical style, pattern, and difficulty of placement tests conducted by ${company}.`
      : 'Generate realistic, placement-level questions.';

    const prompt = `Generate exactly ${count} multiple-choice questions for ${category} Practice.
Subcategory/Topic: ${subcategory}.
Difficulty Level: ${difficulty}.
${companyPrompt}

You MUST output ONLY a valid JSON array of objects. Do not include markdown codeblocks (e.g. \`\`\`json) or any conversational text. Just the raw JSON.
Each object in the array MUST have these exact keys and format:
{
  "questionText": "Question text here. Include relevant numerical values or passage text if needed.",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": "The exact string of the correct option matching one of the options above",
  "explanation": "Step by step explanation of why this answer is correct",
  "shortcut": "Solving shortcut, trick, or time-saving tip",
  "formula": "Math formulas used (if applicable, otherwise empty string)",
  "difficulty": "${difficulty}",
  "topic": "${subcategory}",
  "estimatedTime": 60
}`;

    const rawResponse = await callGemini(prompt);
    const questions = parseJsonFromAi(rawResponse, []);

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({ status: 'error', message: 'Failed to generate questions. Please try again.' });
    }

    res.status(200).json({ status: 'success', data: questions });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Save completed practice session results, update user XP/coins & streak
 * @route   POST /api/placement-prep/save-result
 * @access  Private
 */
export const saveSessionResult = async (req, res, next) => {
  try {
    const { category, subcategory, score, totalQuestions, timeTaken, company, mode } = req.body;
    const userId = req.user._id;

    if (score === undefined || !totalQuestions) {
      return res.status(400).json({ status: 'error', message: 'Score and totalQuestions are required.' });
    }

    const accuracy = Math.round((score / totalQuestions) * 100);

    // Calculate XP & Coins: 10 XP and 5 Coins per correct answer.
    let xpEarned = score * 10;
    let coinsEarned = score * 5;

    // Perfect score bonus
    if (score === totalQuestions && totalQuestions >= 10) {
      xpEarned += 50;
      coinsEarned += 20;
    }

    // Timed test bonus
    if (mode === 'Timed Test') {
      xpEarned += 15;
      coinsEarned += 5;
    }

    // Save History Record
    const history = await PlacementHistory.create({
      user: userId,
      category,
      subcategory,
      score,
      totalQuestions,
      accuracy,
      xpEarned,
      coinsEarned,
      timeTaken,
      company,
      mode,
    });

    // Update User Gamification & Streak
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    user.xp = (user.xp || 0) + xpEarned;
    user.coins = (user.coins || 0) + coinsEarned;
    user.points = (user.points || 0) + xpEarned; // Map points to XP
    user.totalQuestionsSolved = (user.totalQuestionsSolved || 0) + totalQuestions;

    // Streak logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.lastLoginDate) {
      const lastLogin = new Date(user.lastLoginDate);
      lastLogin.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today - lastLogin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Active streak continued
        user.currentStreak += 1;
      } else if (diffDays > 1) {
        // Reset streak
        user.currentStreak = 1;
      }
      // If diffDays === 0, user already completed an activity today, streak remains same.
    } else {
      user.currentStreak = 1;
    }

    user.lastLoginDate = new Date();
    if (user.currentStreak > (user.longestStreak || 0)) {
      user.longestStreak = user.currentStreak;
    }

    // Unlock badges dynamically
    const unlockedBadges = [];
    if (user.totalQuestionsSolved >= 100 && !user.badges.includes('100 Questions Solved')) {
      user.badges.push('100 Questions Solved');
      unlockedBadges.push('100 Questions Solved');
    }
    if (score === totalQuestions && totalQuestions >= 10 && !user.badges.includes('Perfect Score')) {
      user.badges.push('Perfect Score');
      unlockedBadges.push('Perfect Score');
    }
    if (user.currentStreak >= 7 && !user.badges.includes('7-Day Streak')) {
      user.badges.push('7-Day Streak');
      unlockedBadges.push('7-Day Streak');
    }
    if (category === 'Aptitude' && user.totalQuestionsSolved >= 50 && !user.badges.includes('Master of Quant')) {
      user.badges.push('Master of Quant');
      unlockedBadges.push('Master of Quant');
    }
    if (category === 'Verbal' && user.totalQuestionsSolved >= 50 && !user.badges.includes('Grammar Expert')) {
      user.badges.push('Grammar Expert');
      unlockedBadges.push('Grammar Expert');
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        history,
        xpEarned,
        coinsEarned,
        currentStreak: user.currentStreak,
        totalCoins: user.coins,
        totalXP: user.xp,
        unlockedBadges,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get user analytics and dashboard statistics for placement prep
 * @route   GET /api/placement-prep/stats
 * @access  Private
 */
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user overall gamification data
    const user = await User.findById(userId).select('xp coins currentStreak longestStreak totalQuestionsSolved badges');

    // Fetch placement practice sessions
    const sessions = await PlacementHistory.find({ user: userId });

    if (sessions.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          questionsSolved: user?.totalQuestionsSolved || 0,
          dailyStreak: user?.currentStreak || 0,
          longestStreak: user?.longestStreak || 0,
          accuracyRate: 0,
          placementReadiness: 10,
          strongestCategory: 'N/A',
          xp: user?.xp || 0,
          coins: user?.coins || 0,
          badges: user?.badges || [],
          weeklyImprovement: 0,
        },
      });
    }

    // Calculate overall accuracy
    const totalCorrect = sessions.reduce((sum, s) => sum + s.score, 0);
    const totalQuestions = sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
    const accuracyRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Calculate strongest subcategory based on accuracy
    const subcategoryStats = {};
    sessions.forEach(s => {
      if (!subcategoryStats[s.subcategory]) {
        subcategoryStats[s.subcategory] = { correct: 0, total: 0 };
      }
      subcategoryStats[s.subcategory].correct += s.score;
      subcategoryStats[s.subcategory].total += s.totalQuestions;
    });

    let strongestCategory = 'N/A';
    let maxSubcategoryAccuracy = 0;
    Object.keys(subcategoryStats).forEach(key => {
      const stats = subcategoryStats[key];
      if (stats.total >= 5) {
        const acc = (stats.correct / stats.total) * 100;
        if (acc > maxSubcategoryAccuracy) {
          maxSubcategoryAccuracy = acc;
          strongestCategory = key;
        }
      }
    });

    if (strongestCategory === 'N/A' && Object.keys(subcategoryStats).length > 0) {
      // Fallback to highest accuracy if no topic has 5 questions solved yet
      let maxAcc = 0;
      Object.keys(subcategoryStats).forEach(key => {
        const stats = subcategoryStats[key];
        const acc = (stats.correct / stats.total) * 100;
        if (acc > maxAcc) {
          maxAcc = acc;
          strongestCategory = key;
        }
      });
    }

    // Weekly improvement calculation
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const thisWeekSessions = sessions.filter(s => s.date >= oneWeekAgo);
    const lastWeekSessions = sessions.filter(s => s.date >= twoWeeksAgo && s.date < oneWeekAgo);

    const getAvgAccuracy = (sessList) => {
      if (sessList.length === 0) return 0;
      const correct = sessList.reduce((sum, s) => sum + s.score, 0);
      const total = sessList.reduce((sum, s) => sum + s.totalQuestions, 0);
      return total > 0 ? (correct / total) * 100 : 0;
    };

    const thisWeekAcc = getAvgAccuracy(thisWeekSessions);
    const lastWeekAcc = getAvgAccuracy(lastWeekSessions);
    const weeklyImprovement = Math.round(thisWeekAcc - lastWeekAcc);

    // Placement Readiness Calculation
    // Base weight: 50% accuracyRate, 30% questionsSolved volume, 20% streak consistency
    const volumeFactor = Math.min((user.totalQuestionsSolved / 200) * 30, 30); // max 30 points for 200 questions solved
    const streakFactor = Math.min((user.currentStreak / 15) * 20, 20); // max 20 points for 15-day streak
    const accuracyFactor = (accuracyRate / 100) * 50; // max 50 points
    const placementReadiness = Math.round(Math.min(volumeFactor + streakFactor + accuracyFactor + 10, 100)); // offset by base 10

    res.status(200).json({
      status: 'success',
      data: {
        questionsSolved: user?.totalQuestionsSolved || totalQuestions,
        dailyStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
        accuracyRate,
        placementReadiness,
        strongestCategory,
        xp: user?.xp || 0,
        coins: user?.coins || 0,
        badges: user?.badges || [],
        weeklyImprovement,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle Bookmark for a question, add notes/set difficulty
 * @route   POST /api/placement-prep/bookmark
 * @access  Private
 */
export const toggleBookmark = async (req, res, next) => {
  try {
    const { questionText, options, correctAnswer, explanation, shortcut, formula, category, subcategory, difficulty, notes, isDifficult } = req.body;
    const userId = req.user._id;

    if (!questionText || !correctAnswer || !category) {
      return res.status(400).json({ status: 'error', message: 'Question details are required.' });
    }

    const existingBookmark = await PlacementBookmark.findOne({
      user: userId,
      questionText,
    });

    if (existingBookmark) {
      // Remove bookmark
      await PlacementBookmark.findByIdAndDelete(existingBookmark._id);
      return res.status(200).json({ status: 'success', message: 'Bookmark removed.', isBookmarked: false });
    }

    // Add bookmark
    const bookmark = await PlacementBookmark.create({
      user: userId,
      questionText,
      options,
      correctAnswer,
      explanation,
      shortcut,
      formula,
      category,
      subcategory,
      difficulty,
      notes,
      isDifficult,
    });

    res.status(200).json({ status: 'success', data: bookmark, isBookmarked: true });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all bookmarked questions for a user
 * @route   GET /api/placement-prep/bookmarks
 * @access  Private
 */
export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookmarks = await PlacementBookmark.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: bookmarks });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get or generate the Daily Placement Challenge
 * @route   GET /api/placement-prep/daily-challenge
 * @access  Private
 */
export const getDailyChallenge = async (req, res, next) => {
  try {
    const dateStr = getTodayDateString();
    const userId = req.user._id;

    // Check if challenge is already generated for today
    let challenge = await DailyChallenge.findOne({ date: dateStr });

    if (!challenge) {
      // Generate Aptitude Questions for Daily Challenge
      const aptPrompt = `Generate exactly 10 high-quality placement multiple-choice questions for Quantitative Aptitude/Logical Reasoning.
You MUST output ONLY a valid JSON array of objects. Just the raw JSON.
Format:
{
  "questionText": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "The exact string representing the correct option",
  "explanation": "Detailed explanation",
  "shortcut": "Shortcut trick",
  "formula": "Formulas",
  "difficulty": "Medium",
  "topic": "Daily Aptitude",
  "estimatedTime": 60
}`;

      // Generate Verbal Questions for Daily Challenge
      const verbalPrompt = `Generate exactly 10 high-quality placement multiple-choice questions for Verbal Ability (Grammar/Comprehension).
You MUST output ONLY a valid JSON array of objects. Just the raw JSON.
Format:
{
  "questionText": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "The exact string representing the correct option",
  "explanation": "Detailed explanation",
  "shortcut": "Shortcut trick",
  "formula": "",
  "difficulty": "Medium",
  "topic": "Daily Verbal",
  "estimatedTime": 60
}`;

      const [rawApt, rawVerbal] = await Promise.all([
        callGemini(aptPrompt),
        callGemini(verbalPrompt),
      ]);

      const aptitudeQuestions = parseJsonFromAi(rawApt, []);
      const verbalQuestions = parseJsonFromAi(rawVerbal, []);

      challenge = await DailyChallenge.create({
        date: dateStr,
        aptitudeQuestions,
        verbalQuestions,
      });
    }

    const user = await User.findById(userId).select('lastChallengeCompletedDate');
    const completedToday = user.lastChallengeCompletedDate === dateStr;

    res.status(200).json({
      status: 'success',
      data: {
        date: dateStr,
        aptitude: challenge.aptitudeQuestions,
        verbal: challenge.verbalQuestions,
        completedToday,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Submit Daily Challenge completion
 * @route   POST /api/placement-prep/daily-challenge/complete
 * @access  Private
 */
export const completeDailyChallenge = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const dateStr = getTodayDateString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    if (user.lastChallengeCompletedDate === dateStr) {
      return res.status(400).json({ status: 'error', message: 'Daily challenge already completed for today.' });
    }

    // Award bonus XP and coins for Daily Challenge Completion
    const xpAwarded = 100;
    const coinsAwarded = 50;

    user.xp = (user.xp || 0) + xpAwarded;
    user.coins = (user.coins || 0) + coinsAwarded;
    user.points = (user.points || 0) + xpAwarded;
    user.lastChallengeCompletedDate = dateStr;

    // Check if daily challenge badge is unlocked
    if (!user.badges.includes('Daily Challenger')) {
      user.badges.push('Daily Challenger');
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Daily challenge completed!',
      data: {
        xpAwarded,
        coinsAwarded,
        totalXP: user.xp,
        totalCoins: user.coins,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Global Placement Leaderboard based on XP
 * @route   GET /api/placement-prep/leaderboard
 * @access  Private
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.find({ status: 'active' })
      .select('name profilePicture xp coins currentStreak')
      .sort({ xp: -1 })
      .limit(10);

    res.status(200).json({ status: 'success', data: leaderboard });
  } catch (err) {
    next(err);
  }
};
