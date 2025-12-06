# Admin Login Troubleshooting Guide

## Issue: 401 Unauthorized Error

You're seeing a 401 error when trying to log in. Here's how to fix it:

## Step-by-Step Solution

### 1. Verify Environment Variables

Make sure your `.env.local` file has all required variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rafazz?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
RESEND_API_KEY=re_your_api_key
ADMIN_EMAIL=your-email@example.com
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 2. Check MongoDB Connection

**Common Issues:**
- ❌ Wrong connection string
- ❌ IP not whitelisted in MongoDB Atlas
- ❌ Incorrect username/password
- ❌ Database name missing

**Fix:**
1. Go to MongoDB Atlas → Database → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add `/rafazz` before the `?` to specify database name

**Example:**
```
mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/rafazz?retryWrites=true&w=majority
```

### 3. Restart Development Server

After updating `.env.local`, you MUST restart the server:

```bash
# Stop the current server (Ctrl+C)
# Then start again
npm run dev
```

### 4. Register First Admin Account

**IMPORTANT:** You need to register before you can log in!

1. Go to `http://localhost:3000/admin/register`
2. Fill in your details:
   - Name: Your Name
   - Email: your-email@example.com
   - Password: (at least 6 characters)
   - Confirm Password: (same as above)
3. Click "Create Account"
4. Check your email for verification link
5. Click the verification link
6. Now you can log in at `http://localhost:3000/admin/login`

### 5. Check Browser Console

Open browser DevTools (F12) and check:
- Console tab for JavaScript errors
- Network tab for API response details

### 6. Common Error Messages

**"No admin found with this email"**
- Solution: Register an account first at `/admin/register`

**"Please verify your email before logging in"**
- Solution: Check your email and click the verification link

**"Invalid password"**
- Solution: Make sure you're using the correct password

**"Failed to connect to MongoDB"**
- Solution: Check your `MONGODB_URI` and internet connection

### 7. Quick Test Checklist

- [ ] `.env.local` file exists in root directory
- [ ] All environment variables are set
- [ ] MongoDB URI is correct and database is accessible
- [ ] Development server was restarted after adding `.env.local`
- [ ] You've registered an admin account
- [ ] Email was verified (check spam folder)
- [ ] Using correct email and password to log in

## Still Having Issues?

### Check Server Logs

Look at your terminal where `npm run dev` is running. You should see error messages if something is wrong.

### Test MongoDB Connection

Create a test file `test-db.js`:

```javascript
const mongoose = require('mongoose');

const MONGODB_URI = 'your-mongodb-uri-here';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
```

Run it:
```bash
node test-db.js
```

### Enable Debug Mode

Add this to your NextAuth configuration to see detailed logs:

In `src/app/api/auth/[...nextauth]/route.js`, add:

```javascript
export const authOptions = {
  debug: true, // Add this line
  providers: [
    // ... rest of config
  ],
  // ... rest of config
};
```

## Most Likely Solution

**You haven't registered yet!** 

The login page requires an existing admin account. Go to:
```
http://localhost:3000/admin/register
```

Register → Verify Email → Then Login

---

## Need Help?

If you're still stuck, share:
1. Error message from browser console
2. Error message from terminal
3. Whether you've registered an account
4. Whether MongoDB connection is working
