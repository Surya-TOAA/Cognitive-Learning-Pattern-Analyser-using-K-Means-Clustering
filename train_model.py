import os
import numpy as np
import joblib
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Ensure the directory exists
os.makedirs("ml_models", exist_ok=True)

# 1. Simulate 100 synthetic user feature vectors (11 features extracted by A2)
# Features: [acc_overall, acc_easy, acc_med, acc_hard, avg_time, carelessness, imp, pat, foc, ref, risk]
np.random.seed(42)
X = np.random.rand(100, 11)

# Adjust some columns to make the fake data realistic
X[:, 4] = X[:, 4] * 60  # Scale avg_response_time to seconds (0-60s)
X[:, 6:11] = X[:, 6:11] * 3  # Scale psychological traits to 0-3 range

# 2. Scale the data (CRITICAL for K-Means)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. Train K-Means with 4 clusters
print("Training K-Means with 4 clusters...")
kmeans = KMeans(n_clusters=4, random_state=42)
kmeans.fit(X_scaled)

# 4. Save the scaler and model for A3 to use later
joblib.dump(scaler, "ml_models/scaler.pkl")
joblib.dump(kmeans, "ml_models/kmeans_model.pkl")

print("✅ Model trained and saved successfully in the ml_models/ directory!")