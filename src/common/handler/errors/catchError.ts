import { ErrorType } from "@common/types";

export function catchError<T>(
  promise: Promise<any>
): Promise<[undefined, T] | [ErrorType]> {
  return promise
    .then((data) => {
      return [undefined, data ?? []] as [undefined, T];
    })
    .catch((error: ErrorType) => {
      return [error];
    });
}
