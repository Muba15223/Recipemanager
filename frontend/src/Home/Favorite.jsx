import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Constants
const API_BASE_URL = "https://recipemanager-ma43.onrender.com";
const DEFAULT_RECIPE_IMAGE = "/default-recipe.jpg";

// Utility function for error handling
const getErrorMessage = (error, defaultMessage) => {
  return error.response?.data?.message || error.message || defaultMessage;
};

const Favorite = () => {
  const navigate = useNavigate();
  
  // State management
  const [state, setState] = useState({
    favorites: [],
    loading: true,
    error: null,
  });

  const { favorites, loading, error } = state;

  // Memoized fetch function
  const fetchFavorites = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to view favorites");
      }

      const response = await axios.get(`${API_BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const favoritesData = response.data?.data || response.data;
      
      if (!Array.isArray(favoritesData)) {
        throw new Error("Invalid favorites data format");
      }

      const normalizedFavorites = favoritesData
        .map(fav => fav.recipeId || fav)
        .filter(Boolean);

      setState(prev => ({
        ...prev,
        favorites: normalizedFavorites,
        loading: false,
      }));

    } catch (err) {
      console.error("Fetch error:", err);
      setState(prev => ({
        ...prev,
        error: getErrorMessage(err, "Error loading favorites"),
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleDeleteFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`${API_BASE_URL}/favorites/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setState(prev => ({
        ...prev,
        favorites: prev.favorites.filter(item => item._id !== recipeId),
      }));
    } catch (error) {
      console.error("Delete error:", error);
      alert(getErrorMessage(error, "Failed to remove favorite"));
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading your favorite recipes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: "600px", background: "rgba(248, 215, 218, 0.9)", border: "none" }}>
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
        <div className="mt-3">
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)", minHeight: "100vh" }}>
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold text-gradient">Your Favorite Recipes</h2>
        <p className="text-muted">All your saved recipes in one place</p>
      </div>
      
      {favorites.length === 0 ? (
        <EmptyFavoritesState />
      ) : (
        <div className="row g-4">
          {favorites.map((recipe) => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              onDelete={handleDeleteFavorite}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyFavoritesState = () => (
  <div className="text-center py-5 my-5 rounded-3" style={{ background: "rgba(255, 255, 255, 0.8)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
    <i className="bi bi-heart text-muted" style={{ fontSize: "3rem" }}></i>
    <h4 className="mt-3">Your favorites collection is empty</h4>
    <p className="text-muted">Discover amazing recipes and add them to your favorites!</p>
    <Link to="/" className="btn btn-primary mt-3 px-4">
      <i className="bi bi-search me-2"></i>Browse Recipes
    </Link>
  </div>
);

const RecipeCard = ({ recipe, onDelete, navigate }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
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
            src={recipe.image || DEFAULT_RECIPE_IMAGE} 
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
        <div className="card-body d-flex flex-column p-3" 
          style={{ 
            borderRadius: "0 0 15px 15px",
            backgroundColor: "white"
          }}
        >
          <h5 className="card-title text-truncate mb-1">{recipe.name}</h5>
          <p className="card-text text-muted mb-2">
            <small>
              <i className="bi bi-clock me-1"></i>
              {recipe.timeToCook || 'N/A'}
            </small>
          </p>
          <div className="mt-2 d-flex justify-content-end">
            <button 
              className="btn btn-danger btn-sm py-1 px-2"
              onClick={(e) => {
                e.preventDefault();
                onDelete(recipe._id);
              }}
              style={{ fontSize: "0.8rem" }}
            >
              <i className="bi bi-trash me-1"></i> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    timeToCook: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default Favorite;