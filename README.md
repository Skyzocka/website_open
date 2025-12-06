# Startup Website Project

This repository contains the source code for a web platform developed for a startup project. The application handles user registration, authentication, and a contact system for "Idea Givers".

## Context & Backstory

I developed this project as the **Sole Developer / Lead IT** within a three-person startup team. My responsibility covered the entire technical implementation, including:

* Frontend design and templating.
* Backend logic and server configuration.
* Database integration and user management.

**Note:** The startup operation was discontinued a short time after development began. As a result, this repository represents a **prototype state**. Some features may not be fully polished, and the frontend represents the development status at the time the project was halted.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Templating:** EJS (Embedded JavaScript templates)
* **Database:** PostgreSQL (using `pg` client)
* **Authentication:** Bcrypt (for password hashing)
* **Email Services:** Nodemailer (SMTP integration)

## Features implemented

* **User Authentication:** Secure registration and login flow with hashed passwords.
* **Multi-Language Support:** Basic structure for German/English switching.
* **Contact Form:** Form submission handling with email notification integration.
* **Responsive Design:** CSS media queries for desktop and mobile views.
* **Database Connection:** Integration with a local PostgreSQL database to store user data.

## Getting Started

To run this project locally, you need Node.js and a PostgreSQL instance installed.

### Installation

1. Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd <repository-name>
npm install
```

2. Database Setup
Ensure you have a PostgreSQL database running. The application expects a database named login_information_db (or similar, check src/app.js configuration).

3. Configuration
Note: For security reasons, sensitive credentials (SMTP, DB passwords) have been removed or redacted in this repository. You will need to configure your own environment variables or update the config in src/app.js.

4. Run the Server
```bash
node src/app.js
```
The server usually starts on port 4000. Visit http://localhost:4000 in your browser.
