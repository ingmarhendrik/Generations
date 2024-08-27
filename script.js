let gameData = {
    randomEvent: '',
    triggeredEventsIndices: []
}

let playerData = {
    firstName: '',
    lastName: '',
    birthday: '',
    currentAge: 0,
    gender: '',
    birthCountry: '',
    healthScore: 0,
    money: 0,
    intelligence: 0,
    looks: 0
};

let motherData = {
    firstName: '',
    lastName: '',
    occupation: ''
}

let fatherData = {
    firstName: '',
    lastName: '',
    occupation: ''
}

let filePaths = {
    maleFirstNameUrl: 'txt_files/male-first-names.txt',
    femaleFirstNameUrl: 'txt_files/female-first-names.txt',
    surnameUrl: 'txt_files/surnames.txt',
    occupationUrl: 'txt_files/occupations.txt',
    randomEventUrl: 'txt_files/random-events.txt',
    countryUrl: 'txt_files/countries.json'
};

function showGenderSlide() {
    Swal.fire({
        width: 1000,
        padding: "7em",
        title: "Choose your gender",
        html: 
        `<button id="maleButton" class="swal2-gender-button">Male</button>
        <button id="femaleButton" class="swal2-gender-button">Female</button>`,
        showCancelButton: true, 
        customClass: {
            cancelButton: 'swal2-cancel-main',
            confirmButton: 'swal2-next-main'
        },
        confirmButtonText: "Next",
        preConfirm: () => {
            if (!playerData.gender) {
                Swal.showValidationMessage('Please select your gender.');
                return false;
            }
            return playerData.gender;
        },
        didOpen: () => {
            const maleButton = document.getElementById('maleButton');
            const femaleButton = document.getElementById('femaleButton');

            if (playerData.gender === 'male') {
                maleButton.classList.add('active');
            } else if (playerData.gender === 'female') {
                femaleButton.classList.add('active');
            }

            maleButton.addEventListener('click', () => {
                playerData.gender = 'male';
                maleButton.classList.add('active');
                femaleButton.classList.remove('active');
            });

            femaleButton.addEventListener('click', () => {
                playerData.gender = 'female';
                femaleButton.classList.add('active');
                maleButton.classList.remove('active');
            });

        }
    }).then((result) => {
        if (result.isConfirmed) {
            playerData.gender = result.value;
            showFirstNameSlide();
        }
        
        else if (result.dismiss === Swal.DismissReason.cancel) {
            emptyAllForms();
        }
    });
}

function showFirstNameSlide() {
    Swal.fire({
        width: 1000,
        padding: "7em",
        title: "What's your first name?",
        input: 'text',
        inputValue: playerData.firstName,
        inputPlaceholder: 'Enter your first name',
        showCancelButton: true,
        showDenyButton: true,
        preConfirm: () => {
            const firstName = Swal.getInput().value.trim();
            if (!firstName) {
                Swal.showValidationMessage('Please enter your first name.');
                return false;
            }
            playerData.firstName = firstName;
            return firstName;
        },
        customClass: {
            cancelButton: 'swal2-cancel-main',
            confirmButton: 'swal2-next-main',
            denyButton: 'swal2-goback-main'
        },
        confirmButtonText: "Next",
        denyButtonText: "Back",
    }).then((result) => {
        if (result.isConfirmed) {
            playerData.firstName = result.value;
            showLastNameSlide();
        }
        else if (result.isDenied) {
            showGenderSlide();
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
            emptyAllForms();
        }
    });
}

function showLastNameSlide() {
    Swal.fire({
        width: 1000,
        padding: "7em",
        input: 'text',
        title: "What's your last name?",
        inputPlaceholder: 'Enter your last name',
        showCancelButton: true,
        preConfirm: () => {
            const lastName = Swal.getInput().value.trim();
            if (!lastName) {
                Swal.showValidationMessage('Please enter your last name.');
                return false;
            }
            playerData.lastName = lastName;
            return lastName;
        },
        customClass: {
            cancelButton: 'swal2-cancel-main',
            confirmButton: 'swal2-next-main',
            denyButton: 'swal2-goback-main'
        },
        inputValue: playerData.lastName,
        showDenyButton: true,
        confirmButtonText: "Next",
        denyButtonText: "Back"
    }).then((result) => {
        if (result.isConfirmed) {
            playerData.lastName = result.value;
            showCountrySlide();
        }
        else if (result.isDenied) {
            showFirstNameSlide();
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
            emptyAllForms();
        }
    });
}


