import { z } from "zod";

export const schemaTarifBongkarBatchItem = z.object({
    id: z.number().optional(),
    idTradeType: z.number(),
    idContainerSize: z.number(),
    idAngkut: z.number(),
    idBarang: z.number(),
    amount: z.number().min(0),
    jasaWrapping: z.boolean().default(false),
});

export const schemaBatchTarifBongkar = z.object({
    items: z.array(schemaTarifBongkarBatchItem),
});

export type ITarifBongkarBatchItem = z.infer<typeof schemaTarifBongkarBatchItem>;
export type ITarifBongkarBatchPayload = z.infer<typeof schemaBatchTarifBongkar>;

export default class TarifBongkarBatchDTO {
    static fromBatchTarifBongkar = async (body: ITarifBongkarBatchPayload) => {
        return schemaBatchTarifBongkar.parseAsync(body);
    };
}
