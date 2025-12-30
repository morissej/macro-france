import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function useScrollSpy(sectionIds: string[]) {
    const { setActiveSection } = useAppStore();

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setActiveSection(id);
                            }
                        });
                    },
                    {
                        rootMargin: "-50% 0px -50% 0px", // Trigger when element is in middle of viewport
                        threshold: 0,
                    }
                );
                observer.observe(element);
                observers.push(observer);
            }
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [sectionIds, setActiveSection]);
}
