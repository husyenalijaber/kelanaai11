import os
import boto3
from dotenv import load_dotenv

load_dotenv()

client = boto3.client(
    service_name="bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "ap-southeast-2"),
)


def generate_travel_recommendation(destination: str, days: int, budget: float, category: str) -> str:
    prompt = f"""You are an expert travel planner. Create a detailed {days}-day itinerary for {destination} with a total budget of ${budget:.2f} USD ({category} category).

For EACH day include:
Morning (2-3 specific activities): landmarks, breakfast spots, best time to visit.
Afternoon (cultural sites): museums, local experiences, lunch spots.
Evening (dinner & nightlife): restaurant recommendations, entertainment.

Format as:
Day X: [Theme]
Morning:
- activity 1
- activity 2
Afternoon:
- site 1
- experience 1
Evening:
- dinner spot
- nightlife

Format in Markdown with headers and bullet lists. Keep within {category} budget."""

    response = client.converse(
        modelId=os.getenv("MODEL_ID", "amazon.nova-lite-v1:0"),
        messages=[{"role": "user", "content": [{"text": prompt}]}]
    )
    return response["output"]["message"]["content"][0]["text"]
