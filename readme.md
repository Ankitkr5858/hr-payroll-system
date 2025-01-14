# Kelick HR Platform

A modern HR platform built with React, Vite, and Supabase, featuring employee management, payroll processing, and CPF calculations for Singapore-based companies.

## Features

- 👥 **Employee Management**
  - Bulk employee upload via Excel/CSV
  - Employee profile management
  - Status tracking (Active, Invite Sent, Payroll Only)
  - Employment type categorization

- 💰 **Payroll System**
  - Singapore CPF calculations
  - Support for different age groups and employment types
  - Batch processing capabilities
  - Additional payments and deductions handling

- 📊 **Analytics & Reporting**
  - Employee statistics dashboard
  - Nationality distribution tracking
  - Employment type breakdown
  - Status monitoring

- 🔒 **Security**
  - Row Level Security (RLS)
  - Role-based access control
  - Secure authentication
  - Data validation

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Handling**: XLSX
- **UI Components**: Radix UI
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kelick-hr-platform.git
   cd kelick-hr-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Create a new Supabase project
2. Run the migrations from `supabase/migrations/`
3. Enable Row Level Security (RLS)
4. Configure authentication settings

## Project Structure

```
kelick-hr-platform/
├── src/
│   ├── components/         # React components
│   │   ├── employee-upload/# Employee upload components
│   │   └── ui/            # Shared UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and services
│   │   └── payroll/       # Payroll processing logic
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main application component
├── docs/                  # Documentation
├── supabase/             # Supabase configuration and migrations
└── public/               # Static assets
```

## Documentation

- [Deployment Strategy](docs/DEPLOYMENT.md)
- [Payroll System](docs/PAYROLL_SYSTEM.md)

## Features in Detail

### Employee Management

- **Bulk Upload**: Upload multiple employees via Excel/CSV
- **Data Validation**: Comprehensive validation of employee data
- **Status Tracking**: Monitor employee status changes
- **Profile Management**: Update employee information

### Payroll Processing

- **CPF Calculations**: Accurate Singapore CPF calculations
- **Batch Processing**: Efficient handling of multiple payroll records
- **Additional Payments**: Support for bonuses and allowances
- **Deductions**: Handle various types of deductions

### Analytics

- **Employee Statistics**: Visual representation of employee data
- **Distribution Analysis**: Track nationality and employment type distribution
- **Status Overview**: Monitor employee status changes
- **Export Capabilities**: Export data to Excel for further analysis

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.io/) for the backend infrastructure
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations