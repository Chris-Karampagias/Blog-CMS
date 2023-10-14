"use client";

import { useContext } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Logout() {
  const router = useRouter();
  const context = useContext(AuthContext);
  const logout = async () => {
    try {
      await fetch("http://localhost:4000/api/logout");
      toast.success("Logout succesful");
      context.dispatch({
        type: "LOGOUT",
        user: null,
      });
      setTimeout(() => router.push("/"), 500);
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <button
      onClick={logout}
      className="btn btn-ghost text-white outline-none text-2xl"
    >
      Logout
    </button>
  );
}
