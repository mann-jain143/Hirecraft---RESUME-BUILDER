// Mock Email Service for Sandbox
export const sendEmail = async ({ to, subject, text }) => {
  console.log(`\n========================================`);
  console.log(`📩 MOCK EMAIL SENT`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`----------------------------------------`);
  console.log(`${text}`);
  console.log(`========================================\n`);
  return true;
};
