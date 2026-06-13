from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_PATH = PROJECT_ROOT / "data" / "raw"

DESTINATIONS_FILE = DATA_PATH / "destinations.csv"
USERS_FILE = DATA_PATH / "users.csv"
BOOKINGS_FILE = DATA_PATH / "bookings_history.csv"
SUSTAINABILITY_FILE = DATA_PATH / "sustainability_scores.csv"
CONGESTION_FILE = DATA_PATH / "congestion_scores.csv"