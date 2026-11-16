# 🛡️ SMS Shield — Intelligent SMS Spam Detection

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13-blue?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Machine%20Learning-Scikit--learn-orange?logo=scikitlearn&logoColor=white" alt="Scikit-learn">
  <img src="https://img.shields.io/badge/Framework-Flask-black?logo=flask" alt="Flask">
  <img src="https://img.shields.io/badge/Model-Linear%20SVM-success" alt="Linear SVM">
  <img src="https://img.shields.io/badge/Deployment-Render-purple" alt="Render">
</p>

<p align="center">
  <b>An intelligent Machine Learning web application that identifies unwanted SMS messages and distinguishes Spam from legitimate messages (Ham).</b>
</p>

<p align="center">
  <a href="https://sms-shield-h68o.onrender.com/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Try_SMS_Shield-6C63FF?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/PritwishSaha/SMS-Shield">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</p>

---

## 🌐 Live Application

**Try SMS Shield:**  
https://sms-shield-h68o.onrender.com/

Paste an SMS message into the application and let the trained Machine Learning model classify it as:

- 🟢 **HAM** — A legitimate message.
- 🔴 **SPAM** — An unwanted or potentially fraudulent message.

---

## 📌 Project Overview

SMS spam messages are commonly used to distribute misleading offers, unwanted advertisements, suspicious links, and fraudulent notifications.

**SMS Shield** is a Machine Learning-based solution designed to automatically classify SMS messages using Natural Language Processing (NLP).

The application uses a TF-IDF text representation technique and a tuned Linear Support Vector Machine (Linear SVM) classifier to identify patterns in SMS messages.

The trained model is integrated into a Flask web application, allowing users to enter messages and receive predictions through an interactive interface.

### 🎯 Project Objectives

- Build an end-to-end Machine Learning classification system.
- Perform text cleaning and preprocessing.
- Explore SMS message patterns using Exploratory Data Analysis.
- Convert text into numerical features using TF-IDF.
- Compare multiple Machine Learning algorithms.
- Optimize model performance using hyperparameter tuning.
- Evaluate the final model using classification metrics.
- Deploy the trained model as a public web application.

---

## ✨ Key Features

- **Real-Time SMS Classification:** Predict whether a message is Spam or Ham.
- **NLP-Based Processing:** Clean and normalize incoming text before prediction.
- **TF-IDF Vectorization:** Convert textual messages into numerical features.
- **Machine Learning Classification:** Uses a tuned Linear SVM model.
- **Interactive Web Interface:** Simple and responsive interface built with HTML, CSS and JavaScript.
- **Model Performance Dashboard:** Displays evaluation metrics from the final trained model.
- **Input Validation:** Handles empty and invalid message submissions.
- **Live Deployment:** Accessible through a public Render URL.

---

## 🧠 Machine Learning Workflow

The project follows a complete Machine Learning pipeline:

```text
              SMS Spam Dataset
                      |
                      ▼
              Data Exploration
                      |
                      ▼
              Data Cleaning
                      |
                      ▼
           Duplicate Removal
                      |
                      ▼
            Text Preprocessing
                      |
                      ▼
             Train-Test Split
                      |
                      ▼
              TF-IDF Vectorizer
                      |
                      ▼
             Model Comparison
                      |
                      ▼
          Hyperparameter Tuning
                      |
                      ▼
              Linear SVM Model
                      |
                      ▼
             Model Evaluation
                      |
                      ▼
              Model Persistence
                      |
                      ▼
              Flask Integration
                      |
                      ▼
             Interactive Web App
                      |
                      ▼
                Deployment
```

### 1. Data Preprocessing

The original dataset contained 5,572 SMS records.

The preprocessing stage included:

- Removing duplicate messages.
- Reconstructing message text from the original dataset columns.
- Standardizing class labels.
- Converting text to lowercase.
- Normalizing URLs using a special token.
- Removing unnecessary whitespace.

After duplicate removal:

| Description | Records |
|---|---:|
| Original records | 5,572 |
| Duplicate records removed | 414 |
| Final cleaned records | 5,158 |

### 2. Exploratory Data Analysis

EDA was performed to understand the distribution and characteristics of Spam and Ham messages.

Final class distribution:

| Category | Messages |
|---|---:|
| Ham | 4,516 |
| Spam | 642 |
| **Total** | **5,158** |

Additional analysis included:

- Class distribution.
- Message length analysis.
- Word count analysis.
- Most frequent words.
- Spam-specific keywords.
- Unigram and bigram analysis.
- URL, number and currency pattern analysis.

### 3. Feature Extraction

**TF-IDF (Term Frequency–Inverse Document Frequency)** was used to transform SMS messages into numerical feature vectors.

Configuration:

| Parameter | Value |
|---|---|
| max_features | 5,000 |
| ngram_range | (1, 2) |
| min_df | 2 |
| max_df | 0.95 |
| sublinear_tf | True |

Both unigrams and bigrams were considered to capture individual words and meaningful word combinations.

### 4. Model Comparison

Three Machine Learning algorithms were evaluated:

- Multinomial Naive Bayes
- Logistic Regression
- Linear Support Vector Machine

The Linear SVM achieved the strongest baseline performance and was selected for further optimization.

### 5. Hyperparameter Tuning

GridSearchCV with Stratified 5-Fold Cross-Validation was used to optimize the Linear SVM.

Best parameters:

