import { config } from "../core/config";

export const verifyHasura = (headers) => {
  if (
    !headers["x-toothfairy-secret-key"] ||
    headers["x-toothfairy-secret-key"] !== config.hasuraToothFairySecret
  ) {
    throw new Error(
      JSON.stringify({
        statusCode: 403,
        body: JSON.stringify({
          message: "'x-toothfairy-secret-key' is missing or value is invalid",
        }),
      })
    );
  }
};
