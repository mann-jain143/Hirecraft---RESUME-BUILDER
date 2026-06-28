import generateToken from './generateToken.js';

export function shouldBeSuperAdmin(email = '', name = '') {
  return email.toLowerCase() === 'mannjain4885@gmail.com';
}

export async function ensureSuperAdminRole(user) {
  const isSA = shouldBeSuperAdmin(user.email, user.name);
  if (isSA) {
    let modified = false;
    if (user.role !== 'SUPER_ADMIN') {
      user.role = 'SUPER_ADMIN';
      modified = true;
    }
    if (user.realRole !== 'SUPER_ADMIN') {
      user.realRole = 'SUPER_ADMIN';
      modified = true;
    }
    if (user.viewMode !== 'SUPER_ADMIN') {
      user.viewMode = 'SUPER_ADMIN';
      modified = true;
    }
    if (modified) {
      await user.save({ validateBeforeSave: false });
    }
  } else if (!isSA && (user.role === 'SUPER_ADMIN' || user.realRole === 'SUPER_ADMIN' || user.viewMode === 'SUPER_ADMIN')) {
    user.role = 'USER';
    user.realRole = 'USER';
    user.viewMode = 'USER';
    await user.save({ validateBeforeSave: false });
  }
  return user;
}

export function formatUserResponse(user, token) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || 'USER',
    realRole: user.realRole || user.role || 'USER',
    viewMode: user.viewMode || user.role || 'USER',
    points: user.points ?? 0,
    badges: user.badges ?? [],
    onboardingCompleted: user.onboardingCompleted ?? false,
    careerField: user.careerField ?? '',
    portfolioUsername: user.portfolioUsername ?? '',
    profilePicture: user.profilePicture || '',
    coverImage: user.coverImage || '',
    token: token || generateToken(user._id),
  };
}
