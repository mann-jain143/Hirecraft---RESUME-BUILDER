import User from '../models/User.js';
import Role from '../models/Role.js';
import { shouldBeSuperAdmin } from './userResponse.js';

export async function bootstrapSuperAdmins() {
  try {
    // 1. Seed Roles
    const defaultRoles = [
      { name: 'USER', permissions: ['create_resume', 'use_ai', 'create_portfolio'] },
      { name: 'ADMIN', permissions: ['moderate_users', 'view_reports'] },
      { name: 'SUPER_ADMIN', permissions: ['all'] },
    ];

    for (const r of defaultRoles) {
      await Role.findOneAndUpdate(
        { name: r.name },
        r,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Roles initialized in database');

    // 2. Data Migration: Convert lowercase roles to uppercase and populate realRole / currentRole fields
    const allUsers = await User.find({});
    for (const u of allUsers) {
      let modified = false;
      let newRole = u.role;
      if (u.role === 'user') { newRole = 'USER'; modified = true; }
      else if (u.role === 'admin') { newRole = 'ADMIN'; modified = true; }
      else if (u.role === 'super-admin') { newRole = 'SUPER_ADMIN'; modified = true; }

      // Enforce ONLY mannjain4885@gmail.com can be SUPER_ADMIN
      if ((newRole === 'SUPER_ADMIN' || u.role === 'SUPER_ADMIN' || u.realRole === 'SUPER_ADMIN') && u.email.toLowerCase() !== 'mannjain4885@gmail.com') {
        newRole = 'USER';
        u.role = 'USER';
        u.realRole = 'USER';
        u.viewMode = 'USER';
        modified = true;
        console.log(`⚠️ Demoted unauthorized Super Admin account: ${u.email}`);
      }

      if (modified || !u.realRole || !u.viewMode) {
        u.role = newRole;
        u.realRole = u.realRole || newRole;
        u.viewMode = u.viewMode || newRole;
        await u.save({ validateBeforeSave: false });
      }
    }
    console.log('✅ User roles migration completed');

    // 3. Promote matching super admins
    const users = await User.find({ role: { $ne: 'SUPER_ADMIN' } });
    let promoted = 0;
    for (const user of users) {
      if (shouldBeSuperAdmin(user.email, user.name)) {
        user.role = 'SUPER_ADMIN';
        user.realRole = 'SUPER_ADMIN';
        user.viewMode = 'SUPER_ADMIN';
        await user.save({ validateBeforeSave: false });
        promoted++;
        console.log(`👑 Super Admin promoted: ${user.email}`);
      }
    }
    if (promoted === 0) {
      console.log('ℹ️  No new Super Admin promotions needed.');
    }
  } catch (err) {
    console.warn('Super Admin bootstrap failed:', err.message);
  }
}
