import { create } from "mutative";

import { generateSha256Hash } from "../helper";

import type { AadharDataObject, AadharObject, InternalAadharDataObject, MutableInternalAadharDataObjectInstance } from "../types/aadhar";
import type { Nullable } from "../types/generic";

function castInternalAadharDataObjectToIAadharDataObject(data: InternalAadharDataObject): AadharDataObject {
    return {
        version: data.version,
        referenceId: data.refId,
        demographic: {
            name: data.name,
            dob: new Date(data.dob),
            gender: data.gender,
        },
        address: {
            co: data.address.co ?? null,
            district: data.address.district ?? null,
            landmark: data.address.landmark ?? null,
            house: data.address.house ?? null,
            location: data.address.location ?? null,
            pincode: data.address.pincode ?? null,
            po: data.address.po ?? null,
            state: data.address.state ?? null,
            street: data.address.street ?? null,
            subdist: data.address.subdist ?? null,
            vtc: data.address.vtc ?? null,
        },
        contains: {
            mobile: (data.mobileEmailFlag === 1 || data.mobileEmailFlag === 3) && data.hash.mobile !== null,
            email: (data.mobileEmailFlag === 2 || data.mobileEmailFlag === 3) && data.hash.email !== null,
        },
    };
}

export function createAadharObject(data: InternalAadharDataObject): AadharObject {
    return {
        data: create(castInternalAadharDataObjectToIAadharDataObject(data), () => {}),
        async validate(type, value) {
            const rehashing = Math.max(Number.parseInt(data.refId[3]), 2);
            if (type === "mobile") {
                const hash = data.hash.mobile;
                let mobileHash = await generateSha256Hash(value);
                for (let i = 1; i < rehashing; i++) {
                    mobileHash = await generateSha256Hash(mobileHash);
                }
                return hash === mobileHash;
            } else if (type === "email") {
                const hash = data.hash.email;
                let emailHash = await generateSha256Hash(value);
                for (let i = 1; i < rehashing; i++) {
                    emailHash = await generateSha256Hash(emailHash);
                }
                return hash === emailHash;
            }

            throw new Error("Invalid type");
        },
        getSignature() {
            return data.signature;
        },
        getImage() {
            return data.image;
        },
        getHash(type) {
            return data.hash[type];
        },
        get __internal() {
            return create(data, () => {});
        },
    };
}

export function createInternalAadharDataObjectInstance(): MutableInternalAadharDataObjectInstance {
    const mutableData: InternalAadharDataObject = {
        version: null,
        mobileEmailFlag: -1,
        refId: "",
        name: "",
        dob: "",
        gender: "",
        address: {},
        lastMobile4Digits: null,
        image: null,
        hash: {
            mobile: null,
            email: null,
        },
        signature: "",
    };

    return {
        set: {
            version(version: Nullable<string>) {
                mutableData.version = version;
            },
            mobileEmailFlag(flag: number) {
                mutableData.mobileEmailFlag = flag;
            },
            refId(id: string) {
                mutableData.refId = id;
            },
            name(name: string) {
                mutableData.name = name;
            },
            dob(dob: string) {
                mutableData.dob = dob;
            },
            gender(gender: string) {
                mutableData.gender = gender;
            },
            address(key: string, value: Nullable<string>) {
                if (!mutableData.address) mutableData.address = {} as Record<string, Nullable<string>>;
                mutableData.address[key] = value;
            },
            lastMobile4Digits(digits: Nullable<string>) {
                mutableData.lastMobile4Digits = digits;
            },
            image(image: Nullable<Uint8Array>) {
                mutableData.image = image;
            },
            hash(type: "mobile" | "email", value: Nullable<string>) {
                if (!mutableData.hash) mutableData.hash = {} as Record<"mobile" | "email", Nullable<string>>;
                mutableData.hash[type] = value;
            },
            signature(signature: string) {
                mutableData.signature = signature;
            },
        },
        get: {
            version() {
                return mutableData.version;
            },
            mobileEmailFlag() {
                return mutableData.mobileEmailFlag;
            },
            refId() {
                return mutableData.refId;
            },
            name() {
                return mutableData.name;
            },
            dob() {
                return mutableData.dob;
            },
            gender() {
                return mutableData.gender;
            },
            address(key) {
                return mutableData.address[key];
            },
            lastMobile4Digits() {
                return mutableData.lastMobile4Digits;
            },
            image() {
                return mutableData.image;
            },
            hash(type) {
                return mutableData.hash[type];
            },
            signature() {
                return mutableData.signature;
            },
        },
        finalize: () => create(mutableData, () => {}),
    };
}
