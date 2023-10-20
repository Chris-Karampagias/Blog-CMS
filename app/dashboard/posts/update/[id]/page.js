"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@/utils/AuthContextProvider";
import { Editor } from "@tinymce/tinymce-react";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import Icon from "@mdi/react";
import { mdiDelete } from "@mdi/js";

export default function Post() {
  const [post, setPost] = useState({
    title: "",
    description: "",
    image: "",
    comments: [],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const context = useContext(AuthContext);
  const editorRef = useRef(null);
  const pathname = usePathname();
  const postId = pathname.split("/")[4];
  const [commentToBeDeleted, setCommentToBeDeleted] = useState(null);

  const formatDate = (date) => {
    const dateObject = new Date(date);
    return DateTime.fromJSDate(dateObject).toLocaleString(
      DateTime.DATETIME_MED
    );
  };

  useEffect(() => {
    if (!context.user) {
      router.push("/");
    }
  }, []);

  const handleFileInput = (e) => {
    setPost({ ...post, image: e.target.files[0] });
  };

  const deleteComment = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://blog-api-production-a764.up.railway.app/api/auth/posts/${post._id}/comments/${commentToBeDeleted}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Server error");
      }
      const commentIndex = post.comments.findIndex(
        (comment) => comment._id === commentToBeDeleted
      );
      post.comments.splice(commentIndex, 1);

      setPost({
        ...post,
        comments: [...post.comments],
      });
      toast.success("Comment deletion succesful");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
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
        `https://blog-api-production-a764.up.railway.app/api/auth/posts/${postId}`,
        {
          method: "PUT",
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
        toast.success("Post update succesful");
        setTimeout(() => router.push("/dashboard/posts"), 1000);
      }
    } catch (err) {
      if (err.message === "jwt expired") {
        context.dispatch({
          type: "LOGOUT",
        });
      }
      setLoading(false);
      toast.error(err.message);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const getPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://blog-api-production-a764.up.railway.app/api/auth/posts/${postId}`,
        {
          mode: "cors",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
            "Content-Type": "application/json",
          },
        }
      );
      const post = await res.json();
      console.log(post);
      if (!res.ok) {
        setLoading(false);
        throw new Error(post.error);
      }
      setPost(post);
    } catch (error) {
      if (error.message === "jwt expired") {
        context.dispatch({
          type: "LOGOUT",
        });
      }
      setLoading(false);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      {context.user && (
        <div className="flex flex-col sm:flex-row gap-10">
          <div className="card w-4/5 md:w-1/3 mx-auto h-1/3 my-10 bg-base-100 shadow-2xl">
            <div className="card-body p-4">
              <h1 className="text-3xl text-center my-5 border-b-[1px] border-slate-200">
                Post details
              </h1>
              <form
                id="post-form"
                encType="multipart/form-data"
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
                    apiKey={process.env.TINYMCE_KEY}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={post.description}
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
                  />
                </div>
                <button
                  className={
                    !loading ? "btn btn-accent" : "btn btn-accent btn-disabled"
                  }
                >
                  {loading && <span className="loading loading-spinner"></span>}
                  Update post
                </button>
              </form>
            </div>
          </div>
          <div className="card w-4/5 md:w-1/3 mx-auto h-[600px] lg:h-[800px] my-10 bg-base-100 shadow-2xl">
            <h1 className="text-3xl text-center my-10 sticky top-0 border-b-[1px] border-slate-200">
              Comments
            </h1>
            <div className="card-body overflow-y-hidden p-5">
              <div className="carousel carousel-vertical space-y-5 rounded-box">
                {post.comments.length === 0 && (
                  <div className="alert">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-info shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span className="text-lg md:text-2xl">
                      No comments yet!
                    </span>
                  </div>
                )}
                {post.comments.length > 0 && (
                  <>
                    {post.comments.map((comment) => {
                      return (
                        <div
                          key={comment._id}
                          className="carousel-item border-[1px] border-slate-300 rounded-2xl p-1 flex flex-col gap-3 h-4/5 md:h-3/5"
                        >
                          <div className="flex flex-col md:flex-row items-center gap-3 md:justify-between">
                            <h1 className="md:w-1/2 text-xl self-start">
                              <span className="font-bold">@</span>
                              {comment.authorName}
                            </h1>
                            <p className="text-slate-500 w-fit text-start md:text-end">
                              <span className="font-bold">Posted: </span>
                              {formatDate(comment.postedAt)}
                            </p>
                          </div>
                          <h2 className="text-xl border-y-[1px] border-slate-500">
                            {comment.title}
                          </h2>
                          <p className="carousel ml-2 h-[100px] overflow-y-auto text-xl">
                            <span className="font-bold text-2xl mr-2">
                              &gt;
                            </span>
                            {comment.content}
                          </p>
                          <div className="w-full flex justify-end">
                            <button
                              className="cursor-pointer transition-all duration-200 hover:scale-105 "
                              data-id={comment._id}
                              onClick={(e) => {
                                document
                                  .getElementById("my_modal_2")
                                  .showModal();
                                setCommentToBeDeleted(
                                  e.target.getAttribute("data-id")
                                );
                              }}
                            >
                              <Icon
                                path={mdiDelete}
                                size={1.5}
                                className="text-red-500 pointer-events-none"
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <dialog id="my_modal_2" className="modal ">
                      <div className="modal-box flex flex-col gap-3">
                        <p className="py-4 md:text-2xl">
                          Are you sure you want to delete this comment?
                        </p>
                        <span className="font-bold md:text-xl text-red-500">
                          This action is irreversible!
                        </span>
                        <button
                          className="btn btn-error w-fit p-2 self-end bg-red-500 btn-md"
                          onClick={async () => {
                            document.getElementById("my_modal_2").close();
                            await deleteComment(commentToBeDeleted);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setCommentToBeDeleted(null)}>
                          close
                        </button>
                      </form>
                    </dialog>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
