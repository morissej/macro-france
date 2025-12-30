export const datasets = {
    timeSeries: {
        productivityIndex: {
            description: "Index 2019=100",
            data: [
                { year: 2010, France: 92, Allemagne: 91, EtatsUnis: 90 },
                { year: 2015, France: 97, Allemagne: 98, EtatsUnis: 98 },
                { year: 2019, France: 100, Allemagne: 100, EtatsUnis: 100 },
                { year: 2020, France: 96, Allemagne: 97, EtatsUnis: 101 },
                { year: 2021, France: 98, Allemagne: 99, EtatsUnis: 103 },
                { year: 2022, France: 97, Allemagne: 99, EtatsUnis: 104 },
                { year: 2023, France: 96.5, Allemagne: 99.4, EtatsUnis: 105 }
            ],
            source: "Synthèse compétitivité & productivité (CNP / sources convergentes)"
        },
        employmentIndex: {
            description: "Index 2019=100",
            data: [
                { year: 2019, France: 100 },
                { year: 2020, France: 99 },
                { year: 2021, France: 101 },
                { year: 2022, France: 103 },
                { year: 2023, France: 104.5 },
                { year: 2024, France: 105.2 }
            ],
            source: "INSEE / DARES"
        }
    },
    waterfall: {
        prodDecrochage: [
            { id: "apprentissage", label: "Apprentissage", value: -1.5, tooltip: "Entrée de jeunes à productivité initiale plus faible." },
            { id: "composition", label: "Composition main-d’œuvre", value: -1.2, tooltip: "Plus d’emplois peu qualifiés / éloignés de l’emploi." },
            { id: "retention", label: "Rétention de main-d’œuvre", value: -2.3, tooltip: "Entreprises gardent les effectifs malgré ralentissement." },
            { id: "autres", label: "Autres / résiduel", value: -0.9, tooltip: "Effets sectoriels et autres facteurs." }
        ],
        source: "Synthèse sur la compétitivité et les réformes structurelles"
    },
    digitalAdoption: {
        byCountry: [
            { country: "France", value: 57 },
            { country: "UE", value: 70 },
            { country: "États-Unis", value: 73 }
        ],
        bySectorFrance: [
            { sector: "Industrie", value: 52 },
            { sector: "Services", value: 60 },
            { sector: "Commerce", value: 55 },
            { sector: "Construction", value: 49 }
        ],
        source: "Synthèse — adoption digitale avancée"
    },
    aiInvest: {
        byRegion: [
            { region: "États-Unis", value: 335 },
            { region: "Chine", value: 103 },
            { region: "Royaume-Uni", value: 21 },
            { region: "Europe", value: 35 }
        ],
        unit: "USD_bn",
        source: "Synthèse — investissements IA 2013-2023"
    }
};

export const glossary = [
    { term: "Compétitivité hors-prix", definition: "Capacité à gagner des marchés grâce à la qualité, l'innovation, la marque, le service, la fiabilité." },
    { term: "Coin socio-fiscal", definition: "Écart entre coût total employeur et salaire net perçu, dû aux prélèvements." },
    { term: "Diffusion technologique", definition: "Vitesse à laquelle les technologies (IA, robotique, data) se répandent dans le tissu productif." }
];
