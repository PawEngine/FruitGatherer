from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="Fruit Gatherer API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScoreEntry(BaseModel):
    name: str
    score: int

# In-memory score storage for demonstration
# In a real app, use a database like DynamoDB or RDS
high_scores = [
    {"name": "Master", "score": 5000},
    {"name": "Player1", "score": 3000},
    {"name": "FruitLover", "score": 1500},
]

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/highscores", response_model=List[ScoreEntry])
def get_highscores():
    # Return sorted high scores, limit to top 10
    sorted_scores = sorted(high_scores, key=lambda x: x["score"], reverse=True)
    return sorted_scores[:10]

@app.post("/score")
def submit_score(entry: ScoreEntry):
    if entry.score < 0:
        raise HTTPException(status_code=400, detail="Score cannot be negative")
    
    high_scores.append(entry.dict())
    return {"message": "Score submitted successfully", "total_entries": len(high_scores)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
