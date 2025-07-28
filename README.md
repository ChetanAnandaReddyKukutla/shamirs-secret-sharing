# Shamir's Secret Sharing

This project implements Shamir's Secret Sharing algorithm to find the constant term of a polynomial given encoded points.

## Files

- `script.js` - Main implementation
- `testcase1.json` - Test case 1 
- `testcase2.json` - Test case 2

## Usage

```bash
node script.js
```

## Output

The program will output the secret (constant term) for both test cases.

## Algorithm

Uses Lagrange interpolation to reconstruct the polynomial and find the constant term by evaluating at x=0.
