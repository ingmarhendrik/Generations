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
};

let parentsData = {
    fatherFirstName: '',
    motherFirstName: '',
    fatherOccupation: '',
    motherOccupation: ''
};

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
        denyButtonText: "Back",
    }).then(async(result) => {
        if (result.isConfirmed) {
            playerData.birthday = result.value;
            await getParents();
            startGame();
            addDataToGame();
        }
        else if (result.isDenied) {
            showCountrySlide();
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
    document.getElementById('welcoming-parents').innerHTML = `You were born to <b>${parentsData.fatherFirstName} ${playerData.lastName}</b> and <b>${parentsData.motherFirstName} ${playerData.lastName}</b>.`;
    document.getElementById('welcoming-mother-occupation').innerHTML = `Your mother <b>${parentsData.motherFirstName}</b> works as a <b>${parentsData.motherOccupation}</b>.`;
    document.getElementById('welcoming-father-occupation').innerHTML = `Your father <b>${parentsData.fatherFirstName}</b> works as a <b>${parentsData.fatherOccupation}</b>.`;
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
        let occupation = await fetchNames(filePaths.occupationUrl);

        let randomFatherIndex = Math.floor(Math.random() * maleFirstName.length);
        let randomMotherIndex = Math.floor(Math.random() * femaleFirstName.length);
        let randomFatherOccupationIndex = Math.floor(Math.random() * occupation.length)
        let randomMotherOccupationIndex = Math.floor(Math.random() * occupation.length)

        parentsData.fatherFirstName = maleFirstName[randomFatherIndex];
        parentsData.motherFirstName = femaleFirstName[randomMotherIndex];
        parentsData.fatherOccupation = occupation[randomFatherOccupationIndex];
        parentsData.motherOccupation = occupation[randomMotherOccupationIndex];

    } catch (error) {
        console.error('Error fetching names:', error);
    }
}

function openRelationships() {
    let relationshipContent = document.getElementById('relationship-content').innerHTML;
    Swal.fire({
        width: 1000,
        padding: "14em",
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "Go back",
        html: relationshipContent,
        customClass: {
            cancelButton: 'swal2-goback-button'
        }
        
    });
}


function startGame() {
    const toHide = ['main-page'];
    const toShow = ['divider', 'age-button', 'profile-divider', 'name-text', 'occupation-text', 'box-of-life', 'age', 'interactions'];

    toHide.forEach(id => document.getElementById(id).style.display = 'none');
    toShow.forEach(id => document.getElementById(id).style.display = 'block');
}





