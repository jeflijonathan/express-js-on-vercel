export interface LaporanBongkarMuatResponseModel {
    id: number;
    tanggalAwal: Date;
    tanggalAkhir: Date;
    createdAt: Date;
    updatedAt: Date;
    detailLaporan: DetailLaporanResponseModel[];
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
    idKoorLap: string;
    idGroupTeam: string;
    idBarang?: number;
    idStatusBongkar: number;
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
