import UserActivity from '../models/UserActivity.js';
import AdminLog from '../models/AdminLog.js';
import LoginHistory from '../models/LoginHistory.js';
import AuditLog from '../models/AuditLog.js';
import ActivityLog from '../models/ActivityLog.js';

export async function logUserActivity(userId, action, details = '', ipAddress = '') {
  try {
    await UserActivity.create({ user: userId, action, details, ipAddress });
    
    // Map internal action labels to standard ActivityLog enum if needed
    let mappedAction = '';
    if (action === 'RESUME_CREATE') mappedAction = 'Resume Created';
    else if (action === 'RESUME_EDIT') mappedAction = 'Resume Edited';
    else if (action === 'RESUME_DOWNLOAD') mappedAction = 'PDF Downloaded';
    else if (action === 'AI_REQUEST') mappedAction = 'AI Used';

    if (mappedAction) {
      await ActivityLog.create({ user: userId, action: mappedAction, details });
    }
  } catch (err) {
    console.warn('[Logger] Error logging user activity:', err.message);
  }
}

export async function logAdminAction(adminId, action, targetUserId = null, targetResource = '', targetResourceId = '', details = '', ipAddress = '') {
  try {
    await AdminLog.create({
      admin: adminId,
      action,
      targetUser: targetUserId,
      targetResource,
      targetResourceId,
      details,
      ipAddress
    });
    
    // Write to audit log for legacy compatibility
    await AuditLog.create({
      user: adminId,
      action,
      resourceType: targetResource,
      resourceId: targetResourceId,
      details,
      ipAddress
    });
  } catch (err) {
    console.warn('[Logger] Error logging admin action:', err.message);
  }
}

export async function logLogin(userId, ipAddress = '', userAgent = '') {
  try {
    await LoginHistory.create({ user: userId, ipAddress, userAgent });
    await logUserActivity(userId, 'LOGIN', `Logged in from IP: ${ipAddress}`, ipAddress);
  } catch (err) {
    console.warn('[Logger] Error logging login history:', err.message);
  }
}
