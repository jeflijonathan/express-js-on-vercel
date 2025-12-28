import { prisma } from "../config/database/client";

export const tarifBongkarMuatSeeder = async () => {
    const getBarangId = async (name: string) => (await prisma.barang.findFirst({ where: { name } }))?.id;
    const getTradeId = async (name: string) => (await prisma.tradeType.findFirst({ where: { name } }))?.id;
    const getSizeId = async (name: string) => (await prisma.containerSize.findFirst({ where: { name } }))?.id;
    const getAngkutId = async (name: string) => (await prisma.angkut.findFirst({ where: { name } }))?.id;

    const ids = {
        barang: {
            all: await getBarangId("ALL"),
            mesin: await getBarangId("MESIN"),
            plastik: await getBarangId("BIJI PLASTIK"),
            nonPlastik: await getBarangId("NON PLASTIK"),
            lain: await getBarangId("LAIN-LAIN"),
        },
        trade: {
            import: await getTradeId("IMPORT"),
            export: await getTradeId("EXPORT"),
        },
        size: {
            f20: await getSizeId("20 feet"),
            f40: await getSizeId("40 feet"),
            lclHijau: await getSizeId("LCL(hijau)"),
            lclMerah: await getSizeId("LCL(merah)"),
            all: await getSizeId("ALL"),
        },
        angkut: {
            forklift: await getAngkutId("FORKLIFT"),
            manual: await getAngkutId("MANUAL"),
            all: await getAngkutId("ALL"),
        }
    };

    if (!ids.trade.import || !ids.size.f20) {
        console.error("Missing essential master data. Ensure all master seeders have run.");
        return;
    }

    const tarifData = [
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f40, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 80000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f40, idAngkut: ids.angkut.manual, idBarang: ids.barang.mesin, amount: 180000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f40, idAngkut: ids.angkut.manual, idBarang: ids.barang.lain, amount: 250000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f20, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 60000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f20, idAngkut: ids.angkut.manual, idBarang: ids.barang.plastik, amount: 230000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f20, idAngkut: ids.angkut.manual, idBarang: ids.barang.nonPlastik, amount: 180000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.f20, idAngkut: ids.angkut.manual, idBarang: ids.barang.mesin, amount: 140000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.lclHijau, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 100000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.lclMerah, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 120000, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f40, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 250000, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f40, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 250000, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f20, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 300000, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f20, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 0, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.f20, idAngkut: ids.angkut.forklift, idBarang: ids.barang.all, amount: 0, jasaWrapping: false },
        { idTradeType: ids.trade.export, idContainerSize: ids.size.lclHijau, idAngkut: ids.angkut.manual, idBarang: ids.barang.all, amount: 100000, jasaWrapping: false },
        { idTradeType: ids.trade.import, idContainerSize: ids.size.all, idAngkut: ids.angkut.all, idBarang: ids.barang.all, amount: 20000, jasaWrapping: true },
    ];

    console.log("Starting TarifBongkar seeding...");

    for (const data of tarifData) {
        if (!data.idBarang || !data.idTradeType || !data.idContainerSize || !data.idAngkut) {
            console.warn("Skipping row due to missing master data ID:", data);
            continue;
        }

        const existing = await prisma.tarifBongkar.findFirst({
            where: {
                idBarang: data.idBarang,
                idContainerSize: data.idContainerSize,
                idTradeType: data.idTradeType,
                idAngkut: data.idAngkut,
                jasaWrapping: data.jasaWrapping,
            }
        });

        if (!existing) {
            await prisma.tarifBongkar.create({
                data: data as any
            });
            console.log(`Created Tarif: Amount ${data.amount}`);
        } else {
            if (existing.amount !== data.amount) {
                await prisma.tarifBongkar.update({
                    where: { id: existing.id },
                    data: { amount: data.amount }
                });
                console.log(`Updated Tarif: Amount ${existing.amount} -> ${data.amount}`);
            } else {
                console.log(`Skipped existing Tarif: Amount ${existing.amount}`);
            }
        }
    }

    console.log("TarifBongkar seeding completed.");
};
