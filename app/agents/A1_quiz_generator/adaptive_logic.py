def diagnostic_distribution():
    return {
        "mode": "diagnostic",
        "distribution": {
            "easy": 3,
            "medium": 4,
            "hard": 3
        }
    }

def base_from_accuracy(accuracy):
    if accuracy is None:
        return diagnostic_distribution()

    if accuracy < 50:
        return {
            "mode": "adaptive",
            "distribution": {"easy": 5, "medium": 3, "hard": 2}
        }
    elif 50 <= accuracy < 75:
        return {
            "mode": "adaptive",
            "distribution": {"easy": 2, "medium": 5, "hard": 3}
        }
    else:
        return {
            "mode": "adaptive",
            "distribution": {"easy": 1, "medium": 4, "hard": 5}
        }

def adjust_by_improvement(profile, improvement):
    if improvement is None:
        return profile

    distribution = profile["distribution"]

    if improvement > 10:
        distribution["hard"] += 1
        distribution["easy"] = max(1, distribution["easy"] - 1)
    elif improvement < -5:
        distribution["easy"] += 1
        distribution["hard"] = max(1, distribution["hard"] - 1)

    profile["distribution"] = distribution
    return profile

def determine_difficulty(performance_data):
    base_profile = base_from_accuracy(performance_data.get("accuracy"))
    final_profile = adjust_by_improvement(
        base_profile,
        performance_data.get("improvement")
    )
    return final_profile