"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const context = useContext(AuthContext);
  useEffect(() => {
    if (context.user) {
      router.push("dashboard");
    }
  }, [context.user]);
  return (
    <>
      {!context.user && (
        <div className="card w-fit mx-auto mt-96 bg-base-100 shadow-2xl">
          <div className="card-body flex flex-col gap-10">
            <h2 className="card-title break-words text-2xl">
              Welcome to the Content Management System for your Blog!
            </h2>
            <p className="text-xl">
              In order to edit, create & delete a post you must first log in!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
