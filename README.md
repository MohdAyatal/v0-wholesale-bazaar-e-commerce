# Wholesale Baazar - E-Commerce Platform

A modern, production-ready wholesale e-commerce platform built with Next.js 16, React 19, and Tailwind CSS. Perfect for B2B wholesale businesses, bulk orders, and enterprise distribution.

## 🚀 Live Features

### Homepage
- **Auto-Rotating Carousel** - Admin-managed slideshow for promotions
- **Flash Sale Countdown** - Real-time timer for limited-time offers
- **Trust Badges** - Build customer confidence with security indicators
- **Newsletter Signup** - Capture leads and stay connected
- **30 Fake Products** - Complete product catalog for testing
- **Floating Chatbot** - 24/7 customer support with WhatsApp integration

### Navigation
- **Aligned Header** - Products, About, Contact links
- **WhatsApp Button** - Direct messaging at +91-8840130533
- **Search Bar** - Product discovery
- **Shopping Cart** - Persistent cart with local storage
- **Mobile Menu** - Responsive hamburger navigation

### Products
- **30 Products** - 5 categories with realistic data
  - Men (5 items)
  - Women (5 items)
  - Kids (5 items)
  - Accessories (5 items)
  - Home & Kitchen (10 items)
- **Filters** - Category and price range filtering
- **Pagination** - 12 products per page
- **Ratings** - Star ratings and review counts
- **Discounts** - 50% off badges on all products

### Contact Page
- **Contact Form** - Get in touch with business inquiries
- **Bulk Order Form** - Request wholesale pricing
- **Business Information** - Phone, email, address
- **Integration Placeholders** - Email, Razorpay, Firebase, Supabase setup info
- **Google Form Link** - Extended bulk order form

### Admin Dashboard
- **Product Management** - Add, edit, delete products
- **Slideshow Management** - Create promotional carousels
- **Analytics Dashboard** - View stats and metrics
- **Secure Login** - Admin authentication system

## 📋 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account (free tier available)

### Installation

1. **Clone and install:**
```bash
git clone <repository>
cd wholesale-baazar
pnpm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

3. **Run development server:**
```bash
pnpm dev
```

4. **Open in browser:**
```
http://localhost:3000
```

### Admin Access
- **URL:** http://localhost:3000/admin/login
- **Demo Credentials:** 
  - Email: `admin@wholesalebaazar.com`
  - Password: `admin123`

## 🛠️ Configuration

### Environment Variables

Required variables (see `ENV_SETUP.md` for complete guide):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email
EMAIL_USER=
EMAIL_PASSWORD=
```

## 📁 Project Structure

```
wholesale-baazar/
├── app/
│   ├── (auth)/login/           # User login
│   ├── admin/
│   │   ├── login/page.tsx      # Admin login
│   │   └── page.tsx            # Admin dashboard
│   ├── api/
│   │   ├── contact/route.ts    # Contact form API
│   │   ├── bulk-order/route.ts # Bulk order API
│   │   ├── razorpay/route.ts   # Payment API
│   │   └── chatbot/route.ts    # Chatbot API
│   ├── contact/page.tsx        # Contact page
│   ├── products/page.tsx       # Products catalog
│   ├── about/page.tsx          # About page
│   └── page.tsx                # Homepage
│
├── components/
│   ├── header.tsx              # Navigation header
│   ├── home-carousel.tsx       # Slideshow component
│   ├── flash-sale-section.tsx  # Flash sale display
│   ├── trust-badges.tsx        # Trust indicators
│   ├── newsletter-section.tsx  # Newsletter signup
│   ├── floating-chatbot.tsx    # Chat support
│   └── cart-sidebar.tsx        # Shopping cart
│
├── lib/
│   ├── cart-context.tsx        # Cart state management
│   ├── admin-context.tsx       # Admin authentication
│   ├── supabase/
│   │   ├── client.ts           # Supabase client
│   │   └── server.ts           # Supabase server
│   └── integrations-placeholder.ts  # Service configs
│
├── public/                     # Static assets
├── styles/
│   └── globals.css             # Tailwind CSS
├── ENV_SETUP.md                # Environment setup guide
└── FEATURES_SUMMARY.md         # Complete features list
```

