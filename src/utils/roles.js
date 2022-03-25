export function isSuperAdmin(role) {
  return role === "super_admin";
}

export function isAdmin(role) {
  return role === "admin" || isSuperAdmin(role);
}

export function isManagement(role) {
  return role === "management";
}
