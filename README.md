# Containerizing a Web Application with Docker and Docker Compose

This project demonstrates how to containerize a web application using Docker and Docker Compose. 

**The application consists of three main components:**

**Client:** A Svelte-based front-end application served using Nginx.

**Server:** A Node.js back-end application.

**Database:** A MongoDB database.

## Project Structure
```
├── docker-compose.yml
├── client
│   ├── Dockerfile.alpine
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   └── ...
└── server
    ├── Dockerfile.alpine
    ├── package.json
    ├── package-lock.json
    ├── .env
    ├── src/
    └── ...
```

## Running the Application

Ensure you have the following installed:

- Docker
- Docker Compose: Comes pre-installed with Docker Desktop.

### Steps to Run

1. Clone the Repository:
```
git clone https://github.com/simonakardel/Pawgress.git
cd pawgress
```

2. Set up Environment Variables:
- Create a .env file in the server directory and add the following environment variables:

```
DATABASE_URL=your_mongodb_url
ACCESS_TOKEN_SECRET=your_access_token
REFRESH_TOKEN_SECRET=your_refresh_token
MAIL_USER=your_mail
MAIL_PASSWORD=your_mail_password
APP_PASSWORD=your_app_password
```

### Build and Start the Containers:

In the project root directory, run:
```
docker compose up --build
```

This command will:

- Build Docker images for the client and server.
- Pull the MongoDB image for the database.
- Start all containers as defined in docker-compose.yml.


### Access the Application:

Open your browser and navigate to:

```
http://localhost:3000
```

This will display the Svelte front-end application.

### Stopping the Application:

To stop and remove the containers, networks, and volumes, run:

```
docker compose down
```

## Docker Setup and Configuration

**Docker Compose File:**
The docker-compose.yml file defines three services: client, server, and database.

### Services:

- **client:**
Builds from `client/Dockerfile.alpine`.
Exposes port 80 inside the container, mapped to 3000 on the host.
- **server:**
Builds from `server/Dockerfile.alpine`.
Exposes port 8080.
Depends on the database service.
- **database:**
Uses the `mongo:5.0 image`.
Stores data in a Docker volume `mongo_data`.


### Volumes:

- **mongo_data:**
Ensures MongoDB data persists across container restarts.

### Networks:

- **default:**
Allows external communication for the client and server.
- **db-internal-network:**
An internal network for secure communication between the server and database.
Defined with `internal: true` to restrict external access.

### Resource Limits
Defined under deploy in docker-compose.yml for each service:

```
client:
CPU: Limited to 0.25 (25% of a CPU core).
Memory: Limited to 256M.
server:
CPU: Limited to 0.50 (50% of a CPU core).
Memory: Limited to 512M.
database:
CPU: Limited to 0.50.
Memory: Limited to 512M.
```
#### Benefits:

- Prevents any single service from consuming excessive resources.
- Ensures smoother operation and scalability.