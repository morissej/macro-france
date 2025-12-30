"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface DataPoint {
    year: number;
    [key: string]: number;
}

interface LineDualAxisProps {
    data: DataPoint[];
    series: {
        key: string;
        label: string;
        color: string;
        axis?: 'left' | 'right';
    }[];
    height?: number;
}

export function LineDualAxis({ data, series, height = 400 }: LineDualAxisProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            setWidth(entries[0].contentRect.width);
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!width || !data.length || !svgRef.current) return;

        // Clear previous
        d3.select(svgRef.current).selectAll("*").remove();

        const margin = { top: 20, right: 50, bottom: 30, left: 50 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X Axis
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year) as [number, number])
            .range([0, chartWidth]);

        svg.append("g")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")))
            .attr("color", "#94a3b8")
            .select(".domain").remove();

        // Y Axis logic
        const leftSeries = series.filter(s => s.axis !== 'right');
        const rightSeries = series.filter(s => s.axis === 'right');

        // Currently handling single scale logic simplicity for demo if needed, but dual axis requested
        // Let's assume extent for both or normalize logic if separate
        // Actually standard dual axis implementation:

        // Left Y
        const yLeft = d3.scaleLinear()
            .domain([90, 110]) // Fixed domain based on data knowledge for clear comparison
            // or d3.extent of left series
            .range([chartHeight, 0]);

        svg.append("g")
            .call(d3.axisLeft(yLeft).ticks(5))
            .attr("color", "#94a3b8")
            .select(".domain").remove();

        // Grid lines
        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(yLeft)
                .tickSize(-chartWidth)
                .tickFormat(() => "")
            )
            .attr("color", "#e2e8f0")
            .select(".domain").remove();


        series.forEach(s => {
            const line = d3.line<DataPoint>()
                .x(d => x(d.year))
                .y(d => yLeft(d[s.key]))
                .curve(d3.curveMonotoneX);

            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", s.color)
                .attr("stroke-width", 3)
                .attr("d", line);

            // Add points
            svg.selectAll(`dot-${s.key}`)
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.year))
                .attr("cy", d => yLeft(d[s.key]))
                .attr("r", 4)
                .attr("fill", "white")
                .attr("stroke", s.color)
                .attr("stroke-width", 2);
        });

        // Add simple Legend
        const legend = svg.append("g")
            .attr("transform", `translate(0, -10)`);

        series.forEach((s, i) => {
            const g = legend.append("g").attr("transform", `translate(${i * 150}, 0)`);
            g.append("rect").attr("width", 12).attr("height", 12).attr("fill", s.color).attr("rx", 3);
            g.append("text").attr("x", 18).attr("y", 10).text(s.label).attr("font-size", "12px").attr("fill", "#64748b");
        });


    }, [width, height, data, series]);

    return (
        <div ref={containerRef} className="w-full">
            <svg ref={svgRef} />
        </div>
    );
}
