from pydantic import BaseModel
from typing import List, Optional

class QuizAnswer(BaseModel):
    question_id: str
    answer: str

class SubmitQuiz(BaseModel):
    user_id: str
    answers: List[QuizAnswer]

class StyleProfile(BaseModel):
    user_id: str
    styles: List[str]
    occasions: List[str]
    gender: str
    price_range: str