"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const context = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (!context.user) {
      router.push("/");
    }
  }, []);
  return (
    <>
      {context.user && (
        <div className="flex flex-col items-center">
          <div className="chat mt-10 space-y-3 absolute bottom-2 chat-start self-start text-3xl">
            <div className="chat-bubble bg-gray-400 text-slate-100">
              Nice having you back admin!
            </div>
            <div className="chat-bubble bg-gray-400 text-slate-100">
              Welcome to the Dashboard!
            </div>
          </div>
          <div className="flex flex-col min-h-screen items-center gap-10 mt-10">
            <div className="card w-full bg-base-100 shadow-2xl">
              <div className="card-body space-y-2 p-10">
                <h2 className="card-title text-2xl">Posts</h2>
                <p className="text-xl">View, edit & delete your posts</p>
                <div className="card-actions justify-center">
                  <Link href="dashboard/posts" className="btn btn-primary">
                    Go to posts
                  </Link>
                </div>
              </div>
            </div>
            <div className="card w-full bg-base-100 shadow-2xl">
              <div className="card-body space-y-2 p-10">
                <h2 className="card-title text-2xl">New Post</h2>
                <p className="text-xl">Create a new post</p>
                <div className="card-actions justify-center">
                  <Link href="dashboard/posts/new" className="btn btn-primary">
                    Create
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
