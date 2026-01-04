import BaseDTO from "@common/base/baseDTO";
import z from "zod";

export interface ILaporanBongkarMuatCreatePayload {
    tanggalAwal: string;
    tanggalAkhir: string;
    koorlapIds?: string[];
}


class CreateLaporanBongkarMuatDTO extends BaseDTO {
    static schemaCreate = z.object({
        tanggalAwal: z.string().min(1, "tanggalAwal is required."),
        tanggalAkhir: z.string().min(1, "tanggalAkhir is required."),
        koorlapIds: z.array(z.string()).optional(),
    });

    static async fromCreate(payload: ILaporanBongkarMuatCreatePayload) {
        return super.from(payload, this.schemaCreate, CreateLaporanBongkarMuatDTO);
    }
}

export default CreateLaporanBongkarMuatDTO;
