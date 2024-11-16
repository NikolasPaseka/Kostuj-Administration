import { toast } from "react-toastify";

export const notifySuccess = (message: string, autoClose: number=5000) => toast.success(message, {
    position: "bottom-center",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
});