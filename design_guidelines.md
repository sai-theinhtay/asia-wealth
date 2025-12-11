# Design Guidelines: Automobile Shop Management System

## Design Approach

**Selected System:** Linear-inspired dashboard design combined with Material Design principles for data-heavy enterprise applications.

**Justification:** This utility-focused business management tool requires efficiency, clear information hierarchy, and professional aesthetics. Linear's clean approach to task management combined with Material Design's robust component library provides the perfect foundation for complex data displays and workflows.

## Core Design Elements

### Typography

**Primary Font:** Inter (Google Fonts)
- Headings: 600 weight, sizes: text-3xl (dashboard titles), text-2xl (page headers), text-xl (section headers)
- Body: 400 weight, text-base for content, text-sm for secondary info, text-xs for labels/metadata
- Data/Numbers: 500 weight (tabular medium) for financial figures and metrics
- Buttons/CTAs: 500 weight, text-sm to text-base

### Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4 to gap-6
- Page margins: Container max-w-7xl with px-6

**Grid Structure:**
- Sidebar navigation: Fixed width 240px (w-60)
- Main content: Flex-grow with responsive padding
- Dashboard cards: 2-column on tablet (md:grid-cols-2), 3-column on desktop (lg:grid-cols-3)
- Data tables: Full-width with horizontal scroll on mobile

### Component Library

**Navigation:**
- Persistent left sidebar with company logo, main modules (Dashboard, Sales, Service, Inventory, Finance, Members), and user profile at bottom
- Top header bar with page title, breadcrumbs, and quick action buttons (+ New Sale, + New Appointment)
- Module icons from Heroicons (outline style)

**Dashboard Cards:**
- Elevated cards with subtle shadow (shadow-sm), rounded corners (rounded-lg)
- Card header with icon, title, and optional action menu
- Stat cards: Large number display with trend indicators (arrows) and percentage change
- Chart cards: Integrated chart.js visualizations for revenue trends, service bookings

**Data Tables:**
- Striped rows for better readability (odd:bg-opacity-50)
- Sticky header row on scroll
- Action column with icon buttons (edit, delete, view details)
- Status badges with rounded-full styling
- Sortable columns with indicator icons
- Pagination controls at bottom

**Forms:**
- Multi-step forms for complex workflows (Add Vehicle, Create Sale, Service Job Card)
- Label above input, helper text below
- Input groups with prefix icons for fields (currency, search)
- Required field indicators (asterisk in label)
- Validation states with inline error messages below inputs

**Modals & Overlays:**
- Slide-over panels for quick edits and details (from right side, w-96 to w-[32rem])
- Centered modals for confirmations and critical actions
- Modal backdrop with backdrop-blur-sm effect

**Status Indicators:**
- Service status: Badges (Pending, In Progress, Completed, Cancelled)
- Stock status: Dot indicators (In Stock, Low Stock, Out of Stock)
- Payment status: Pills (Paid, Pending, Overdue)

**Buttons:**
- Primary: Solid background for main actions
- Secondary: Outline style for secondary actions
- Ghost: Text-only for tertiary actions
- Icon buttons: Circular for compact spaces (w-8 h-8)
- Button groups for related actions

### Animations

**Minimal Motion:**
- Hover state transitions: transition-colors duration-200
- Sidebar collapse/expand: transition-all duration-300
- Modal/drawer entries: slide and fade (no elaborate animations)
- Loading states: Simple spinner or skeleton screens

## Page-Specific Layouts

**Dashboard:**
- 4-stat card grid at top (Revenue, Sales Count, Active Services, Low Stock Alerts)
- Two-column layout below: Revenue chart (left, col-span-2), Recent Activities list (right)
- Quick actions section with large buttons (New Sale, Schedule Service, Add Inventory)

**Sales Module:**
- Vehicle inventory grid with image thumbnails, make/model, price, stock status
- Filter sidebar (collapsible on mobile): Price range, Make, Model, Year, Status
- Sale details form: Customer selection dropdown, vehicle selection, payment terms, trade-in section

**Service Module:**
- Calendar view for appointments (week/month toggle)
- Service job card form: Vehicle selection, customer info, service checklist, parts required, labor hours, mechanic assignment
- Service history table with expandable rows for job details

**Inventory Module:**
- Master-detail layout: Vehicle list (left, w-96), detailed view (right)
- Add vehicle form: Multi-step (Basic Info, Specifications, Pricing, Photos)
- Stock alerts section with low-inventory vehicles highlighted

**Finance Module:**
- Summary cards row: Total Revenue, Expenses, Net Profit, Outstanding Payments
- Tab navigation: Sales Revenue, Service Income, Expenses, Reports
- Filterable transaction table with date range picker
- Export functionality (PDF/Excel buttons)

**Members Module:**
- Customer directory with search and filters
- Customer profile view: Contact details, purchase history table, service history table, notes section
- Quick action buttons: Send Email, Call, Add Note, Schedule Service

## Images

**Placement:**
- Dashboard: No hero image (data-focused)
- Inventory listings: Vehicle thumbnail images (aspect-ratio-4/3, object-cover)
- Vehicle detail view: Image gallery with main large image + thumbnail strip below
- Empty states: Illustrative graphics (from unDraw or similar) for "No vehicles in inventory", "No appointments scheduled"
- Company logo: Header and sidebar (transparent background recommended)

**Image Treatment:**
- Rounded corners: rounded-md for thumbnails, rounded-lg for larger images
- Aspect ratios: Consistent 4:3 for vehicle listings, 16:9 for detail views
- Lazy loading for performance