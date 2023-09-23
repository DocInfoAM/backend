import {AssertionError} from "assert";

export function error2msg(error: unknown) {
  if (error instanceof Error) return error.message
  if (error instanceof AssertionError) return error.message
}