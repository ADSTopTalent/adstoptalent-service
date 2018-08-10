package com.myapp.MyFirstSpringBootApp;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
 * Unit test for simple App.
 */
public class AppTest extends TestCase	{
	//Voting voting=new Voting();
	Product product=new Product();
	Login login=new Login();
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public AppTest( String testName ){
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite( AppTest.class );
    }
    /**
     * Rigourous Test :-)
     */
    public void testApp() {
        assertTrue( true );
    }
	
	public void testApp2() {
		boolean canIVote = product.canVote(25);
		assertTrue(canIVote);
	}

	public void testApp3() {
		boolean validate = login.validate("admin","admin");
		assertTrue(validate);
	}
}
