
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface AuditScore {
  category: string;
  score: number;
}

export interface AuditSession {
  id: string;
  auditor: string;
  area: string;
  date: string;
  scores: Record<string, number[]>;
  averages: Record<string, number>;
  totalAverage: number;
  aiInsights?: string;
  timestamp: number;
}

export interface AuditCategory {
  name: string;
  questions: string[];
}

/**
 * Interface for artifact objects used in the application.
 * Added to fix the import error in ArtifactCard.tsx.
 */
export interface Artifact {
  id: string;
  html: string;
  styleName: string;
  status: string;
}
