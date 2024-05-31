export const DATA_SEPARATOR = 255;
export const VERSION_MARKER = 86;

export const INVALID_START_MARKER = 60;

export const JPEG2000_MARKER = [255, 79];

export const HASH_BYTE_SIZE = 32;
export const SIGN_BYTE_SIZE = 256;

export const AadharQRTextDataOrder = [
    "version",
    "mobileEmailFlag",
    "refId",
    "name",
    "dob",
    "gender",
    "address.co",
    "address.district",
    "address.landmark",
    "address.house",
    "address.location",
    "address.pincode",
    "address.po",
    "address.state",
    "address.street",
    "address.subdist",
    "address.vtc",
    "lastMobile4Digits",
] as const;
