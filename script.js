let firstName = '';
let lastName = '';
let birthday = '';

function showFirstNameSlide() {
    Swal.fire({
        width: 1000,
        padding: "7em",
        title: "What's your first name?",
        input: 'text',
        inputValue: firstName,
        inputPlaceholder: 'Enter your first name',
        showCancelButton: true,
        confirmButtonText: "Next",
    }).then((result) => {
        if (result.isConfirmed) {
            firstName = result.value;
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
        inputValue: lastName,
        showDenyButton: true,
        confirmButtonText: "Next",
        denyButtonText: "Back"
    }).then((result) => {
        if (result.isConfirmed) {
            lastName = result.value;
            showBirthdaySlide();
        }
        else if (result.isDenied) {
            showFirstNameSlide()
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
        inputValue: birthday,
        showDenyButton: true,
        confirmButtonText: "Start the game",
        denyButtonText: "Back"
    }).then((result) => {
        if (result.isConfirmed) {
            birthday = result.value;
            startGame();
            addDataToGame();
        }
        else if (result.isDenied) {
            showLastNameSlide()
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
            emptyAllForms();
        }
    });
}

function emptyAllForms() {
    firstName = '';
    lastName = '';
    birthday = '';
}

function addDataToGame() {
    document.getElementById('name-text').innerHTML = `Name: <b>${firstName}</b> <b>${lastName}</b>`;
    document.getElementById('welcoming-name').textContent = `Your name is ${firstName} ${lastName}.`;
    document.getElementById('welcoming-birthdate').textContent = `Your were born on ${birthday}.`;
}

function triggerNextYear() {
    const ageButton = document.getElementById('age-button');
    let currentAge = parseInt(ageButton.textContent, 10);
    currentAge++;
    ageButton.textContent = currentAge;
}

function startGame() {
    const toHide = ['welcome-text', 'first-life-buttons'];
    const toShow = ['divider', 'age-button', 'profile-divider', 'name-text', 'occupation-text', 'box-of-life'];

    toHide.forEach(id => document.getElementById(id).style.display = 'none');
    toShow.forEach(id => document.getElementById(id).style.display = 'block');
}



