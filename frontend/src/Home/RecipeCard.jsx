import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function RecipeCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`https://recipemanager-ma43.onrender.com/recipes/${id}`);
        const recipeData = data.data || data;
        
        if (!recipeData) throw new Error("Recipe not found");

        setRecipe({
          ...recipeData,
          image: recipeData.image?.includes('res.cloudinary.com') 
            ? recipeData.image 
            : recipeData.image 
              ? `https://recipemanager-ma43.onrender.com/${recipeData.image}`
              : null
        });
      } catch (err) {
        console.error("Error fetching recipe details", err);
        setError(err.response?.data?.message || err.message || "Error loading recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-50">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="ms-3">Loading recipe details...</span>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger mx-auto mt-5 animate__animated animate__fadeIn" style={{ maxWidth: "600px" }}>
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      {error}
      <div className="mt-3">
        <button 
          className="btn btn-primary hover-scale" 
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (!recipe) return null;

  return (
    <section className="py-5 animate__animated animate__fadeIn" style={{ background: "linear-gradient(135deg, #f9f9ff 0%, #f0f4ff 100%)" }}>
      <div className="container">
        <div className="row gx-5">
          {/* Recipe Image with Loading Effect */}
          <aside className="col-lg-6">
            <div className="border rounded-4 mb-3 d-flex justify-content-center overflow-hidden hover-scale">
              <img
                className={`img-fluid rounded transition-all ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "70vh", 
                  objectFit: "cover",
                  transition: 'opacity 0.5s ease, transform 0.3s ease'
                }}
                src={recipe.image || "/default-recipe.jpg"}
                alt={recipe.name}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = "/default-recipe.jpg";
                  setImageLoaded(true);
                }}
              />
              {!imageLoaded && (
                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-light">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Recipe Details with Staggered Animation */}
          <main className="col-lg-6">
            <div className="ps-lg-3">
              <h2 className="title text-dark mb-4 animate__animated animate__fadeInDown">
                {recipe.name}
              </h2>
              
              <div className="mb-4 animate__animated animate__fadeIn animate__delay-1s">
                <h5 className="d-inline-block me-2">
                  <i className="bi bi-clock me-2"></i>
                  Cooking Time:
                </h5>
                <span className="text-muted">{recipe.timeToCook || "Not specified"}</span>
              </div>

              {/* Ingredients with Hover Effects */}
              <div className="mb-4 animate__animated animate__fadeIn animate__delay-2s">
                <h4><i className="bi bi-list-check me-2"></i>Ingredients:</h4>
                <ul className="list-group list-group-flush">
                  {recipe.ingredients?.length > 0 ? (
                    recipe.ingredients.map((ingredient, i) => (
                      <li 
                        key={i} 
                        className="list-group-item hover-lift transition-all"
                        style={{ transition: 'transform 0.2s ease' }}
                      >
                        <i className="bi bi-dot me-2"></i>
                        {ingredient}
                      </li>
                    ))
                  ) : <li className="list-group-item text-muted">No ingredients listed</li>}
                </ul>
              </div>

              {/* Steps with Checkbox Interaction */}
              <div className="mb-4 animate__animated animate__fadeIn animate__delay-3s">
                <h4><i className="bi bi-list-ol me-2"></i>Steps:</h4>
                <ol className="list-group list-group-numbered">
                  {recipe.steps?.length > 0 ? (
                    recipe.steps.map((step, i) => (
                      <li 
                        key={i} 
                        className="list-group-item hover-lift transition-all"
                        style={{ transition: 'transform 0.2s ease' }}
                      >
                        <div className="ms-2 d-flex align-items-center">
                          <input 
                            type="checkbox" 
                            className="form-check-input me-3 hover-scale" 
                            style={{ cursor: 'pointer' }}
                          />
                          {step || `Step ${i + 1}`}
                        </div>
                      </li>
                    ))
                  ) : <li className="list-group-item text-muted">No steps provided</li>}
                </ol>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export default RecipeCard;