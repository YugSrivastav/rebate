/**
 * Matching Engine for Rebate
 * Strictly compares voluntary developer profile attributes with campaign targeting.
 * NEVER inspects code, prompts, or terminal history.
 */

import {
  DeveloperProfile,
  Campaign,
  OpportunityMatchReason,
} from '@rebate/shared';

export interface MatchResult {
  isMatch: boolean;
  relevanceScore: number;
  reason: OpportunityMatchReason;
  rejectionReason?: string;
}

export function evaluateCampaignMatch(
  profile: DeveloperProfile,
  campaign: Campaign
): MatchResult {
  const target = campaign.target;
  const matchReason: OpportunityMatchReason = {
    skills: [],
  };

  // 1. HARD GEOGRAPHIC ISOLATION RULE (Section 9)
  // If campaign requires a specific geography and the developer does not match it: DO NOT SHOW.
  // If location is not supplied by the developer: only show campaigns that permit unspecified location.
  const hasTargetCountries = target.countries && target.countries.length > 0;
  const hasTargetStates = target.states && target.states.length > 0;
  const devCountry = profile.location?.country?.trim();
  const devState = profile.location?.state?.trim();

  if (hasTargetCountries || hasTargetStates) {
    if (!devCountry) {
      // Developer did not supply location
      if (!target.allowUnspecifiedLocation) {
        return {
          isMatch: false,
          relevanceScore: 0,
          reason: matchReason,
          rejectionReason: 'Developer location is unspecified but campaign requires specific geography',
        };
      }
    } else {
      // Developer supplied country
      if (hasTargetCountries) {
        const countryMatch = target.countries!.some(
          (c) => c.toLowerCase() === devCountry.toLowerCase() || c.toLowerCase() === 'global'
        );
        if (!countryMatch) {
          return {
            isMatch: false,
            relevanceScore: 0,
            reason: matchReason,
            rejectionReason: `Developer country (${devCountry}) does not match campaign countries`,
          };
        }
        matchReason.location = devCountry;
      }

      if (hasTargetStates && devState) {
        const stateMatch = target.states!.some(
          (s) => s.toLowerCase() === devState.toLowerCase()
        );
        if (!stateMatch) {
          return {
            isMatch: false,
            relevanceScore: 0,
            reason: matchReason,
            rejectionReason: `Developer state (${devState}) does not match campaign states`,
          };
        }
        matchReason.location = `${devState}, ${devCountry}`;
      }
    }
  }

  // 2. Role Targeting
  let roleScore = 0.8;
  if (target.roles && target.roles.length > 0) {
    if (target.roles.includes(profile.role)) {
      roleScore = 1.0;
      matchReason.role = profile.role;
    } else {
      // If campaign strictly targets certain roles, reject if no match
      return {
        isMatch: false,
        relevanceScore: 0,
        reason: matchReason,
        rejectionReason: `Role mismatch: campaign targets [${target.roles.join(', ')}], developer is ${profile.role}`,
      };
    }
  }

  // 3. Field Targeting
  let fieldScore = 0.8;
  if (target.fields && target.fields.length > 0) {
    if (target.fields.includes(profile.field)) {
      fieldScore = 1.0;
      matchReason.field = profile.field;
    } else {
      // Low field affinity
      fieldScore = 0.2;
    }
  }

  // 4. Skills Match
  let skillScore = 0.8;
  if (target.skills && target.skills.length > 0) {
    const matchedSkills = profile.skills.filter((devSkill) =>
      target.skills!.some(
        (targetSkill) => targetSkill.toLowerCase() === devSkill.toLowerCase()
      )
    );
    matchReason.skills = matchedSkills;
    skillScore = matchedSkills.length / target.skills.length;

    // Minimum skill threshold if campaign specified skills
    if (skillScore === 0) {
      // No overlap in required skills
      return {
        isMatch: false,
        relevanceScore: 0,
        reason: matchReason,
        rejectionReason: 'No overlapping skills with campaign target skills',
      };
    }
  } else {
    matchReason.skills = profile.skills.slice(0, 3);
  }

  // 5. Education / Status Match
  let eduScore = 0.8;
  if (target.education && target.education.length > 0) {
    if (target.education.includes(profile.education)) {
      eduScore = 1.0;
      matchReason.education = profile.education;
    } else {
      eduScore = 0.3;
    }
  }

  // 6. Category Preference Multiplier
  let categoryMultiplier = 1.0;
  if (
    profile.preferredCategories &&
    profile.preferredCategories.includes(campaign.opportunityType)
  ) {
    categoryMultiplier = 1.1; // 10% boost for preferred category
  }

  // Weighted relevance calculation
  // Skills (40%), Field (25%), Role (20%), Education (15%)
  const rawRelevance =
    skillScore * 0.40 +
    fieldScore * 0.25 +
    roleScore * 0.20 +
    eduScore * 0.15;

  const finalRelevance = Math.min(
    1.0,
    Math.max(0.05, Math.round(rawRelevance * categoryMultiplier * 100) / 100)
  );

  return {
    isMatch: true,
    relevanceScore: finalRelevance,
    reason: matchReason,
  };
}