async function loadCountryOptions() {
    try {
        const response = await fetch(filePaths.countryUrl);
        const countriesData = await response.json();

        const countryOptions = Object.keys(countriesData).map(country => {
            const flagUrl = countriesData[country].flag;
            return {
                id: country,
                text: country,
                flag: flagUrl
            };
        });

        return countryOptions;
    } catch (error) {
        console.error('Error loading country options:', error);
    }
}

async function loadCityOptions(selectedCountry) {
    try {
        const response = await fetch(filePaths.countryUrl);
        const countriesData = await response.json();

        const cityOptions = countriesData[selectedCountry].cities.map(city => {
            return `<option value="${city}">${city}</option>`;
        }).join('');

        return cityOptions;
    } catch (error) {
        console.error('Error loading city options:', error);
    }
}


async function showCountrySlide() {
    const countryOptions = await loadCountryOptions();
    Swal.fire({
        width: 1000,
        padding: "7em",
        title: "Choose your nationality",
        html: `<select id="countryDropdown" class="swal2-input"></select>`,
        showCancelButton: true,
        customClass: {
            cancelButton: 'swal2-cancel-main',
            confirmButton: 'swal2-next-main',
            denyButton: 'swal2-goback-main'
        },
        didOpen: () => {
            const selectElement = $('#countryDropdown');

            selectElement.select2({
                data: countryOptions,
                templateResult: formatCountryOption,
                templateSelection: formatCountryOption,
                minimumResultsForSearch: -1,
                dropdownParent: $('.swal2-container')
            });
            if (playerData.birthCountry) {
                selectElement.val(playerData.birthCountry).trigger('change');
            }
        },
        showDenyButton: true,
        confirmButtonText: "Next",
        denyButtonText: "Back",
        preConfirm: () => {
            const selectedCountry = $('#countryDropdown').val();
            if (!selectedCountry) {
                Swal.showValidationMessage('Please select your nationality.');
                return false;
            }
            playerData.birthCountry = selectedCountry;
            return selectedCountry;
        }
    }).then((result) => {

    if (result.isConfirmed) {
        showCitySelection(result.value);
    } else if (result.isDenied) {
        showLastNameSlide();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        emptyAllForms();
    }
});
};

function formatCountryOption(option) {
    if (!option.id) {
        return option.text;
    }

    const flagUrl = option.flag;
    const countryName = option.text;

    const $option = $(`
        <span><img src="${flagUrl}" class="img-flag" /> ${countryName}</span>
    `);
    return $option;
}

async function showCitySelection(selectedCountry) {
    const cityOptions = await loadCityOptions(selectedCountry);

    Swal.fire({
        width: 1000,
        padding: "7em",
        title: 'Select your city',
        html: `<select id="cityDropdown" class="swal2-input">${cityOptions}</select>`,
        showCancelButton: true,
        customClass: {
            cancelButton: 'swal2-cancel-main',
            confirmButton: 'swal2-next-main',
            denyButton: 'swal2-goback-main'
        },
        showDenyButton: true,
        confirmButtonText: "Next",
        denyButtonText: "Back",
        preConfirm: () => {
            const selectedCity = document.getElementById('cityDropdown').value;
            if (!selectedCity) {
                Swal.showValidationMessage('Please select your city.');
                return false;
            }
            playerData.birthCity = selectedCity;
            return selectedCity;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            showBirthdaySlide();
        } else if (result.isDenied) {
            showCountrySlide();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            emptyAllForms();
        }
    });
}


function showBirthdaySlide() {
    Swal.fire({
        width: 1000,
        padding: "7em",
        title: "What's your birthdate?",
        input: 'date',
        showCancelButton: true,
        inputValue: playerData.birthday,
        showDenyButton: true,
        customClass: {
            cancelButton: 'swal2-cancel-main',
            confirmButton: 'swal2-next-main',
            denyButton: 'swal2-goback-main'
        },
        showDenyButton: true,
        confirmButtonText: "Next",
        preConfirm: () => {
            const birthdate = Swal.getInput().value;
            if (!birthdate) {
                Swal.showValidationMessage('Please select your birthdate.');
                return false;
            }
            playerData.birthday = birthdate;
            return birthdate;
        },
        denyButtonText: "Back",
    }).then((result) => {
        if (result.isConfirmed) {
            showMoneySlide();
        } else if (result.isDenied) {
            showCitySelection(playerData.birthCountry);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            emptyAllForms();
        }
    });
};

