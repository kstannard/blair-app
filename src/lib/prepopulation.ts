/**
 * Smart Pre-Population Engine for the Narrowing Exercise
 *
 * Translates user backgrounds into specific problems they've solved,
 * rather than generic job descriptions.
 */

interface ProfileInput {
  role?: string;
  companies?: string;
  years?: string;
  industries?: string;
  shoulderTaps?: string;
  weirdlyGoodAt?: string;
  linkedinSummary?: string;
  notableExperience?: string;
  strengths?: string;
  traits?: string;
}

type RoleCategory =
  | "enterprise-sales"
  | "marketing-brand"
  | "operations-bizops"
  | "product-pmm"
  | "engineering"
  | "finance-analytics"
  | "recruiting-talent"
  | "design-ux"
  | "content-editorial"
  | "general";

const roleAccomplishments: Record<RoleCategory, string[]> = {
  "enterprise-sales": [
    "Built outbound pipeline from scratch for a new market segment",
    "Designed enterprise sales process for complex deal cycles",
    "Managed multi-stakeholder deals at $100K+ ACV",
    "Created sales enablement materials and playbooks",
    "Developed partner/channel sales motions",
    "Built and led a team of SDRs/AEs",
    "Ran QBRs and revenue forecasting",
    "Defined ICP and territory planning for new markets",
    "Negotiated and closed enterprise contracts with legal review",
    "Built account-based selling strategies for named accounts",
  ],
  "marketing-brand": [
    "Led full brand repositioning for a growing company",
    "Built content strategy that drove measurable pipeline",
    "Managed agency relationships and creative production",
    "Developed messaging frameworks for product launches",
    "Created brand guidelines and voice documentation",
    "Led PR campaigns and media relationships",
    "Built and managed marketing team from scratch",
    "Designed go-to-market campaigns for new product lines",
    "Created demand generation programs tied to revenue",
    "Ran competitive positioning and differentiation projects",
  ],
  "operations-bizops": [
    "Built operational processes from scratch at a scaling startup",
    "Designed and implemented cross-functional workflows",
    "Led system migrations (CRM, ERP, project management)",
    "Created reporting dashboards and KPI frameworks",
    "Managed vendor selection and procurement",
    "Built onboarding programs for new hires",
    "Designed and ran company-wide planning processes",
    "Led cross-team operational reviews and accountability systems",
    "Built SOPs that reduced onboarding time by weeks",
    "Managed budget planning and resource allocation",
  ],
  "product-pmm": [
    "Led product launches from positioning to go-to-market",
    "Conducted customer research and competitive analysis",
    "Built pricing strategies and packaging models",
    "Created sales collateral and battle cards",
    "Managed product roadmap prioritization",
    "Ran beta programs and user feedback loops",
    "Developed product positioning for new market segments",
    "Built customer advisory boards for product input",
    "Created competitive intelligence systems",
    "Designed onboarding flows that improved activation",
  ],
  engineering: [
    "Architected systems that scaled to handle 10x traffic",
    "Built automation that saved the team hours every week",
    "Led technical team through major migration",
    "Designed API integrations between enterprise systems",
    "Built internal tools that improved team productivity",
    "Led incident response and built reliability practices",
    "Designed data pipelines for real-time analytics",
    "Mentored junior engineers and led technical interviews",
    "Built CI/CD pipelines that cut deploy time significantly",
    "Led technical due diligence for acquisitions or partnerships",
  ],
  "finance-analytics": [
    "Built financial models for fundraising",
    "Created board reporting packages",
    "Managed budget planning and forecasting",
    "Conducted due diligence on acquisitions",
    "Built data pipelines for business intelligence",
    "Designed compensation and equity frameworks",
    "Led financial planning for new market expansion",
    "Created unit economics models and LTV/CAC analysis",
    "Managed relationships with auditors and legal counsel",
    "Built investor reporting and communication processes",
  ],
  "recruiting-talent": [
    "Built recruiting pipeline from scratch for hypergrowth team",
    "Designed structured interview processes that improved hire quality",
    "Managed campus and early-career recruiting programs",
    "Created employer branding and candidate experience programs",
    "Negotiated compensation packages for senior hires",
    "Built diversity recruiting strategies and partnerships",
    "Led recruiting team and managed agency relationships",
    "Designed onboarding programs that reduced early attrition",
    "Built referral programs that became top sourcing channel",
    "Created hiring manager training programs",
  ],
  "design-ux": [
    "Built design systems from scratch for scaling products",
    "Led user research that changed product direction",
    "Created component libraries used across engineering teams",
    "Designed onboarding experiences that improved activation rates",
    "Ran usability testing programs and synthesized insights",
    "Built brand identity systems for startups",
    "Led design team and established design review processes",
    "Created design-to-dev handoff workflows",
    "Redesigned core product flows that improved key metrics",
    "Built accessibility standards and implementation guidelines",
  ],
  "content-editorial": [
    "Built content engine from scratch that drove organic growth",
    "Created editorial calendar and production workflow",
    "Grew newsletter subscriber base from zero to scale",
    "Developed brand voice and editorial guidelines",
    "Managed freelancer network and content production",
    "Built SEO strategy that drove measurable organic traffic",
    "Led social media strategy across multiple channels",
    "Created thought leadership programs for executives",
    "Designed content distribution and amplification systems",
    "Built content-to-pipeline attribution reporting",
  ],
  general: [
    "Led cross-functional projects from concept to delivery",
    "Built processes that made teams more efficient",
    "Managed stakeholder relationships across departments",
    "Created frameworks that teams still use today",
    "Hired, trained, and managed team members",
    "Presented to leadership and got buy-in for new initiatives",
    "Designed workflows that reduced manual work",
    "Built reporting systems that improved decision-making",
  ],
};

