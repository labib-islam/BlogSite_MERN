import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import "./Categories.css";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorCard from "../../shared/components/ErrorCard";
import { toast } from "sonner";
import AuthContext from "../../shared/contexts/AuthContext";

const Categories = () => {
  const { role } = useContext(AuthContext);
  const [loadedCategories, setLoadedCategories] = useState();
  const [inputs, setInputs] = useState({
    category: "",
    color: "#e9e9e9",
  });
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [error, setError] = useState();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === "test-admin") {
      toast.error("This feature is disabled for demo admin accounts.");
      return;
    }
    try {
      setIsLoadingSubmit(true);
      const res = await axios.post("/api/category/new", inputs);

      setInputs({ category: "", color: "#e9e9e9" });
      fetchCategories();
      setIsLoadingSubmit(false);
    } catch (err) {
      console.log(err);
      setIsLoadingSubmit(false);
      if (err.status === 400) {
        toast.error(err.response?.data.message);
      } else {
        setError(err);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoadingFetch(true);
      const responseData = await axios.get(`/api/category`);
      setLoadedCategories(responseData.data.categories);
      setIsLoadingFetch(false);
    } catch (err) {
      console.error(err);
      setIsLoadingFetch(false);
      setError(err);
    }
  };

  const handleDelete = async (categoryId) => {
    if (role === "test-admin") {
      toast.error("This feature is disabled for demo admin accounts.");
      return;
    }
    try {
      setIsLoadingFetch(true);
      await axios.delete(`/api/category/${categoryId}`);
      setLoadedCategories((prev) =>
        prev.filter((cat) => cat._id !== categoryId)
      );
      setIsLoadingFetch(false);
    } catch (err) {
      console.error(err);
      setIsLoadingFetch(false);
      setError(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <>
      {error && <ErrorCard error={error} />}

      {!error && loadedCategories && (
        <main className="page-categories">
          <section>
            <header>Add Category</header>
            <hr />
            <form className="add-category-form">
              <input
                type="text"
                name="category"
                placeholder="Category"
                style={{ backgroundColor: inputs.color }}
                value={inputs.category}
                onChange={handleChange}
              />
              <label
                htmlFor="color-picker"
                className="color-picker-label"
                style={{ backgroundColor: inputs.color }}
              >
                Color
                <input
                  type="color"
                  id="color-picker"
                  name="color"
                  value={inputs.color}
                  onChange={handleChange}
                />
              </label>
              <button onClick={handleSubmit}>
                {isLoadingSubmit ? (
                  <span className="loader button"></span>
                ) : (
                  "Create"
                )}
              </button>
            </form>
          </section>
          <section>
            <header>Category List</header>
            <hr />
            {isLoadingFetch && <LoadingSpinner fullHeight={false} />}
            {!isLoadingFetch && (
              <ul className="category-list">
                {loadedCategories &&
                  loadedCategories.map((cat) => (
                    <li key={cat._id} style={{ backgroundColor: cat.color }}>
                      {cat.category}
                      <span onClick={() => handleDelete(cat._id)}>&times;</span>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </main>
      )}
    </>
  );
};

export default Categories;
