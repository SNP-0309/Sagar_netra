import unittest

from PIL import Image, ImageDraw

from app.detector import baseline_detect


class BaselineDetectorTests(unittest.TestCase):
    def test_returns_normalized_detection_boxes(self) -> None:
        image = Image.new("L", (320, 240), color=80)
        draw = ImageDraw.Draw(image)
        draw.rectangle((120, 80, 170, 135), fill=240)

        detections = baseline_detect(image)

        self.assertGreater(len(detections), 0)
        for detection in detections:
            box = detection["bounding_box"]
            self.assertGreaterEqual(box["x"], 0)
            self.assertLessEqual(box["x"] + box["w"], 1)
            self.assertGreaterEqual(box["y"], 0)
            self.assertLessEqual(box["y"] + box["h"], 1)


if __name__ == "__main__":
    unittest.main()
