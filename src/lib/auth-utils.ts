export function isAuthorizedAdmin(session: any): boolean {
  if (!session?.user?.email) return false;
  
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
  const publicAdminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",");
  
  const allAdmins = Array.from(new Set([...adminEmails, ...publicAdminEmails])).filter(Boolean);
  
  // Default fallback if env not set (for safety of the primary owner)
  if (allAdmins.length === 0) {
    return session.user.email === "m.mario9988@gmail.com";
  }

  return allAdmins.includes(session.user.email);
}
