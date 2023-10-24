"use client";

import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      localStorage.clear();
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      dispatch({
        type: "LOGIN",
        payload: true,
      });
    } else {
      dispatch({
        type: "LOGOUT",
      });
    }
  }, []);
  console.log("Authentication state is:  ", state);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
