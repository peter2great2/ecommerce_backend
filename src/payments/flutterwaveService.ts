import Flutterwave from "flutterwave-node-v3";

// Initialize Flutterwave
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY!,
  process.env.FLUTTERWAVE_SECRET_KEY!
);

export interface PaymentData {
  amount: number;
  currency: string;
  email: string;
  phone_number?: string;
  name: string;
  tx_ref: string;
  redirect_url: string;
  customer_id: string;
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

export interface VerifyPaymentResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: string;
    created_at: string;
    account_id: number;
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: string;
    };
  };
}

class FlutterwaveService {
  /**
   * Initialize a payment transaction
   */
  async initializePayment(paymentData: PaymentData) {
    try {
      const payload = {
        tx_ref: paymentData.tx_ref,
        amount: paymentData.amount,
        currency: paymentData.currency,
        redirect_url: paymentData.redirect_url,
        customer: {
          email: paymentData.email,
          phone_number: paymentData.phone_number,
          name: paymentData.name,
        },
        customizations: {
          title: paymentData.customizations?.title || "Shop App Payment",
          description:
            paymentData.customizations?.description || "Payment for order",
          logo: paymentData.customizations?.logo || "",
        },
      };

      const response = await flw.Charge.card(payload);
      return response;
    } catch (error) {
      console.error("Flutterwave payment initialization error:", error);
      throw error;
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(transactionId: string): Promise<VerifyPaymentResponse> {
    try {
      const response = await flw.Transaction.verify({ id: transactionId });
      return response;
    } catch (error) {
      console.error("Flutterwave payment verification error:", error);
      throw error;
    }
  }

  /**
   * Generate payment link using direct API call (since PaymentLink.create doesn't exist)
   */
  async generatePaymentLink(paymentData: PaymentData) {
    try {
      console.log("=== Flutterwave Service: Generate Payment Link ===");
      console.log("Input data:", paymentData);

      // Validate required environment variables
      if (
        !process.env.FLUTTERWAVE_PUBLIC_KEY ||
        !process.env.FLUTTERWAVE_SECRET_KEY
      ) {
        throw new Error(
          "Flutterwave API keys not configured. Please check your .env file"
        );
      }

      const payload = {
        tx_ref: paymentData.tx_ref,
        amount: paymentData.amount,
        currency: paymentData.currency,
        redirect_url: paymentData.redirect_url,
        payment_options: "card,mobilemoney,ussd",
        customer: {
          email: paymentData.email,
          phone_number: paymentData.phone_number,
          name: paymentData.name,
        },
        customizations: {
          title: paymentData.customizations?.title || "Shop App Payment",
          description:
            paymentData.customizations?.description || "Payment for order",
          logo: paymentData.customizations?.logo || "",
        },
        meta: {
          consumer_id: paymentData.customer_id,
        },
      };

      console.log("Flutterwave payload:", payload);

      // Use direct API call since SDK doesn't have PaymentLink.create
      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Flutterwave response:", data);

      if (!response.ok) {
        throw new Error(
          `Flutterwave API error: ${data.message || response.statusText}`
        );
      }

      return data;
    } catch (error) {
      console.error("Flutterwave payment link generation error:", error);
      throw error;
    }
  }

  /**
   * Get all transactions
   */
  async getAllTransactions() {
    try {
      const response = await flw.Transaction.fetch({});
      return response;
    } catch (error) {
      console.error("Flutterwave get transactions error:", error);
      throw error;
    }
  }

  /**
   * Refund a transaction
   */
  async refundTransaction(transactionId: string, amount?: number) {
    try {
      const payload: any = { id: transactionId };
      if (amount) {
        payload.amount = amount;
      }

      const response = await flw.Transaction.refund(payload);
      return response;
    } catch (error) {
      console.error("Flutterwave refund error:", error);
      throw error;
    }
  }
}

export default new FlutterwaveService();
