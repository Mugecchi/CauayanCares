import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUser } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkLogin = async () => {
			try {
				const userData = await fetchUser();
				setUser(userData);
				setIsLoggedIn(true);
			} catch (err) {
				setIsLoggedIn(false);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		checkLogin();
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, setUser, isLoggedIn, setIsLoggedIn, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