function showMoneySlide() {
    Swal.fire({
        width: 1000,
        padding: "7em",
        title: "Choose your starting amount of money",
        input: "range",
        inputAttributes: {
          min: "0",
          max: "1000",
          step: "100"
        },
        inputValue: playerData.money,
        showCancelButton: true,
        preConfirm: () => {
            const money = Swal.getInput().value;
            if (money === null || money === '') {
                Swal.showValidationMessage('Please select starting amount of money.');
                return false;
            }
            playerData.money = parseInt(money, 10);
            return money;
        },
        showDenyButton: true,
        customClass: {
            cancelButton: 'swal2-cancel-main',
            confirmButton: 'swal2-next-main',
            denyButton: 'swal2-goback-main'
        },
        confirmButtonText: "Next",
        denyButtonText: "Back",
    }).then((result) => {
        if (result.isConfirmed) {
            playerData.money = result.value;
            showIntelligenceSlide();
        } else if (result.isDenied) {
            showBirthdaySlide();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            emptyAllForms();
        }
    });
    };


function showIntelligenceSlide() {
    Swal.fire({
        width: 1000,
        padding: "7em",
        title: "Choose your intelligence level",
        input: "range",
        inputAttributes: {
            min: "0",
            max: "100",
            step: "1"
        },
        inputValue: playerData.intelligence,
        showCancelButton: true,
        preConfirm: () => {
            const intelligence = Swal.getInput().value;
            if (intelligence === null || intelligence === '') {
                Swal.showValidationMessage('Please select your intelligence level');
                return false;
            }
            playerData.intelligence = parseInt(intelligence, 10);
            return intelligence;
        },
        showDenyButton: true,
        customClass: {
            cancelButton: 'swal2-cancel-main',
            confirmButton: 'swal2-next-main',
            denyButton: 'swal2-goback-main'
        },
        showDenyButton: true,
        confirmButtonText: "Next",
        denyButtonText: "Back",
    }).then((result) => {
         if (result.isConfirmed) {
            playerData.intelligence = result.value;
            showLooksSlide();
        } else if (result.isDenied) {
            showIntelligenceSlide();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            emptyAllForms();
        }
    });
};

function showLooksSlide() {
    Swal.fire({
    width: 1000,
    padding: "7em",
    title: "Choose your level of looks",
    input: "range",
    inputAttributes: {
        min: "0",
        max: "100",
        step: "1"
    },
    inputValue: playerData.looks,
    showCancelButton: true,
    preConfirm: () => {
        const looks = Swal.getInput().value;
        if (looks === null || looks === '') {
            Swal.showValidationMessage('Please select the level of looks.');
            return false;
        }
        playerData.looks = parseInt(looks, 10);
        return looks;
    },
    showDenyButton: true,
    customClass: {
        cancelButton: 'swal2-cancel-main',
        confirmButton: 'swal2-next-main',
        denyButton: 'swal2-goback-main'
    },
    showDenyButton: true,
    confirmButtonText: "Next",
    denyButtonText: "Back",
}).then((result) => {
    if (result.isConfirmed) {
        playerData.looks = result.value;
        showHealthSlide();
    } else if (result.isDenied) {
        showIntelligenceSlide();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        emptyAllForms();
    }
});
}

function showHealthSlide() {
    Swal.fire({
        width: 1000,
        padding: "7em",
        title: "Choose your health level",
        input: "range",
        inputAttributes: {
          min: "0",
          max: "100",
          step: "1"
        },
        inputValue: playerData.healthScore,
        showCancelButton: true,
        preConfirm: () => {
            const healthScore = Swal.getInput().value;
            if (healthScore === null || healthScore === '') {
                Swal.showValidationMessage('Please select your health level.');
                return false;
            }
            playerData.healthScore = parseInt(healthScore, 10);
            return healthScore;
        },
        showDenyButton: true,
        customClass: {
            cancelButton: 'swal2-cancel-main',
            confirmButton: 'swal2-next-main',
            denyButton: 'swal2-goback-main'
        },
        showDenyButton: true,
        confirmButtonText: "Start the game",
        denyButtonText: "Back",
    }).then(async(result) => {
        if (result.isConfirmed) {
            playerData.healthScore = result.value;
            await getParents();
            startGame();
            addDataToGame();
        }
        else if (result.isDenied) {
            showMoneySlide();
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
            emptyAllForms();
        }
      });
    }

function emptyAllForms() {
    playerData.firstName = '';
    playerData.lastName = '';
    playerData.birthday = '';
    playerData.gender = '';
    playerData.birthCountry = '';
}

