/**
 * A notification bridge for TrustChain.
 * These functions can be called from anywhere, 
 * but they rely on the ToastContext being initialized.
 */

let toastInstance = null;

export const registerToastInstance = (instance) => {
    toastInstance = instance;
};

export const toast = {
    success: (msg) => {
        if (toastInstance) toastInstance.success(msg);
        else console.log("SUCCESS:", msg);
    },
    error: (msg) => {
        if (toastInstance) toastInstance.error(msg);
        else console.error("ERROR:", msg);
    },
    info: (msg) => {
        if (toastInstance) toastInstance.info(msg);
        else console.info("INFO:", msg);
    }
};

export const showSuccess = toast.success;
export const showError = toast.error;
export const showInfo = toast.info;
