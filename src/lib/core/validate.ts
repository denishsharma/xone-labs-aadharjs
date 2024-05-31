const dihedralGroup = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const permutation = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/**
 * Validate the AADHAR number or Virtual ID
 * @param aadhar AADHAR number or Virtual ID
 * @returns Whether the AADHAR number or Virtual ID is valid
 * @example
 * ```ts
 * const isValid = validateAadharNumber("378282210921577");
 * console.log(isValid); // true
 * ```
 */
export function validateAadharNumber(aadhar: string): boolean {
    if ((aadhar.length !== 12 && aadhar.length !== 16) || !/^\d+$/.test(aadhar) || aadhar[0] === "0" || aadhar[0] === "1") return false;

    const aadharNumber = aadhar.split("").map(Number).reverse();
    const checkSum = aadharNumber.reduce((sum, num, i) => dihedralGroup[sum][permutation[i % 8][num]], 0);
    return checkSum === 0;
}
