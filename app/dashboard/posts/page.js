"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { DateTime } from "luxon";

export default function Posts() {
  const context = useContext(AuthContext);
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!context.user) {
      router.push("/");
    }
  }, [context.user]);
  const formatDate = (date) => {
    const dateObject = new Date(date);
    return DateTime.fromJSDate(dateObject).toLocaleString(
      DateTime.DATETIME_MED
    );
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/posts", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          "Content-Type": "application/json",
        },
      });
      const postData = await res.json();
      if (!res.ok) {
        setLoading(false);
        throw new Error(postData.error);
      }

      setPosts(postData);
    } catch (error) {
      if (error.message === "jwt expired") {
        context.dispatch({
          type: "LOGOUT",
        });
      }
      toast.error(error.message);
      setLoading(false);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {" "}
      {context.user && loading && (
        <span className="loading loading-spinner absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] loading-lg "></span>
      )}
      {context.user && !loading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 min-[2500px]:grid-cols-3 justify-items-center gap-10 gap-y-28  mt-10 p-10 min-h-screen">
          {posts.map((post) => {
            return (
              <div
                key={post._id}
                className="card max-w-[600px] lg:aspect-square bg-base-100 shadow-2xl"
              >
                <figure>
                  <Image
                    src={"http://localhost:4000/" + post.image}
                    width={600}
                    height={600}
                    alt="Post image"
                  />
                </figure>
                <div className="card-body justify-between  p-5 md:p-10 space-y-5">
                  <div>
                    <h2 className="card-title self-center md:self-start text-2xl md:text-3xl">
                      {post.title}
                    </h2>
                    <p className="text-slate-500 mt-3 lg:text-xl">
                      <span className="font-bold">Posted: </span>
                      {formatDate(post.postedAt)}
                    </p>
                    <p className="text-slate-500 mt-3 lg:text-xl">
                      <span className="font-bold">Last edit: </span>
                      {formatDate(post.updatedAt)}
                    </p>
                  </div>
                  <div className="card-actions justify-center gap-5 md:justify-end">
                    <Link
                      href={"/dashboard/posts/update/" + post._id}
                      className="btn btn-secondary btn-md xl:btn-lg"
                    >
                      Edit
                    </Link>
                    <Link
                      href={"/dashboard/posts/delete/" + post._id}
                      className="btn btn-error bg-red-500 btn-md xl:btn-lg"
                    >
                      Delete
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
