# Drive Slideshow

A multi-tier web application to create beautiful slideshows from your Google Drive photos.

## Features

- **Multi-account Connectivity**: Connect multiple Google Drive accounts.
- **Folder Selection**: Easily browse and select one or more folders containing your images.
- **Stunning Transitions**: Choose from a variety of slideshow transition effects like Fade, Slide, Cube, Flip, and Zoom.
- **Background Music**: Enjoy a soothing background track while viewing your slideshow, with the option to toggle it on or off.
- **Cartoonish & Friendly UI**: A clean, modern, and self-explanatory interface built with React, TailwindCSS, and shadcn/ui.
- **How-to Guide**: An illustrated guide to get you started in no time.

## Project Structure

This project is a monorepo with two main packages:

- `api/`: A Node.js/Express backend that handles Google OAuth2 authentication and proxies requests to the Google Drive API.
- `ui/`: A React frontend built with Vite that provides the user interface for connecting accounts, selecting folders, and viewing slideshows.

---

## Setup & Installation

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Google Cloud Platform project with OAuth 2.0 credentials (Client ID and Client Secret).

### Configuration

1.  **Google Cloud Console Setup**:
    -   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    -   Create a new project.
    -   Go to "APIs & Services" > "Enabled APIs & Services" and enable the "Google Drive API".
    -   Go to "APIs & Services" > "Credentials".
    -   Create an "OAuth 2.0 Client ID".
    -   Select "Web application" as the application type.
    -   Add `http://localhost:3001/auth/google/callback` to the "Authorized redirect URIs".
    -   Copy the "Client ID" and "Client Secret".

2.  **Environment Variables**:
    -   Navigate to the `api/` directory and create a `.env` file from `.env.example`.
    -   Fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and a `SESSION_SECRET` (a random string).
    -   Navigate to the `ui/` directory and create a `.env` file from `.env.example`.
    -   Set `VITE_API_BASE_URL` to your API's address (e.g., `http://localhost:3001`).

### Running the Application

1.  **Start the API (Backend)**:
    ```bash
    cd api
    npm install
    npm run dev
    ```
    The API will be running on `http://localhost:3001` (or the port you specified).

2.  **Start the UI (Frontend)**:
    ```bash
    cd ui
    npm install
    npm run dev
    ```
    The UI will be running on `http://localhost:5173` (or the default Vite port). Open this URL in your browser.

---

## Tech Stack

### Backend (API)
- Node.js
- Express
- TypeScript
- Google APIs Node.js Client (`googleapis`)
- `express-session` for session management

### Frontend (UI)
- React
- Vite
- TypeScript
- TailwindCSS
- shadcn/ui
- Swiper.js
- Lucide React (for icons)
