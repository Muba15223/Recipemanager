# RecipeManager 🍽️

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

Welcome to RecipeManager, a full-stack MERN application designed for cooking enthusiasts. This platform allows users to create, organize, view, and discover their favorite recipes. With secure JWT authentication, you can manage your recipes safely and efficiently.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Release Information](#release-information)
- [Contact](#contact)

## Features 🌟

- **User Authentication**: Secure login and registration using JWT.
- **Recipe Management**: Create, update, delete, and view recipes.
- **Search Functionality**: Easily discover new recipes.
- **Organize Recipes**: Categorize recipes for easy access.
- **Responsive Design**: Works well on both desktop and mobile devices.

## Technologies Used 🛠️

- **MongoDB**: NoSQL database for storing recipe data.
- **Express.js**: Web framework for Node.js to handle server-side logic.
- **React**: Front-end library for building user interfaces.
- **Node.js**: JavaScript runtime for server-side programming.
- **JWT**: JSON Web Tokens for secure authentication.

## Getting Started 🚀

To set up RecipeManager locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Muba15223/Recipemanager.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd Recipemanager
   ```

3. **Install dependencies**:
   - For the server:
     ```bash
     cd server
     npm install
     ```
   - For the client:
     ```bash
     cd ../client
     npm install
     ```

4. **Set up environment variables**:
   Create a `.env` file in the server directory and add your MongoDB connection string and JWT secret.

5. **Run the application**:
   - Start the server:
     ```bash
     cd server
     npm start
     ```
   - Start the client:
     ```bash
     cd ../client
     npm start
     ```

Now, you can access the application at `http://localhost:3000`.

## Usage 📖

Once you have the application running, you can:

1. **Register a new account** or **log in** to an existing account.
2. **Create a new recipe** by filling out the form with ingredients, instructions, and categories.
3. **View your recipes** in a list format.
4. **Search for recipes** using keywords.
5. **Edit or delete recipes** as needed.

## API Endpoints 🔗

### Authentication

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in an existing user.

### Recipes

- **GET /api/recipes**: Get all recipes.
- **GET /api/recipes/:id**: Get a recipe by ID.
- **POST /api/recipes**: Create a new recipe.
- **PUT /api/recipes/:id**: Update a recipe by ID.
- **DELETE /api/recipes/:id**: Delete a recipe by ID.

## Contributing 🤝

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Release Information 📦

For the latest releases, visit the [Releases section](https://github.com/Muba15223/Recipemanager/releases). Here, you can download and execute the latest version of RecipeManager.

## Contact 📬

For questions or suggestions, feel free to reach out:

- **Email**: your-email@example.com
- **GitHub**: [Muba15223](https://github.com/Muba15223)

Thank you for checking out RecipeManager! We hope you enjoy creating and discovering delicious recipes.