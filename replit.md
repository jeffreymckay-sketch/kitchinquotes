# Overview

This is a "Quotes from the Kitchin" web application that allows users to view random quotes and submit their own kitchen-themed wisdom. It's a full-stack application built with React frontend and Express backend, featuring a PostgreSQL database for quote storage. The application uses modern UI components from shadcn/ui and provides a clean, interactive interface for quote management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: React Query (@tanstack/react-query) for server state management and data fetching
- **Routing**: Wouter for client-side routing (lightweight React router alternative)
- **Form Handling**: React Hook Form with Zod schema validation using @hookform/resolvers
- **Styling**: Tailwind CSS with custom CSS variables for theming and Inter font family

## Backend Architecture
- **Runtime**: Node.js with TypeScript using tsx for development
- **Framework**: Express.js for REST API endpoints
- **Build Process**: esbuild for production bundling with ESM module format
- **API Design**: RESTful endpoints for quote operations (GET /api/quotes/random, GET /api/quotes, POST /api/quotes)
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Logging**: Custom request logging middleware for API endpoints

## Data Storage
- **Database**: PostgreSQL with Neon Database serverless driver (@neondatabase/serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Validation**: Drizzle-Zod integration for runtime schema validation
- **Fallback Storage**: In-memory storage implementation for development/testing

## Project Structure
- **Monorepo Layout**: Single repository with client/, server/, and shared/ directories
- **Shared Code**: Common TypeScript types and schemas in shared/ directory
- **Asset Management**: Static assets in attached_assets/ directory with Vite alias support
- **Build Output**: Separate dist/ directories for client (dist/public) and server (dist/)

## Development Features
- **Hot Reload**: Vite development server with HMR for frontend
- **TypeScript**: Strict type checking across all project files
- **Code Quality**: Path aliases for clean imports (@/, @shared/, @assets/)
- **Environment**: Environment-specific configurations for development and production

# External Dependencies

## Database Service
- **Neon Database**: PostgreSQL-compatible serverless database platform
- **Connection**: Uses DATABASE_URL environment variable for database connectivity
- **Driver**: @neondatabase/serverless for optimized serverless database access

## UI Component Library
- **shadcn/ui**: Pre-built accessible React components with Tailwind CSS
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Lucide React**: Icon library providing consistent iconography

## Development Tools
- **Replit Integration**: Runtime error overlay and cartographer plugins for Replit environment
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins
- **ESBuild**: Fast JavaScript bundler for production builds

## Utility Libraries
- **date-fns**: Modern date utility library for JavaScript
- **clsx & tailwind-merge**: Utility functions for conditional CSS class names
- **class-variance-authority**: Type-safe variant styling for components
- **nanoid**: URL-safe unique string ID generator