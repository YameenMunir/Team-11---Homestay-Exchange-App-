// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  HOST: 'host',
  GUEST: 'guest',
};

// Document Types
export const DOCUMENT_TYPES = {
  GOVERNMENT_ID: 'government_id',
  DBS_CHECK: 'dbs_check',
  PROOF_OF_ADDRESS: 'proof_of_address',
  ADMISSION_PROOF: 'admission_proof',
};

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  MATCHED: 'matched',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Problem Severity
export const PROBLEM_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  DOCUMENT_UPLOAD: 'document_upload',
  VERIFICATION_UPDATE: 'verification_update',
  FACILITATION_REQUEST: 'facilitation_request',
  PROBLEM_REPORT: 'problem_report',
  RATING_RECEIVED: 'rating_received',
  MATCH_UPDATE: 'match_update',
};

// Document Type Labels (for UI)
export const DOCUMENT_TYPE_LABELS = {
  [DOCUMENT_TYPES.GOVERNMENT_ID]: 'Government ID',
  [DOCUMENT_TYPES.DBS_CHECK]: 'DBS Check',
  [DOCUMENT_TYPES.PROOF_OF_ADDRESS]: 'Proof of Address',
  [DOCUMENT_TYPES.ADMISSION_PROOF]: 'Admission Proof',
};

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
];
