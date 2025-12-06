# Quick Fix for MongoDB Connection

## Issue Found

Your MongoDB URI is missing the database name. It should end with `/rafazz` before the query parameters.

## Current (Wrong):
```
mongodb+srv://berglin1998_db_user:xjOLiKh4XIBmDTpe@cluster0.uqyhpgm.mongodb.net/?appName=Cluster0
```

## Correct Format:
```
mongodb+srv://berglin1998_db_user:xjOLiKh4XIBmDTpe@cluster0.uqyhpgm.mongodb.net/rafazz?retryWrites=true&w=majority
```

## What to Change

Update your `.env.local` file:

**Replace this line:**
```env
MONGODB_URI=mongodb+srv://berglin1998_db_user:xjOLiKh4XIBmDTpe@cluster0.uqyhpgm.mongodb.net/?appName=Cluster0
```

**With this:**
```env
MONGODB_URI=mongodb+srv://berglin1998_db_user:xjOLiKh4XIBmDTpe@cluster0.uqyhpgm.mongodb.net/rafazz?retryWrites=true&w=majority
```

## Steps:

1. **Update `.env.local`** - Add `/rafazz` before the `?`
2. **Restart the server** - Stop (Ctrl+C) and run `npm run dev` again
3. **Check terminal logs** - You'll now see detailed login logs
4. **Try logging in again**

## What the Logs Will Show

After restarting, when you try to log in, you'll see in the terminal:
- 🔐 Login attempt for: your-email@example.com
- 📡 Connecting to MongoDB...
- ✅ MongoDB connected
- 🔍 Looking for admin: your-email@example.com
- ✅ Admin found
- 🔒 Verification status: true
- 🔑 Checking password...
- ✅ Password valid! Login successful

This will help us see exactly where the issue is!
