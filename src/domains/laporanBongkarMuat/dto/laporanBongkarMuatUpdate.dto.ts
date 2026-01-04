import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface ILaporanBongkarMuatUpdatePayload {
    tanggalAwal?: string;
    tanggalAkhir?: string;
    koorlapIds?: string[];
}


class UpdateLaporanBongkarMuatDTO extends BaseDTO {
    static schemaUpdate = z.object({
        tanggalAwal: z.string().min(1, "tanggalAwal is required.").optional(),
        tanggalAkhir: z.string().min(1, "tanggalAkhir is required.").optional(),
        koorlapIds: z.array(z.string()).optional(),
    });

    static async fromUpdate(payload: ILaporanBongkarMuatUpdatePayload) {
        return super.from(payload, this.schemaUpdate, UpdateLaporanBongkarMuatDTO);
    }
}

export default UpdateLaporanBongkarMuatDTO;
