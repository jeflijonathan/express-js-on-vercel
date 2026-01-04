export interface LaporanBongkarMuatResponseModel {
    id: number;
    tanggalAwal: Date;
    tanggalAkhir: Date;
    createdAt: Date;
    updatedAt: Date;
    koorlapId?: string;
    detailLaporan: DetailLaporanResponseModel[];
    recordTarifBongkars: any[];
    recordGajis: any[];
}

export interface DetailLaporanResponseModel {
    id: number;
    idSesiBongkar: string;
    gajiKaryawan: number;
    hargaBongkar: number;
    biayaWrapping: number;
    idLaporan: number;
    createdAt: Date;
    updatedAt: Date;
    sesiBongkar: SesiBongkarResponseModel;
}

export interface SesiBongkarResponseModel {
    noContainer: string;
    koorlapId: string;
    idGroupTeam: string;
    idBarang?: number;

    idContainerSize: number;
    idTradeType: number;
    idAngkut: number;
    jasaWrapping: boolean;
    createdAt: Date;
    endAT?: Date;
    updatedAt: Date;
    groupTeam?: any;
    containerSize?: any;
    tradeType?: any;
    angkut?: any;
    barang?: any;
}
