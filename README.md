# Edgewater Backend

This repository contains the backend implementation for a single-page application that interacts with the Coinbase Pro WebSocket API. The backend is developed using Node.js and NestJS, with MongoDB for user data storage and Redis for caching WebSocket data. It provides a robust API and WebSocket gateway to manage user interactions and real-time data updates.

 Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [API Components](#api-components)
- [Testing](#testing)
- [License](#license)

 Features

- WebSocket integration with Coinbase Pro for real-time data updates.
- Support for multiple users with independent subscriptions.
- Authentication and authorization using JWT.
- Redis caching for efficient data handling.
- MongoDB for storing user information.
- Modular and scalable architecture.

 Architecture Overview

- **User Flow**:
  - User Registration and Login using the authentication module.
  - Update pairs to subscribe to desired products.
  - WebSocket connection to Coinbase Pro WebSocket API for real-time data updates.
  - Store WebSocket data in Redis and serve it to users based on their subscriptions.

- **Data Components**:
  - **Redis**: Cache real-time WebSocket data for performance.
  - **MongoDB**: Store user authentication and subscription data.
  - **WebSocket Gateway**: Relay data to users in real-time.

 Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (v5 or later)
- Redis (v6 or later)

 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/edgewater-backend.git
   cd edgewater-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following environment variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/edgewater
   JWT_SECRET=your_jwt_secret
   REDIS_URL=redis://localhost:6379
   COINBASE_API_URL=wss://ws-feed.pro.coinbase.com
   ```

 Usage

# Development Mode

Run the application in development mode with live reload:
```bash
npm run start:dev
```

# Production Mode

Build and start the application:
```bash
npm run build
npm run start:prod
```

 Scripts

- `build`: Compiles the TypeScript files into JavaScript.
- `start`: Starts the application.
- `start:dev`: Starts the application in development mode using Nodemon.
- `lint`: Lints the codebase using ESLint.
- `test`: Runs the unit tests using Jest.
- `test:e2e`: Runs end-to-end tests.

 Project Structure

```plaintext
src/
├── app.module.ts        # Root module
├── auth/                # Authentication module
├── common/              # Shared utilities and filters
├── datahost/            # WebSocket data handling module
├── user/                # User management module
├── websocket/           # WebSocket gateway module
└── main.ts              # Entry point
```

 API Components

# Subscribe/Unsubscribe
- Allows users to subscribe/unsubscribe to products.
- Manages WebSocket subscription and unsubscription messages.

# Price View
- Displays real-time bid and ask updates for subscribed products.
- Data refreshed every 50ms.

# Match View
- Shows trade blotter with timestamp, product, size, and price.
- Differentiates buy and sell trades with green and red text.

# System Status
- Displays all active WebSocket channels.
