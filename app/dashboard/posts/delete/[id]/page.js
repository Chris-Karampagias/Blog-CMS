"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import Link from "next/link";
import toast from "react-hot-toast";
export default function DeletePost() {
  const [post, setPost] = useState({
    title: "",
    description: "",
    image: "",
    comments: [],
  });
  const router = useRouter();
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const pathname = usePathname();
  const postId = pathname.split("/")[4];

  useEffect(() => {
    if (!context.user) {
      router.push("/");
    }
  }, []);

  const deletePost = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://blog-api-production-a764.up.railway.app/api/auth/posts/${postId}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error);
      } else {
        toast.success("Post deletion succesful");
        setTimeout(() => router.push("/dashboard/posts"), 1000);
      }
    } catch (error) {
      setError(true);
      if (error.message === "jwt expired") {
        context.dispatch({
          type: "LOGOUT",
        });
      }
      toast.error(error.message);
    } finally {
      setTimeout(() => setLoading(false), 1100);
    }
  };

  const getPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://blog-api-production-a764.up.railway.app/api/auth/posts/${postId}`,
        {
          mode: "cors",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
            "Content-Type": "application/json",
          },
        }
      );
      const post = await res.json();
      if (!res.ok) {
        throw new Error(post.error);
      }
      setPost(post);
    } catch (error) {
      if (error.message === "jwt expired") {
        context.dispatch({
          type: "LOGOUT",
        });
      }
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      {context.user && error && !loading && (
        <div className="alert alert-error w-[98%] mx-auto mt-20 md:text-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            There was an error with your request.
            <br />
            Please try again later!
          </span>
        </div>
      )}
      {context.user && loading && !error && (
        <span className="loading loading-spinner absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] loading-lg "></span>
      )}
      {context.user && !loading && !error && (
        <>
          <div className="card mx-5 mt-32 sm:mx-auto max-w-[500px] bg-base-100 shadow-2xl">
            <div className="card-body p-2 md:p-5 xl:p-8 space-y-3">
              <h2 className="card-title text-xl">Post deletion</h2>
              <p className="text-lg">
                Are you sure you want to delete post{" "}
                <span className="font-bold">&quot;{post.title}&quot;</span>?{" "}
              </p>
              <p className="font-bold text-lg text-red-500">
                This action is irreversible!
              </p>
              <div className="card-actions justify-center gap-5">
                <button
                  className="btn btn-error bg-red-500 btn-md"
                  onClick={() => {
                    deletePost();
                  }}
                >
                  Delete
                </button>
                <Link
                  href="/dashboard/posts"
                  className="btn btn-ghost bg-slate-200"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
