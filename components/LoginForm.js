"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { useRouter } from "next/navigation";
export default function LoginForm() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", password: "" });
  const context = useContext(AuthContext);
  const submitData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error);
      }
      toast.success("Login success");
      context.dispatch({
        type: "LOGIN",
        payload: user,
      });
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <button
        className="btn btn-ghost text-white outline-none text-2xl"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Login
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="modal-action justify-center">
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (user.username === "" || user.password === "") {
                  return;
                }
                submitData();
                document.getElementById("my_modal_1").close();
                setUser({ username: "", password: "" });
              }}
            >
              <div>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={user.username}
                  onChange={(e) => {
                    setUser({ ...user, username: e.target.value });
                  }}
                  className="input input-bordered w-full max-w-xs"
                  required
                />
                <label htmlFor="username"></label>
              </div>
              <div>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={(e) => {
                    setUser({ ...user, password: e.target.value });
                  }}
                  className="input input-bordered w-full max-w-xs"
                  required
                />
                <label htmlFor="password"></label>
              </div>
              <div className="w-full flex justify-center gap-10">
                <button className="btn" type="submit">
                  Login
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    document.getElementById("my_modal_1").close();
                    setUser({ username: "", password: "" });
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <Toaster position="bottom-right" />
    </>
  );
}
