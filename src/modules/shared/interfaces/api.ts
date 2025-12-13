export interface ApiValidationError {
  issues: ApiValidationIssue[];
}

interface ApiValidationIssue {
  message: string;
}