// Path-specific relevance boosters - which accomplishment categories
// are most relevant for each path
const pathRelevance: Record<string, RoleCategory[]> = {
  "gtm-growth-strategist": ["enterprise-sales", "marketing-brand", "product-pmm"],
  "messaging-positioning": ["marketing-brand", "content-editorial", "product-pmm"],
  "fractional-cmo": ["marketing-brand", "content-editorial", "operations-bizops"],
  "content-thought-leadership": ["content-editorial", "marketing-brand"],
  "revenue-operations": ["operations-bizops", "enterprise-sales", "finance-analytics"],
  "fractional-operator": ["operations-bizops", "finance-analytics"],
  "automation-systems-builder": ["engineering", "operations-bizops"],
  "content-engine-operator": ["content-editorial", "marketing-brand"],
  "lead-gen-operator": ["marketing-brand", "enterprise-sales", "finance-analytics"],
  "studio-builder": ["design-ux", "product-pmm"],
  "niche-talent-placement": ["recruiting-talent", "operations-bizops"],
  "investor-operator": ["finance-analytics", "operations-bizops", "enterprise-sales"],
};

function detectRoleCategory(profile: ProfileInput): RoleCategory {
  const text = [
    profile.role,
    profile.companies,
    profile.industries,
    profile.strengths,
    profile.linkedinSummary,
    profile.weirdlyGoodAt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/sales|revenue|account executive|ae\b|sdr|bdr|business development|deal|pipeline|quota/i.test(text)) {
    return "enterprise-sales";
  }
  if (/recruit|talent|hiring|headhunt|staffing|placement/i.test(text)) {
    return "recruiting-talent";
  }
  if (/design|ux|ui|figma|user experience|product design|visual/i.test(text)) {
    return "design-ux";
  }
  if (/content|editorial|newsletter|copywriting|social media|blog|writer/i.test(text)) {
    return "content-editorial";
  }
  if (/brand|marketing|messaging|positioning|communications|pr\b|creative director|campaign/i.test(text)) {
    return "marketing-brand";
  }
  if (/product\s*(manag|market)|pmm|go-to-market|gtm|launch/i.test(text)) {
    return "product-pmm";
  }
  if (/operat|bizops|strategy|process|program manag|chief of staff/i.test(text)) {
    return "operations-bizops";
  }
  if (/engineer|develop|architect|software|technical|devops|infrastructure|backend|frontend/i.test(text)) {
    return "engineering";
  }
  if (/financ|cfo|controller|accounting|analyst|data|analytics|model/i.test(text)) {
    return "finance-analytics";
  }

  return "general";
}

function detectSeniority(profile: ProfileInput): "junior" | "mid" | "senior" | "executive" {
  const text = [profile.role, profile.years, profile.linkedinSummary]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Check for executive signals
  if (/\b(vp|vice president|cfo|coo|cto|cmo|ceo|chief|head of|director|svp|evp)\b/i.test(text)) {
    return "executive";
  }

  // Parse years of experience
  const yearsMatch = text.match(/(\d+)\+?\s*years?/);
  const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;

  if (years >= 10) return "senior";
  if (years >= 5) return "mid";
  if (years > 0) return "junior";

  // Default based on other signals
  if (/senior|lead|principal|staff/i.test(text)) return "senior";
  if (/manager|team lead/i.test(text)) return "mid";

  return "mid";
}

export function generateNicheChips(profile: ProfileInput, pathSlug: string): string[] {
  const roleCategory = detectRoleCategory(profile);
  const seniority = detectSeniority(profile);

  // Get primary accomplishments from the detected role category
  const primaryAccomplishments = roleAccomplishments[roleCategory] || roleAccomplishments.general;

  // Get path-relevant categories for cross-referencing
  const relevantCategories = pathRelevance[pathSlug] || [];
  const secondaryAccomplishments: string[] = [];
  for (const cat of relevantCategories) {
    if (cat !== roleCategory) {
      secondaryAccomplishments.push(...(roleAccomplishments[cat] || []).slice(0, 3));
    }
  }

  // Build the chip list: prioritize primary, supplement with path-relevant
  const chips: string[] = [];

  // Add seniority-appropriate primary accomplishments
  const seniorityOffset = seniority === "executive" ? 0 : seniority === "senior" ? 1 : seniority === "mid" ? 2 : 3;
  const primarySlice = primaryAccomplishments.slice(seniorityOffset, seniorityOffset + 5);
  chips.push(...primarySlice);

  // Add 2-3 path-relevant accomplishments from other categories
  const secondarySlice = secondaryAccomplishments.filter((a) => !chips.includes(a)).slice(0, 3);
  chips.push(...secondarySlice);

  // Cap at 8 chips
  return chips.slice(0, 8);
}
