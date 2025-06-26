// toastUtils.js

const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'white', // This might be overridden by your CSS if it's more specific
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
});

// You can create helper functions to make it even easier to use
function showSuccessToast(title = 'Success', message = '') {
    Toast.fire({
        icon: 'success',
        title: title,
        html: message
    });
}

function showErrorToast(title = 'Error', message = '') {
    Toast.fire({
        icon: 'error',
        title: title,
        html: message
    });
}

function showWarningToast(title = 'Warning', message = '') {
    Toast.fire({
        icon: 'warning',
        title: title,
        html: message
    });
}

function showInfoToast(title = 'Info', message = '') {
    Toast.fire({
        icon: 'info',
        title: title,
        html: message
    });
}

function showQuestionToast(title = 'Question', message = '') {
    Toast.fire({
        icon: 'question',
        title: title,
        html: message
    });
}

window.showSuccessToast = showSuccessToast;
window.showErrorToast = showErrorToast;
window.showWarningToast = showWarningToast;
window.showInfoToast = showInfoToast;
window.showQuestionToast = showQuestionToast;