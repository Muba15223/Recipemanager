# Recipe Manager

A full-stack application designed to help you organize, store, and discover your favorite recipes. Whether you're a seasoned chef or just starting out, Recipe Manager makes it easy to keep track of your culinary creations.

## Features

* **Recipe Storage:** Easily add, edit, and delete your recipes.
* **Search & Filter:** Quickly find recipes by name, ingredients, or categories.
* **User-Friendly Interface:** An intuitive and responsive design for a seamless experience.
* **Ingredient Management:** (Add if applicable, e.g., track ingredients, shopping lists)
* **Deployment Ready:** Hosted on Render for easy access.

## Live Demo

You can access the live version of Recipe Manager here:
**[https://recipemanager-frontend.onrender.com](https://recipemanager-frontend.onrender.com)**

## 🛠️ Technologies Used

* **Frontend:** React, Vite, Bootstrap, HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcrypt
* **Image Upload:** Multer, Cloudinary
* **Deployment:** Render

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (if your frontend/backend uses it)
* [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
* [Specific backend runtime/framework dependencies, e.g., Python, Java JDK, etc.]
* [Database setup if running locally, e.g., MongoDB, PostgreSQL]

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Anwarsha7/Recipemanager.git](https://github.com/Anwarsha7/Recipemanager.git)
    cd Recipemanager
    ```

2.  **Frontend Setup:**
    Navigate to your frontend directory (e.g., `cd frontend` or `cd client` if it's in a subfolder) and install dependencies.
    ```bash
    # Example for React/Node.js frontend
    cd frontend # Adjust this path if your frontend is in a different folder
    npm install # or yarn install
    ```

3.  **Backend Setup:**
    Navigate to your backend directory (e.g., `cd backend` or `cd server` if it's in a subfolder) and install dependencies.
    ```bash
    # Example for Node.js backend
    cd backend # Adjust this path if your backend is in a different folder
    npm install # or yarn install
    ```
    Configure your environment variables (e.g., database connection strings, API keys) if necessary. You might need a `.env` file based on your backend setup.

### Running Locally

To run the application on your local machine, you'll need to start both the frontend and backend servers.

#### Important Note for Frontend Development:

**Before trying to run the frontend locally, remember to change the API endpoint from `https://recipemanager-ma43.onrender.com` to `http://localhost:3000` (or whatever port your backend runs on locally, if different from 3000).** This change is typically made in your frontend's environment configuration file or a constant file (e.g., `.env`, `config.js`, `constants.js`).

1.  **Start the Backend Server:**
    Navigate to your backend directory and start the server.
    ```bash
    cd backend # or wherever your backend is
    npm start # or node server.js, python app.py, etc.
    ```
    Your backend should now be running, likely on `http://localhost:3000` (or another port specified in your backend configuration).

2.  **Start the Frontend Server:**
    Navigate to your frontend directory and start the development server.
    ```bash
    cd frontend # or wherever your frontend is
    npm start # or yarn start
    ```
    This will usually open the application in your web browser at `http://localhost:3000` (or another port like 3001, depending on your frontend framework).

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

Anwarsha - [ynetflix894@gmail.com/www.linkedin.com/in/anwarsha-k-s-b1a540231]

Project Link: [https://github.com/Anwarsha7/Recipemanager](https://github.com/Anwarsha7/Recipemanager)
