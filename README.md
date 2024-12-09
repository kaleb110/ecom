## 🛒 Ecom/FetanGebeya - an E-Commerce Web App

![E-Commerce Web App](https://i.postimg.cc/R0DN2nPH/ecom.png)

Ecom is An elegant and performant full-stack e-commerce platform built to showcase modern web technologies and provide a seamless shopping experience with ease and simplicity. 🚀

## 🌟 Features

- **Frontend**: Built with [Next.js](https://nextjs.org/) for server-side rendering and fast client-side navigation.
- **Styling**: Beautiful and responsive design using [Tailwind CSS](https://tailwindcss.com/).
- **Backend**: API server powered by [Express.js](https://expressjs.com/) for a robust and scalable backend.
- **Database**: Data stored in a [PostgreSQL](https://www.postgresql.org/) database using [Prisma ORM](https://www.prisma.io/) for type-safe database queries.
- **Authentication**: Secure and hassle-free user management with [Clerk](https://clerk.dev/).
- **Payments**: Stripe integration for handling payments securely.
- **Image Uploads**: Effortless image hosting powered by [UploadThing](https://uploadthing.com/).
- **Hosting**: 
  - Frontend hosted on [Vercel](https://vercel.com/).
  - Backend hosted on [Render](https://render.com/).
  - Database hosted on [Neon](https://neon.tech/).

## 🛠️ Technologies Used

| Technology        | Purpose                          |
|--------------------|----------------------------------|
| Next.js           | Frontend framework              |
| TypeScript        | Type-safe development           |
| Tailwind CSS      | Styling                         |
| Express.js        | Backend framework               |
| PostgreSQL        | Relational database             |
| Prisma ORM        | Database ORM                    |
| Clerk             | Authentication                  |
| Stripe            | Payment processing              |
| UploadThing       | Image upload service            |
| Vercel            | Frontend hosting                |
| Render            | Backend hosting                 |
| Neon              | Database hosting                |

## 🚀 Getting Started

Follow these steps to set up the project locally:

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [PostgreSQL](https://www.postgresql.org/) database set up
- API keys and credentials for Clerk, UploadThing, Neon, etc.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kaleb110/ecom.git
   cd ecom

2. Install dependencies for both frontend and backend:
   ```bash
   cd ./frontend
   npm install
   cd ./backend
   npm install
   ```

3. Set up environment variables:
   - **Frontend**: Create a `.env.local` file in the `frontend` directory with:
     ```env
     NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-api-key>
     UPLOADTHING_TOKEN=<your-uploadthing-token>
     ```
   - **Backend**: Create a `.env` file in the `backend` directory with:
     ```env
     DATABASE_URL=<your-neon-database-url>
     PORT=<5000 or any other port>
     CLERK_API_KEY=<your-clerk-api-key>
     CLERK_SECRET_KEY=<your-clerk-secret-key>
     CLIENT_URL=<your-front-end-url(http://localhost:3000)>
     SECRET_KEY=<your-stripe-secret-key>
     ```

4. Start the development servers:
   - **Frontend**:
     ```bash
     cd frontend
     npm run dev
     ```
   - **Backend**:
     ```bash
     cd backend
     npm run dev
     ```

5. Access the app:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🏗️ Project Structure

```
.
├── frontend/        # Next.js frontend
│   ├── components/  # Reusable UI components
│   ├── app/         # Next.js routes or pages
│   ├── types/       # typescript declarations
│   └── ...          # Other frontend files
├── backend/         # Express.js backend
│   ├── src/         # API endpoints
│   ├── prisma/      # Prisma schema and migrations
│   └── ...          # Other backend files
└── README.md        # Project documentation
```

## 🌍 Deployment

### Frontend
Deployed on [Vercel](https://vercel.com/):
- Push to the main branch to trigger auto-deployment.

### Backend
Hosted on [Render](https://render.com/):
- Configure the backend service and deploy the repository.

### Database
Hosted on [Neon](https://neon.tech/):
- Ensure your database is connected and running.

## 🌐 Live Demo

Check out the live demo of the ecommerce App [here](https://ecom-steel-rho.vercel.app/).

## 🤝 Contributing

Contributions are welcome! Here's how you can help:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature description"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## 📧 Contact

If you have any questions, feel free to reach out:

- **Your Name**: [kalisha123k.com](mailto:kalisha123k@gmail.com)
- [GitHub Issues](https://github.com/kaleb110/ecom/issues)

---

Made with ❤️ using modern web technologies.