function addDataToGame() {
    document.getElementById('age').innerHTML = `<b>Age: ${playerData.currentAge}</b>`;
    document.getElementById('name-text').innerHTML = `Name: <b>${playerData.firstName}</b> <b>${playerData.lastName}</b>`;
    document.getElementById('welcoming-name').innerHTML = `Your name is <b>${playerData.firstName} ${playerData.lastName}</b>.`;
    document.getElementById('welcoming-gender').innerHTML = `You are <b>${playerData.gender}</b>.`;
    document.getElementById('welcoming-birthdate').innerHTML = `You were born on <b>${playerData.birthday}</b>.`;
    document.getElementById('welcoming-parents').innerHTML = `You were born to <b>${fatherData.firstName} ${fatherData.lastName}</b> and <b>${motherData.firstName} ${motherData.lastName}</b>.`;
    document.getElementById('welcoming-mother-occupation').innerHTML = `Your father <b>${fatherData.firstName}</b> works as a <b>${fatherData.occupation}</b>.`;
    document.getElementById('welcoming-father-occupation').innerHTML = `Your mother <b>${motherData.firstName}</b> works as a <b>${motherData.occupation}</b>.`;
    document.getElementById('health-text').innerHTML = `Health: <b>${playerData.healthScore}</b>`;
    document.getElementById('looks-text').innerHTML = `Looks: <b>${playerData.looks}</b>`;
    document.getElementById('intelligence-text').innerHTML = `Intelligence: <b>${playerData.intelligence}</b>`;
    document.getElementById('money-text').innerHTML = `Money: <b>${playerData.money}</b>`;
    document.getElementById('relationship-mother-name').innerHTML = `${motherData.firstName} ${motherData.lastName}`;
    document.getElementById('relationship-father-name').innerHTML = `${fatherData.firstName} ${fatherData.lastName}`;

}

function triggerNextYear() {
    const ageButton = document.getElementById('age-button');
    playerData.currentAge = parseInt(ageButton.textContent, 10);
    playerData.currentAge++;
    ageButton.textContent = playerData.currentAge;
    document.getElementById('age').innerHTML = `<b>Age: ${playerData.currentAge}</b>`;

    const toHide = ['box-of-life'];
    toHide.forEach(id => document.getElementById(id).style.display = 'none');

    displayNewContent();
}

async function fetchNames(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const text = await response.text();
    return text.split('\n').map(name => name.trim()).filter(name => name !== '');
}

async function displayNewContent() {
        await triggerRandomEvent();
        if (Math.random() <= 0.2) {
            triggerDisease();
        }
}

async function triggerRandomEvent() {
    try {
        let ranEvent = await fetchNames(filePaths.randomEventUrl);
        
        let randomEventIndex;
        do {
            randomEventIndex = Math.floor(Math.random() * ranEvent.length);
        } while (gameData.triggeredEventsIndices.includes(randomEventIndex));

        gameData.triggeredEventsIndices.push(randomEventIndex);
        gameData.randomEvent = ranEvent[randomEventIndex];
    } catch (error) {
        console.error('Error fetching events', error);
    }
    document.getElementById('random-event').textContent = `${gameData.randomEvent}`;
    const toShow = ['box-of-content'];
    toShow.forEach(id => document.getElementById(id).style.display = 'block');
}

async function getParents() {
    try {
        let maleFirstName = await fetchNames(filePaths.maleFirstNameUrl);
        let femaleFirstName = await fetchNames(filePaths.femaleFirstNameUrl);
        let occupations = await fetchNames(filePaths.occupationUrl);

        let randomFatherIndex = Math.floor(Math.random() * maleFirstName.length);
        let randomMotherIndex = Math.floor(Math.random() * femaleFirstName.length);
        let randomFatherOccupationIndex = Math.floor(Math.random() * occupations.length)
        let randomMotherOccupationIndex = Math.floor(Math.random() * occupations.length)

        fatherData.firstName = maleFirstName[randomFatherIndex];
        motherData.firstName = femaleFirstName[randomMotherIndex];
        fatherData.occupation = occupations[randomFatherOccupationIndex];
        motherData.occupation = occupations[randomMotherOccupationIndex];

        fatherData.lastName = playerData.lastName;
        motherData.lastName = playerData.lastName;

    } catch (error) {
        console.error('Error fetching names:', error);
    }
}

function openRelationships() {
    let relationshipContent = document.getElementById('relationship-content').innerHTML;
    Swal.fire({
        width: 1000,
        padding: "10em",
        showConfirmButton: false,
        showCloseButton: true,
        html: relationshipContent,
        customClass: {
            closeButton: 'swal2-close-button'
        }
        
    });
}

function startGame() {
    const toHide = ['main-page'];
    const toShow = [
        'divider', 
        'age-button', 
        'profile-divider', 
        'name-text', 
        'occupation-text', 
        'box-of-life', 
        'age', 
        'interactions',
        'second-row',
        'name-text',
        'occupation-text',
        'third-row'
    ];

    toHide.forEach(id => document.getElementById(id).style.display = 'none');
    toShow.forEach(id => document.getElementById(id).style.display = 'block');
}





