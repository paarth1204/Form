import { OptionsObject, useSnackbar } from "notistack";

export const useToasts = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const successToast = (message: string, options?: OptionsObject) =>
    enqueueSnackbar(message, { ...options, variant: "success" });

  const warningToast = (message: string, options?: OptionsObject) =>
    enqueueSnackbar(message, { ...options, variant: "warning" });

  const errorToast = (message: string, options?: OptionsObject) =>
    enqueueSnackbar(message, { ...options, variant: "error" });

  const infoToast = (message: string, options?: OptionsObject) =>
    enqueueSnackbar(message, { ...options, variant: "info" });

  return {
    successToast,
    warningToast,
    errorToast,
    infoToast,
    closeToast: closeSnackbar,
  };
};
