# ==========================================================
# SMS SPAM DETECTION - FLASK BACKEND
# ==========================================================

from flask import Flask, render_template, request, jsonify
import joblib
import os
import re
import json
from datetime import datetime

# ----------------------------------------------------------
# INITIALIZE FLASK
# ----------------------------------------------------------

app = Flask(__name__)

app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024

# ----------------------------------------------------------
# LOAD TRAINED MODEL
# ----------------------------------------------------------

MODEL_PATH = os.path.join(
    "models",
    "sms_spam_detection_model.pkl"
)

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Trained model not found: {MODEL_PATH}"
    )

model = joblib.load(MODEL_PATH)

print("SMS SPAM DETECTION MODEL LOADED SUCCESSFULLY")

# ----------------------------------------------------------
# LOAD EVALUATION METRICS
# ----------------------------------------------------------

METRICS_PATH = os.path.join(
    "models",
    "evaluation_results.json"
)

evaluation_metrics = {}

if os.path.exists(METRICS_PATH):
    with open(METRICS_PATH, "r", encoding="utf-8") as file:
        evaluation_metrics = json.load(file)

# ----------------------------------------------------------
# TEXT PREPROCESSING
# Must match the notebook preprocessing
# ----------------------------------------------------------

def preprocess_text(text):

    text = text.lower()

    text = re.sub(
        r"(https?://\S+|www\.\S+)",
        " URLTOKEN ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()

# ----------------------------------------------------------
# PREDICTION FUNCTION
# ----------------------------------------------------------

def predict_sms(message):

    processed_message = preprocess_text(message)

    prediction = model.predict([processed_message])[0]

    return prediction

# ----------------------------------------------------------
# HOME PAGE
# ----------------------------------------------------------

@app.route("/")
def home():

    return render_template(
        "index.html",
        metrics=evaluation_metrics
    )

# ----------------------------------------------------------
# PREDICTION API
# ----------------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "success": False,
                "error": "Invalid request."
            }), 400

        message = data.get("message", "")

        if not isinstance(message, str):
            return jsonify({
                "success": False,
                "error": "Message must be text."
            }), 400

        message = message.strip()

        if not message:
            return jsonify({
                "success": False,
                "error": "Please enter an SMS message."
            }), 400

        if len(message) > 5000:
            return jsonify({
                "success": False,
                "error": "Message must not exceed 5000 characters."
            }), 400

        prediction = predict_sms(message)

        result = prediction.upper()

        response = {
            "success": True,
            "message": message,
            "prediction": result,
            "timestamp": datetime.now().strftime(
                "%d %b %Y, %I:%M:%S %p"
            )
        }

        return jsonify(response)

    except Exception as error:

        app.logger.exception("Prediction failed")

        return jsonify({
            "success": False,
            "error": "Prediction failed. Please try again."
        }), 500

# ----------------------------------------------------------
# ERROR HANDLERS
# ----------------------------------------------------------

@app.errorhandler(413)
def request_entity_too_large(error):

    return jsonify({
        "success": False,
        "error": "Request is too large."
    }), 413


@app.errorhandler(404)
def page_not_found(error):

    return "Page not found", 404

# ----------------------------------------------------------
# RUN APPLICATION
# ----------------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )