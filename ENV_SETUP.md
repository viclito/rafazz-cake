# Environment Variables Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/rafazz?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Resend API Key
RESEND_API_KEY=re_your_resend_api_key_here

# Admin Email (for notifications)
ADMIN_EMAIL=your-email@example.com
```

## Setup Instructions

1. **MongoDB**: 
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string and replace `MONGODB_URI`

2. **NextAuth Secret**: 
   - Generate a random secret: `openssl rand -base64 32`
   - Replace `NEXTAUTH_SECRET`

3. **Resend API Key**:
   - Sign up at [Resend](https://resend.com)
   - Get your API key from the dashboard
   - Replace `RESEND_API_KEY`

4. **Admin Email**:
   - Set your email for receiving notifications
