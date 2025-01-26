# Indian Accounting Software - Frontend

A modern Next.js frontend for managing business accounting, featuring a clean Material-UI design and responsive layout.

## Features

- 🎨 Modern Material-UI Design
- 📊 Dashboard Overview
- 👥 Client Management
- 📦 Inventory Management
- 📄 Invoice Generation
- 📱 Responsive Layout
- 🔄 Real-time Form Validation
- 🌙 Light/Dark Mode Support

## Tech Stack

- Next.js 14
- TypeScript
- Material-UI (MUI)
- Axios for API calls
- React Hook Form
- Emotion for styling

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/indian-accounting-frontend.git
cd indian-accounting-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit the `.env.local` file with your configuration.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name
- See `.env.example` for all available options

## Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Pages and Features

### Dashboard
- Overview of business metrics
- Recent invoices
- Quick statistics

### Business Settings
- Company details management
- Logo upload
- Address and contact information
- Bank details
- Terms and conditions

### Clients
- Client list with search and filter
- Add/Edit client details
- View client history
- GSTIN validation

### Inventory
- Product catalog
- Stock management
- HSN code support
- Unit and price management

### Invoices
- Create new invoices
- PDF generation
- Tax calculations
- Item selection from inventory
- Client selection

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
├── lib/             # Utilities and helpers
├── services/        # API services
└── types/           # TypeScript definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 