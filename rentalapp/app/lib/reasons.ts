export const ISSUE_REASONS = {
  'no-response': 'Agent is not responding',
  unavailable: 'Property was no longer available',
  misleading: 'Listing was misleading',
  other: 'Something else',
} as const;

export const REPORT_REASONS = {
  scam: 'Looks like a scam',
  unavailable: 'Property is not available',
  'wrong-info': 'Wrong price, photos or details',
  duplicate: 'Duplicate listing',
  other: 'Something else',
} as const;

export const REPORT_STATUSES = ['open', 'in-progress', 'resolved'] as const;
