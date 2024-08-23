export { triggerRandomDisease };

const diseases = [
    { name: "Common Cold", probability: 0.20 },
    { name: "Flu", probability: 0.10 },
    { name: "Stomach Flu", probability: 0.10 },
    { name: "Sinus Infection", probability: 0.13 },
    { name: "Bronchitis", probability: 0.05 },
    { name: "Hay Fever", probability: 0.15 },
    { name: "Pink Eye", probability: 0.10 },
    { name: "Migraine", probability: 0.13 },
    { name: "Eczema", probability: 0.10 },
    { name: "Strep Throat", probability: 0.05 },
    { name: "Anxiety", probability: 0.20 },
    { name: "Depression", probability: 0.10 },
    { name: "GERD", probability: 0.20 },
    { name: "High Blood Pressure", probability: 0.30 },
    { name: "Type 2 Diabetes", probability: 0.10 },
    { name: "Acne", probability: 0.20 }
];

// Example normalization code snippet
const totalProbability = diseases.reduce((sum, disease) => sum + disease.probability, 0);

function triggerRandomDisease() {
    const random = Math.random() * totalProbability;
    let cumulativeProbability = 0;

    let newDisease = null;

    for (let disease of diseases) {
        cumulativeProbability += disease.probability;
        if (random < cumulativeProbability) {
            newDisease = disease.name;
            break;
        }
    }

    Swal.fire({
        title: "New disease!",
        text: `You have been diagnosed with ${newDisease}!`,
        icon: "warning"
    });

    return newDisease; 
}
