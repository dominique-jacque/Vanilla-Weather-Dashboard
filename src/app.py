import os
import json
import boto3
import requests
from datetime import datetime
from dotenv import load_dotenv
import random
import string

print(f"Current working directory: {os.getcwd()}")
# Load environment variables
load_dotenv()
print(f"OPENWEATHER_API_KEY: {os.getenv('OPENWEATHER_API_KEY')}")
print(f"AWS_BUCKET_BASE_NAME: {os.getenv('AWS_BUCKET_BASE_NAME')}")

# Helper function to generate a unique suffix for bucket names
def generate_unique_suffix(length=6):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

class WeatherDashboard:
    def __init__(self):
        self.api_key = os.getenv('OPENWEATHER_API_KEY')
        self.bucket_base_name = os.getenv('AWS_BUCKET_BASE_NAME', 'weather-dashboard-data')
        self.s3_client = boto3.client('s3')

        # Create a unique bucket name using the base name and a random suffix
        self.bucket_name = f"{self.bucket_base_name}-{generate_unique_suffix()}"

    def create_bucket_if_not_exists(self):
        """Create an S3 bucket if it doesn't exist."""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            print(f"Bucket {self.bucket_name} already exists.")
        except:
            print(f"Creating bucket {self.bucket_name}...")
            try:
                # Create the bucket in the default region
                self.s3_client.create_bucket(Bucket=self.bucket_name)
                print(f"Successfully created bucket: {self.bucket_name}")
            except Exception as e:
                print(f"Error creating bucket: {e}")

    def fetch_weather(self, city):
        """Fetch weather data from the OpenWeatherMap API."""
        base_url = "http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": city,
            "appid": self.api_key,
            "units": "imperial"
        }

        try:
            response = requests.get(base_url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching weather data: {e}")
            return None

    def save_to_s3(self, weather_data, city):
        """Save weather data to the S3 bucket."""
        if not weather_data:
            return False

        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        file_name = f"weather-data/{city}-{timestamp}.json"

        try:
            # Add a timestamp to the weather data
            weather_data['timestamp'] = timestamp
            # Upload the weather data as a JSON object to S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_name,
                Body=json.dumps(weather_data),
                ContentType='application/json'
            )
            print(f"Successfully saved data for {city} to S3: {file_name}")
            return True
        except Exception as e:
            print(f"Error saving data to S3: {e}")
            return False

def main():
    # Initialize the dashboard
    dashboard = WeatherDashboard()

    # Ensure the S3 bucket exists
    dashboard.create_bucket_if_not_exists()

    # List of cities to fetch weather data for
    cities = ["Philadelphia", "Seattle", "New York"]

    # Fetch and process weather data for each city
    for city in cities:
        print(f"\nFetching weather data for {city}...")
        weather_data = dashboard.fetch_weather(city)

        if weather_data:
            # Print weather details to the console
            temp = weather_data['main']['temp']
            feels_like = weather_data['main']['feels_like']
            humidity = weather_data['main']['humidity']
            description = weather_data['weather'][0]['description']

            print(f"Temperature: {temp}°F")
            print(f"Feels like: {feels_like}°F")
            print(f"Humidity: {humidity}%")
            print(f"Conditions: {description}")

            # Save the data to S3
            success = dashboard.save_to_s3(weather_data, city)
            if success:
                print(f"Weather data for {city} saved to S3!")
        else:
            print(f"Failed to fetch weather data for {city}.")

if __name__ == "__main__":
    main()
