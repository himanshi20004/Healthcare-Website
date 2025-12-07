import os
import requests
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# --- Configuration ---
app = FastAPI(title="Medicine AI Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NEXT_APP_URL = "http://localhost:3000"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

user_states = {} 

# --- Models ---
class TrainRequest(BaseModel):
    userId: str

class PredictRequest(BaseModel):
    userId: str
    date: str 
    medicine_name: str
    total_daily_medicines: int

# --- Helpers ---

def get_model_path(user_id):
    return os.path.join(MODEL_DIR, f"model_{user_id}.pkl")

def fetch_user_data(user_id):
    try:
        url = f"{NEXT_APP_URL}/api/public/analytics/export?userId={user_id}"
        print(f"Fetching data from: {url}")
        response = requests.get(url)
        if response.status_code != 200:
            return None
        return response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def preprocess_data(raw_json):
    medicines = raw_json.get("rawdata", [])
    records = []
    
    # We cut off training at "Today" because future days aren't missed yet
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    print(f"Processing {len(medicines)} medicines...")

    for med in medicines:
        try:
            med_name = med["name"]
            
            # 1. Parse DB Start Date
            db_start_date = datetime.strptime(med["startDate"].split('T')[0], "%Y-%m-%d")
            
            # 2. Parse Taken Dates
            taken_dates_set = set()
            taken_dates_objs = []
            if med.get("datesTaken"):
                for d in med["datesTaken"]:
                    d_clean = d.split('T')[0]
                    taken_dates_set.add(d_clean)
                    taken_dates_objs.append(datetime.strptime(d_clean, "%Y-%m-%d"))
            
            # 3. Determine ACTUAL Start Date (Handle Backfilling)
            # If user clicked dates BEFORE the official start date, use the earliest click.
            actual_start_date = db_start_date
            if taken_dates_objs:
                min_taken = min(taken_dates_objs)
                if min_taken < actual_start_date:
                    actual_start_date = min_taken

            # 4. Determine End Date (Training stops at Today)
            # We don't use scheduledDays for training range, we use the timeline passed so far.
            end_date = today

            # 5. Generate Daily Records
            # Iterate from Actual Start -> Today
            delta = (end_date - actual_start_date).days
            
            # Safety: If delta is negative (start date in future), skip
            if delta < 0:
                continue

            for i in range(delta + 1):
                current_date = actual_start_date + timedelta(days=i)
                date_str = current_date.strftime("%Y-%m-%d")
                
                is_taken = 1 if date_str in taken_dates_set else 0
                
                records.append({
                    "date": current_date,
                    "medicine_name": med_name,
                    "days_since_start": i,
                    "target": is_taken
                })

        except Exception as e:
            print(f"Error processing med {med.get('name')}: {e}")

    if not records:
        return pd.DataFrame()

    df = pd.DataFrame(records)
    
    # Feature Engineering
    df['day_of_week'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month
    df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    
    daily_counts = df.groupby('date')['medicine_name'].count().reset_index()
    daily_counts.rename(columns={'medicine_name': 'daily_total_meds'}, inplace=True)
    
    df = pd.merge(df, daily_counts, on='date', how='left')

    return df

def train_model_task(user_id: str):
    print(f"--- Starting training for {user_id} ---")
    user_states[user_id] = "training"

    raw_data = fetch_user_data(user_id)
    if not raw_data:
        user_states[user_id] = "error"
        return

    df = preprocess_data(raw_data)

    if df.empty:
        user_states[user_id] = "not_enough_data"
        return

    # DEBUG LOGS
    print("--- Training Data Balance (Target Counts) ---")
    print(df['target'].value_counts()) 
    # ^^^^ THIS SHOULD NOW SHOW ~36 for '1' and remaining for '0'

    # Check for enough unique days (lowered threshold slightly for testing comfort, keep > 10)
    unique_days = df['date'].nunique()
    if unique_days < 10: 
        print(f"Not enough data: {unique_days} days found.")
        user_states[user_id] = "not_enough_data"
        return

    le = LabelEncoder()
    df['med_code'] = le.fit_transform(df['medicine_name'])
    joblib.dump(le, os.path.join(MODEL_DIR, f"encoder_{user_id}.pkl"))

    features = ['day_of_week', 'month', 'is_weekend', 'days_since_start', 'daily_total_meds', 'med_code']
    X = df[features]
    y = df['target']

    try:
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(X, y)
        joblib.dump(clf, get_model_path(user_id))
        user_states[user_id] = "trained"
        print(f"--- Training Success ---")
    except Exception as e:
        print(f"Training failed: {e}")
        user_states[user_id] = "error"

# --- Endpoints ---

@app.get("/")
def home():
    return {"message": "AI Server Ready"}

@app.get("/status/{user_id}")
def get_status(user_id: str):
    return {"state": user_states.get(user_id, "not_trained")}

@app.post("/train")
async def trigger_training(req: TrainRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(train_model_task, req.userId)
    return {"message": "Training started", "state": "training"}

@app.post("/predict")
def predict(req: PredictRequest):
    user_id = req.userId
    model_path = get_model_path(user_id)
    encoder_path = os.path.join(MODEL_DIR, f"encoder_{user_id}.pkl")
    
    if not os.path.exists(model_path):
        return {"message": "No model found", "prediction": None}

    try:
        clf = joblib.load(model_path)
        le = joblib.load(encoder_path)

        target_date = datetime.strptime(req.date, "%Y-%m-%d")
        
        try:
            med_code = le.transform([req.medicine_name])[0]
        except ValueError:
            med_code = -1 

        features_df = pd.DataFrame([{
            'day_of_week': target_date.weekday(),
            'month': target_date.month,
            'is_weekend': 1 if target_date.weekday() >= 5 else 0,
            'days_since_start': 30, # Assumed mid-course
            'daily_total_meds': req.total_daily_medicines,
            'med_code': med_code
        }])

        prediction = clf.predict(features_df)[0]
        probs = clf.predict_proba(features_df)[0]
        probability = probs[1] if len(probs) > 1 else (1.0 if prediction == 1 else 0.0)

        return {
            "prediction": "Likely to Take" if prediction == 1 else "Risk of Missing", 
            "probability_score": float(probability),
            "raw_prediction": int(prediction)
        }

    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)