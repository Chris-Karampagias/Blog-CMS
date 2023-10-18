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

  const date = new Date(Date.now());

  const comments = [
    {
      _id: 1,
      authorName: "Person 1",
      title: "Title 1",
      content:
        "odales dolor. Fusce enim velit, consequat non arcu tincidunt, tincidunt aliquet enim. Aliquam iaodales dolor. Fusce enim velit, consequat non arcu tincidunt, tincidunt aliquet enim. Aliquam iaodales dolor. Fusce enim velit, consequat non arcu tincidunt, tincidunt aliquet enim. Aliquam iaodales dolor. Fusce enim velit, consequat non arcu tincidunt, tincidunt aliquet enim. Aliquam iaodales dolor. Fusce enim velit, consequat non arcu tincidunt, tincidunt aliquet enim. Aliquam iaodales dolor. Fusce enim velit, consequat non arcu tincidunt, tincidunt aliquet enim. Aliquam iaodales dolor. Fusce enim velit, consequat non arcu tincidunt, tincidunt aliquet enim. Aliquam ia",
      postedAt: DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      _id: 2,
      authorName: "Person 2",
      title: "Title 2",
      content:
        "odales dolor. Fusce enim velit, consequat non arcu tincidunt, tincidunt aliquet enim. Aliquam ia",
      postedAt: DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      _id: 3,
      authorName: "Person 3",
      title: "Title 3",
      content:
        "odales dolor. Fusce enim velit, consequat non arcu tincidunt, tincidunt aliquet enim. Aliquam ia",
      postedAt: DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED),
    },
  ];

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
      const res = await fetch(`http://localhost:4000/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          Accept: "application/json",
        },
        body: data,
      });
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
      const res = await fetch(`http://localhost:4000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          "Content-Type": "application/json",
        },
      });
      const post = await res.json();
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
                {comments.map((comment) => {
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
                          {comment.postedAt}
                        </p>
                      </div>
                      <h2 className="text-xl border-y-[1px] border-slate-500">
                        {comment.title}
                      </h2>
                      <p className="carousel ml-2 h-[100px] overflow-y-auto text-xl">
                        <span className="font-bold text-2xl mr-2">&gt;</span>
                        {comment.content}
                      </p>
                      <div className="w-full flex justify-end">
                        <Icon
                          path={mdiDelete}
                          size={1.5}
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
