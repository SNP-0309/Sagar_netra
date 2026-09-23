# Test images

These synthetic raster images are for testing the upload and baseline-analysis
workflow. They are not labeled scientific ground truth and must not be used to
report model accuracy.

| File | Intended use |
| --- | --- |
| `sonar-debris-heavy.png` | Several obvious high-contrast debris-like signatures |
| `sonar-clean-seabed.png` | Negative-control scan with mostly uniform seabed texture |
| `sonar-mixed-anomalies.png` | Rocky patch, cable-like line, circular object, and ambiguous shadow |
| `sonar-single-subtle-anomaly.png` | Mostly clean scan with one subtle low-contrast candidate |
| `sonar-dense-debris-field.png` | Dense field of bright, separated debris-like targets |
| `sonar-asymmetric-debris-zone.png` | Clean left side with a concentrated debris zone on the right |
| `sonar-low-contrast.png` | Low-contrast scan for sensitivity and false-positive testing |

Upload them from `/analyze` after starting the local ML service.
