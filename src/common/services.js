import Swal from 'sweetalert2'

function success_toast(msg) {
    Swal.fire({
        position: 'top-right',
        icon: 'success',
        toast: true,
        title: msg,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 2500
    });
}
function error_toast(msg) {
    Swal.fire({
        position: 'top-right',
        icon: 'error',
        toast: true,
        title: msg,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 2500
    });
}
function confirm_toast(callback) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        callback(result);
    })
}
export { success_toast, error_toast, confirm_toast }