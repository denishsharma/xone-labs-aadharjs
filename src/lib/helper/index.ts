import { decompressSync } from "fflate";

export async function generateSha256Hash(data: string) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    return crypto.subtle.digest("SHA-256", dataBuffer).then(hashBuffer => bufferToHex(new Uint8Array(hashBuffer)));
}

export function bufferToHex(buffer: Uint8Array): string {
    return Array.prototype.map.call(buffer, (x: number) => (`00${x.toString(16)}`).slice(-2)).join("");
}

export function inflateQRData(data: string): Uint8Array {
    try {
        return decompressSync(Uint8Array.from(BigInt(data).toString(16).match(/.{1,2}/g)!.map(byte => Number.parseInt(byte, 16))));
    } catch (e) {
        throw new Error("The given data is not a valid compressed QR code data.", { cause: e });
    }
}
