import React, { useContext, useEffect, useState } from "react";

import "./BlogItem.css";
import UserCard from "../../user/components/UserCard";
import CategoryCard from "../components/CategoryCard";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import axios from "axios";
import { Editor } from "../components/Editor";
import AuthContext from "../contexts/AuthContext";
import { toast } from "sonner";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorCard from "../components/ErrorCard";

const BlogItem = () => {
  const { userId, role } = useContext(AuthContext);
  const [blog, setBlog] = useState();
  const [feedback, setFeedback] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const bid = useParams().bid;
  const location = useLocation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const responseData = await axios.delete(`/api/blog/${bid}`);
      setIsLoading(false);
      toast.success("Blog Deleted");
      navigate(`/user/${userId}/blogs`);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error("Failed to Delete Blog");
      setError(err);
    }
  };

  const handleDeleteConfirmation = () => {
    toast.error("Are you sure?", {
      classNames: {
        actionButton: "toast-delete-button",
      },
      action: {
        label: "Delete",
        onClick: handleDelete,
      },
    });
  };

  const handleStatus = async (status) => {
    if (role === "test-admin") {
      toast.error("This feature is disabled for demo admin accounts.");
      return;
    }
    try {
      setIsLoading(true);
      const responseData = await axios.patch(
        `/api/blog/status/${bid}/${status}`
      );
      setIsLoading(false);
      fetchBlog();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError(err);
    }
  };

  const handleFeedback = async (e) => {
    if (e) e.preventDefault();

    if (role === "test-admin") {
      toast.error("This feature is disabled for demo admin accounts.");
      return;
    }

    try {
      setIsLoading(true);
      const responseData = await axios.patch(`/api/blog/feedback/${bid}`, {
        feedback,
      });
      setIsLoading(false);
      fetchBlog();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError(err);
    }
  };

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const responseData = await axios.get(`/api/blog/${bid}`);
      setBlog(responseData.data.blog);
      responseData.data.blog.feedback &&
        setFeedback(responseData.data.blog.feedback);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError(err);
    }
  };

  useEffect(() => {
    if (location.state) {
      setBlog(location.state.blog);
      location.state.blog.feedback && setFeedback(location.state.blog.feedback);
    } else {
      fetchBlog();
    }
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorCard error={error} />}

      {!error && !isLoading && blog && (
        <main className="page-blog">
          {blog && (
            <section className="blog__container">
              <header>{blog.title}</header>
              <hr />
              <div className="user-date__container">
                <UserCard
                  name={blog.author.username}
                  image={blog.author.imageUrl}
                  userId={blog.author._id}
                />
                <span className="date">
                  {format(blog.publication_date, "MMM d, yyyy")}
                </span>
              </div>
              <hr />
              <CategoryCard category={blog.category} />
              <figure className="blog-image__container">
                <img src={blog.imageUrl} alt="" />
              </figure>
              <Editor readOnly={true} content={blog.content.blocks} />
              {userId === blog.author._id && role === "user" && (
                <>
                  <p className="blog-status">
                    Status: <span>{blog.status}</span>
                  </p>
                  {blog.feedback && (
                    <section className="feedback__container">
                      <header>Feedback</header>
                      <span>{blog.feedback}</span>
                    </section>
                  )}
                  <div className="blog-buttons__container">
                    <Link
                      to={`/user/blogs/edit/${blog._id}`}
                      state={{ blog }}
                      className="yellow-button"
                    >
                      Edit
                    </Link>
                    <button
                      className="red-button"
                      onClick={handleDeleteConfirmation}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
              {(role === "admin" || role === "test-admin") && (
                <>
                  <p className="blog-status">
                    Status: <span>{blog.status}</span>
                  </p>
                  {blog.feedback && (
                    <section className="feedback__container">
                      <header>Feedback</header>
                      <span>{blog.feedback}</span>
                    </section>
                  )}
                  <div className="blog-buttons__container">
                    <button
                      className="yellow-button"
                      onClick={() => handleStatus("archived")}
                    >
                      Archive
                    </button>
                    <button
                      className="green-button"
                      onClick={() => handleStatus("published")}
                    >
                      Publish
                    </button>
                    <button
                      className="red-button"
                      onClick={() => handleStatus("rejected")}
                    >
                      Reject
                    </button>
                  </div>
                  <form className="feedback-form" onSubmit={handleFeedback}>
                    <textarea
                      name="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write feedback here..."
                    />
                    <button onClick={handleFeedback}>Send Feedback</button>
                  </form>
                </>
              )}
            </section>
          )}
        </main>
      )}
    </>
  );
};

export default BlogItem;
