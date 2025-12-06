# Corrected MongoDB URI

Based on your MongoDB Atlas screenshot, I can see you have a database called **"admins"**.

## Update Your `.env.local` File

Replace the entire content of your `.env.local` file with this:

```env
# MongoDB Configuration - CORRECTED
MONGODB_URI=mongodb+srv://berglin1998_db_user:xjOLiKh4XIBmDTpe@cluster0.uqyhpgm.mongodb.net/admins?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=2z65/nWTSUKmVrRlR7m8CrD0xNOURJQ9W44vSMySlII=

# Resend API Key (optional for development - auto-verify is enabled)
RESEND_API_KEY=re_your_resend_api_key_here

# Admin Email (for notifications)
ADMIN_EMAIL=berglin1998@gmail.com
```

## Key Changes:

1. ✅ Changed database name from `rafazz` to `admins` (matching your Atlas database)
2. ✅ Added proper query parameters `?retryWrites=true&w=majority`
3. ✅ Kept your existing credentials and secret

## Next Steps:

1. **Copy the entire content above** (from `# MongoDB Configuration` to the end)
2. **Paste it into your `.env.local` file** (replace everything)
3. **Save the file**
4. **Restart the dev server:**
   - Press `Ctrl+C` in terminal
   - Run `npm run dev`
5. **Try logging in again**

You should now see detailed logs in the terminal showing the login process!

---

## Screenshot Analysis

From your MongoDB Atlas screenshot, I can see:
- ✅ Database: `admins` 
- ✅ Collection: `admins` (visible in the tree)
- ✅ You have at least 1 document (your registered admin account)

The connection should work now with the database name set to `admins`!
