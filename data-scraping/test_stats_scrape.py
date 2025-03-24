from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Set up Selenium WebDriver
driver = webdriver.Chrome()  # Ensure ChromeDriver is installed and in PATH
driver.get("https://www.premierleague.com/match/116092")  # Replace with the desired webpage URL

# Handle the cookie consent popup
try:
    cookie_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "onetrust-accept-btn-handler"))  # Locate the "Accept All Cookies" button
    )
    cookie_button.click()  # Click the button to dismiss the popup
    print("Cookie consent popup handled.")
except Exception as e:
    print("No cookie popup found or error handling it:", e)

# Wait for the "Stats" button to be clickable
try:
    stats_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//li[text()='Stats']"))  # Locate the "Stats" button
    )
    stats_button.click()  # Click the "Stats" button
    print("Stats button clicked.")
except Exception as e:
    print(f"Error clicking the 'Stats' button: {e}")
    driver.quit()
    exit()

# Optionally wait for the content to load after clicking
time.sleep(2)  # Adjust the sleep time if necessary

# Save the entire updated page as HTML
with open("updated_page_with_active.html", "w", encoding="utf-8") as file:
    file.write(driver.page_source)  # Save the current HTML content of the page

print("Page saved as 'updated_page_with_active.html'")

# Close the browser
driver.quit()