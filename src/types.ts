export enum ScenarioType {
    PESSIMIST = 'Pessimiste',
    REALIST = 'Réaliste',
    OPTIMIST = 'Optimiste'
}

export interface MarketDataPoint {
    year: number;
    volume: number; // Volume brut d'entreprises à céder
    successRate: number; // Taux de réussite basé sur le scénario
    jobsAtRisk: number;
}

export interface PreparationLevel {
    score: number; // 0 à 100
    label: string;
    description: string;
    valuationImpact: number; // Multiplicateur (ex: 0.5 à 1.2)
}

export enum UserRole {
    SELLER = 'Cédant',
    BUYER = 'Acquéreur'
}

export interface DiagnosticEntry {
    id: string;
    timestamp: string;
    userName: string;
    title: string;
    company: string;
    website: string;
    score: number;
    diagnostic: string;
    transcript: string; // Compte rendu détaillé question par question
}
