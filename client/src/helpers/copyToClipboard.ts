import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type CopyToClipboardState = {
  canCopy: boolean;
  copyToClipboard: (copyText: string) => Promise<void>;
};

export function useCopyToClipboard(): CopyToClipboardState {
  const [canCopy, setCanCopy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const checkIfClipboardWriteSupported = async (): Promise<void> => {
      const { state } = await navigator.permissions.query({
        name: "clipboard-write",
      } as any);

      if (state === "granted" || state === "prompt") {
        setCanCopy(true);
      } else {
        setCanCopy(false);
      }
    };

    checkIfClipboardWriteSupported();
  }, []);

  const copyToClipboard = async (copyText: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(copyText);
      toast({ description: "Successfully copied to clipboard." });
    } catch (err) {
      toast({ description: "Unable to copy to clipboard." });
    }
  };

  return { canCopy, copyToClipboard };
}
