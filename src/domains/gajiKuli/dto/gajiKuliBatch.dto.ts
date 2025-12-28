import { z } from "zod";

export const schemaGajiKuliBatchItem = z.object({
    tradeTypeId: z.number(),
    containerSizeId: z.number(),
    angkutId: z.number(),
    gaji: z.number().min(0),
});

export const schemaBatchGajiKuli = z.object({
    koorlapId: z.string().uuid(),
    items: z.array(schemaGajiKuliBatchItem),
    isCreateMode: z.boolean().optional(),
});

export type IGajiKuliBatchItem = z.infer<typeof schemaGajiKuliBatchItem>;
export type IGajiKuliBatchPayload = z.infer<typeof schemaBatchGajiKuli>;

export default class GajiKuliBatchDTO {
    static fromBatchGajiKuli = async (body: IGajiKuliBatchPayload) => {
        return schemaBatchGajiKuli.parseAsync(body);
    };
}
