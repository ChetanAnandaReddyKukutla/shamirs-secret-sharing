# Shamir's Secret Sharing Implementation

A JavaScript implementation of Shamir's Secret Sharing algorithm to reconstruct polynomial coefficients and find the constant term (secret) from encoded data points.

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Algorithm Explanation](#algorithm-explanation)
- [Implementation Details](#implementation-details)
- [File Structure](#file-structure)
- [Usage](#usage)
- [Example](#example)
- [Mathematical Background](#mathematical-background)
- [Key Features](#key-features)

## 🔍 Overview

This project implements a simplified version of Shamir's Secret Sharing algorithm. Given a set of encoded points that lie on an unknown polynomial, the program reconstructs the polynomial and extracts the constant term (the "secret").

The implementation handles:
- **Base conversion** from various number systems (binary, octal, decimal, hexadecimal, etc.)
- **Polynomial reconstruction** using Lagrange interpolation
- **Secret extraction** by evaluating the polynomial at x=0

## 📝 Problem Statement

Given an unknown polynomial of degree `m`:

```
f(x) = a_m * x^m + a_{m-1} * x^{m-1} + ... + a_1 * x + c
```

Where:
- `m` is the degree of the polynomial
- `c` is the constant term (our secret)
- We need `k = m + 1` points to uniquely determine the polynomial

The challenge is that the points are provided in a specific encoded format with different number bases.

## 🧮 Algorithm Explanation

### Step 1: Input Parsing
- Read JSON files containing encoded polynomial points
- Extract `n` (total points) and `k` (minimum points needed)
- Parse each point where:
  - `x` = key of the JSON object
  - `y` = decoded value from the given base

### Step 2: Base Conversion
Convert encoded `y` values from their respective bases to decimal:
```javascript
// Example: "111" in base 2 = 7 in decimal
// Example: "213" in base 4 = 39 in decimal
```

### Step 3: Polynomial Reconstruction
Use **Lagrange Interpolation** to find the polynomial that passes through the decoded points.

### Step 4: Secret Extraction
Evaluate the reconstructed polynomial at `x = 0` to get the constant term.

### Step 5: Validation
Since we have more points than needed (`n ≥ k`), we:
- Generate all possible combinations of `k` points
- Find the most frequently occurring constant term
- This ensures robustness against potential data errors

## 🔧 Implementation Details

### Base Conversion Function
```javascript
function baseToDecimal(str, base)
```
- Supports bases 2 through 36
- Handles digits 0-9 and letters a-z (case insensitive)
- Uses BigInt for handling large numbers

### Lagrange Interpolation
```javascript
function lagrangeInterpolation(points)
```
- Implements exact fraction arithmetic to avoid floating-point errors
- Evaluates polynomial at x=0 using the Lagrange formula:
  ```
  f(0) = Σ [y_i * Π(-x_j)/(x_i - x_j)] for j ≠ i
  ```

### Combination Generation
```javascript
function generateCombinations(arr, k)
```
- Generates all possible k-sized combinations from n points
- Uses backtracking algorithm for efficiency

## 📁 File Structure

```
shamirs-secret-sharing/
├── script.js           # Main implementation
├── testcase1.json      # Test case 1 (4 points, k=3)
├── testcase2.json      # Test case 2 (10 points, k=7)
├── package.json        # Project metadata
└── README.md          # This file
```

## 🚀 Usage

### Prerequisites
- Node.js installed on your system

### Running the Program
```bash
# Clone the repository
git clone https://github.com/ChetanAnandaReddyKukutla/shamirs-secret-sharing.git

# Navigate to the directory
cd shamirs-secret-sharing

# Run the program
node script.js
```

### Alternative
```bash
npm start
```

## 📊 Example

### Input (testcase1.json)
```json
{
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
}
```

### Decoding Process
- Point 1: (1, 4) - "4" in base 10 = 4
- Point 2: (2, 7) - "111" in base 2 = 7  
- Point 3: (3, 12) - "12" in base 10 = 12
- Point 6: (6, 39) - "213" in base 4 = 39

### Output
```
Shamir's Secret Sharing

Processing testcase1.json: n=4, k=3, points=4
Generated 4 combinations
Valid combinations: 4/4
Secret candidate: 3 (appears 4 times)

Secret for Testcase 1: 3
```

## 🧮 Mathematical Background

### Lagrange Interpolation Formula
For points (x₀,y₀), (x₁,y₁), ..., (xₖ₋₁,yₖ₋₁), the interpolating polynomial is:

```
P(x) = Σ y_i * L_i(x)
```

Where the Lagrange basis polynomials are:
```
L_i(x) = Π (x - x_j) / (x_i - x_j) for j ≠ i
```

To find the constant term, we evaluate at x = 0:
```
P(0) = Σ y_i * Π (-x_j) / (x_i - x_j) for j ≠ i
```

### Why This Works
- Any polynomial of degree m is uniquely determined by m+1 points
- Shamir's Secret Sharing splits a secret into n shares
- Any k shares can reconstruct the secret (where k ≤ n)
- The secret is the y-intercept (constant term) of the polynomial

## ✨ Key Features

- **Pure JavaScript**: No external dependencies except Node.js built-ins
- **BigInt Support**: Handles arbitrarily large numbers (up to 256-bit as per requirements)
- **Multiple Base Support**: Converts from bases 2-36
- **Robust Error Handling**: Gracefully handles invalid inputs and edge cases
- **Combination Analysis**: Tests all possible point combinations for reliability
- **Exact Arithmetic**: Uses fraction arithmetic to avoid floating-point precision issues

## 🎯 Results

The program successfully finds the secrets for both test cases:
- **Testcase 1**: Secret = 3
- **Testcase 2**: Secret = 79836264049851

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This implementation is part of a Catalog Placements Assignment and demonstrates the mathematical concepts behind Shamir's Secret Sharing scheme.
