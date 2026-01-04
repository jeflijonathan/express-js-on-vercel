import { Worksheet } from "exceljs";
import { fullBorder } from "@common/utils/Excel/borderExcel";

interface ColumnAggregate {
    count: number;
    totalAmount?: number;
}

interface TariffWithRelations {
    id: number;
    amount: number;
    jasaWrapping: boolean;
    idTradeType: number;
    tradeType?: { name: string };
    idContainerSize: number;
    containerSize?: { name: string };
    idAngkut: number;
    angkut?: { name: string };
    idBarang: number;
    barang?: { name: string };
}

interface ColumnCriteria {
    trade?: string;
    size?: string;
    angkut?: string;
    barangKeywords?: string[];
    excludeKeywords?: string[];
    sizeKeywords?: string[];
    wantsWrapping?: boolean;
    isSimple?: boolean;
}

const getCriteria = (col: number, isSimple: boolean): ColumnCriteria | null => {
    if (isSimple) {
        if (col === 3) return { angkut: "FORKLIFT", isSimple: true };
        if (col === 4) return { angkut: "MANUAL", isSimple: true };
        return null;
    }

    if (col === 3) return { trade: "IMPORT", size: "40", angkut: "FORKLIFT" };
    if (col === 4) return { trade: "IMPORT", size: "40", angkut: "MANUAL", barangKeywords: ["MESIN", "MATERIAL"] };
    if (col === 5) return { trade: "IMPORT", size: "40", angkut: "MANUAL" };

    if (col === 6) return { trade: "IMPORT", size: "20", angkut: "FORKLIFT" };
    if (col === 7) return { trade: "IMPORT", size: "20", angkut: "MANUAL", barangKeywords: ["PLASTIK"], excludeKeywords: ["NON"] };
    if (col === 8) return { trade: "IMPORT", size: "20", angkut: "MANUAL", barangKeywords: ["NON"] }; // Non-Plastik? Or Non-Mesin? "NON" check
    if (col === 9) return { trade: "IMPORT", size: "20", angkut: "MANUAL", barangKeywords: ["MESIN", "MATERIAL"] };

    if (col === 10) return { trade: "IMPORT", size: "LCL", sizeKeywords: ["HIJAU"] };
    if (col === 11) return { trade: "IMPORT", size: "LCL", sizeKeywords: ["MERAH"] };

    if (col === 12) return { trade: "ALL", size: "ALL", angkut: "ALL", sizeKeywords: ["ALL", "ALLLCL"], wantsWrapping: true }; // Jasa Wrapping

    if (col === 13) return { trade: "EXPORT", size: "40", angkut: "FORKLIFT" };
    if (col === 14) return { trade: "EXPORT", size: "40", angkut: "MANUAL" };
    if (col === 15) return { trade: "EXPORT", size: "20", angkut: "FORKLIFT" };
    if (col === 16) return { trade: "EXPORT", size: "20", angkut: "MANUAL" };
    if (col === 17) return { trade: "EXPORT", size: "LCL", sizeKeywords: ["HIJAU"] };

    return null;
};

export const resolvePriceForColumn = (col: number, isBarangAll: boolean, allTariffs: TariffWithRelations[]): number => {
    const criteria = getCriteria(col, isBarangAll);
    if (!criteria) return 0;

    if (criteria.wantsWrapping) {
        const wrap = allTariffs.find(t => {
            if (!t.jasaWrapping) return false;
            const name = t.barang?.name?.toLowerCase().trim() || "";
            return name === "all" || name === "general" || name === "jasa wrapping" || name.includes("lain") || name === "alllcl";
        });
        if (wrap) return wrap.amount;
        console.log(`Col ${col} (Wrapping) - No tariff found for 'ALL'/'General'/'Jasa Wrapping' with jasaWrapping=true`);
        return 0;
    }

    const matchesAngkut = (tAngkut: string, criteriaAngkut: string) => {
        if (!criteriaAngkut) return true;
        if (criteriaAngkut === "MANUAL") {
            return tAngkut.includes("MANUAL") || tAngkut.includes("BURUH");
        }
        return tAngkut.includes(criteriaAngkut);
    };

    let candidates = allTariffs.filter(t => {
        const tTrade = t.tradeType?.name?.toUpperCase() || "";
        const tSize = t.containerSize?.name?.toUpperCase() || "";
        const tAngkut = t.angkut?.name?.toUpperCase() || "";
        const isBase = !t.jasaWrapping;

        if (!isBase) return false;

        if (criteria.isSimple) {
            if (criteria.angkut && !matchesAngkut(tAngkut, criteria.angkut)) return false;
            return true;
        }

        if (criteria.trade && !tTrade.includes(criteria.trade)) return false;
        if (criteria.size && !tSize.includes(criteria.size)) return false;
        if (criteria.sizeKeywords) {
            if (!criteria.sizeKeywords.some(k => tSize.includes(k))) return false;
        }
        if (criteria.angkut && !matchesAngkut(tAngkut, criteria.angkut)) return false;

        return true;
    });

    if (criteria.barangKeywords) {
        const exact = candidates.find(t => {
            const name = t.barang?.name?.toUpperCase() || "";
            return criteria.barangKeywords!.some(k => name.includes(k));
        });
        if (exact) return exact.amount;
    }

    const allMatch = candidates.find(t => {
        const name = t.barang?.name?.toLowerCase().trim() || "";
        return name === "all" || name === "general" || name.includes("lain") || name === "alllcl";
    });
    if (allMatch) return allMatch.amount;

    if (!criteria.isSimple) {
        const looseCandidates = allTariffs.filter(t => {
            const tTrade = t.tradeType?.name?.toUpperCase() || "";
            const tSize = t.containerSize?.name?.toUpperCase() || "";
            const isBase = !t.jasaWrapping;
            if (!isBase) return false;

            if (criteria.trade && !tTrade.includes(criteria.trade)) return false;
            if (criteria.size && !tSize.includes(criteria.size)) return false;
            return true;
        });

        const crossMatch = looseCandidates.find(t => {
            const name = t.barang?.name?.toLowerCase().trim() || "";
            return name === "all" || name === "general" || name.includes("lain");
        });
        if (crossMatch) {
            return crossMatch.amount;
        }
    }

    if (candidates.length > 0) return candidates[0].amount;

    return 0;
};

