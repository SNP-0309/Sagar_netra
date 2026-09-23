"""Baseline detector and response helpers.

Replace ``baseline_detect`` with the trained model once labeled sonar data is
available. The response shape is kept stable so the web app does not need to
change when the model improves.
"""

from __future__ import annotations

from typing import Any

import numpy as np
from PIL import Image


def intersection_over_union(a: tuple[float, float, float, float], b: tuple[float, float, float, float]) -> float:
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    a_right, a_bottom = ax + aw, ay + ah
    b_right, b_bottom = bx + bw, by + bh
    left, top = max(ax, bx), max(ay, by)
    right, bottom = min(a_right, b_right), min(a_bottom, b_bottom)
    intersection = max(0.0, right - left) * max(0.0, bottom - top)
    union = aw * ah + bw * bh - intersection
    return intersection / union if union else 0.0


def baseline_detect(image: Image.Image) -> list[dict[str, Any]]:
    """Return candidate anomaly regions using local contrast.

    The detector intentionally calls its output ``possible_anomaly``: it is a
    useful engineering baseline, not a claim that a region is marine debris.
    """

    original_width, original_height = image.size
    scale = min(1.0, 256 / max(original_width, original_height))
    width = max(64, int(original_width * scale))
    height = max(64, int(original_height * scale))
    gray = np.asarray(image.convert("L").resize((width, height))) / 255.0

    padded = np.pad(gray, 1, mode="edge")
    local_mean = sum(
        padded[row : row + height, col : col + width]
        for row in range(3)
        for col in range(3)
    ) / 9.0
    local_contrast = np.abs(gray - local_mean)
    global_contrast = np.abs(gray - float(gray.mean()))
    score_map = local_contrast * 0.7 + global_contrast * 0.3

    tile = max(12, min(width, height) // 10)
    candidates: list[tuple[float, tuple[float, float, float, float]]] = []
    for y in range(0, height - tile + 1, max(6, tile // 2)):
        for x in range(0, width - tile + 1, max(6, tile // 2)):
            score = float(score_map[y : y + tile, x : x + tile].mean())
            if score >= 0.055:
                box = (x / width, y / height, tile / width, tile / height)
                candidates.append((score, box))

    candidates.sort(key=lambda item: item[0], reverse=True)
    selected: list[tuple[float, tuple[float, float, float, float]]] = []
    for score, box in candidates:
        if all(intersection_over_union(box, previous_box) < 0.25 for _, previous_box in selected):
            selected.append((score, box))
        if len(selected) == 8:
            break

    results: list[dict[str, Any]] = []
    for index, (score, box) in enumerate(selected, start=1):
        confidence = min(0.96, max(0.51, 0.50 + score * 2.8))
        severity = "high" if confidence >= 0.82 else "medium" if confidence >= 0.65 else "low"
        results.append(
            {
                "id": f"det_{index:03d}",
                "label": "Possible sonar anomaly",
                "confidence": round(confidence, 3),
                "severity": severity,
                "geo": None,
                "area_m2": None,
                "bounding_box": {
                    "x": round(box[0], 4),
                    "y": round(box[1], 4),
                    "w": round(box[2], 4),
                    "h": round(box[3], 4),
                },
            }
        )

    return results
