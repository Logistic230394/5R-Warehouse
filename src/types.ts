
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

export interface Question {
  text: string;
  descriptions: string[]; // 5 descriptions for scores 1-5
}

export interface AuditCategory {
  name: string;
  questions: Question[];
}
