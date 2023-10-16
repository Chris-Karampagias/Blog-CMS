"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
export default function Posts() {
  const context = useContext(AuthContext);
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!context.user) {
      router.push("/");
    }
  }, []);

  const formatImageData = (image) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    let result;
    fileReader.onload = () => {
      result = fileReader.result;
    };
    return result;
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
      console.log(res);
      const result = await res.json();
      console.log("Posts are: ", result);
      if (!res.ok) {
        throw new Error(result.error);
      }
      setPosts(result);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return <>{context.user && <div>All posts</div>}</>;
}
