import { createAadharObject, createInternalAadharDataObjectInstance } from "./aadhar";
import { AadharQRTextDataOrder, DATA_SEPARATOR, HASH_BYTE_SIZE, INVALID_START_MARKER, JPEG2000_MARKER, SIGN_BYTE_SIZE, VERSION_MARKER } from "../constants/aadhar";
import { bufferToHex, inflateQRData } from "../helper";

import type { AadharObject } from "../types/aadhar";

/**
 * Decode Aadhar QR code data to Aadhar object
 *
 * @param {string} qr Aadhar QR code data
 * @returns {AadharObject} Decoded Aadhar object
 * @example
 * ```ts
 * const aadhar = decodeAadhar("...");
 * ```
 */
export function decodeAadhar(qr: string): AadharObject {
    const data = inflateQRData(qr);
    const aadhar = createInternalAadharDataObjectInstance();
    let offset = -1;

    // Get version
    const firstByte = data[0];
    const version = firstByte === VERSION_MARKER
        ? Number.parseInt(String.fromCharCode(data[1]))
        : firstByte === INVALID_START_MARKER ? "invalid" : 0;
    if (version === "invalid") throw new Error("The data is not a valid version of Aadhar QR code");

    // Parse data
    AadharQRTextDataOrder.forEach((key) => {
        if (version !== 2 && (key === "lastMobile4Digits" || key === "version")) return;

        const dataEndIndex = data.findIndex((byte, index) => index > offset && byte === DATA_SEPARATOR);
        const dataSlice = data.slice(offset + 1, dataEndIndex);
        const dataString = String.fromCharCode(...dataSlice);

        if (key.startsWith("address.")) {
            const _key = key.split(".")[1];
            aadhar.set.address(_key, dataString);
            offset = dataEndIndex;
            return;
        }

        if (key === "mobileEmailFlag") {
            aadhar.set.mobileEmailFlag(Number.parseInt(dataString));
        } else if (key === "refId") {
            aadhar.set.refId(dataString);
        } else if (key === "name") {
            aadhar.set.name(dataString);
        } else if (key === "dob") {
            aadhar.set.dob(dataString);
        } else if (key === "gender") {
            aadhar.set.gender(dataString);
        }

        offset = dataEndIndex;
    });

    // Extract image
    const hasImage = data.findIndex((byte, index) => byte === JPEG2000_MARKER[0] && data[index + 1] === JPEG2000_MARKER[1]);
    if (hasImage) {
        const imageIndex = offset + 1;
        const imageEndIndex = data.length - SIGN_BYTE_SIZE - (Math.max(version !== 2 ? aadhar.get.mobileEmailFlag() - 1 : 1, 0) * HASH_BYTE_SIZE);
        if (imageIndex !== -1 && imageEndIndex !== -1) {
            const image = data.slice(imageIndex, imageEndIndex);
            aadhar.set.image(image);
            offset = imageEndIndex - 1;
        }
    }

    // Extract hashes
    if (aadhar.get.mobileEmailFlag() === 3 || aadhar.get.mobileEmailFlag() === 2) {
        const emailIndex = offset + 1;
        const hash = data.slice(offset + 1, emailIndex + HASH_BYTE_SIZE);
        aadhar.set.hash("email", bufferToHex(hash));
        offset = emailIndex + HASH_BYTE_SIZE - 1;
    }
    if ((aadhar.get.mobileEmailFlag() === 3 || aadhar.get.mobileEmailFlag() === 1) && version !== 2) {
        const hashIndex = offset + 1;
        const hash = data.slice(hashIndex, hashIndex + HASH_BYTE_SIZE);
        aadhar.set.hash("mobile", bufferToHex(hash));
        offset = hashIndex + HASH_BYTE_SIZE - 1;
    }

    // Extract signature
    const signature = data.slice(offset + 1);
    aadhar.set.signature(bufferToHex(signature));

    return createAadharObject(aadhar.finalize());
}
