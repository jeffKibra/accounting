function isSuperAdmin(role) {
  return role === "super_admin";
}

function isAdmin(role) {
  return role === "admin";
}

function isManagement(role) {
  return role === "management";
}

function validateAdmin(role) {
  const valid = isAdmin(role) || isSuperAdmin(role);

  if (!valid) throw new Error("Access denied!");

  return valid;
}

function validateManagement(role) {
  const valid = isManagement(role);

  if (!valid) throw new Error("Access denied!");

  return valid;
}

module.exports = {
  isSuperAdmin,
  isAdmin,
  isManagement,
  validateAdmin,
  validateManagement,
};
