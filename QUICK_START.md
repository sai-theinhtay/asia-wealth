# AutoPro - Quick Start Guide

## 🚀 Getting Started

### Step 1: Setup Database

```bash
# Create database
mysql -u root -p111111 -e "CREATE DATABASE automanager;"

# Set environment variable
export DATABASE_URL="mysql://root:111111@localhost:3306/automanager"

# Run migrations
npm run db:push
```

### Step 2: Create Admin User

You need to create an admin user to login. You can do this by:

**Option A: Using MySQL directly**
```sql
-- First, hash a password (you'll need to do this in Node.js or use a tool)
-- For example, password "admin123" hashed:
INSERT INTO users (username, password) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
```

**Option B: Create a seed script** (recommended)
Create a file `scripts/seed.ts`:
```typescript
import { hashPassword } from "../server/auth";
import { storage } from "../server/storage";

async function seed() {
  // Create admin user
  const adminPassword = await hashPassword("admin123");
  await storage.createUser({
    username: "admin",
    password: adminPassword,
  });
  
  console.log("Admin user created: username='admin', password='admin123'");
}

seed();
```

### Step 3: Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 👤 Member Registration & Login

### Register New Member

1. **Go to:** `http://localhost:5000/member-login`
2. **Click:** "Register" tab
3. **Fill in:**
   - Name: Your full name
   - Email: Your email (must be unique)
   - Phone: (Optional)
   - Password: At least 6 characters
   - Confirm Password: Must match
4. **Click:** "Create Account"
5. **You'll be automatically logged in** and redirected to Member Portal

### Login as Member

1. **Go to:** `http://localhost:5000/member-login`
2. **Enter:**
   - Email: Your registered email
   - Password: Your password
3. **Click:** "Login"
4. **You'll be redirected** to Member Portal

## 👨‍💼 Admin Login

1. **Go to:** `http://localhost:5000/admin-login`
2. **Enter:**
   - Username: `admin` (or your admin username)
   - Password: `admin123` (or your admin password)
3. **Click:** "Login"
4. **You'll be redirected** to Dashboard

## 📱 Using Member Portal

### Access Member Portal
- URL: `http://localhost:5000/member-portal`
- You must be logged in as a member

### Features Available:

1. **View Profile**
   - See your member level (Bronze/Silver/Gold/Platinum)
   - View points balance
   - Check wallet balance

2. **Manage Vehicles**
   - View your vehicles
   - Add new vehicles
   - See service history

3. **Shopping Cart**
   - Click "Cart" button in header
   - Add items to cart
   - Update quantities
   - Checkout

4. **Points & Wallet**
   - View transaction history
   - Top up wallet (via admin)
   - Earn points on purchases

## 🎛️ Using Admin Dashboard

### Access Dashboard
- URL: `http://localhost:5000/`
- You must be logged in as admin

### Main Features:

1. **Dashboard** (`/`)
   - View key metrics
   - See revenue charts
   - Recent activities

2. **Members** (`/members`)
   - View all members
   - Add new members
   - Manage points & wallet
   - Search members

3. **Users** (`/users`)
   - Manage admin/staff accounts
   - Create new users
   - Edit/delete users

4. **Sales** (`/sales`)
   - Manage vehicle sales
   - Track sales history

5. **Service** (`/service`)
   - Schedule services
   - View appointments

6. **Parts** (`/parts`)
   - Manage inventory
   - Track stock

7. **Inventory** (`/inventory`)
   - Manage vehicles
   - Add/update vehicles

8. **Finance** (`/finance`)
   - View financial reports
   - Track revenue/expenses

9. **Branches** (`/branches`)
   - Manage branches
   - Assign users

## 🔄 Common Workflows

### Workflow 1: New Member Registration
```
1. Member goes to /member-login
2. Clicks "Register" tab
3. Fills registration form
4. Clicks "Create Account"
5. Auto-logged in → Redirected to /member-portal
6. Can now browse services, add to cart, etc.
```

### Workflow 2: Member Makes Purchase
```
1. Member logs in → /member-portal
2. Browses services/parts
3. Adds items to cart
4. Goes to /cart
5. Reviews order
6. Clicks "Proceed to Checkout"
7. Payment processed
8. Points earned (if applicable)
9. Wallet deducted (if using wallet)
```

### Workflow 3: Admin Manages Member
```
1. Admin logs in → Dashboard
2. Goes to /members
3. Searches for member
4. Clicks on member row
5. Can:
   - Add points
   - Top up wallet
   - View transactions
   - Update member info
```

### Workflow 4: Admin Creates Service
```
1. Admin logs in → Dashboard
2. Goes to /service
3. Clicks "New Service" or similar
4. Fills service form
5. Assigns to member
6. Service scheduled
```

## 🔐 Session Management

- **Sessions last:** 7 days
- **Auto-logout:** After 7 days of inactivity
- **Manual logout:** Click logout button (to be added to UI)
- **Session stored:** In httpOnly cookies

## 📊 API Usage Examples

### Using cURL

**Member Login:**
```bash
curl -X POST http://localhost:5000/api/auth/member/login \
  -H "Content-Type: application/json" \
  -d '{"email":"member@example.com","password":"password123"}' \
  -c cookies.txt
```

**Get Current Member:**
```bash
curl http://localhost:5000/api/auth/member/me \
  -b cookies.txt
```

**Add Points to Member:**
```bash
curl -X POST http://localhost:5000/api/members/MEMBER_ID/points/add \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"description":"Purchase reward"}'
```

### Using JavaScript/Fetch

```javascript
// Login
const response = await fetch('/api/auth/member/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'member@example.com',
    password: 'password123'
  })
});

// Get current user
const me = await fetch('/api/auth/member/me', {
  credentials: 'include'
}).then(r => r.json());
```

## ⚠️ Important Notes

1. **First Time Setup:**
   - Must create database
   - Must run migrations
   - Must create admin user

2. **Password Requirements:**
   - Minimum 6 characters
   - Stored as bcrypt hash

3. **Email Uniqueness:**
   - Each member email must be unique
   - Registration will fail if email exists

4. **Session Cookies:**
   - Use `credentials: 'include'` in fetch requests
   - Cookies are httpOnly for security

5. **Development vs Production:**
   - Change `SESSION_SECRET` in production
   - Use secure cookies in production
   - Set proper CORS settings

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is set
- Verify MySQL is running
- Check database exists

### "Login fails"
- Verify user exists in database
- Check password is correct
- Ensure password is hashed in database

### "Session not persisting"
- Check cookies are enabled
- Verify `credentials: 'include'` in requests
- Check SESSION_SECRET is set

### "Cart not working"
- Must be logged in as member
- Check member ID is correct
- Verify cart API endpoints

## 📚 Next Steps

1. **Explore the UI:**
   - Try all the pages
   - Test member registration
   - Test admin login

2. **Test Features:**
   - Add members
   - Manage points
   - Use cart
   - View reports

3. **Customize:**
   - Add your own data
   - Customize member levels
   - Configure points rates

4. **Production Setup:**
   - Set secure SESSION_SECRET
   - Configure CORS
   - Set up SSL
   - Use environment variables

