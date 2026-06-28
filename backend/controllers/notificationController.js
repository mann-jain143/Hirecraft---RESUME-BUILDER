import Notification from '../models/Notification.js';

// @desc    Get all notifications for user
// @route   GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
};

// @desc    Create a notification (internal use mostly, but good to have)
// @route   POST /api/notifications
export const createNotification = async (req, res) => {
  try {
    const { title, message, type, link } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const notification = await Notification.create({
      user: req.user._id,
      title,
      message,
      type: type || 'Info',
      link
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(500).json({ message: 'Server error while creating notification' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    console.error('Mark Notification Read Error:', error);
    res.status(500).json({ message: 'Server error while updating notification' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark All Read Error:', error);
    res.status(500).json({ message: 'Server error while updating notifications' });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ message: 'Server error while deleting notification' });
  }
};
