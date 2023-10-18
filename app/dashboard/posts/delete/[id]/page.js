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
      const res = await fetch(`http://localhost:4000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!res.ok) {
        setLoading(false);
        throw new Error(result.error);
      } else {
        toast.success("Post deletion succesful");
      }
    } catch (error) {
      if (error.message === "jwt expired") {
        context.dispatch({
          type: "LOGOUT",
        });
      }
      setLoading(false);
      toast.error(error.message);
    }
  };

  const getPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          "Content-Type": "application/json",
        },
      });
      const post = await res.json();
      console.log(post);
      if (!res.ok) {
        setLoading(false);
        throw new Error(post.error);
      }
      setPost(post);
    } catch (error) {
      setLoading(false);
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
      {context.user && loading && (
        <span className="loading loading-spinner absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] loading-lg "></span>
      )}
      {context.user && !loading && (
        <>
          <div className="card mx-5 mt-32 sm:mx-auto max-w-[500px] bg-base-100 shadow-2xl">
            <div className="card-body p-2 md:p-5 xl:p-8 space-y-3">
              <h2 className="card-title text-xl">Post deletion</h2>
              <p className="text-lg">
                Are you sure you want to delete post{" "}
                <span className="font-bold">&quot;{post.title}&quot;</span>?{" "}
                <br />
                <br />
                <span className="font-bold text-red-500">
                  This action is irreversible!
                </span>
              </p>
              <div className="card-actions justify-center gap-5">
                <button
                  className="btn btn-error bg-red-500 btn-md"
                  onClick={() => {
                    deletePost();
                    if (!loading) {
                      setTimeout(() => router.push("/dashboard/posts"), 500);
                    }
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
