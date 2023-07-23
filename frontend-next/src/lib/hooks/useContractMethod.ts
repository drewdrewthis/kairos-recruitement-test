import {
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import { useEffect } from "react";
import compact from "lodash/fp/compact";
import { enqueueSnackbar } from "notistack";

export function useContractMethod(
  params: Parameters<typeof usePrepareContractWrite>[0] & {
    messagePrefix?: string;
    onSuccess?: () => void;
    onError?: () => void;
  }
) {
  const { messagePrefix, onSuccess, onError, ...rest } = params;

  // Prepare contract write
  const { config, error: prepError } = usePrepareContractWrite({
    ...rest,
  });

  // Get the write function
  const {
    write,
    data,
    isLoading,
    error: writeError,
  } = useContractWrite(config);

  // Stake NFTs
  const execute = () => {
    if (write) {
      enqueueSnackbar(`${messagePrefix}`, { variant: "info" });
      write();
    } else {
      enqueueSnackbar(
        `${messagePrefix} - Operation not ready. Please wait for transfers/checks to finish.`,
        {
          variant: "warning",
        }
      );
    }
  };

  // Wait for the transaction to complete to show a notification
  const {
    isLoading: isLoadingTx,
    error: txError,
    data: txData,
  } = useWaitForTransaction({
    hash: data?.hash,
    enabled: params.enabled && data?.hash != null,
    scopeKey: JSON.stringify(rest.args),
    cacheTime: 0,
    onSuccess() {
      if (!data) return;
      if (!params.enabled) return;
      if (onSuccess) onSuccess();
      enqueueSnackbar(
        `${messagePrefix}: Success! Hash: ${data?.hash} ${JSON.stringify(
          rest.args
        )}`,
        {
          variant: "success",
        }
      );
    },
  });

  // Handle prep errors
  useEffect(() => {
    if (prepError) {
      console.warn(messagePrefix, "PrepError", prepError);
    }
  }, [messagePrefix, prepError]);

  // Handle errors
  const errors = compact([writeError, txError]);

  // Handle errors
  useEffect(() => {
    if (txData?.transactionHash === data?.hash && errors.length > 0) {
      for (const error of errors) {
        console.error(error);
        enqueueSnackbar(`${messagePrefix}: Error - ${error.message}`, {
          variant: "error",
        });
      }

      if (onError) onError();
    }
  }, [data?.hash, errors, messagePrefix, txData?.transactionHash, onError]);

  return {
    execute,
    data,
    isLoading: isLoading || isLoadingTx,
  };
}
