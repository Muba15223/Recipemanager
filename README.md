# Recipe Manager

A full-stack application designed to help you organize, store, and discover your favorite recipes. Whether you're a seasoned chef or just starting out, Recipe Manager makes it easy to keep track of your culinary creations.

## Features

* **Recipe Storage:** Easily add, edit, and delete your recipes.
* **Search & Filter:** Quickly find recipes by name, ingredients, or categories.
* **User-Friendly Interface:** An intuitive and responsive design for a seamless experience.
* **Ingredient Management:** Track ingredients and manage shopping lists (add if applicable).
* **Deployment Ready:** Hosted on Render for easy access.

---

## Project Showcase

Here are some glimpses of the Recipe Manager in action:

---

### Recipe List View

![Recipe List View](public/1.png)
_Easily browse through your stored recipes, with quick access to details and editing options._

---

### Add New Recipe Form

![Add New Recipe Form](public/2.png)
_A simple and guided form to add new culinary creations, including ingredients, instructions, and an image upload._

---

### Recipe Detail View

![Recipe Detail View](public/3.png)
_View all the details of a specific recipe, including ingredients, step-by-step instructions, and a larger image._

---

## Live Demo

You can access the live version of Recipe Manager here:
**[https://recipemanager-frontend.onrender.com](https://recipemanager-frontend.onrender.com)**

---

## 🛠️ Technologies Used

* **Frontend:** React, Vite, Bootstrap, HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcrypt
* **Image Upload:** Multer, Cloudinary
* **Deployment:** Render

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (includes npm)
* [MongoDB](https://www.mongodb.com/try/download/community) (for local database setup, or use a cloud-hosted MongoDB service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/Anwarsha7/Recipemanager.git](https://github.com/Anwarsha7/Recipemanager.git)
    cd Recipemanager
    ```

2.  **Frontend Setup:**
    Navigate to the `frontend` directory and install dependencies.

    ```bash
    cd frontend
    npm install
    ```

3.  **Backend Setup:**
    Navigate to the `backend` directory and install dependencies.

    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory with your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`). Refer to the backend's `config` or `example.env` file for required variables.

---

## Running Locally

To run the application on your local machine, you'll need to start both the frontend and backend servers.

#### Important Note for Frontend Development:

**Before trying to run the frontend locally, remember to change the API endpoint from `https://recipemanager-ma43.onrender.com` to `http://localhost:3000` (or whatever port your backend runs on locally, if different from 3000).** This change is typically made in your frontend's environment configuration file or a constant file (e.g., `.env`, `config.js`, `constants.js`).

1.  **Start the Backend Server:**
    Navigate to your `backend` directory and start the server.

    ```bash
    cd backend
    npm start
    ```
    Your backend should now be running, likely on `http://localhost:3000`.

2.  **Start the Frontend Server:**
    Navigate to your `frontend` directory and start the development server.

    ```bash
    cd frontend
    npm run dev # Or npm start, depending on your Vite setup
    ```
    This will usually open the application in your web browser at `http://localhost:5173` (or another port like 3001, depending on your frontend framework).

---

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

Anwarsha - [ynetflix894@gmail.com](mailto:ynetflix894@gmail.com) | [www.linkedin.com/in/anwarsha-k-s-b1a540231](https://www.linkedin.com/in/anwarsha-k-s-b1a540231)

Project Link: [https://github.com/Anwarsha7/Recipemanager](https://github.com/Anwarsha7/Recipemanager)
