# AutoPro - User Guide

## 🔐 Authentication & Login

### Member Registration & Login

#### **Register as a New Member**

1. **Navigate to Member Login Page:**
   - Go to: `http://localhost:5000/member-login`
   - Or click "Member Login" link from the homepage

2. **Fill Registration Form:**
   - Click on the **"Register"** tab
   - Enter your details:
     - **Name**: Your full name
     - **Email**: Your email address (must be unique)
     - **Phone**: Your phone number (optional)
     - **Password**: At least 6 characters
     - **Confirm Password**: Must match your password
   - Click **"Create Account"**

3. **Auto-Login:**
   - After successful registration, you'll be automatically logged in
   - You'll be redirected to the Member Portal

#### **Login as Existing Member**

1. **Navigate to Member Login:**
   - Go to: `http://localhost:5000/member-login`
   - Or use the login link

2. **Enter Credentials:**
   - **Email**: Your registered email address
   - **Password**: Your password
   - Click **"Login"**

3. **Access Member Portal:**
   - After successful login, you'll be redirected to `/member-portal`
   - You can view your vehicles, services, points, and wallet

### Admin/Staff Login

1. **Navigate to Admin Login:**
   - Go to: `http://localhost:5000/admin-login`

2. **Enter Admin Credentials:**
   - **Username**: Your admin username
   - **Password**: Your admin password
   - Click **"Login"**

3. **Access Admin Dashboard:**
   - After successful login, you'll be redirected to the main dashboard
   - You can access all management features

## 📱 Member Portal Features

### **View Your Profile**
- See your member level (Bronze, Silver, Gold, Platinum)
- View your points balance
- Check your wallet balance
- See your join date

### **Manage Vehicles**
- View all your registered vehicles
- Add new vehicles
- View service history for each vehicle

### **View Service History**
- See all past services
- Check service details and costs
- View upcoming appointments

### **Points System**
- **Earn Points**: Points are earned when you make purchases
- **Spend Points**: Use points to get discounts
- **View Transactions**: See all your points transactions

### **Wallet Management**
- **Top Up**: Add money to your wallet
- **View Balance**: Check your current wallet balance
- **Transaction History**: See all wallet transactions

### **Shopping Cart**
1. **Add Items to Cart:**
   - Browse services or parts
   - Click "Add to Cart"
   - Items are saved to your cart

2. **View Cart:**
   - Click the "Cart" button in the header
   - Or go to: `http://localhost:5000/cart`

3. **Manage Cart Items:**
   - Update quantities
   - Remove items
   - View total price

4. **Checkout:**
   - Review your order
   - Proceed to checkout
   - Complete payment

## 👨‍💼 Admin Dashboard Features

### **Dashboard Overview**
- View key metrics:
  - Total Revenue
  - Vehicles Sold
  - Active Services
  - Low Stock Alerts
- See revenue charts
- View recent activities

### **Member Management** (`/members`)
- **View All Members**: See list of all registered members
- **Add New Member**: Click "Add Member" button
- **Search Members**: Use search bar to find members
- **View Member Details**: Click on a member row
- **Manage Points**: Add or deduct points for members
- **Manage Wallet**: Top up or deduct wallet balance
- **View Member Levels**: See distribution of member levels

### **User Management** (`/users`)
- **View All Users**: See all admin/staff users
- **Add User**: Create new admin or staff accounts
- **Edit User**: Update user details
- **Delete User**: Remove user accounts
- **Reset Password**: Send password reset

### **Sales Management** (`/sales`)
- View vehicle sales
- Create new sales
- Track sales history

### **Service Management** (`/service`)
- View service appointments
- Schedule new services
- Track service history

### **Parts Management** (`/parts`)
- View parts inventory
- Add new parts
- Update stock levels

### **Inventory Management** (`/inventory`)
- View all vehicles in inventory
- Add new vehicles
- Update vehicle details

### **Finance** (`/finance`)
- View financial reports
- Track revenue and expenses
- View profit/loss statements

### **Branches** (`/branches`)
- Manage multiple branches
- View branch details
- Assign users to branches

## 🔧 API Endpoints

### **Member Authentication**

#### Register Member
```http
POST /api/auth/member/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "password": "password123"
}
```

