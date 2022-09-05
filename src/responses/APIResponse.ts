interface APIResponse {
  success: boolean;
  code: number;
  message?: string[];
  echo?: any;
  data?: any;
}

export { APIResponse };
