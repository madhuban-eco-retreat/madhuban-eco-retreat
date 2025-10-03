# Madhuban Eco Retreat Website

# JHTC6NRN8H9SLZ1GH5XMJZB9

A visually stunning, SEO-optimized, and mobile-first website for Madhuban Eco Retreat — an eco-luxury resort nestled near Ratapani Wildlife Sanctuary in Bhopal, India.

## Project Structure

The project consists of two main parts:

1. **Frontend**: React.js with Tailwind CSS
2. **Backend**: Django with Django REST Framework

## Frontend Features

- Responsive, mobile-first design
- Nature-inspired visual theme using forest greens, earthy browns, and stone grays
- Seamless booking experience with real-time availability checking
- Interactive gallery and experience showcase
- Blog section with eco-travel tips, sustainable living guides, and wildlife information
- Integration with WhatsApp Business API for customer support

## Backend Features

- RESTful API with Django REST Framework
- JWT-based authentication
- Custom user model with extended profile information
- Comprehensive booking system with real-time availability checking
- Content management system for accommodations, experiences, and blog posts
- Admin dashboard for managing bookings, content, and user accounts

## Key Components

### Accommodations

- Cottages, luxury tents, and treehouses
- Detailed information with amenities, pricing, and availability
- High-quality images and virtual tours

### Experiences

- Nature trails, organic farming, bird watching, local culture tours, yoga and meditation
- Booking system for experiences
- Facilitator profiles and reviews

### Booking Engine

- Real-time availability calendar
- Secure payment processing with Razorpay
- Guest information collection
- Add-on selection for experiences and services

### Sustainability Showcase

- Eco initiatives, water & waste management, carbon footprint reduction
- Educational content about sustainable tourism

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Formik for form handling
- Framer Motion for animations

### Backend

- Django
- Django REST Framework
- MySQL database
- JWT authentication
- Cloudinary for media storage

### DevOps

- Git for version control
- Digital Ocean for hosting
- Cloudflare for CDN and caching

## Setup Instructions

### Frontend Setup

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with necessary environment variables
5. Start the development server:
   ```
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Set up environment variables
5. Run migrations:
   ```
   python manage.py migrate
   ```
6. Create a superuser:
   ```
   python manage.py createsuperuser
   ```
7. Start the development server:
   ```
   python manage.py runserver
   ```

## API Documentation

The API documentation is available at `/api/docs/` when the server is running.

## Deployment

Instructions for deploying to production environment:

1. Set up a DigitalOcean droplet
2. Configure Nginx as a reverse proxy
3. Set up SSL with Let's Encrypt
4. Configure MySQL database
5. Deploy the Django application with Gunicorn
6. Deploy the React application
7. Set up Cloudflare for CDN and caching

## License

This project is proprietary and not open for redistribution or use without explicit permission.

## Contact

For inquiries, please contact info@madhubanecoretreat.com
