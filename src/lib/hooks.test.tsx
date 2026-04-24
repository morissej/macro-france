import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollSpy } from "./hooks";

describe("useScrollSpy", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    beforeEach(() => {
        observe.mockClear();
        disconnect.mockClear();
        // Minimal IntersectionObserver mock for jsdom.
        class MockIO {
            observe = observe;
            unobserve = vi.fn();
            disconnect = disconnect;
            takeRecords = () => [];
            root = null;
            rootMargin = "";
            thresholds = [];
        }
        // @ts-expect-error assigning mock to global
        globalThis.IntersectionObserver = MockIO;
    });

    it("observes every section id that exists in the DOM", () => {
        document.body.innerHTML = `<div id="a"></div><div id="b"></div>`;
        renderHook(() => useScrollSpy(["a", "b", "missing"]));
        // One observer per existing element.
        expect(observe).toHaveBeenCalledTimes(2);
    });

    it("disconnects observers on unmount", () => {
        document.body.innerHTML = `<div id="a"></div>`;
        const { unmount } = renderHook(() => useScrollSpy(["a"]));
        unmount();
        expect(disconnect).toHaveBeenCalledTimes(1);
    });
});
