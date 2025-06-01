import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const MyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get("http://localhost:3000/my-recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const recipes = response.data.data || response.data;
        setMyRecipes(Array.isArray(recipes) ? recipes : []);
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`http://localhost:3000/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyRecipes(myRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="py-5 min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container">
        <h2 className="text-center mb-5 fw-bold">Your Recipes</h2>
        
        {myRecipes.length === 0 ? (
          <div className="text-center py-5">
            <h4>You haven't created any recipes yet.</h4>
            <Link to="/create_recipe" className="btn btn-success btn-lg mt-3">
              + Create Your First Recipe
            </Link>
          </div>
        ) : (
          <>
            <div className="row g-4 justify-content-center">
              {myRecipes.map((recipe) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={recipe._id}>
                  <div className="card h-100 shadow border-0 overflow-hidden" 
                    style={{ 
                      borderRadius: "15px",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div 
                      className="position-relative" 
                      style={{ 
                        height: "200px",
                        overflow: "hidden",
                        borderRadius: "15px 15px 0 0"
                      }}
                    >
                      <img 
                        src={recipe.image || "/default-recipe.jpg"} 
                        className="img-fluid w-100 h-100"
                        alt={recipe.name}
                        style={{ 
                          objectFit: "cover",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                      />
                    </div>
                    <div className="card-body d-flex flex-column" 
                      style={{ 
                        borderRadius: "0 0 15px 15px",
                        backgroundColor: "white"
                      }}
                    >
                      <h5 className="card-title text-truncate mb-2">{recipe.name}</h5>
                      <p className="card-text text-muted mb-3"><small>{recipe.timeToCook}</small></p>
                      <div className="mt-auto d-flex justify-content-between gap-2">
                        <Link 
                          to={`/update_recipe/${recipe._id}`} 
                          className="btn btn-primary btn-sm"
                          style={{ width: "30%" }}
                        >
                          Update
                        </Link>
                        <button 
                          className="btn btn-danger btn-sm"
                          style={{ width: "30%" }}
                          onClick={() => handleDeleteRecipe(recipe._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-5">
              <Link to="/create_recipe" className="btn btn-success btn-lg px-4 py-2">
                + Create New Recipe
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;