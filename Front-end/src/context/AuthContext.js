import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user details
  const [token, setToken] = useState(null); // Stores JWT token

  // Login function
  const login = (data) => {
    try {
      // Update user and token in state
      setUser({
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      setToken(data.token);

      // Persist data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Restore state from localStorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
