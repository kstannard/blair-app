/**
 * Person enrichment — combines LinkedIn data (via Proxycurl) with
 * public web search to build a richer profile before scoring.
 *
 * Proxycurl: set PROXYCURL_API_KEY env var when available.
 * Web search: uses Tavily API (set TAVILY_API_KEY env var).
 */

export interface EnrichedProfile {
  linkedinData?: LinkedinProfile;
  webSearchSummary?: string;
  publicUrls: string[];
  enrichmentNotes: string[];
}

export interface LinkedinProfile {
  fullName: string;
  headline: string;
  summary: string;
  currentRole: string;
  currentCompany: string;
  experience: Array<{
    title: string;
    company: string;
    description: string;
    startsAt?: { year: number };
    endsAt?: { year: number } | null;
  }>;
  skills: string[];
  publicProfileUrl: string;
}

/**
 * Fetch LinkedIn profile via Proxycurl.
 * Returns null if no API key or profile not found.
 */
async function fetchLinkedin(linkedinUrl: string): Promise<LinkedinProfile | null> {
  const apiKey = process.env.PROXYCURL_API_KEY;
  if (!apiKey || !linkedinUrl) return null;

  // Normalize URL
  const url = linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`;

  try {
    const res = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}&use_cache=if-present&fallback_to_cache=on-error`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    if (!res.ok) {
      console.warn(`Proxycurl returned ${res.status} for ${linkedinUrl}`);
      return null;
    }
    const data = await res.json();
    return {
      fullName: data.full_name || "",
      headline: data.headline || "",
      summary: data.summary || "",
      currentRole: data.experiences?.[0]?.title || "",
      currentCompany: data.experiences?.[0]?.company || "",
      experience: (data.experiences || []).map((e: Record<string, unknown>) => ({
        title: e.title as string || "",
        company: e.company as string || "",
        description: e.description as string || "",
        startsAt: e.starts_at as { year: number } | undefined,
        endsAt: e.ends_at as { year: number } | null | undefined,
      })),
      skills: (data.skills || []).map((s: { name: string }) => s.name),
      publicProfileUrl: data.public_identifier
        ? `https://www.linkedin.com/in/${data.public_identifier}`
        : linkedinUrl,
    };
  } catch (err) {
    console.error("Proxycurl error:", err);
    return null;
  }
}

/**
 * Search for a person publicly using Tavily.
 * Only uses results we can confirm are about this specific person.
 */
async function searchPerson(
  name: string,
  role: string,
  linkedinUrl?: string
): Promise<string | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey || !name) return null;

  // Build a specific query to avoid false matches
  const query = `"${name}" ${role} site:linkedin.com OR site:twitter.com OR site:substack.com OR site:medium.com`;

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: 5,
        search_depth: "basic",
        include_answer: true,
        include_raw_content: false,
      }),
    });

    if (!res.ok) {
      console.warn(`Tavily returned ${res.status}`);
      return null;
    }

    const data = await res.json();

    // Filter to results we can reasonably confirm are this person
    // (URL contains their name, or result explicitly matches name + role)
    const nameSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const firstName = name.split(" ")[0].toLowerCase();
    const lastName = name.split(" ").slice(-1)[0].toLowerCase();

    const confirmedResults = (data.results || []).filter((r: { url: string; content: string; title: string }) => {
      const urlLower = r.url.toLowerCase();
      const contentLower = (r.content || "").toLowerCase();
      const titleLower = (r.title || "").toLowerCase();
      // Must mention both first and last name in content or URL
      return (
        (urlLower.includes(firstName) && urlLower.includes(lastName)) ||
        (urlLower.includes(nameSlug)) ||
        (contentLower.includes(firstName) && contentLower.includes(lastName) && titleLower.includes(firstName))
      );
    });

    if (!confirmedResults.length) return null;

    // Summarize what we found
    const snippets = confirmedResults
      .slice(0, 3)
      .map((r: { url: string; content: string }) => `Source: ${r.url}\n${r.content?.substring(0, 300)}`)
      .join("\n\n");

    return snippets;
  } catch (err) {
    console.error("Tavily search error:", err);
    return null;
  }
}

/**
 * Main enrichment function. Call after storing quiz submission.
 */
export async function enrichPerson(params: {
  name: string;
  role: string;
  linkedinUrl?: string;
  otherLinks?: string;
}): Promise<EnrichedProfile> {
  const { name, role, linkedinUrl, otherLinks } = params;
  const notes: string[] = [];
  const publicUrls: string[] = [];

  // Collect all submitted URLs
  if (linkedinUrl) publicUrls.push(linkedinUrl);
  if (otherLinks) {
    const urls = otherLinks.split(/[\s,]+/).filter((u) => u.startsWith("http"));
    publicUrls.push(...urls);
  }

  // Fetch LinkedIn via Proxycurl
  let linkedinData: LinkedinProfile | undefined;
  if (linkedinUrl) {
    const result = await fetchLinkedin(linkedinUrl);
    if (result) {
      linkedinData = result;
      notes.push(`LinkedIn fetched via Proxycurl: ${result.currentRole} at ${result.currentCompany}`);
    } else if (process.env.PROXYCURL_API_KEY) {
      notes.push("LinkedIn URL provided but Proxycurl returned no data");
    } else {
      notes.push("LinkedIn URL provided but PROXYCURL_API_KEY not set — skipped");
    }
  } else {
    notes.push("No LinkedIn URL provided");
  }

  // Web search — do this regardless of LinkedIn
  const webSearchSummary = await searchPerson(name, role, linkedinUrl);
  if (webSearchSummary) {
    notes.push("Public web search found confirmed results");
  } else {
    notes.push("Public web search found no confirmed results for this person");
  }

  return {
    linkedinData,
    webSearchSummary: webSearchSummary || undefined,
    publicUrls,
    enrichmentNotes: notes,
  };
}

/**
 * Format enriched profile into a text summary for the Claude prompt.
 */
export function formatEnrichmentForPrompt(profile: EnrichedProfile): string {
  const parts: string[] = [];

  if (profile.linkedinData) {
    const li = profile.linkedinData;
    parts.push(`## LinkedIn Profile (via Proxycurl)`);
    parts.push(`Name: ${li.fullName}`);
    parts.push(`Headline: ${li.headline}`);
    if (li.summary) parts.push(`About: ${li.summary}`);
    if (li.experience.length) {
      parts.push(`\nExperience:`);
      for (const exp of li.experience.slice(0, 5)) {
        const years = exp.startsAt ? `${exp.startsAt.year}–${exp.endsAt?.year ?? "present"}` : "";
        parts.push(`- ${exp.title} at ${exp.company} ${years}`.trim());
        if (exp.description) parts.push(`  ${exp.description.substring(0, 200)}`);
      }
    }
    if (li.skills.length) parts.push(`\nSkills: ${li.skills.slice(0, 10).join(", ")}`);
  }

  if (profile.webSearchSummary) {
    parts.push(`\n## Public Web Search Results (confirmed matches only)`);
    parts.push(profile.webSearchSummary);
  }

  if (!profile.linkedinData && !profile.webSearchSummary) {
    parts.push("No enrichment data found. Rely on quiz answers only.");
  }

  return parts.join("\n");
}
