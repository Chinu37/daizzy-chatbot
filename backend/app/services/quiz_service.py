import json
from pathlib import Path
from app.models.quiz import SubmitQuiz

DB_FILE = Path("app/data/quiz_profiles.json")

class QuizService:

    def __init__(self):
        DB_FILE.parent.mkdir(parents=True, exist_ok=True)
        if not DB_FILE.exists():
            DB_FILE.write_text("{}")

    def _load(self):
        return json.loads(DB_FILE.read_text())

    def _save(self, data):
        DB_FILE.write_text(json.dumps(data, indent=2))

    def submit_quiz(self, data: SubmitQuiz):
        # Map answers to style profile
        styles = []
        occasions = []
        gender = "female"
        price_range = "mid"

        for qa in data.answers:
            q = qa.question_id
            a = qa.answer.lower()

            if q == "gender":
                gender = a

            elif q == "occasion":
                occasions.append(a)

            elif q == "style":
                style_map = {
                    "classic": ["classic", "minimal"],
                    "bold": ["bold", "trendy"],
                    "elegant": ["elegant", "sophisticated"],
                    "casual": ["casual", "bohemian"],
                    "sporty": ["sporty"]
                }
                styles.extend(style_map.get(a, [a]))

            elif q == "budget":
                budget_map = {
                    "low": "low",
                    "mid": "mid",
                    "high": "high",
                    "luxury": "luxury"
                }
                price_range = budget_map.get(a, "mid")

        profile = {
            "user_id": data.user_id,
            "styles": styles,
            "occasions": occasions,
            "gender": gender,
            "price_range": price_range
        }

        data_store = self._load()
        data_store[data.user_id] = profile
        self._save(data_store)
        return profile

    def get_profile(self, user_id: str):
        data = self._load()
        return data.get(user_id, None)