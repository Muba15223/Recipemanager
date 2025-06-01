import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const Home = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/recipes");
        setData(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3000/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const favoriteData = response.data.data || response.data;
        const favoriteRecipeIds = favoriteData.map(fav => fav.recipeId?._id || fav.recipeId);
        setFavorites(favoriteRecipeIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Failed to load favorites. Please try again later.");
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        alert("Please login to favorite recipes");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/favorites/toggle", 
        { recipeId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "Removed from favorites") {
        setFavorites(favorites.filter((id) => id !== recipeId));
      } else {
        setFavorites([...favorites, recipeId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setError("Failed to update favorite. Please try again.");
    }
  };

  const filterData = data.filter((item) =>
    item.name && item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  const recordPerPage = 4;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = filterData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filterData.length / recordPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const DEFAULT_IMAGE = "istockphoto-520410807-612x612.jpg";

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-light py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-5 fw-bold mb-4 text-primary">Welcome to TastyBite</h1>
              <p className="lead text-muted mb-4">
                Your kitchen companion! Whether you're a pro or a beginner, explore thousands of 
                recipes, easy meal plans, and simple instructions. Discover new dishes, save your 
                favorites, and share your creations. Let's get cooking!
              </p>
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-pill p-2 me-3">
                  <i className="bi bi-egg-fried text-white fs-4"></i>
                </div>
                <p className="mb-0 small text-muted">1000+ recipes waiting for you</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image-container position-relative">
                <img 
                  src="sandwich.jpg" 
                  alt="Delicious sandwich"
                  className="img-fluid rounded-3 shadow-lg"
                  style={{
                    width: "400px",
                    height: "350px",
                    objectFit: "cover"
                  }} 
                />
                <div className="position-absolute bottom-0 start-0 bg-primary text-white px-3 py-2 rounded-end">
                  <i className="bi bi-star-fill me-1"></i> Chef's Choice
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-divider bg-light">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" aria-hidden="true">
          <path fill="#fff" fillOpacity="1" d="M0,64L60,74.7C120,85,240,107,360,112C480,117,600,107,720,90.7C840,75,960,53,1080,53.3C1200,53,1320,75,1380,85.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      {/* Search Section */}
      <section className="search-section py-4 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="position-relative">
                <input
                  type="search"
                  placeholder="Search recipes..."
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  className="form-control form-control-lg shadow-sm ps-5"
                  aria-label="Search recipes"
                  style={{ borderRadius: "50px" }}
                />
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe List */}
      <div className="container my-4">
        {records.length > 0 ? (
          <div className="row g-4 justify-content-center">
            {records.map((item) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center" key={item._id}>
                <div className="card h-100" style={{ width: '280px' }}>
                  <Link to={`/recipe/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img 
                      src={item.image || DEFAULT_IMAGE}
                      className="card-img-top" 
                      alt={item.name || "Recipe image"} 
                      style={{ height: '200px', objectFit: "cover" }} 
                      onError={(e) => {
                        e.target.src = DEFAULT_IMAGE; // Fallback to default image if error
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text"><strong>{item.timeToCook}</strong></p>
                    </div>
                  </Link>
                  <div className="card-footer bg-transparent border-top-0">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(item._id);
                      }} 
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "24px",
                        color: favorites.includes(item._id) ? "red" : "gray",
                      }}
                      aria-label={favorites.includes(item._id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.includes(item._id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-12 text-center">
            <h3>No recipes found. Try a different search term.</h3>
          </div>
        )}
      </div>

      {/* Pagination */}
      {npage > 1 && (
        <section className="pagination-section py-3 bg-light">
          <div className="container">
            <nav aria-label="Recipe pagination">
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link rounded-start-pill px-3"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i> Previous
                  </button>
                </li>

                {numbers.map((n) => (
                  <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(n)}
                      style={{ minWidth: "45px", textAlign: "center" }}
                    >
                      {n}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === npage ? 'disabled' : ''}`}>
                  <button 
                    className="page-link rounded-end-pill px-3"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, npage))}
                    disabled={currentPage === npage}
                  >
                    Next <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      )}
    </div>
  );
};

Home.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      timeToCook: PropTypes.string,
      image: PropTypes.string,
    })
  ),
};