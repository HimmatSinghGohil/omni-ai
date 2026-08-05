# OMNI-AI - Unified AI Platform

Omni-AI is a comprehensive, next-generation AI platform that consolidates multiple AI tools into a single, intuitive interface.

## 🚀 Features

- **10+ AI Tools** - Chat, Image Generation, Video Creation, Code Assistance, Translation, and more
- **Credit System** - Flexible credit-based usage model
- **User Authentication** - Secure signup and login with JWT
- **Request History** - Track all your AI requests
- **Asset Management** - Download and organize generated content
- **Dark Mode** - Beautiful theme support
- **Responsive Design** - Works on desktop and mobile
- **Admin Panel** - Manage users and credits

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Icons
- **Backend**: Next.js API Routes, Supabase, Prisma ORM
- **Authentication**: JWT, bcryptjs
- **Infrastructure**: GitHub Actions, Redis for caching/rate limiting

## 📁 Project Structure

```
omni-ai/
├── src/
│   ├── pages/
│   │   ├── api/              # API endpoints
│   │   ├── _app.tsx          # App wrapper
│   │   └── index.tsx         # Home page
│   ├── components/           # React components
│   ├── lib/                  # Utilities and libraries
│   ├── types/                # TypeScript definitions
│   ├── config/               # Constants
│   └── styles/               # Global styles
├── prisma/
│   └── schema.prisma         # Database schema
└── .github/workflows/        # CI/CD pipeline
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Redis instance

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/HimmatSinghGohil/omni-ai.git
   cd omni-ai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your credentials

5. Run development server
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/user/profile` - Get user profile
- `GET /api/user/credits` - Get credit balance
- `GET /api/user/history` - Get request history
- `POST /api/user/preferences` - Update preferences

### AI Requests
- `POST /api/orchestrator` - Route AI requests

### Assets
- `GET /api/assets/list` - List user assets
- `POST /api/assets/delete` - Delete asset

### Admin
- `GET /api/admin/metrics` - Platform metrics
- `POST /api/admin/allocate-credits` - Allocate credits

## 💳 Credit System

- Chat: 1 credit
- Study: 1 credit  
- Voice: 2 credits
- Image Generator: 5 credits
- Video Generator: 20 credits
- Coding Assistant: 2 credits
- Business Assistant: 2 credits
- PDF Assistant: 3 credits
- Translator: 1 credit
- Resume Builder: 3 credits

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Redis rate limiting
- SQL injection protection via Prisma
- CORS configuration

## 📖 Database Schema

See `prisma/schema.prisma` for complete schema with:
- Users and profiles
- Chat sessions
- AI requests
- Generated assets
- Admin logs

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Railway.app
- Render.com
- DigitalOcean
- AWS Amplify

## 🐛 Troubleshooting

### Build Issues
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Database Issues
- Verify DATABASE_URL in .env.local
- Run migrations: `npx prisma migrate dev`

### Redis Issues
- Check REDIS_URL format
- Verify Redis instance is running

## 📝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Himmat Singh Gohil** - [GitHub](https://github.com/HimmatSinghGohil)

## 🤝 Support

For support, open an issue on GitHub or email support@omni-ai.com

---

**Built with ❤️ by Himmat Singh Gohil**
