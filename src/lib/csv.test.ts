import { describe, expect, it } from "vitest";
import { sanitizeForCsv } from "./csv";

describe("sanitizeForCsv", () => {
    it("returns empty string for nullish values", () => {
        expect(sanitizeForCsv(null)).toBe("");
        expect(sanitizeForCsv(undefined)).toBe("");
        expect(sanitizeForCsv("")).toBe("");
    });

    it("passes normal text through unchanged", () => {
        expect(sanitizeForCsv("Hello world")).toBe("Hello world");
        expect(sanitizeForCsv("12345")).toBe("12345");
        expect(sanitizeForCsv("Acme, Inc.")).toBe("Acme, Inc.");
    });

    it("prefixes formula-starting characters with a single quote", () => {
        expect(sanitizeForCsv("=SUM(A1:A2)")).toBe("'=SUM(A1:A2)");
        expect(sanitizeForCsv("+1+1")).toBe("'+1+1");
        expect(sanitizeForCsv("-cmd")).toBe("'-cmd");
        expect(sanitizeForCsv("@SUM(1)")).toBe("'@SUM(1)");
    });

    it("prefixes values starting with whitespace control characters", () => {
        expect(sanitizeForCsv("\t=BAD")).toBe("'\t=BAD");
        expect(sanitizeForCsv("\rpoison")).toBe("'\rpoison");
    });

    it("does not prefix when the risky character is not at the start", () => {
        expect(sanitizeForCsv("sum=1")).toBe("sum=1");
        expect(sanitizeForCsv("a+b")).toBe("a+b");
    });
});