const FooterTarifBongkar = (
    ws: Worksheet,
    startRow: number,
    aggregates: Map<number, ColumnAggregate>,
    isBarangAll: boolean,
    allTariffs: TariffWithRelations[]
) => {
    let currentRow = startRow;
    const startCol = 3;
    const endCol = isBarangAll ? 4 : 17;

    const calculatedTotals = new Map<number, { count: number, price: number, total: number }>();
    let grandTotal = 0;

    for (let c = startCol; c <= endCol; c++) {
        const ag = aggregates.get(c) || { count: 0, totalAmount: 0 };
        const masterPrice = resolvePriceForColumn(c, isBarangAll, allTariffs);

        // Use totalAmount from service (which prefers DetailLaporan.hargaBongkar)
        // Fallback to calculation if totalAmount is missing or zero
        const total = (ag.totalAmount && ag.totalAmount > 0) ? ag.totalAmount : (ag.count * masterPrice);

        // Determine "Effective" price for display
        // If total aligns with count*masterPrice, show masterPrice
        // Otherwise if we have total, show average or master? 
        // User asked to "use price in report". 
        const displayPrice = (ag.count > 0 && ag.totalAmount && ag.totalAmount > 0)
            ? Math.round(ag.totalAmount / ag.count)
            : masterPrice;

        calculatedTotals.set(c, { count: ag.count, price: displayPrice, total });
        grandTotal += total;
    }

    ws.getCell(currentRow, 2).value = "Jumlah";
    ws.getCell(currentRow, 2).alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    ws.getCell(currentRow, 2).font = { bold: true };
    ws.getCell(currentRow, 2).border = fullBorder;

    for (let c = startCol; c <= endCol; c++) {
        const data = calculatedTotals.get(c)!;
        ws.getCell(currentRow, c).value = data.count;
        ws.getCell(currentRow, c).font = { bold: true };
        ws.getCell(currentRow, c).alignment = { horizontal: "center" };
        ws.getCell(currentRow, c).border = fullBorder;
    }
    currentRow++;

    ws.getCell(currentRow, 2).value = "Harga Satuan";
    ws.getCell(currentRow, 2).alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    ws.getCell(currentRow, 2).font = { bold: true };
    ws.getCell(currentRow, 2).border = fullBorder;

    for (let c = startCol; c <= endCol; c++) {
        const data = calculatedTotals.get(c)!;
        ws.getCell(currentRow, c).value = data.price;
        ws.getCell(currentRow, c).numFmt = "#,##0";
        ws.getCell(currentRow, c).alignment = { horizontal: "center" };
        ws.getCell(currentRow, c).border = fullBorder;
    }
    currentRow++;

    // ==========================
    // ROW 3: SUBTOTAL
    // ======= ===================
    ws.getCell(currentRow, 2).value = "Subtotal";
    ws.getCell(currentRow, 2).alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    ws.getCell(currentRow, 2).font = { bold: true };
    ws.getCell(currentRow, 2).border = fullBorder;

    for (let c = startCol; c <= endCol; c++) {
        const data = calculatedTotals.get(c)!;
        ws.getCell(currentRow, c).value = data.total;
        ws.getCell(currentRow, c).numFmt = "#,##0";
        ws.getCell(currentRow, c).alignment = { horizontal: "center" };
        ws.getCell(currentRow, c).border = fullBorder;
    }
    currentRow++;

    // ==========================
    // ROW 4: TOTAL (Grand Total)
    // ==========================
    ws.getCell(currentRow, 2).value = "Total";
    ws.getCell(currentRow, 2).alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell(currentRow, 2).font = { bold: true };
    ws.getCell(currentRow, 2).border = fullBorder;

    ws.mergeCells(currentRow, startCol, currentRow, endCol);
    ws.getCell(currentRow, startCol).value = grandTotal;
    ws.getCell(currentRow, startCol).numFmt = "#,##0";
    ws.getCell(currentRow, startCol).font = { bold: true };
    ws.getCell(currentRow, startCol).alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell(currentRow, startCol).border = fullBorder;
};

export default FooterTarifBongkar;
