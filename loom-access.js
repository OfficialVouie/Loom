export const WEBSITE_ROLE_DEFINITIONS = [
  { key: "ceo", label: "CEO", badgeClass: "chip border-red-500/45 text-red-100" },
  { key: "marketplace_manager", label: "Marketplace Manager", badgeClass: "chip border-fuchsia-500/35 text-fuchsia-200" },
  { key: "asset_verifier", label: "Asset Verifier", badgeClass: "chip border-emerald-500/35 text-emerald-200" },
  { key: "moderator", label: "Moderator", badgeClass: "chip border-rose-500/35 text-rose-200" },
  { key: "support_agent", label: "Support Agent", badgeClass: "chip border-sky-500/35 text-sky-200" },
  { key: "verified_creator", label: "Verified Creator", badgeClass: "chip border-amber-500/35 text-amber-200" }
];

export const WEBSITE_ROLE_MAP = new Map(WEBSITE_ROLE_DEFINITIONS.map((item) => [item.key, item]));

const WEBSITE_ROLE_ALIASES = {
  ceo: "ceo",
  chiefexecutiveofficer: "ceo",
  chief_executive_officer: "ceo",
  marketplacemanager: "marketplace_manager",
  marketplace_manager: "marketplace_manager",
  assetverifier: "asset_verifier",
  asset_verifier: "asset_verifier",
  moderator: "moderator",
  supportagent: "support_agent",
  support_agent: "support_agent",
  verifiedcreator: "verified_creator",
  verified_creator: "verified_creator"
};

const RESTRICTED_TEXT_RULES = [
  {
    pattern: /\b(fuck|fucking|motherfucker|shit|bullshit|bitch|asshole|cunt|nigga|nigger)\b/i,
    reason: "contains profanity"
  },
  {
    pattern: /\b(porn|pornography|nsfw|nude|naked|hentai|blowjob|boobs|tits|fetish)\b/i,
    reason: "contains explicit content"
  }
];

export function normalizeWebsiteRoleKey(rawValue = "") {
  const normalized = String(rawValue || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[\s-]+/g, "_");
  const compact = normalized.replace(/[^a-z0-9_]/g, "");
  const key = WEBSITE_ROLE_ALIASES[normalized] || WEBSITE_ROLE_ALIASES[compact] || normalized;
  return WEBSITE_ROLE_MAP.has(key) ? key : "";
}

export function normalizeWebsiteRoles(rawValue = []) {
  const source = Array.isArray(rawValue)
    ? rawValue
    : typeof rawValue === "string" && rawValue.trim()
      ? rawValue.split(/[,\n|]/)
      : [];
  const roles = [];
  source.forEach((item) => {
    const key = normalizeWebsiteRoleKey(item);
    if (key && !roles.includes(key)) {
      roles.push(key);
    }
  });
  return roles;
}

export function collectWebsiteRoles(raw = {}) {
  const rawRoles = Array.isArray(raw.siteRoles)
    ? raw.siteRoles
    : Array.isArray(raw.websiteRoles)
      ? raw.websiteRoles
      : Array.isArray(raw.staffRoles)
        ? raw.staffRoles
        : [];
  const legacyRole = normalizeWebsiteRoleKey(raw.role);
  return normalizeWebsiteRoles(legacyRole ? [...rawRoles, legacyRole] : rawRoles);
}

export function websiteRoleLabel(roleKey = "") {
  return WEBSITE_ROLE_MAP.get(normalizeWebsiteRoleKey(roleKey))?.label || "";
}

export function websiteRoleBadgeClass(roleKey = "") {
  return WEBSITE_ROLE_MAP.get(normalizeWebsiteRoleKey(roleKey))?.badgeClass || "chip border-white/15 text-white/80";
}

export function hasWebsiteRole(profile = null, roleKey = "") {
  const normalizedRoleKey = normalizeWebsiteRoleKey(roleKey);
  if (!normalizedRoleKey) return false;
  return collectWebsiteRoles(profile || {}).includes(normalizedRoleKey);
}

export function hasAnyWebsiteRole(profile = null, roleKeys = []) {
  return roleKeys.some((roleKey) => hasWebsiteRole(profile, roleKey));
}

export function isCeo(profile = null) {
  return hasWebsiteRole(profile, "ceo");
}

export function canAssignWebsiteRoles(profile = null) {
  return isCeo(profile);
}

export function canVerifyAssets(profile = null) {
  return isCeo(profile) || hasWebsiteRole(profile, "asset_verifier");
}

export function canManageMarketplace(profile = null) {
  return isCeo(profile) || hasWebsiteRole(profile, "marketplace_manager");
}

export function canModerateUsers(profile = null) {
  return isCeo(profile) || hasWebsiteRole(profile, "moderator");
}

export function canUseSupportTools(profile = null) {
  return isCeo(profile) || hasWebsiteRole(profile, "support_agent");
}

export function canAccessReviewQueue(profile = null) {
  return canVerifyAssets(profile);
}

export function primaryWebsiteRoleLabel(profile = null) {
  const roles = collectWebsiteRoles(profile || {});
  if (roles.length) {
    return websiteRoleLabel(roles[0]);
  }
  return normalizeAccountMode(profile?.accountMode, profile?.role, false, roles) === "creator" ? "Creator" : "Consumer";
}

export function normalizeAccountMode(rawMode = "", rawRole = "", fallbackCreator = false, explicitRoles = null) {
  const mode = String(rawMode || "").trim().toLowerCase();
  if (mode === "creator" || mode === "consumer") return mode;
  const role = String(rawRole || "").trim().toLowerCase();
  const roles = explicitRoles ? normalizeWebsiteRoles(explicitRoles) : [];
  if (role === "creator") return "creator";
  if (roles.includes("verified_creator") || normalizeWebsiteRoleKey(role) === "verified_creator") return "creator";
  return fallbackCreator ? "creator" : "consumer";
}

export function normalizeAccountStatus(rawStatus = "") {
  return String(rawStatus || "").trim().toLowerCase() === "banned" ? "banned" : "active";
}

export function isBanned(profile = null) {
  return normalizeAccountStatus(profile?.accountStatus) === "banned";
}

export function banSummary(profile = null) {
  const reason = String(profile?.banReason || "").trim();
  if (!isBanned(profile)) return "Account active";
  return reason ? `Banned: ${reason}` : "Banned account";
}

export function validateCleanText(value = "", label = "This text", options = {}) {
  const trimmed = String(value ?? "").trim();
  if (options.required && !trimmed) {
    return `${label} is required.`;
  }
  if (Number.isFinite(options.maxLength) && trimmed.length > Number(options.maxLength)) {
    return `${label} must be ${Number(options.maxLength)} characters or fewer.`;
  }
  for (const rule of RESTRICTED_TEXT_RULES) {
    if (rule.pattern.test(trimmed)) {
      return `${label} ${rule.reason}.`;
    }
  }
  return "";
}

export function validateCleanTextGroup(items = []) {
  for (const item of items) {
    const message = validateCleanText(item?.value, item?.label, item?.options || {});
    if (message) return message;
  }
  return "";
}
