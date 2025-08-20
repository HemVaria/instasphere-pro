# 🌟 Instasphere

**Connect with people you love** - A modern social platform for real-time communication and community building.

![Instasphere Banner](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=300&fit=crop&crop=center)

## ✨ Features

### 🚀 Core Functionality
- **Real-time Chat** - Instant messaging with live updates
- **Channel Management** - Create public/private channels with custom topics
- **Social Feed** - Share posts with images, like, comment, and engage
- **Image Uploads** - Share photos seamlessly with Supabase Storage
- **Smart Notifications** - Stay updated with mentions and messages
- **User Presence** - See who's online and active
- **Responsive Design** - Works perfectly on desktop and mobile

### 🎨 Modern UI/UX
- **Unique Visual Identity** - Warm, modern design distinct from other platforms
- **Smooth Animations** - Powered by Framer Motion
- **Interactive Backgrounds** - Dynamic wave animations and visual effects
- **Dark/Light Themes** - Comfortable viewing in any environment
- **Mobile-First** - Optimized for all screen sizes

### 🔧 Technical Features
- **Next.js 15** - Latest React framework with App Router
- **Real-time Updates** - Supabase real-time subscriptions
- **Authentication** - Secure user management with demo mode fallback
- **Database** - PostgreSQL with Supabase
- **File Storage** - Image uploads with Supabase Storage
- **TypeScript** - Full type safety throughout

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Supabase account
- Git

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/yourusername/instasphere.git
cd instasphere
npm install
\`\`\`

### 2. Environment Setup
Create a \`.env.local\` file:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Auto-configured by Supabase)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
\`\`\`

### 3. Database Setup
Run the database migrations in order:

\`\`\`bash
# Core tables and authentication
psql $POSTGRES_URL -f scripts/01-setup-database.sql

# Default data and channels
psql $POSTGRES_URL -f scripts/02-insert-default-data.sql

# Posts and social features
psql $POSTGRES_URL -f scripts/03-create-posts-schema.sql

# Image upload support
psql $POSTGRES_URL -f scripts/05-add-post-image.sql
\`\`\`

### 4. Supabase Storage Setup
1. Go to your Supabase dashboard → Storage
2. Create a new bucket called \`post-images\`
3. Set it to **Public** for image sharing
4. Configure upload policies as needed

### 5. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 📱 Usage Guide

### Getting Started
1. **Sign Up/Sign In** - Create an account or use demo mode
2. **Join Channels** - Start with #general or create your own
3. **Start Chatting** - Send messages, emojis, and share thoughts
4. **Explore Feed** - Share posts with images and engage with others
5. **Stay Connected** - Get notifications and see who's online

### Key Features

#### 💬 Chat System
- **Channels**: Organized conversations by topic
- **Real-time**: Messages appear instantly
- **Rich Content**: Emojis, formatting, and media
- **User Management**: See online users and activity

#### 📱 Social Feed
- **Create Posts**: Share thoughts with titles and descriptions
- **Image Sharing**: Upload and display photos
- **Engagement**: Like, comment, and reply to posts
- **Social Features**: Share posts and build community

#### 🔔 Notifications
- **Smart Alerts**: Get notified of mentions and important updates
- **Customizable**: Control what notifications you receive
- **Real-time**: Instant updates across all devices

## 🛠️ Development

### Project Structure
\`\`\`
instasphere/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (image upload, etc.)
│   ├── globals.css        # Global styles
│   └── page.tsx           # Main application entry
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── feed/             # Social feed components
│   ├── slidezone/        # Chat interface
│   ├── explore/          # Discovery features
│   └── settings/         # User settings
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── scripts/              # Database migration scripts
└── public/               # Static assets
\`\`\`

### Key Technologies
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL + Real-time + Storage)
- **Authentication**: Supabase Auth with demo fallback
- **Deployment**: Vercel (recommended)

### Available Scripts
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
\`\`\`

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. **Connect Repository**: Import your GitHub repo to Vercel
2. **Environment Variables**: Add all \`.env.local\` variables to Vercel
3. **Deploy**: Vercel will automatically build and deploy
4. **Database**: Run migration scripts on your production database

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment
1. Build the application: \`npm run build\`
2. Set up environment variables on your hosting platform
3. Run database migrations on production database
4. Deploy the \`.next\` folder and \`public\` assets

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Your Supabase project URL | ✅ |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anonymous key | ✅ |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Service role key (server-only) | ✅ |
| \`POSTGRES_URL\` | Database connection string | ✅ |

### Database Schema
The application uses several key tables:
- \`users\` - User profiles and authentication
- \`channels\` - Chat channels and permissions  
- \`messages\` - Chat messages with real-time updates
- \`posts\` - Social feed posts with images
- \`comments\` - Post comments and replies
- \`notifications\` - User notification system

## 🎨 Customization

### Theming
The app uses a modern, warm color palette defined in \`app/globals.css\`:
- **Primary**: Warm orange/coral tones
- **Secondary**: Soft blues and teals  
- **Background**: Rich dark grays with warm undertones
- **Accents**: Vibrant highlights for interactions

### Styling System
- **Tailwind CSS**: Utility-first styling
- **CSS Variables**: Easy theme customization
- **Component Variants**: Consistent design system
- **Responsive Design**: Mobile-first approach

## 🐛 Troubleshooting

### Common Issues

#### "Connected successfully!" banner stuck
- **Solution**: Hard refresh the page (Ctrl+Shift+R)
- **Cause**: Client-side state caching

#### Database connection errors
- **Check**: Environment variables are correctly set
- **Verify**: Supabase project is active and accessible
- **Test**: Database migrations have been run

#### Image uploads failing
- **Verify**: \`post-images\` bucket exists in Supabase Storage
- **Check**: Bucket is set to public
- **Confirm**: \`SUPABASE_SERVICE_ROLE_KEY\` is set correctly

#### Real-time features not working
- **Check**: Supabase real-time is enabled for your tables
- **Verify**: RLS policies allow real-time subscriptions
- **Test**: Network connection and WebSocket support

### Demo Mode
If Supabase is unavailable, the app automatically falls back to demo mode:
- ✅ Local authentication with demo users
- ✅ In-memory data storage
- ✅ Full UI functionality
- ❌ No data persistence
- ❌ No real-time sync between users

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: \`git checkout -b feature/amazing-feature\`
3. **Commit** your changes: \`git commit -m 'Add amazing feature'\`
4. **Push** to the branch: \`git push origin feature/amazing-feature\`
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test on both desktop and mobile
- Ensure accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure and real-time features
- **Vercel** - Hosting and deployment platform
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **shadcn/ui** - Component library foundation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/instasphere/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/instasphere/discussions)
- **Email**: support@instasphere.app

---

**Built with ❤️ using Next.js and Supabase**

*Connect with people you love on Instasphere* 🌟
