# Environment Variables Setup Guide

## Quick Start

Create a `.env.local` file in the project root and add the following variables:

## Required Configuration

### 1. Supabase (Database & Auth)

```env
NEXT_PUBLIC_SUPABASE_URL=https://lpjlgwvjspfujjcfatww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwamxnd3Zqc3BmdWpqY2ZhdHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDIwOTQsImV4cCI6MjA5NTMxODA5NH0.Zy0Fw2-cv86Xw_1-PvnST4G2Jnlg1BfAv9dFKfQGqTI

SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwamxnd3Zqc3BmdWpqY2ZhdHd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc0MjA5NCwiZXhwIjoyMDk1MzE4MDk0fQ.EUbQ04QobHxQg2HlFFEu73JGV8-TzzDdoGl3jHxPoDI
```

**How to get these:**
1. Go to https://supabase.com
2. Create a new project
3. Copy URL and API keys from Settings > API
4. Paste them here

### 2. Firebase (Cloud Functions & Storage)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**How to get these:**
1. Go to https://firebase.google.com
2. Create a new project
3. Go to Project Settings
4. Copy the config object values

### 3. Razorpay (Payment Processing)

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY=your_public_key
```

**How to get these:**
1. Go to https://dashboard.razorpay.com
2. Sign up / Log in
3. Go to Settings > API Keys
4. Copy Key ID and Secret

### 4. Email Service (SendGrid or Gmail)

**Using SendGrid (Recommended):**
```env
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=wholesalebazaar.support@gmail.com
```

**Using Gmail:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=wholesalebazaar.support@gmail.com
EMAIL_PASSWORD=nxxhtsndvhofnijb
ADMIN_EMAIL=wholesalebazaar.support@gmail.com
```

**How to get Gmail App Password:**
1. Enable 2-Factor Authentication in your Google Account
2. Go to myaccount.google.com > Security
3. Find "App passwords"
4. Generate a password for Mail > Windows Computer (or your device)
5. Copy the generated password

### 5. Google Forms (Bulk Order Form)

```env
NEXT_PUBLIC_GOOGLE_FORM_URL=https://forms.gle/YOUR_FORM_ID
```

**How to create Google Form:**
1. Go to https://forms.google.com
2. Create new form for bulk orders
3. Add fields: Company Name, Email, Categories, Order Volume, Notes
4. Copy the form ID from the URL
5. Use: https://forms.gle/YOUR_FORM_ID

## Optional Configuration

### Analytics

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Error Tracking (Sentry)

```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## Database Schema Setup

After connecting Supabase, run these SQL commands to create necessary tables:

```sql
-- Contact Submissions Table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bulk Orders Table
CREATE TABLE bulk_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  categories TEXT NOT NULL,
  order_volume INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount DECIMAL(10, 2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON contact_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bulk_orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON payments TO authenticated;
```

## Testing the Configuration

### Test Contact Form:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message"
  }'
```

### Test Bulk Order:
```bash
curl -X POST http://localhost:3000/api/bulk-order \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "businessEmail": "company@example.com",
    "categories": "Men,Women",
    "orderVolume": 1000,
    "notes": "Test bulk order"
  }'
```

## Deployment Configuration

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Go to Project Settings > Environment Variables
3. Add all the environment variables from above
4. Redeploy the project

### Docker Deployment

```dockerfile
# Build image with environment variables
docker build -t wholesale-baazar .

# Run container
docker run -e NEXT_PUBLIC_SUPABASE_URL=xxx ... wholesale-baazar
```

## Security Best Practices

1. **Never commit `.env.local` to git** - Add to `.gitignore`
2. **Use `NEXT_PUBLIC_` only for client-safe values** - Keys, IDs, URLs
3. **Never expose secrets** - Use backend-only environment variables for secrets
4. **Rotate API keys regularly** - Every 90 days recommended
5. **Use strong admin passwords** - Minimum 12 characters with mixed case, numbers, symbols
6. **Enable 2FA** - On all service accounts (Firebase, Supabase, Razorpay)

## Environment Variables Checklist

- [ ] Supabase URL and keys configured
- [ ] Firebase project created and keys added
- [ ] Razorpay keys obtained and configured
- [ ] Email service set up (SendGrid or Gmail)
- [ ] Google Form created and URL added
- [ ] Admin email configured
- [ ] Database tables created in Supabase
- [ ] All variables added to `.env.local`
- [ ] Testing all API endpoints
- [ ] Ready for deployment

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is missing"
- Check that `.env.local` file exists in project root
- Verify the variable name is spelled correctly
- Restart dev server: `npm run dev`

### "Razorpay payment failed"
- Check that keys are correct (not swapped Key ID and Secret)
- Verify test mode is enabled if using test keys
- Check network requests in browser console

### "Email not sending"
- For Gmail: Verify app password was generated (not regular password)
- For SendGrid: Check API key is valid and not expired
- Test email credentials using Postman or curl

### "Firebase storage not working"
- Check bucket name matches exactly (case-sensitive)
- Verify Firebase Cloud Storage is enabled in console
- Check CORS settings in Firebase console

## Support

For issues or questions:
- Email: support@wholesalebaazar.com
- WhatsApp: +91-8840130533
- GitHub Issues: [Create an issue]
