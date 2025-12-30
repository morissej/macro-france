"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface WaterfallData {
    id: string;
    label: string;
    value: number;
    tooltip?: string;
}

interface WaterfallChartProps {
    data: WaterfallData[];
    totalLabel?: string;
    onClickBar?: (id: string) => void;
    height?: number;
}

export function WaterfallChart({ data, totalLabel = "Total", onClickBar, height = 500 }: WaterfallChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            setWidth(entries[0].contentRect.width);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!width || !data.length || !svgRef.current) return;

        // Clear
        d3.select(svgRef.current).selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Prepare data with start/end
        let cumulative = 0;
        const processData = data.map(d => {
            const start = cumulative;
            cumulative += d.value;
            const end = cumulative;
            return { ...d, start, end, class: d.value >= 0 ? "positive" : "negative" };
        });

        const total = {
            id: "total",
            label: totalLabel,
            value: cumulative,
            start: 0,
            end: cumulative,
            class: "total"
        };

        const allBars = [...processData, total];

        // Scales
        const x = d3.scaleBand()
            .domain(allBars.map(d => d.label))
            .range([0, chartWidth])
            .padding(0.3);

        const minVal = d3.min(allBars, d => Math.min(d.start, d.end))!;
        const maxVal = d3.max(allBars, d => Math.max(d.start, d.end))!;

        // Add some padding to domain
        const yDomainPadding = (maxVal - minVal) * 0.1;
        const y = d3.scaleLinear()
            .domain([minVal - (minVal < 0 ? yDomainPadding : 0), maxVal + (maxVal > 0 ? yDomainPadding : 0)])
            .range([chartHeight, 0]);

        // Axis
        svg.append("g")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .style("fill", "#64748b");

        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d => `${d}%`))
            .style("font-size", "12px")
            .style("fill", "#64748b")
            .select(".domain").remove();

        // Grid
        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).tickSize(-chartWidth).tickFormat(() => ""))
            .attr("color", "#e2e8f0")
            .select(".domain").remove();

        // Bars
        const bars = svg.selectAll(".bar")
            .data(allBars)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.label)!)
            .attr("y", d => y(Math.max(d.start, d.end)))
            .attr("width", x.bandwidth())
            .attr("height", d => Math.abs(y(d.start) - y(d.end)) || 2) // Ensure min 2px
            .attr("fill", d => {
                if (d.class === "total") return "var(--color-primary)";
                if (d.class === "positive") return "var(--color-success)";
                return "var(--color-danger)";
            })
            .attr("rx", 4)
            .style("cursor", "pointer")
            .on("click", (e, d) => {
                if (onClickBar && d.id !== "total") onClickBar(d.id);
            })
            .on("mouseover", function () {
                d3.select(this).attr("opacity", 0.8);
            })
            .on("mouseout", function () {
                d3.select(this).attr("opacity", 1);
            });

        // Connector lines
        const lineGenerator = d3.line<{ x: number, y: number }>()
            .x(d => d.x)
            .y(d => d.y);

        for (let i = 0; i < processData.length; i++) {
            const current = processData[i];
            if (i < processData.length) {
                const next = i === processData.length - 1 ? total : processData[i + 1];

                const points = [
                    { x: x(current.label)! + x.bandwidth(), y: y(current.end) },
                    { x: x(next.label)!, y: y(current.end) }
                ];

                svg.append("path")
                    .datum(points)
                    .attr("d", lineGenerator)
                    .attr("fill", "none")
                    .attr("stroke", "#94a3b8")
                    .attr("stroke-dasharray", "4 4");
            }
        }

        // Labels
        svg.selectAll(".label")
            .data(allBars)
            .enter()
            .append("text")
            .attr("x", d => x(d.label)! + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(d.start, d.end)) - 10)
            .attr("text-anchor", "middle")
            .text(d => `${d.value > 0 ? "+" : ""}${d.value}%`)
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "#475569");

    }, [width, height, data, totalLabel, onClickBar]);

    return (
        <div ref={containerRef} className="w-full">
            <svg ref={svgRef} />
        </div>
    );
}
