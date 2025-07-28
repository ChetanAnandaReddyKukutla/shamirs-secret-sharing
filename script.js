// Shamir's Secret Sharing Implementation
const fs = require('fs');

function baseToDecimal(str, base) {
    let result = 0n;
    for (let i = 0; i < str.length; i++) {
        let digit = str[i];
        let value;
        
        if (digit >= '0' && digit <= '9') {
            value = digit.charCodeAt(0) - '0'.charCodeAt(0);
        } else if (digit >= 'a' && digit <= 'z') {
            value = digit.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
        } else if (digit >= 'A' && digit <= 'Z') {
            value = digit.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
        } else {
            throw new Error(`Invalid digit: ${digit}`);
        }
        
        if (value >= base) {
            throw new Error(`Digit ${digit} is invalid for base ${base}`);
        }
        
        result = result * BigInt(base) + BigInt(value);
    }
    return result;
}

// Generate all k-sized combinations from array
function generateCombinations(arr, k) {
    const combinations = [];
    
    function backtrack(start, currentCombination) {
        if (currentCombination.length === k) {
            combinations.push([...currentCombination]);
            return;
        }
        
        for (let i = start; i < arr.length; i++) {
            currentCombination.push(arr[i]);
            backtrack(i + 1, currentCombination);
            currentCombination.pop();
        }
    }
    
    backtrack(0, []);
    return combinations;
}

// Lagrange Interpolation to find constant term
function lagrangeInterpolation(points) {
    let totalNumerator = 0n;
    let totalDenominator = 1n;
    
    for (let i = 0; i < points.length; i++) {
        const [xi, yi] = points[i];
        
        let numerator = 1n;
        let denominator = 1n;
        
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                const [xj, ] = points[j];
                // For x = 0: (0 - xj) / (xi - xj) = -xj / (xi - xj)
                numerator *= (-xj);
                denominator *= (xi - xj);
            }
        }
        
        // Add term to total using fraction arithmetic
        const newNumerator = totalNumerator * denominator + yi * numerator * totalDenominator;
        const newDenominator = totalDenominator * denominator;
        
        const gcd = gcdBigInt(abs(newNumerator), abs(newDenominator));
        totalNumerator = newNumerator / gcd;
        totalDenominator = newDenominator / gcd;
    }
    
    if (totalNumerator % totalDenominator !== 0n) {
        throw new Error("Result is not an integer");
    }
    
    return totalNumerator / totalDenominator;
}

// Helper function to calculate GCD
function gcdBigInt(a, b) {
    while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function abs(n) {
    return n < 0n ? -n : n;
}

// Parse JSON file and extract points
function parseInputFile(filename) {
    try {
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        const n = data.keys.n;
        const k = data.keys.k;
        const points = [];
        
        for (let key in data) {
            if (key !== 'keys' && !isNaN(parseInt(key))) {
                const x = BigInt(parseInt(key));
                const base = parseInt(data[key].base);
                const value = data[key].value;
                
                try {
                    const y = baseToDecimal(value, base);
                    points.push([x, y]);
                } catch (baseError) {
                    console.error(`Error converting value "${value}" from base ${base}: ${baseError.message}`);
                    return null;
                }
            }
        }
        
        return { n, k, points };
    } catch (error) {
        console.error(`Error reading file ${filename}:`, error.message);
        return null;
    }
}

function findSecret(filename) {
    const parsed = parseInputFile(filename);
    if (!parsed) {
        return null;
    }
    
    const { n, k, points } = parsed;
    
    console.log(`Processing ${filename}: n=${n}, k=${k}, points=${points.length}`);
    
    const combinations = generateCombinations(points, k);
    console.log(`Generated ${combinations.length} combinations`);
    
    const constantTermCounts = new Map();
    let validCombinations = 0;
    
    for (const combination of combinations) {
        try {
            const constantTerm = lagrangeInterpolation(combination);
            const key = constantTerm.toString();
            constantTermCounts.set(key, (constantTermCounts.get(key) || 0) + 1);
            validCombinations++;
        } catch (error) {
            continue;
        }
    }
    
    console.log(`Valid combinations: ${validCombinations}/${combinations.length}`);
    
    let maxCount = 0;
    let mostFrequentSecret = null;
    
    for (const [secret, count] of constantTermCounts) {
        console.log(`Secret candidate: ${secret} (appears ${count} times)`);
        if (count > maxCount) {
            maxCount = count;
            mostFrequentSecret = secret;
        }
    }
    
    return mostFrequentSecret;
}

function main() {
    console.log('Shamir\'s Secret Sharing\n');
    
    const secret1 = findSecret('testcase1.json');
    if (secret1 !== null) {
        console.log(`\nSecret for Testcase 1: ${secret1}`);
    } else {
        console.log('Failed to find secret for Testcase 1');
    }
    
    const secret2 = findSecret('testcase2.json');
    if (secret2 !== null) {
        console.log(`\nSecret for Testcase 2: ${secret2}`);
    } else {
        console.log('Failed to find secret for Testcase 2');
    }
    
    console.log('\nProcessing complete!');
}

main();
