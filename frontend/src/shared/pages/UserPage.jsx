import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import UserIcon from "../../assets/icons/user-icon.svg?react";
import { GoTrash } from "react-icons/go";
import { IoTrashOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";

import "./UserPage.css";
import Blogs from "../components/Blogs";
import AuthContext from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorCard from "../components/ErrorCard";
import { toast } from "sonner";

const UserPage = () => {
  const { userId, role } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    searchText: "",
    category: "all",
    status: "all",
  });

  const [loadedUser, setLoadedUser] = useState();
  const [loadedBlogs, setLoadedBlogs] = useState();
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { uid, status } = useParams();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const responseData = await axios.get(`/api/user/${uid}`);
      setLoadedUser(responseData.data.user);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError(err);
    }
  };

  const fetchBlogs = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsLoading(true);
      const responseData = await axios.get(
        `/api/blog/user/${uid}/blogs?search=${inputs.searchText}&cat=${inputs.category}&status=${inputs.status}`
      );
      setLoadedBlogs(responseData.data.blogs);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError(err);
    }
  };

  const handleDelete = async () => {
    if (role === "test-admin") {
      toast.error("This feature is disabled for demo admin accounts.");
      return;
    }
    try {
      setIsLoading(true);
      await axios.delete(`/api/user/${loadedUser._id}`);
      setIsLoading(false);
      toast.success("User Deleted");
      navigate(`/admin/users`);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error("Failed to Delete User");
      setError(err);
    }
  };

  const handleDeleteConfirmation = () => {
    toast.error("Are you sure?", {
      classNames: {
        actionButton: "toast-delete-button",
      },
      description: `Delete User: ${loadedUser.username}`,
      action: {
        label: "Delete",
        onClick: handleDelete,
      },
    });
  };

  useEffect(() => {
    if (status) inputs.status = status;

    if (location.state) {
      setLoadedUser(location.state.user);
    } else {
      fetchUser();
    }

    fetchBlogs();
  }, [uid]);
  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorCard error={error} />}

      {!error && !isLoading && loadedUser && (
        <main className="page-user-dashboard">
          <div className="dashboard__container">
            {loadedUser && (
              <section className="user-info__container">
                <figure>
                  {loadedUser.imageUrl ? (
                    <img src={loadedUser.imageUrl} alt="" />
                  ) : (
                    <UserIcon className="user-icon" />
                  )}
                </figure>
                <article>
                  <header>{loadedUser.username}</header>
                  {(loadedUser._id === userId || role === "admin") && (
                    <span>{loadedUser.email}</span>
                  )}
                </article>
              </section>
            )}
            <section className="user-action-buttons__container">
              {userId === loadedUser._id && role === "user" && (
                <>
                  <Link to="/user/edit-profile" className="user-edit-button">
                    Edit Profile
                  </Link>
                  <Link to="/user/blogs/new" className="new-blog-button">
                    New Blog
                  </Link>
                </>
              )}
              {(role === "admin" || role === "test-admin") && (
                <button
                  className="delete-user-button"
                  onClick={handleDeleteConfirmation}
                >
                  <figure>
                    <FaRegTrashAlt className="trash-icon" />
                  </figure>
                  <span>Delete User</span>
                </button>
              )}
            </section>
            <hr />
            {loadedBlogs && (
              <Blogs
                inputs={inputs}
                setInputs={setInputs}
                fetchBlogs={fetchBlogs}
                showStatus={
                  role === "admin" || loadedUser._id === userId ? true : false
                }
                loadedBlogs={loadedBlogs}
                userId={uid}
              />
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default UserPage;
