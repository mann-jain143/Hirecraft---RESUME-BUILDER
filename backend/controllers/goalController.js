import Goal from '../models/Goal.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all goals for user
// @route   GET /api/goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    console.error('Get Goals Error:', error);
    res.status(500).json({ message: 'Server error while fetching goals' });
  }
};

// @desc    Create a goal
// @route   POST /api/goals
export const createGoal = async (req, res) => {
  try {
    const { type, title, targetValue, currentValue, deadline } = req.body;
    
    if (!type || !title || !targetValue) {
      return res.status(400).json({ message: 'Type, title, and targetValue are required' });
    }

    const goal = await Goal.create({
      user: req.user._id,
      type,
      title,
      targetValue,
      currentValue: currentValue || 0,
      deadline
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Goal Set',
      details: `${title} (${targetValue})`
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Create Goal Error:', error);
    res.status(500).json({ message: 'Server error while creating goal' });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const { type, title, targetValue, currentValue, deadline, status } = req.body;

    if (type) goal.type = type;
    if (title) goal.title = title;
    if (targetValue !== undefined) goal.targetValue = targetValue;
    if (currentValue !== undefined) goal.currentValue = currentValue;
    if (deadline) goal.deadline = deadline;
    if (status) {
      if (goal.status !== status && status === 'Completed') {
        await ActivityLog.create({
          user: req.user._id,
          action: 'Goal Completed',
          details: goal.title
        });
      }
      goal.status = status;
    }

    const updatedGoal = await goal.save();
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error('Update Goal Error:', error);
    res.status(500).json({ message: 'Server error while updating goal' });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete Goal Error:', error);
    res.status(500).json({ message: 'Server error while deleting goal' });
  }
};
