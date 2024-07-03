# Pawgress

Pawgress is a dog training tracking application built with Node.js and Svelte. It enables users to track their progress in training their dogs. The application was developed as the final exam project for a full-stack JavaScript class.

## Requirements

The project had the following requirements:

1. **Develoment Stack**: Utilize Svelte for the front end and Node.js for the back end.
2. **Database**: Integrate a database for data storage and management.
3. **Email Functionality**: Send out emails using Nodemailer (e.g., during sign up, forgot password, or contact us scenarios).
4. **Notifications**: Implement at least one notification using libraries like toastr or svelte-french-toast.
5. **Authentication**: Implement secure authentication using Bcrypt, Passport.js, Google SSO, OAuth, or Firebase Authenticate.
6. **Authorization**: Implement authorization, using sessions or JWT for backend security.
7. **Protected Routes**: Ensure protected front-end routes, using libraries like svelte-navigator to prevent unauthorized access.

## Features

To fulfill the requirements I developed the following features:

- **Custom Authentication and Authorization**: 
  - **Backend**: Implemented using Bcrypt for hashing passwords, JWT for session management, and Express for routing.
  - **Frontend**: Developed login and sign-out components using Svelte, with route protection handled by svelte-navigator.
  - **Packages Used**: `bcrypt`, `jsonwebtoken`, `express`, `express-validator`, `svelte-navigator`.

- **Data Storage**: 
  - Utilized MongoDB for data storage, with Mongoose for object data modeling and interaction with the database.
  - **Packages Used**: `mongodb`, `mongoose`.

- **Interactive UI**: 
  - Built with Svelte, providing a dynamic, responsive, and engaging user interface.
  - **Packages Used**: `svelte`, `vite` for development.

- **Real-Time Notifications**: 
  - Utilizes Socket.IO to deliver immediate updates and notifications, informing users in real-time.
  - **Packages Used**: `socket.io`, `socket.io-client`.

- **Email Functionality**:
  - Developed a feature that allows users to contact the support team directly through the application. This functionality utilizes Nodemailer to handle the sending of these emails.
  - **Packages Used**: `nodemailer`.

- **Notifications**: 
  - Implemented using toastr for user notifications.
  - **Packages Used**: `toastr`.

## Installation

To get Pawgress running locally, follow these steps:

```bash
git clone https://github.com/simonakardel/pawgress
cd pawgress
```
### Install dependencies

Navigate to both the `client` and `server` directories to install dependencies.

```bash
cd server
npm install

cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory and add the following environment variables:

```bash
DATABASE_URL=your_mongodb_url
ACCESS_TOKEN_SECRET=your_access_token
REFRESH_TOKEN_SECRET=your_refresh_token
MAIL_USER=your_mail
MAIL_PASSWORD=your_mail_password
APP_PASSWORD=your_app_password
```

## Start the application

To run the server and client locally:

```bash
# Start the server
cd server
nodemon app.js

# Start the client
cd ../client
npm run dev
```
## Usage

After setting up the project, you can access the application through the web browser at your configured port. Log in or register to start using the app.

## Dependencies

### Server Dependencies

- bcrypt
- cookie-parser
- cors
- dotenv
- express
- express-validator
- helmet
- jsonwebtoken
- mongodb
- mongoose
- morgan
- nodemailer
- socket.io

### Client Dependencies

- @fortawesome/fontawesome-free
- axios
- socket.io-client
- svelte
- svelte-fa
- svelte-navigator
- toastr
- vite
