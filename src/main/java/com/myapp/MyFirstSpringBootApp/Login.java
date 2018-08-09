package com.myapp.MyFirstSpringBootApp;

public class Login {
	private String username;
	private String password;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean validate(String username, String password) {
		if (username == "admin" && password == "admin") {
			return true;
		} else {
			return false;
		}

	}
}