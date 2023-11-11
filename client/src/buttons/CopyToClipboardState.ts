import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

export type CopyToClipboardState = {
  shouldShow: boolean;
  copyToClipboard: (copyText: string) => Promise<void>;
};

export const useCopyToClipboard = (): CopyToClipboardState => {
  const [shouldShow, setShouldShow] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const checkIfClipboardWriteSupported = async (): Promise<void> => {
      const { state } = await navigator.permissions.query({
        name: "clipboard-write",
      } as any);

      if (state === "granted" || state === "prompt") {
        setShouldShow(true);
      } else {
        setShouldShow(false);
      }
    };

    checkIfClipboardWriteSupported();
  }, []);

  const copyToClipboard = async (copyText: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(copyText);
      enqueueSnackbar("Successfully copied to clipboard.");
    } catch (err) {
      enqueueSnackbar("Unable to copy to clipboard.");
    }
  };

  return {
    shouldShow,
    copyToClipboard,
  };
};
