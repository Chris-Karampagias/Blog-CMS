"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiWrenchCog, mdiCardPlus } from "@mdi/js";

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
        <div className="flex flex-col relative items-center">
          <div className="flex flex-col min-h-screen items-center gap-10 mt-10">
            <div className="card w-full bg-base-100 shadow-2xl">
              <Icon path={mdiWrenchCog} size={4} className="self-center" />
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
              <Icon path={mdiCardPlus} size={4} className="self-center" />
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
          <div className="chat space-y-3  hidden absolute xl:block top-10 left-3 chat-start self-start text-3xl">
            <div className="chat-bubble bg-gray-400 text-slate-100">
              Nice having you back admin! <br />
              Welcome to the Dashboard!
            </div>
          </div>
        </div>
      )}
    </>
  );
}
