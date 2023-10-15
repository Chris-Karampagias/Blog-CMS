"use client";
import LoginForm from "./LoginForm";
import Logout from "./Logout";
import { useContext } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import Link from "next/link";

export default function Navbar() {
  const context = useContext(AuthContext);

  return (
    <div className="navbar w-[98%] mx-auto mt-2 shadow-md shadow-slate-400 rounded-xl  bg-primary">
      <div className="flex-1">
        <Link
          href={context.user ? ".." : "/"}
          className="btn btn-ghost text-white text-3xl normal-case"
        >
          Blog CMS
        </Link>
      </div>
      {!context.user ? <LoginForm /> : <Logout />}
    </div>
  );
}
