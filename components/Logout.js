"use client";

import { useContext } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Logout() {
  const router = useRouter();
  const context = useContext(AuthContext);
  const logout = () => {
    toast.success("Logout succesful");
    context.dispatch({
      type: "LOGOUT",
    });
    localStorage.clear();
    setTimeout(() => router.push("/"), 500);
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
