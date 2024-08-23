let gameData = {
    randomEvent: ''
}

let playerData = {
    firstName: '',
    lastName: '',
    birthday: '',
    currentAge: 0
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
    randomEventUrl: 'txt_files/random-events.txt'
};

function showFirstNameSlide() {
    Swal.fire({
        width: 1000,
        padding: "7em",
        title: "What's your first name?",
        input: 'text',
        inputValue: playerData.firstName,
        inputPlaceholder: 'Enter your first name',
        showCancelButton: true,
        confirmButtonText: "Next",
    }).then((result) => {
        if (result.isConfirmed) {
            playerData.firstName = result.value;
            showLastNameSlide();
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
        inputValue: playerData.lastName,
        showDenyButton: true,
        confirmButtonText: "Next",
        denyButtonText: "Back"
    }).then((result) => {
        if (result.isConfirmed) {
            playerData.lastName = result.value;
            showBirthdaySlide();
        }
        else if (result.isDenied) {
            showFirstNameSlide();
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
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
        confirmButtonText: "Start the game",
        denyButtonText: "Back"
    }).then(async(result) => {
        if (result.isConfirmed) {
            playerData.birthday = result.value;
            await getParents();
            startGame();
            addDataToGame();
        }
        else if (result.isDenied) {
            showLastNameSlide();
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
}

function addDataToGame() {
    document.getElementById('age').innerHTML = `<b>Age: ${playerData.currentAge}</b>`;
    document.getElementById('name-text').innerHTML = `Name: <b>${playerData.firstName}</b> <b>${playerData.lastName}</b>`;
    document.getElementById('welcoming-name').textContent = `Your name is ${playerData.firstName} ${playerData.lastName}.`;
    document.getElementById('welcoming-birthdate').textContent = `You were born on ${playerData.birthday}.`;
    document.getElementById('welcoming-parents').textContent = `You were born to ${parentsData.fatherFirstName} ${playerData.lastName} and ${parentsData.motherFirstName} ${playerData.lastName}.`;
    document.getElementById('welcoming-mother-occupation').textContent = `Your mother ${parentsData.motherFirstName} works as a ${parentsData.motherOccupation}.`;
    document.getElementById('welcoming-father-occupation').textContent = `Your father ${parentsData.fatherFirstName} works as a ${parentsData.fatherOccupation}.`;
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
        
        let randomEventIndex = Math.floor(Math.random() * ranEvent.length);

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




function startGame() {
    const toHide = ['welcome-text', 'first-life-buttons'];
    const toShow = ['divider', 'age-button', 'profile-divider', 'name-text', 'occupation-text', 'box-of-life', 'age'];

    toHide.forEach(id => document.getElementById(id).style.display = 'none');
    toShow.forEach(id => document.getElementById(id).style.display = 'block');
}





