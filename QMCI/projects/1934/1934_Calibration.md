Project: [[1934]]
Start Date: [[2021-02-18]]

# Setup

| Parameter      | Value                                 |
| -------------- | ------------------------------------- |
| Distance$_{1}$ | 0.120 m                               |
| Distance$_{2}$ | 0.038 m                               |
| Diameter$_{1}$ | 10 mm                                 |
| Diameter$_{2}$ | 20 mm                                 |
| Load R         | 2 x 42.26 kOhm                        |
| Gain           | 100x                                  |
| T$_{BB}$       | 800 K                                 |
| Amp Type       | modified, "faster" AC/DC diff amp RVS |


# Find best bias

| Coupling        | Effective Bias Load | V$_{bias}$ (V) | V$_{detector}$ (V) | I$_{detector}$ (uA) | R$_{detector}$ (kOhms) | offset posn. | 2mm Broad Signal | 50 kHz Noise | V$_{offset}$ | S:N    | micro |
| --------------- | ------------------- | -------------- | ------------------ | ------------------- | ---------------------- | ------------ | ---------------- | ------------ | ------------ | ------ | ----- |
| AC              | 84.52e3             | 1.989          | 0.356              | 23.53               | 15.13                  | 0            | 6.496e-6         | 1.74e-8      | -0.777 V     | 373.33 | 1e-6  |
| AC              | 84.52e3             | 4.001          | 0.640              | 47.34               | 13.52                  | 0            | 8.67e-6          | 1.69e-8      | -0.780 V     | 513.02 | 1e-6  |
| AC              | 84.52e3             | 5.984          | 0.810              | 70.80               | 11.44                  | 0            | 7.65e-6          | 1.65e-8      | -0.776 v     | 463.64 | 1e-6  |
| AC              | 84.52e3             | 8.14           | 0.986              | 96.31               | 10.24                  | 0            | 3.65e-6          | 1.65e-8      | -0.779 V     | 221.21 | 1e-6  |
| AC              | 84.52e3             | 3.03           | 0.501              | 35.85               | 13.97                  | 0            | 8.00e-6          | 1.60e-8      | ""           | 500.00 | 1e-6  |
| AC              | 84.52e3             | 5.0            | 0.720              | 59.16               | 12.17                  | 0            | 8.34e-6          | 1.60e-8      | ""           | 521.25 | 1e-6  |
| DC              | 84.52e3             | 5.0            | 0.728              | 59.16               | 12.31                  | 731          | 8.32e-6          | 2.0e-8       | ""           | 416.00 | 1e-6  |
| DC (2021-02-21) | 84.52e3             | 5.0            | 0.745              | 59.16               | 0.00                   | 742          | 9.21e-6          | 9.56e-9      | 0.1mV        | 963.39 | 1e-6  |
<!-- TBLFM: $11=($8/$9);%.2f -->
<!-- TBLFM: $5=(($3/$2)/$12);%.2f -->
<!-- TBLFM: $6=(($4/($5*$12))/1000);%.2f -->

# NEP Measurements

## 850 $\mu$m BP

[[2021-02-18]]

Power incident upon window through filter set = 1.74 e-10 W
Signal = 1.6e-7
Noise = 1.6e-8
NEP$_{system optical}$ = 11 pW/$\sqrt{Hz}$

[[2021-02-21]]

[[rashmi]] made changes to amplifer to half noise, so calibration now:

Power incident upon window through filter set = 1.74 e-10 W
Signal = 1.8e-7
Noise = 9.6e-9
Responsivity = 1.45 kV/W
NEP$_{system optical}$ = 6.6 pW/$\sqrt{Hz}$

## 1.1mm BP + FG (legacy measurement)

[[2021-02-21]]

Power incident upon window through filter set = 7.056 e-11 W
Signal = 1.85e-7
Noise = 9.6e-9
Responsivity = 3.67 kV/W
NEP$_{system optical}$ = 2.7 pW/$\sqrt{Hz}$


[[calibration]]