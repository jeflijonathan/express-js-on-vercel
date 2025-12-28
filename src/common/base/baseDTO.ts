import { StatusBadRequest } from "@common/consts/statusCodes";
import { ZodSchema, z } from "zod";

export default class BaseDTO {
  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }

  static async from<T extends BaseDTO, S extends ZodSchema<any>>(
    payload: unknown,
    schema: S,
    DtoClass: new (data: z.infer<S>) => T
  ): Promise<T & z.infer<S>> {
    const result = await schema.safeParseAsync(payload);

    if (!result.success) {
      const formatted = result.error.errors.map((e) => ({
        field: Array.isArray(e.path) ? e.path.join(".") : String(e.path),
        message: `${e.message}, errornya`,
      }));

      throw {
        statusCode: StatusBadRequest,
        message: `${formatted[0].message} on field ${formatted[0].field}`,
        details: formatted,
      };
    }

    return new DtoClass(result.data) as T & z.infer<S>;
  }
}
