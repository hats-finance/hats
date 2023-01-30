import * as Yup from "yup";
import { toNestError, validateFieldsNatively } from "@hookform/resolvers";
import { appendErrors, FieldError, FieldValues, ResolverOptions, ResolverResult } from "react-hook-form";
import type Lazy from "yup/lib/Lazy";

/**
 * Why `path!` ? because it could be `undefined` in some case
 * https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
 */
const parseErrorSchema = (error: Yup.ValidationError, validateAllFieldCriteria: boolean) => {
  return (error.inner || []).reduce<Record<string, FieldError>>((previous, error) => {
    if (!previous[error.path!]) {
      previous[error.path!] = { message: error.message, type: error.type! };
    }
    console.log("previous[error.path!]", previous[error.path!]);

    if (validateAllFieldCriteria) {
      const types = previous[error.path!].types;
      const messages = types && types[error.type!];

      previous[error.path!] = appendErrors(
        error.path!,
        validateAllFieldCriteria,
        previous,
        error.type!,
        ""
        //messages ? ([] as string[]).concat(messages as string[], error.message) : error.message
        //messages ? ([] as string[]).concat(messages as string[], error.message) : error.message
      ) as FieldError;
    }

    return previous;
  }, {});
};

type Options<T extends Yup.AnyObjectSchema | Lazy<any>> = Parameters<T["validate"]>[1];

export type Resolver = <T extends Yup.AnyObjectSchema | Lazy<any>>(
  schema: T,
  schemaOptions?: Options<T>,
  factoryOptions?: { mode?: "async" | "sync"; rawValues?: boolean }
) => <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>
) => Promise<ResolverResult<TFieldValues>>;

export const yupResolver: Resolver =
  (schema, schemaOptions = {}, resolverOptions = {}) =>
  async (values, context, options) => {
    try {
      if (schemaOptions.context && process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("You should not used the yup options context. Please, use the 'useForm' context object instead");
      }

      const result = await schema[resolverOptions.mode === "sync" ? "validateSync" : "validate"](
        values,
        Object.assign({ abortEarly: false }, schemaOptions, { context })
      );

      options.shouldUseNativeValidation && validateFieldsNatively({}, options);

      return {
        values: resolverOptions.rawValues ? values : result,
        errors: {},
      };
    } catch (e: any) {
      console.log("e", e);

      if (!e.inner) {
        throw e;
      }

      return {
        values: {},
        errors: toNestError(parseErrorSchema(e, !options.shouldUseNativeValidation && options.criteriaMode === "all"), options),
      };
    }
  };
