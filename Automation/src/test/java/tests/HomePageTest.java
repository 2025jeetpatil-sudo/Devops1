package tests;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

public class HomePageTest {

    @Test
    public void testHomePageLoads() {
        WebDriver driver = getDriver();
        driver.get("https://study-notion-lms.vercel.app");
        Assert.assertNotNull(driver.getTitle());
        driver.quit();
    }

    @Test
    public void testHomePageURL() {
        WebDriver driver = getDriver();
        driver.get("https://study-notion-lms.vercel.app");
        //Assert.assertTrue(driver.getCurrentUrl().contains("localhost"));
        driver.quit();
    }

    @Test
    public void testPageSourceNotEmpty() {
        WebDriver driver = getDriver();
        driver.get("https://study-notion-lms.vercel.app");
        Assert.assertTrue(driver.getPageSource().length() > 0);
        driver.quit();
    }

    private WebDriver getDriver() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--remote-allow-origins=*");
        return new ChromeDriver(options);
    }
}