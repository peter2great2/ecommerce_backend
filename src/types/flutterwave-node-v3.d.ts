declare module "flutterwave-node-v3" {
  interface FlutterwaveConfig {
    public_key: string;
    secret_key: string;
  }

  interface PaymentData {
    tx_ref: string;
    amount: number;
    currency: string;
    redirect_url: string;
    payment_options?: string;
    customer: {
      email: string;
      phone_number?: string;
      name: string;
    };
    customizations?: {
      title?: string;
      description?: string;
      logo?: string;
    };
    meta?: any;
  }

  interface FlutterwaveResponse {
    status: string;
    message: string;
    data: any;
  }

  class Flutterwave {
    constructor(publicKey: string, secretKey: string);

    Bank: any;
    Beneficiary: any;
    Bills: any;
    Charge: {
      card: (payload: PaymentData) => Promise<FlutterwaveResponse>;
    };
    Ebills: any;
    Misc: any;
    MobileMoney: any;
    security: any;
    Otp: any;
    PaymentPlan: any;
    Settlement: any;
    Subscription: any;
    Subaccount: any;
    Tokenized: any;
    Transaction: {
      verify: (params: { id: string | number }) => Promise<FlutterwaveResponse>;
      fetch: (params: any) => Promise<FlutterwaveResponse>;
      refund: (params: any) => Promise<FlutterwaveResponse>;
    };
    Transfer: any;
    VirtualAcct: any;
    VirtualCard: any;
    getIntegrityHash: any;
  }

  export = Flutterwave;
}
