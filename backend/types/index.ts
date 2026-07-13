export interface RequestContext {
  aspirantId?: string;
  authorizationTier?: string;
  processedAt: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  alertMessage?: string;
}
