def get_trip_category(budget: float) -> str:
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"


def get_travel_season(travel_month: str) -> str:
    month = travel_month.strip().lower()
    if month == "december":
        return "Peak Season"
    elif month == "june":
        return "Holiday Season"
    else:
        return "Regular Season"


def calculate_daily_budget(budget: float, days: int) -> float:
    return budget / days


def get_place_recommendations(destination: str) -> list:
    recommendations = {
        "japan":     ["Tokyo Tower", "Shibuya Crossing", "Mount Fuji", "Kyoto Temples", "Osaka Castle"],
        "indonesia": ["Bali Rice Terraces", "Borobudur Temple", "Komodo Island", "Raja Ampat", "Bromo Volcano"],
        "france":    ["Eiffel Tower", "Louvre Museum", "Palace of Versailles", "Mont Saint-Michel", "French Riviera"],
        "thailand":  ["Grand Palace", "Phi Phi Islands", "Chiang Mai Night Bazaar", "Ayutthaya Ruins", "Railay Beach"],
    }
    key = destination.strip().lower()
    return recommendations.get(key, [
        f"Old Town {destination}", f"Central Museum {destination}",
        f"National Park {destination}", f"Local Market {destination}",
    ])
