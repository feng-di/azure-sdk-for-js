## API Report File for "@azure/core-util"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export function computeSha256Hash(content: string, encoding: "base64" | "hex"): Promise<string>;

// @public
export function computeSha256Hmac(key: string, stringToSign: string, encoding: "base64" | "hex"): Promise<string>;

// @public
export function delay(timeInMs: number): Promise<void>;

// @public
export function getErrorMessage(e: unknown): string;

// @public
export function getRandomIntegerInclusive(min: number, max: number): number;

// @public
export function isError(e: unknown): e is Error;

// @public
export const isNode: boolean;

// @public
export function isObject(input: unknown): input is UnknownObject;

// @public
export type UnknownObject = {
    [s: string]: unknown;
};

// (No @packageDocumentation comment for this package)

```
