package com.myapp.MyFirstSpringBootApp;

public class Product {
	private String name;
	private String price;
	private String description;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public boolean canVote(int age)
	{
	if(age<18 || age>80 || age==60)
	{
		return false;
	}
	else
	{
		return true;
	}

	}
}
