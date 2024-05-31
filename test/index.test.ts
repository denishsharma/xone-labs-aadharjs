import { describe, expect, it } from "vitest";

import { VALID_AADHAR_QR_DATA } from "./constants/aadhar";
import { decode, validateAadharNumber } from "../src/lib";

describe("aadharjs", () => {
    it("should validate aadhar number successfully", () => {
        const isValid = validateAadharNumber("499118665246");
        expect(isValid).toBe(true);
    });

    it("should validate aadhar number unsuccessfully", () => {
        const isValid = validateAadharNumber("49911866524");
        expect(isValid).toBe(false);
    });

    it("should throw invalid qr data error", () => {
        try {
            decode("...");
            expect(true).toBe(false);
        } catch (error) {
            expect(error.message).toBe("The given data is not a valid compressed QR code data.");
        }
    });

    it("should decode aadhar data successfully", () => {
        const data = decode(VALID_AADHAR_QR_DATA);
        expect(data).toBeDefined();
        expect(data).toHaveProperty("data.referenceId", "269720190308114407437");
    });
});
