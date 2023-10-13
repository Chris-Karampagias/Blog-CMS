import LoginForm from "./LoginForm";
export default function Navbar({ loggedIn }) {
  return (
    <div className="navbar w-[98%] mx-auto mt-2 shadow-md shadow-slate-400 rounded-xl  bg-primary">
      <div className="flex-1">
        <h1 className="btn btn-ghost text-white text-3xl normal-case pointer-events-none">
          Blog CMS
        </h1>
      </div>
      {!loggedIn ? <LoginForm /> : <h1>Hello, admin!</h1>}
    </div>
  );
}
