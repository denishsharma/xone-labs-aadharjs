import type { Freeze, Nullable } from "./generic";

export interface IAadharAddressData {
    address: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
}

export interface IAadharData {
    version?: string;
    mobileEmailLink: string;
    referenceId: string;
    name: string;
    dob: string;
    gender: string;
    address: IAadharAddressData;
    lastMobile4Digits?: string;
    image?: Uint8Array;
    mobileHash?: string;
    emailHash?: string;
    signature: string;
}

export interface InternalAadharDataObject {
    version: Nullable<string>;
    mobileEmailFlag: number;
    refId: string;
    name: string;
    dob: string;
    gender: string;
    address: Record<string, Nullable<string>>;
    lastMobile4Digits: Nullable<string>;
    image: Nullable<Uint8Array>;
    hash: {
        mobile: Nullable<string>;
        email: Nullable<string>;
    };
    signature: string;
}

export interface MutableInternalAadharDataObjectInstance {
    set: {
        version: (version: Nullable<string>) => void;
        mobileEmailFlag: (flag: number) => void;
        refId: (id: string) => void;
        name: (name: string) => void;
        dob: (dob: string) => void;
        gender: (gender: string) => void;
        address: (key: string, value: Nullable<string>) => void;
        lastMobile4Digits: (digits: Nullable<string>) => void;
        image: (image: Nullable<Uint8Array>) => void;
        hash: (type: "mobile" | "email", value: Nullable<string>) => void;
        signature: (signature: string) => void;
    };
    get: {
        version: () => Nullable<string>;
        mobileEmailFlag: () => number;
        refId: () => string;
        name: () => string;
        dob: () => string;
        gender: () => string;
        address: (key: string) => Nullable<string | number | boolean>;
        lastMobile4Digits: () => Nullable<string>;
        image: () => Nullable<Uint8Array>;
        hash: (type: "mobile" | "email") => Nullable<string>;
        signature: () => string;
    };
    finalize: () => Freeze<InternalAadharDataObject>;
}

export interface AadharDataObject {
    version: Nullable<string>;
    /** Last four digits of Aadhaar code and date time stamp in “DDMMYYYYHHMMSSsss” (including milliseconds) format */
    referenceId: string;
    demographic: {
        name: string;
        dob: Date;
        gender: string;
    };
    address: {
        co: Nullable<string>;
        district: Nullable<string>;
        landmark: Nullable<string>;
        house: Nullable<string>;
        location: Nullable<string>;
        pincode: Nullable<string>;
        po: Nullable<string>;
        state: Nullable<string>;
        street: Nullable<string>;
        subdist: Nullable<string>;
        vtc: Nullable<string>;
    };
    contains: {
        mobile: boolean;
        email: boolean;
    };
}

export interface AadharObject {
    /**
     * Validates the mobile or email address with the Aadhar data hash
     * @param {"mobile" | "email"} type
     * @param {string} value
     * @returns {Promise<boolean>}
     */
    validate: (type: "mobile" | "email", value: string) => Promise<boolean>;

    /**
     * Returns the signature of the Aadhar data
     * @returns {string}
     */
    getSignature: () => string;

    /**
     * Returns the JPEG image Uint8Array of the Aadhar data
     * @returns {Nullable<Uint8Array>}
     */
    getImage: () => Nullable<Uint8Array>;

    /**
     * Returns the SHA-256 hash of the mobile or email address
     * @param {"mobile" | "email"} type
     * @returns {Nullable<string>}
     */
    getHash: (type: "mobile" | "email") => Nullable<string>;

    /**
     * Aadhar data object
     */
    data: AadharDataObject;

    /**
     * Internal Aadhar data object for debugging
     * @returns {Freeze<InternalAadharDataObject>}
     */
    get __internal(): Freeze<InternalAadharDataObject>;
}
