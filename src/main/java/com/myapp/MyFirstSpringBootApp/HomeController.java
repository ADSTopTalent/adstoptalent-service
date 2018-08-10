package com.myapp.MyFirstSpringBootApp;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	@RequestMapping("/home")
	public String welcome() {
		return "hello world";
	}
	@RequestMapping("/products")
	public @ResponseBody Product getProducts() {
		Product newProduct = new Product();
		newProduct.setName("iPhone");
		newProduct.setDescription("iPhone X Plus Silver");
		newProduct.setPrice("$1000");
		return newProduct;	
	}
	
	@RequestMapping("/login")
	public @ResponseBody Login login() {
		Login login=new Login();
		login.setUsername(login.getUsername());
		login.setPassword(login.getPassword());

		if(login.getUsername()=="admin" && login.getPassword()=="admin")
		{
			return login;	
		}
		else
		{
		System.out.println("wrong credentials");
		}
		return login;	
	}
}
