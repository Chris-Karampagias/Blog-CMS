"use client";
import { useContext, useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewPost() {
  const [post, setPost] = useState({ title: "", description: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const context = useContext(AuthContext);
  const router = useRouter();
  const editorRef = useRef(null);

  useEffect(() => {
    if (!context.user) {
      router.push("/");
    }
  }, []);

  const handleFileInput = (e) => {
    setPost({ ...post, image: e.target.files[0] });
  };

  const uploadFiles = async () => {
    try {
      if (!context.user) {
        throw new Error("You must be logged in first!");
      }
      const data = new FormData();
      data.append("title", post.title);
      data.append("description", post.description);
      data.append("image", post.image);
      setLoading(true);
      const res = await fetch(
        "https://blog-api-production-a764.up.railway.app/api/auth/posts/new",
        {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
            Accept: "application/json",
          },
          body: data,
        }
      );
      if (res.status === 413) {
        throw new Error("Image file size too large");
      }
      const result = await res.json();
      if (!res.ok) {
        result.error.forEach((error) => {
          toast.error(error.msg);
        });
      } else {
        toast.success("Post creation succesful");
        setTimeout(() => router.push("/dashboard/posts"), 1000);
      }
    } catch (err) {
      setError(true);
      if (err.message === "jwt expired") {
        context.dispatch({
          type: "LOGOUT",
        });
      }
      toast.error(err.message);
    } finally {
      setTimeout(() => setLoading(false), 1100);
    }
  };

  return (
    <>
      {context.user && error && !loading && (
        <div className="alert alert-error w-[98%] mx-auto mt-20 md:text-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            There was an error with your request.
            <br />
            Please try again later!
          </span>
        </div>
      )}
      {context.user && loading && !error && (
        <span className="loading loading-spinner absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] loading-lg "></span>
      )}
      {context.user && !loading && !error && (
        <div className="card w-4/5 xl:w-1/3 mx-auto h-1/3 my-10 bg-base-100 shadow-2xl">
          <div className="card-body p-4">
            <h1 className="text-3xl text-center my-5 border-b-[1px] border-slate-200">
              Post details
            </h1>
            <form
              id="post-form"
              enctype="multipart/form-data"
              className="flex flex-col justify-center items-center h-full space-y-20"
              onSubmit={(e) => {
                e.preventDefault();
                uploadFiles();
              }}
            >
              <div className="w-full flex justify-center">
                <input
                  type="text"
                  id="title"
                  value={post.title}
                  onChange={(e) => {
                    setPost({ ...post, title: e.target.value });
                  }}
                  placeholder="Enter your post's title"
                  className="input text-xl input-bordered w-full max-w-md"
                  required
                />
                <label htmlFor="title"></label>
              </div>
              <div className="w-full flex justify-center">
                <Editor
                  className="text-xl w-full"
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue="Enter your post's description here..."
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  onEditorChange={() => {
                    setPost({
                      ...post,
                      description: editorRef.current
                        .getContent()
                        .replace(/<\/?p>/g, ""),
                    });
                  }}
                />
                <label htmlFor="title"></label>
              </div>
              <div className="flex relative flex-col gap-5 h-fit input input-bordered max-w-md p-5">
                <label
                  className="translate-y-[-60%] md:text-xl absolute bg-white top-0 left-2 z-10"
                  htmlFor="image"
                >
                  Upload an image for your post
                </label>
                <input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="file-input file-input-bordered file-input-secondary w-full max-w-md"
                  required
                />
              </div>
              <button className="btn btn-accent">Create post</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
