# Flutterwave Payment Integration Testing

## Prerequisites

1. Create a Flutterwave account at https://dashboard.flutterwave.com/
2. Get your API keys from the dashboard
3. Update your .env file with the actual keys

## Environment Setup

```bash
# Update your .env file with actual Flutterwave credentials
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your_public_key_here
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_secret_key_here
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TESTyour_encryption_key_here
FLUTTERWAVE_SECRET_HASH=your_webhook_secret_hash_here
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### 1. Create Order (Checkout)

```http
POST /api/order/checkout
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  // No body required - will checkout items from user's cart
}
```

### 2. Initialize Payment

```http
POST /api/payment/initialize
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "orderId": "64f1234567890abcdef12345",
  "paymentMethod": "flutterwave"
}
```

### 3. Verify Payment

```http
GET /api/payment/verify?transaction_id=1234567&tx_ref=shop_app_order_id_uuid
```

### 4. Get Payment Status

```http
GET /api/payment/status/:orderId
Authorization: Bearer <your_jwt_token>
```

### 5. Webhook Endpoint

```http
POST /api/payment/webhook
Content-Type: application/json
verif-hash: <your_webhook_secret_hash>

{
  "event": "charge.completed",
  "data": {
    "id": 1234567,
    "tx_ref": "shop_app_order_id_uuid",
    "flw_ref": "FLW_REF_123456789",
    "amount": 1000,
    "currency": "NGN",
    "status": "successful"
  }
}
```

## Testing Flow

### 1. Complete Order Flow Test

```bash
# Start your server
npm run dev

# 1. Login/Register user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Add products to cart
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"productId":"product_id_here","quantity":2}'

# 3. Checkout (create order)
curl -X POST http://localhost:3000/api/order/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"

# 4. Initialize payment
curl -X POST http://localhost:3000/api/payment/initialize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"orderId":"order_id_from_step_3"}'

# 5. Visit the payment link returned from step 4
# 6. Complete payment on Flutterwave's page
# 7. Verify payment was successful
curl -X GET "http://localhost:3000/api/payment/verify?transaction_id=TX_ID&tx_ref=TX_REF"
```

### 2. Webhook Testing

Use ngrok to expose your local server for webhook testing:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the ngrok URL in your Flutterwave webhook settings
# Example: https://abc123.ngrok.io/api/payment/webhook
```

## Payment Test Cards (Flutterwave Test Environment)

### Successful Payment

- **Card Number:** 4187427415564246
- **CVV:** 828
- **Expiry:** 09/32
- **PIN:** 3310

### Failed Payment

- **Card Number:** 4084084084084081
- **CVV:** 408
- **Expiry:** 09/32
- **PIN:** 0000

## Troubleshooting

### Common Issues:

1. **Invalid API Keys:** Ensure you're using the correct test/live keys
2. **Webhook Not Working:** Check ngrok tunnel and webhook URL in dashboard
3. **Payment Verification Fails:** Verify transaction_id and tx_ref parameters
4. **Amount Mismatch:** Ensure order total matches payment amount

### Debug Tips:

1. Check server logs for detailed error messages
2. Verify environment variables are loaded correctly
3. Test with Flutterwave's API documentation
4. Use Postman or similar tools for API testing

## Production Deployment Notes

### Security Checklist:

- [ ] Use HTTPS in production
- [ ] Validate webhook signatures
- [ ] Store sensitive data securely
- [ ] Implement rate limiting
- [ ] Add proper error logging
- [ ] Use production Flutterwave keys

### Required Updates for Production:

1. Update `FRONTEND_URL` to your production domain
2. Switch to live Flutterwave API keys
3. Configure proper webhook URLs
4. Implement proper error monitoring
5. Add payment reconciliation logic
