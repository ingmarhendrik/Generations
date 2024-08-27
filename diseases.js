let diseases = {
    "Common Cold": 0.35,
    "Brain Cancer": 0.05,
    "Huntington's Disease": 0.10,
    "Type 2 Diabetes": 0.20,
    "Flu": 0.30
};

function triggerDisease() {
    const rand = Math.random();
    let cumulativeProbability = 0;

    for (const [disease, probability] of Object.entries(diseases)) {
        cumulativeProbability += probability;

        if (rand <= cumulativeProbability) {
            Swal.fire({
                title: "Disease Triggered",
                text: `You have been diagnosed with ${disease}.`
            });
            return;
        }
    }
}