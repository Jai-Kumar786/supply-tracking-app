# Supply Tracking App

A professional, full-stack inventory management system designed for tracking supplies between multiple locations (Shop and Godown). Built with performance, scalability, and user experience in mind.

## 🚀 Features

- **Dual-Location Tracking**: Separate inventory management for 'Shop' and 'Godown' environments.
- **Comprehensive CRUD**: Easily add, edit, and delete inventory items with real-time updates.
- **Smart Transfers**: Atomic transfer system to move stock between Shop and Godown with automatic quantity reconciliation.
- **Summary Dashboard**: High-level overview of inventory metrics, including total value, item counts, and distribution.
- **Premium UI/UX**:
  - Responsive design for Mobile, Tablet, and Desktop.
  - Interactive charts and summary cards.
  - Native Dark Mode support.
  - Smooth transitions and micro-animations.
- **Search & Filter**: Quickly find items by commodity name with real-time search filtering.

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), React, [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

- Node.js (v18 or higher)
- A Neon (PostgreSQL) database instance

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd supply-tracking-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Neon connection string:
```env
DATABASE_URL="postgresql://user:password@hostname/neondb?sslmode=require"
```
*(You can find a template in `.env.example`)*

### 4. Database Initialization
Synchronize your database with the Prisma schema:
```bash
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗 Project Structure

- `/app`: Next.js pages, layouts, and server actions.
- `/components`: Reusable UI components (Modals, Dashboard, Cards, etc.).
- `/prisma`: Database schema and migration files.
- `/lib`: Utility functions and shared library configurations (Prisma client).
- `/context`: React Context for state management (Inventory, Dark Mode).
- `/types`: TypeScript interfaces and type definitions.

## 📄 Database Schema

The core `InventoryItem` model includes:
- `id`: Unique identifier (String)
- `commodityName`: Name of the item (String)
- `quantity`: Current stock level (Int)
- `price`: Unit price of the item (Float)
- `location`: Current location ("shop" or "godown")
- `date`: Entry date (String)
- `createdAt` / `updatedAt`: Timestamps

## 🌐 Deployment

This project is optimized for deployment on **Vercel**. 

1. Connect your repository to Vercel.
2. Add the `DATABASE_URL` environment variable in the Vercel project settings.
3. The build process will automatically run `prisma generate` via the `postinstall` script.

---
*Developed for efficient supply chain and inventory visibility.*
