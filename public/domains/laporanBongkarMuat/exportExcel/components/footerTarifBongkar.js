"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePriceForColumn = void 0;
const borderExcel_1 = require("@common/utils/Excel/borderExcel");
const getCriteria = (col, isSimple) => {
    if (isSimple) {
        if (col === 3)
            return { angkut: "FORKLIFT", isSimple: true };
        if (col === 4)
            return { angkut: "MANUAL", isSimple: true };
        return null;
    }
    if (col === 3)
        return { trade: "IMPORT", size: "40", angkut: "FORKLIFT" };
    if (col === 4)
        return { trade: "IMPORT", size: "40", angkut: "MANUAL", barangKeywords: ["MESIN", "MATERIAL"] };
    if (col === 5)
        return { trade: "IMPORT", size: "40", angkut: "MANUAL" };
    if (col === 6)
        return { trade: "IMPORT", size: "20", angkut: "FORKLIFT" };
    if (col === 7)
        return { trade: "IMPORT", size: "20", angkut: "MANUAL", barangKeywords: ["PLASTIK"], excludeKeywords: ["NON"] };
    if (col === 8)
        return { trade: "IMPORT", size: "20", angkut: "MANUAL", barangKeywords: ["NON"] }; // Non-Plastik? Or Non-Mesin? "NON" check
    if (col === 9)
        return { trade: "IMPORT", size: "20", angkut: "MANUAL", barangKeywords: ["MESIN", "MATERIAL"] };
    if (col === 10)
        return { trade: "IMPORT", size: "LCL", sizeKeywords: ["HIJAU"] };
    if (col === 11)
        return { trade: "IMPORT", size: "LCL", sizeKeywords: ["MERAH"] };
    if (col === 12)
        return { trade: "ALL", size: "ALL", angkut: "ALL", sizeKeywords: ["ALL", "ALLLCL"], wantsWrapping: true }; // Jasa Wrapping
    if (col === 13)
        return { trade: "EXPORT", size: "40", angkut: "FORKLIFT" };
    if (col === 14)
        return { trade: "EXPORT", size: "40", angkut: "MANUAL" };
    if (col === 15)
        return { trade: "EXPORT", size: "20", angkut: "FORKLIFT" };
    if (col === 16)
        return { trade: "EXPORT", size: "20", angkut: "MANUAL" };
    if (col === 17)
        return { trade: "EXPORT", size: "LCL", sizeKeywords: ["HIJAU"] };
    return null;
};
const resolvePriceForColumn = (col, isBarangAll, allTariffs) => {
    const criteria = getCriteria(col, isBarangAll);
    if (!criteria)
        return 0;
    if (criteria.wantsWrapping) {
        const wrap = allTariffs.find(t => {
            var _a, _b;
            if (!t.jasaWrapping)
                return false;
            const name = ((_b = (_a = t.barang) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) || "";
            return name === "all" || name === "general" || name === "jasa wrapping" || name.includes("lain") || name === "alllcl";
        });
        if (wrap)
            return wrap.amount;
        console.log(`Col ${col} (Wrapping) - No tariff found for 'ALL'/'General'/'Jasa Wrapping' with jasaWrapping=true`);
        return 0;
    }
    const matchesAngkut = (tAngkut, criteriaAngkut) => {
        if (!criteriaAngkut)
            return true;
        if (criteriaAngkut === "MANUAL") {
            return tAngkut.includes("MANUAL") || tAngkut.includes("BURUH");
        }
        return tAngkut.includes(criteriaAngkut);
    };
    let candidates = allTariffs.filter(t => {
        var _a, _b, _c, _d, _e, _f;
        const tTrade = ((_b = (_a = t.tradeType) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "";
        const tSize = ((_d = (_c = t.containerSize) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || "";
        const tAngkut = ((_f = (_e = t.angkut) === null || _e === void 0 ? void 0 : _e.name) === null || _f === void 0 ? void 0 : _f.toUpperCase()) || "";
        const isBase = !t.jasaWrapping;
        if (!isBase)
            return false;
        if (criteria.isSimple) {
            if (criteria.angkut && !matchesAngkut(tAngkut, criteria.angkut))
                return false;
            return true;
        }
        if (criteria.trade && !tTrade.includes(criteria.trade))
            return false;
        if (criteria.size && !tSize.includes(criteria.size))
            return false;
        if (criteria.sizeKeywords) {
            if (!criteria.sizeKeywords.some(k => tSize.includes(k)))
                return false;
        }
        if (criteria.angkut && !matchesAngkut(tAngkut, criteria.angkut))
            return false;
        return true;
    });
    if (criteria.barangKeywords) {
        const exact = candidates.find(t => {
            var _a, _b;
            const name = ((_b = (_a = t.barang) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "";
            return criteria.barangKeywords.some(k => name.includes(k));
        });
        if (exact)
            return exact.amount;
    }
    const allMatch = candidates.find(t => {
        var _a, _b;
        const name = ((_b = (_a = t.barang) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) || "";
        return name === "all" || name === "general" || name.includes("lain") || name === "alllcl";
    });
    if (allMatch)
        return allMatch.amount;
    if (!criteria.isSimple) {
        const looseCandidates = allTariffs.filter(t => {
            var _a, _b, _c, _d;
            const tTrade = ((_b = (_a = t.tradeType) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "";
            const tSize = ((_d = (_c = t.containerSize) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || "";
            const isBase = !t.jasaWrapping;
            if (!isBase)
                return false;
            if (criteria.trade && !tTrade.includes(criteria.trade))
                return false;
            if (criteria.size && !tSize.includes(criteria.size))
                return false;
            return true;
        });
        const crossMatch = looseCandidates.find(t => {
            var _a, _b;
            const name = ((_b = (_a = t.barang) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) || "";
            return name === "all" || name === "general" || name.includes("lain");
        });
        if (crossMatch) {
            return crossMatch.amount;
        }
    }
    if (candidates.length > 0)
        return candidates[0].amount;
    return 0;
};
exports.resolvePriceForColumn = resolvePriceForColumn;
const FooterTarifBongkar = (ws, startRow, aggregates, isBarangAll, allTariffs) => {
    let currentRow = startRow;
    const startCol = 3;
    const endCol = isBarangAll ? 4 : 17;
    const calculatedTotals = new Map();
    let grandTotal = 0;
    for (let c = startCol; c <= endCol; c++) {
        const ag = aggregates.get(c) || { count: 0, totalAmount: 0 };
        const masterPrice = (0, exports.resolvePriceForColumn)(c, isBarangAll, allTariffs);
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
    ws.getCell(currentRow, 2).border = borderExcel_1.fullBorder;
    for (let c = startCol; c <= endCol; c++) {
        const data = calculatedTotals.get(c);
        ws.getCell(currentRow, c).value = data.count;
        ws.getCell(currentRow, c).font = { bold: true };
        ws.getCell(currentRow, c).alignment = { horizontal: "center" };
        ws.getCell(currentRow, c).border = borderExcel_1.fullBorder;
    }
    currentRow++;
    ws.getCell(currentRow, 2).value = "Harga Satuan";
    ws.getCell(currentRow, 2).alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    ws.getCell(currentRow, 2).font = { bold: true };
    ws.getCell(currentRow, 2).border = borderExcel_1.fullBorder;
    for (let c = startCol; c <= endCol; c++) {
        const data = calculatedTotals.get(c);
        ws.getCell(currentRow, c).value = data.price;
        ws.getCell(currentRow, c).numFmt = "#,##0";
        ws.getCell(currentRow, c).alignment = { horizontal: "center" };
        ws.getCell(currentRow, c).border = borderExcel_1.fullBorder;
    }
    currentRow++;
    // ==========================
    // ROW 3: SUBTOTAL
    // ======= ===================
    ws.getCell(currentRow, 2).value = "Subtotal";
    ws.getCell(currentRow, 2).alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    ws.getCell(currentRow, 2).font = { bold: true };
    ws.getCell(currentRow, 2).border = borderExcel_1.fullBorder;
    for (let c = startCol; c <= endCol; c++) {
        const data = calculatedTotals.get(c);
        ws.getCell(currentRow, c).value = data.total;
        ws.getCell(currentRow, c).numFmt = "#,##0";
        ws.getCell(currentRow, c).alignment = { horizontal: "center" };
        ws.getCell(currentRow, c).border = borderExcel_1.fullBorder;
    }
    currentRow++;
    // ==========================
    // ROW 4: TOTAL (Grand Total)
    // ==========================
    ws.getCell(currentRow, 2).value = "Total";
    ws.getCell(currentRow, 2).alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell(currentRow, 2).font = { bold: true };
    ws.getCell(currentRow, 2).border = borderExcel_1.fullBorder;
    ws.mergeCells(currentRow, startCol, currentRow, endCol);
    ws.getCell(currentRow, startCol).value = grandTotal;
    ws.getCell(currentRow, startCol).numFmt = "#,##0";
    ws.getCell(currentRow, startCol).font = { bold: true };
    ws.getCell(currentRow, startCol).alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell(currentRow, startCol).border = borderExcel_1.fullBorder;
};
exports.default = FooterTarifBongkar;
