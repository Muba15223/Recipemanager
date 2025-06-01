import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

function Update() {
  const [formdata, setFormData] = useState({
    name: "",
    ingredients: "",
    timeToCook: "",
    steps: "",
    image: null,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/recipes/${id}`);
        const { name, ingredients, timeToCook, steps, image } = response.data;
        setFormData({
          name,
          ingredients: ingredients.join(', '),
          timeToCook,
          steps: steps.join('. '),
          image: image || null,
        });
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You need to log in first", {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
      });
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const formattedData = new FormData();
    formattedData.append("name", formdata.name);
    formattedData.append("ingredients", formdata.ingredients);
    formattedData.append("timeToCook", formdata.timeToCook);
    formattedData.append("steps", formdata.steps);

    if (formdata.image instanceof File) {
      formattedData.append("image", formdata.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/recipes/${id}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Recipe Updated Successfully", {
          position: toast.POSITION.TOP_CENTER,
          theme: 'colored',
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Error, data is not valid", {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
      });
    }
  };

  const { name, ingredients, timeToCook, steps } = formdata;

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: '#f0f4f8' }} // soft background color
      >
        <div className="card shadow p-4" style={{ maxWidth: '600px', width: '100%', borderRadius: '12px' }}>
          <h2 className="card-title text-center mb-4"><u>Update Recipe</u></h2>
          <div className="card-body">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group mb-3">
                <label htmlFor="name">Recipe Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={name}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="ingredients">Ingredients (comma-separated):</label>
                <input
                  type="text"
                  id="ingredients"
                  name="ingredients"
                  className="form-control"
                  value={ingredients}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="timeToCook">Time to Cook:</label>
                <input
                  type="text"
                  id="timeToCook"
                  name="timeToCook"
                  className="form-control"
                  value={timeToCook}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="steps">Steps (separate by full stops '.')</label>
                <textarea
                  id="steps"
                  name="steps"
                  className="form-control"
                  rows="4"
                  value={steps}
                  onChange={handleInput}
                  required
                ></textarea>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="image">Upload New Recipe Image (optional):</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="form-control"
                  onChange={handleFileChange}
                />
                {typeof formdata.image === "string" && (
                  <img
                    src={formdata.image}
                    alt="Current Recipe"
                    className="mt-3"
                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                  />
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Update;
