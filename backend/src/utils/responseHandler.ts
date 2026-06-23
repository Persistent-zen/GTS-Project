// src/utils/responseHandler.ts

export const successResponse = (data: any, message = "Success") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message = "Error", code = 500, data?: any) => ({
  success: false,
  message,
  code,
  ...(data ? { data } : {}),
});
