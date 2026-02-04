# 🔐 Godiya EMR/HMS Login Credentials

## Super Admin Access

**Login URL**: `/emr/login`

### Credentials:
```
Email:    ghaliyu@gmail.com
Password: godiya@2025
```

## Password Reset

**Forgot Password URL**: `/emr/forgot-password`

Only the following email will receive a password reset link:
```
Email: ghaliyu@gmail.com
```

## Access Control

- ✅ Only `ghaliyu@gmail.com` with password `godiya@2025` can log in
- ❌ Any other email/password combination will show: "Unauthorized access — invalid credentials."
- ✅ Successful login redirects to `/emr/dashboard`
- ✅ All actions are logged in the Audit Logs page

## Quick Test Flow

1. Visit: `http://localhost:5173/emr/login`
2. Enter: `ghaliyu@gmail.com` / `godiya@2025`
3. Click "Sign In"
4. See success toast: "Login successful. Welcome, Super Admin."
5. Automatically redirected to dashboard
6. Explore all modules via sidebar
7. Click notifications bell to see drawer
8. Click profile → Log out → Confirm

## Navigation from Hospital Website

The hospital website navbar has a "Login to EMR" button that redirects to `/emr/login`

---

**Important**: This is a demo/development setup. In production, credentials should be managed securely with proper authentication backend.
