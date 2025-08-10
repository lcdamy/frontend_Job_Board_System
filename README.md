# JOB BOARDING SYSTEM

## 🧾 Description

This is a client-side application for the Job Boarding System, built with Next.js. You can run the frontend locally by following the setup instructions below. Clone the repo, set up your environment, and get started!

## 🔗 Live Preview

You can view a live version of this frontend (if deployed) at:  
👉 [https://frontend-job-boarding-system.netlify.app](https://frontend-job-boarding-system.netlify.app)

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

## ✅ Prerequisite installation

- Node.js v18.18.0

## 🛠 Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/lcdamy/frontend_Job_Board_System.git
    cd frontend_job_board_system
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

## 🏃‍♂️ Running in Development

To start the server in development mode, follow these steps:

1. Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

2. Start the server:

    ```bash
    npm run dev
    ```

## 🏗️ Building for Production

To build the project for production, run:
```bash
npm run build
```

> **Note:** The built files will be in the `.next` directory.

## 📁 Folder Structure

```
frontend_job_board_system/
├── public/                     # Static assets (images, fonts, etc.)
├── src/
│   ├── app/                    # Application routing and authentication API
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks (e.g., API calls)
│   ├── lib/                    # Constants, types, utility functions, and validation
│   └── store/                  # Zustand state management store
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Project metadata and dependencies
└── README.md
```

## 👥 Contributors

- [lcdamy](https://www.linkedin.com/in/pierre-damien-murindangabo-cyuzuzo-709b53151/)