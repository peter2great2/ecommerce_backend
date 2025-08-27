export class PaymentError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleAsyncError = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const validatePaymentData = (data: any) => {
  const required = ["amount", "email", "name"];
  const missing = required.filter((field) => !data[field]);

  if (missing.length > 0) {
    throw new PaymentError(
      `Missing required fields: ${missing.join(", ")}`,
      400
    );
  }

  if (data.amount <= 0) {
    throw new PaymentError("Amount must be greater than zero", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new PaymentError("Invalid email format", 400);
  }

  return true;
};
