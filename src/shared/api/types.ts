interface ApiResponseReason {
  reason: string;
}

export interface ApiResponseSuccess extends ApiResponseReason {
  success: true;
}

export interface ApiResponseFail extends ApiResponseReason {
  success: false;
}
