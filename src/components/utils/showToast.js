import { toast } from "react-toastify";

export const showToast = (message, type = "success", autoClose = 2000) => {
  return toast(message, {
    type,
    position: "top-center",
    autoClose,
    theme: "light",
    style: { zIndex: 99999 },
  });
};