## 🔌 API Endpoints

### Contact Form
```
POST /api/contact
Body: { name, email, subject, message }
Response: { success: true, message: "..." }
```

### Bulk Order
```
POST /api/bulk-order
Body: { companyName, businessEmail, categories, orderVolume, notes }
Response: { success: true, orderId: "..." }
```

### Razorpay Payment
```
POST /api/razorpay
Body: { orderId, amount, description }
Response: { success: true, razorpayOrderId: "..." }

GET /api/razorpay?razorpay_order_id=xxx&razorpay_payment_id=xxx
Webhook handler for payment confirmation
```

### Chatbot
```
POST /api/chatbot
Body: { message: "user query", context: "..." }
Response: { reply: "chatbot response" }
```

## 🎨 Design System

### Colors
- **Primary:** Teal (#0F766E)
- **Secondary:** Coral (#FF6B6B)  
- **Accent:** Gold (#FFB84D)
- **Background:** White (#FFFFFF)
- **Text:** Dark Gray (#1F2937)

### Typography
- **Headings:** Geist (sans-serif)
- **Body:** Geist (sans-serif)
- **Monospace:** Geist Mono

### Components
- Responsive grid layouts
- Flexible card components
- Modal forms
- Toast notifications
- Loading states

## 🗄️ Database

### Tables Created
- `products` - Product catalog
- `categories` - Product categories
- `slideshow` - Homepage carousel
- `contact_submissions` - Contact form submissions
- `bulk_orders` - Wholesale order requests
- `payments` - Payment records
- `site_settings` - Configuration
- `admin_logs` - Audit logs

## 🔐 Security

- ✅ Session-based admin authentication
- ✅ CORS protection on API routes
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (Supabase)
- ✅ XSS protection (React built-in)
- ✅ Environment variables for sensitive data
- ✅ HTTPS ready for production

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Add environment variables in Project Settings
3. Deploy automatically on push

```bash
git push origin main
# Vercel automatically deploys
```

### Docker

```bash
docker build -t wholesale-baazar .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=xxx wholesale-baazar
```

### Manual Deployment

```bash
pnpm build
pnpm start
```

## 📊 Analytics

Track key metrics:
- Product views and conversions
- Cart abandonment rate
- Bulk order inquiries
- Average order value
- Customer lifetime value

*Integration with Google Analytics or Sentry available*

## 🤝 Support

- **Email:** support@wholesalebaazar.com
- **WhatsApp:** +91-8840130533
- **Phone:** +91-8840130533
- **Business Hours:** Mon-Fri 9AM-6PM IST

## 📝 Documentation

- `ENV_SETUP.md` - Environment variables guide
- `FEATURES_SUMMARY.md` - Complete feature list
- `IMPLEMENTATION_STATUS.md` - Implementation progress

## 🔄 Planned Features

- [ ] User authentication system
- [ ] Order tracking and history
- [ ] Invoice generation and download
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Inventory management
- [ ] Multi-warehouse support
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)

## 📦 Dependencies

### Core
- next@16.x
- react@19.x
- tailwindcss@4.x
- typescript@5.x

### Database & Auth
- @supabase/supabase-js
- @supabase/auth-helpers-nextjs

### Payment
- razorpay (placeholder)

### Utilities
- lucide-react (icons)
- clsx (conditional classes)
- dayjs (date handling)

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

## 📄 License

MIT License - See LICENSE.md

## 🎯 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Database by [Supabase](https://supabase.com)
- Payment gateway [Razorpay](https://razorpay.com)
- Icons from [Lucide React](https://lucide.dev)

---

**Made with ❤️ for wholesale businesses**

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅
