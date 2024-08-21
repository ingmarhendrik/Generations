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
            firstName = '';
            lastName = '';
            birthday = '';
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
            firstName = '';
            lastName = '';
            birthday = '';
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
        confirmButtonText: "Submit",
        denyButtonText: "Back"
    }).then((result) => {
        if (result.isConfirmed) {
            birthday = result.value;
        }
        else if (result.isDenied) {
            showLastNameSlide()
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
            firstName = '';
            lastName = '';
            birthday = '';
        }
    });
}