#### Login Member
```http
POST /api/auth/member/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current Member
```http
GET /api/auth/member/me
```

#### Logout Member
```http
POST /api/auth/member/logout
```

### **Admin Authentication**

#### Login Admin
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Get Current Admin
```http
GET /api/auth/admin/me
```

#### Logout Admin
```http
POST /api/auth/admin/logout
```

### **Member Management**

#### Get All Members
```http
GET /api/members
```

#### Get Member by ID
```http
GET /api/members/:id
```

#### Create Member
```http
POST /api/members
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "password": "hashed_password",
  "address": "123 Main St"
}
```

#### Update Member
```http
PATCH /api/members/:id
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "987-654-3210"
}
```

#### Delete Member
```http
DELETE /api/members/:id
```

### **Points Management**

#### Add Points
```http
POST /api/members/:id/points/add
Content-Type: application/json

{
  "amount": 100,
  "description": "Purchase reward",
  "referenceId": "order-123"
}
```

#### Spend Points
```http
POST /api/members/:id/points/spend
Content-Type: application/json

{
  "amount": 50,
  "description": "Discount applied",
  "referenceId": "order-123"
}
```

#### Get Points Transactions
```http
GET /api/members/:id/points/transactions?limit=50
```

### **Wallet Management**

#### Top Up Wallet
```http
POST /api/members/:id/wallet/topup
Content-Type: application/json

{
  "amount": 100.00,
  "description": "Wallet top-up"
}
```

#### Deduct from Wallet
```http
POST /api/members/:id/wallet/deduct
Content-Type: application/json

{
  "amount": 50.00,
  "description": "Payment for service",
  "referenceId": "service-123"
}
```

#### Refund to Wallet
```http
POST /api/members/:id/wallet/refund
Content-Type: application/json

{
  "amount": 25.00,
  "description": "Service refund",
  "referenceId": "service-123"
}
```

#### Get Wallet Transactions
```http
GET /api/members/:id/wallet/transactions?limit=50
```

### **Cart Management**

#### Get Active Cart
```http
GET /api/members/:id/cart
```

#### Add Item to Cart
```http
POST /api/carts/:cartId/items
Content-Type: application/json

{
  "itemType": "service",
  "itemId": "service-123",
  "name": "Oil Change",
  "price": 50.00,
  "quantity": 1
}
```

#### Update Cart Item
```http
PATCH /api/cart-items/:id
Content-Type: application/json

{
  "quantity": 2
}
```

#### Remove Cart Item
```http
DELETE /api/cart-items/:id
```

#### Clear Cart
```http
POST /api/carts/:cartId/clear
```

#### Complete Cart (Checkout)
```http
POST /api/carts/:cartId/complete
```

## 🚀 Quick Start Guide

### **For Members:**

1. **First Time:**
   - Go to `/member-login`
   - Click "Register" tab
   - Fill in your details
   - Create account
   - You'll be automatically logged in

2. **Returning User:**
   - Go to `/member-login`
   - Enter email and password
   - Click "Login"

3. **Using the Portal:**
   - View your profile and stats
   - Browse services
   - Add items to cart
   - Checkout and pay

### **For Admins:**

1. **Login:**
   - Go to `/admin-login`
   - Enter username and password
   - Access dashboard

2. **Manage System:**
   - Use sidebar to navigate
   - Manage members, users, inventory
   - View reports and analytics

## 🔑 Creating Admin User

To create an admin user, you need to:

1. **Hash a password** (using bcrypt):
   ```javascript
   const bcrypt = require('bcryptjs');
   const hashedPassword = await bcrypt.hash('your-password', 10);
   ```

2. **Insert into database:**
   ```sql
   INSERT INTO users (username, password) 
   VALUES ('admin', '$2a$10$hashed_password_here');
   ```

Or create a seed script to automate this.

## 📝 Notes

- **Sessions**: Login creates a session that lasts 7 days
- **Password Security**: All passwords are hashed with bcrypt (10 rounds)
- **Auto-Login**: Registration automatically logs you in
- **Protected Routes**: Some routes may require authentication (to be implemented)

## 🆘 Troubleshooting

### **Can't Login?**
- Check if email/username is correct
- Verify password is correct
- Make sure account exists

### **Registration Fails?**
- Email must be unique
- Password must be at least 6 characters
- All required fields must be filled

### **Session Expired?**
- Logout and login again
- Sessions last 7 days by default

### **Cart Not Working?**
- Make sure you're logged in as a member
- Check if member ID is correct

## 📞 Support

For issues or questions:
- Check the API documentation
- Review the code comments
- Check server logs for errors

