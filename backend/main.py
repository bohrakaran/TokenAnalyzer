import tiktoken
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import ollama

load_dotenv()

app = FastAPI(title="ChatGPT Token Usage Analyzer")

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, be specific.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pricing per 1k tokens (example pricing, update as needed)
PRICING = {
    "gpt-3.5-turbo": {"prompt": 0.0005, "completion": 0.0015},
    "gpt-4o": {"prompt": 0.005, "completion": 0.015},
    "gpt-4-turbo": {"prompt": 0.01, "completion": 0.03},
}

class AnalysisRequest(BaseModel):
    text: str
    model: str = "gpt-3.5-turbo"

class AnalysisResponse(BaseModel):
    tokens: int
    estimated_cost: float
    model: str
    character_count: int

async def count_tokens(text: str, model_name: str) -> int:
    # Use tiktoken for OpenAI models
    if "gpt" in model_name.lower():
        try:
            encoding = tiktoken.encoding_for_model(model_name)
            return len(encoding.encode(text))
        except Exception:
            encoding = tiktoken.get_encoding("cl100k_base")
            return len(encoding.encode(text))
    
    # Handle Cloud-based Open Source models (for Recruiter Demos)
    if "(cloud)" in model_name.lower():
        # Llama 3 and others often use cl100k_base or similar
        encoding = tiktoken.get_encoding("cl100k_base")
        return len(encoding.encode(text))

    # Try Ollama for local models only
    try:
        response = ollama.generate(model=model_name, prompt=text, options={"num_predict": 1})
        return response.get("prompt_eval_count", 0)
    except Exception as e:
        print(f"Ollama error: {e}")
        # Final fallback for demo purposes
        encoding = tiktoken.get_encoding("cl100k_base")
        return len(encoding.encode(text))

@app.get("/")
async def root():
    return {"message": "Token Usage Analyzer API is running"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    token_count = await count_tokens(request.text, request.model)
    
    # Calculate cost
    # Local models and Cloud Demos are shown as free or low-cost
    is_free = any(m in request.model.lower() for m in ["llama", "mistral", "gemma", "(cloud)"])
    
    if is_free:
        cost = 0.0 # Keeping cloud demos free for recruiter impression
    else:
        model_pricing = PRICING.get(request.model, {"prompt": 0.002, "completion": 0.002})
        cost = (token_count / 1000) * model_pricing["prompt"]
    
    return {
        "tokens": token_count,
        "estimated_cost": round(cost, 6),
        "model": request.model,
        "character_count": len(request.text)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