```python
{
    "C": 0.5,
    "class_weight": "balanced"
}
```

Best cross-validation Macro F1-score: **0.9652**

---

## 📊 Model Performance

The final tuned Linear SVM model was evaluated on an independent test set containing 1,032 messages.

### Final Evaluation Metrics

| Metric | Score |
|---|---:|
| Accuracy | **99.03%** |
| Spam Precision | **97.58%** |
| Spam Recall | **94.53%** |
| Spam F1-Score | **96.03%** |
| Macro F1-Score | **97.74%** |

### Confusion Matrix

```text
                 Predicted
              Ham       Spam

Actual Ham    901         3
Actual Spam     7       121
```

| Classification | Count |
|---|---:|
| True Negative (TN) | 901 |
| False Positive (FP) | 3 |
| False Negative (FN) | 7 |
| True Positive (TP) | 121 |

**Interpretation:**

- 901 legitimate messages were correctly classified as Ham.
- 121 spam messages were correctly detected.
- 3 legitimate messages were incorrectly classified as Spam.
- 7 spam messages were incorrectly classified as Ham.

The model correctly classified 1,022 out of 1,032 test messages.

> These results represent performance on the project's held-out test dataset. They do not guarantee the same accuracy on new, real-world SMS messages.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Programming Language | Python |
| Data Analysis | Pandas, NumPy |
| Data Visualization | Matplotlib, Seaborn |
| Natural Language Processing | NLTK, Regular Expressions |
| Feature Extraction | TF-IDF |
| Machine Learning | Scikit-learn |
| Algorithms | Naive Bayes, Logistic Regression, Linear SVM |
| Model Optimization | GridSearchCV |
| Model Persistence | Joblib |
| Backend | Flask |
| Frontend | HTML, CSS, JavaScript |
| Development Environment | Jupyter Notebook, VS Code |
| Version Control | Git, GitHub |
| Deployment | Render |

---

## 📂 Project Structure

```text
SMS-Shield/
│
├── app.py
├── requirements.txt
├── .gitignore
├── .python-version
│
├── SMS_Spam_Detection.ipynb
│
├── pritwish1.jpeg
│
├── data/
│   └── spam.csv
│
├── models/
│   ├── sms_spam_detection_model.pkl
│   └── evaluation_results.json
│
├── reports/
│   ├── classification_report.txt
│   ├── confusion_matrix.png
│   └── final_model_performance.csv
│
├── templates/
│   └── index.html
│
└── static/
    ├── css/
    │   └── style.css
    │
    ├── img/
    │   └── pritwish.jpg
    │
    └── js/
        └── script.js
```

---

## ⚙️ Installation and Local Setup

Follow these steps to run SMS Shield on your local machine.

### Prerequisites

- Python 3.13.7
- Git
- pip

### Step 1: Clone the Repository

```bash
git clone https://github.com/PritwishSaha/SMS-Shield.git
```

### Step 2: Navigate to the Project Directory

```bash
cd SMS-Shield
```

### Step 3: Create a Virtual Environment

```bash
python -m venv .venv
```

### Step 4: Activate the Environment

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

### Step 5: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 6: Run the Flask Application

```bash
python app.py
```

### Step 7: Open in Browser

Visit:

```text
http://127.0.0.1:5000
```

The SMS Shield application is now running locally.

---

## 🚀 Deployment

The Flask application is deployed using **Render**.

Deployment configuration:

| Configuration | Value |
|---|---|
| Platform | Render |
| Framework | Flask |
| Production Server | Gunicorn |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn app:app` |
| Source Code | GitHub |

**Live Application:**  
https://sms-shield-h68o.onrender.com/

---

## 🧪 Example Predictions

| SMS Message | Expected Classification |
|---|---|
| Congratulations! You won a free iPhone. Call now! | SPAM |
| Hey, are you coming to college tomorrow? | HAM |
| Your account has been selected for a cash reward. | SPAM |
| I'll reach home in 20 minutes. | HAM |

---

## 📈 Future Improvements

Potential improvements for future versions include:

- Add SMS prediction history.
- Support additional languages.
- Experiment with larger and more recent SMS datasets.
- Improve detection of modern phishing and financial scam messages.
- Add explainability to show which text features influenced a prediction.
- Develop an SMS classification API.
- Add automated model retraining and monitoring.
- Expand evaluation using external datasets.

---

## ⚠️ Limitations

- The model was trained on a historical SMS dataset.
- Its classification performance may vary on modern spam and phishing messages.
- The current model is primarily designed for English SMS messages.
- A Ham prediction does not guarantee that a message is safe.
- This project is an educational Machine Learning application and should not replace security or fraud-prevention systems.

---

## 👨‍💻 Author

<p align="center">
  <img src="static/img/pritwish.jpg" width="130" alt="Project Author">
</p>

<h3 align="center">Pritwish Saha</h3>

<p align="center">
  B.Tech Computer Science and Engineering (AI & ML)
</p>

<p align="center">
  <a href="https://github.com/PritwishSaha">GitHub</a> •
  <a href="https://www.linkedin.com/in/pritwish-saha-b49604362/">LinkedIn</a> •
  <a href="https://infotact.in/pritwish-hk5nxp">Portfolio</a>
</p>

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

Your feedback and suggestions are welcome!

---

<p align="center">
  <b>SMS Shield — Making SMS Communication Safer with Machine Learning.</b>
</p>