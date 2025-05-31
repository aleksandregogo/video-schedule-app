# Dynamic Content & Campaign Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Replace with your actual license if different -->
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

Full-stack application designed for managing and displaying dynamic content on screens, potentially for advertising campaigns or informational displays. It features a web interface for administration and a robust backend system that communicates with remote display units.

## ✨ Key Features

*   **User & Company Accounts:** Supports different user roles (individuals and companies) with distinct functionalities.
*   **Campaign Management:** Allows users to create, manage, and track advertising or content campaigns.
*   **Screen Management:** Interface for managing display screens.
*   **Content Scheduling & Display:** Backend logic for scheduling and distributing content to remote "boxes" (TCP clients).
*   **Real-time Communication:** Utilizes TCP/IP (likely with WebSockets over TLS for a scheduler component) for communication with display units.
*   **Role-Based Views:** Tailored UI for regular users (campaigns) and company users (reviews).

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS
*   **Backend:** NestJS (Node.js framework), TypeScript
*   **Database:** PostgreSQL
*   **TCP Client:** TypeScript, Node.js, Protocol Buffers (for communication with display units)
*   **Containerization:** Docker, Docker Compose

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Docker](https://www.docker.com/get-started)
*   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd video-schedule-app
    ```

2.  **Set up Environment Variables:**
    The application uses environment variables for configuration. You'll primarily configure these in the `docker-compose.yml` file or by creating `.env` files within the `Back` and `Front` directories if preferred (though `docker-compose.yml` often centralizes this for development).

    **Key variables in `docker-compose.yml`:**

    *   **Backend Service (`backend`):**
        *   `DATABASE_HOST`: `db`
        *   `DATABASE_PORT`: `5432`
        *   `DATABASE_USER`: (e.g., `kukumala`)
        *   `DATABASE_PASSWORD`: (e.g., `abduljabarkhani`)
        *   `DATABASE_NAME`: (e.g., `db`)
        *   `TCP_HOST`: `0.0.0.0`
        *   `TCP_PORT`: `3033`
    *   **Frontend Service (`frontend`):**
        *   `VITE_APP_DOMAIN`: `http://localhost:5000/api/v1` (Backend API URL)

3.  **Build and Run with Docker Compose:**
    You can use the provided shell script or run Docker Compose directly:
    ```bash
    ./start.sh
    ```
    Or:
    ```bash
    docker-compose up -d --build
    ```

4.  **Access the application:**
    *   Frontend: `http://localhost:3000`
    *   Backend API: `http://localhost:5000`
