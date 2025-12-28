"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const borderExcel_1 = require("@common/utils/Excel/borderExcel");
const client_1 = require("@config/database/client");
const headerTarifBongkar_1 = __importDefault(require("./components/headerTarifBongkar"));
const footerTarifBongkar_1 = __importDefault(require("./components/footerTarifBongkar"));
const headerGajiKaryawan_1 = __importDefault(require("./components/headerGajiKaryawan"));
class ExcelLaporanBongkarMuatService {
    constructor() {
        this.handleExportReport = (req, workbook) => __awaiter(this, void 0, void 0, function* () {
            const worksheet = workbook.addWorksheet("Sheet 1");
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new Error("Invalid ID");
            }
            const laporan = yield client_1.prisma.laporan.findUnique({
                where: { id },
                include: {
                    detailLaporan: {
                        include: {
                            sesiBongkar: {
                                include: {
                                    barang: true,
                                    angkut: true,
                                    tradeType: true,
                                    containerSize: true,
                                    groupTeam: {
                                        include: {
                                            team: {
                                                include: {
                                                    employee: true
                                                }
                                            }
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
            });
            if (!laporan) {
                throw new Error("Data not found");
            }
            worksheet.mergeCells("A4:A8");
            worksheet.getCell("A4").value = "Tanggal";
            worksheet.getCell("A4").alignment = {
                vertical: "middle",
                horizontal: "center",
            };
            worksheet.getCell("A4").border = borderExcel_1.fullBorder;
            worksheet.mergeCells("B4:B8");
            worksheet.getCell("B4").value = "No Container";
            worksheet.getCell("B4").alignment = {
                vertical: "middle",
                horizontal: "center",
            };
            worksheet.getCell("B4").border = borderExcel_1.fullBorder;
            worksheet.getColumn("A").width = 15;
            worksheet.getColumn("B").width = 20;
            for (let i = 18; i <= 27; i++) {
                worksheet.getColumn(i).width = 10;
            }
            let startRow = 9;
            const isBarangAll = laporan.detailLaporan.some((d) => {
                var _a;
                const name = ((_a = d.sesiBongkar.barang) === null || _a === void 0 ? void 0 : _a.name) || "NULL";
                return name.trim().toUpperCase() === "ALL";
            });
            const allTariffs = yield client_1.prisma.tarifBongkar.findMany({
                include: {
                    barang: true,
                    tradeType: true,
                    containerSize: true,
                    angkut: true
                }
            });
            const tariffMap = new Map();
            const tariffGroupMap = new Map();
            const wrapCount = allTariffs.filter(t => t.jasaWrapping).length;
            console.log(`[DEBUG] Fetched ${allTariffs.length} tariffs. Found ${wrapCount} wrapping tariffs.`);
            if (wrapCount > 0) {
                const wraps = allTariffs.filter(t => t.jasaWrapping).map(t => { var _a; return `${(_a = t.barang) === null || _a === void 0 ? void 0 : _a.name} (${t.amount})`; });
                console.log(`[DEBUG] Wrapping Tariffs:`, wraps);
            }
            else {
                console.log(`[DEBUG] NO WRAPPING TARIFFS FOUND IN DB RESPONSE!`);
            }
            allTariffs.forEach((t) => {
                var _a, _b;
                const key = `${t.idTradeType}-${t.idContainerSize}-${t.idAngkut}-${t.idBarang}-${t.jasaWrapping}`;
                tariffMap.set(key, t.amount);
                const groupKey = `${t.idTradeType}-${t.idContainerSize}-${t.idAngkut}`;
                const group = tariffGroupMap.get(groupKey) || [];
                group.push({
                    idBarang: t.idBarang,
                    amount: t.amount,
                    jasaWrapping: t.jasaWrapping,
                    barangName: ((_b = (_a = t.barang) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || ""
                });
                tariffGroupMap.set(groupKey, group);
            });
            const allGaji = yield client_1.prisma.gaji.findMany({
                include: {
                    angkut: true,
                    tradeType: true,
                    containerSize: true
                }
            });
            const resolveWage = (tradeLabel, sizeLabel, angkutLabel, koorlapId) => {
                const findMatch = (sizeSearch) => {
                    return allGaji.find(g => {
                        const gTrade = g.tradeType.name.toUpperCase();
                        const gSize = g.containerSize.name.toUpperCase();
                        const gAngkut = g.angkut.name.toUpperCase();
                        const tradeTarget = tradeLabel.toUpperCase();
                        const angkutTarget = angkutLabel.toUpperCase();
                        const tradeMatch = gTrade === "ALL" ||
                            (tradeTarget.includes("IMPORT") ? gTrade.includes("IMPORT") : gTrade.includes("EXPORT"));
                        let sizeMatch = gSize === "ALL";
                        if (!sizeMatch) {
                            const searchTokens = sizeSearch.toUpperCase().match(/[A-Z0-9]+/g) || [];
                            const dbTokens = gSize.match(/[A-Z0-9]+/g) || [];
                            sizeMatch = searchTokens.every(token => dbTokens.includes(token));
                        }
                        const angkutMatch = gAngkut === "ALL" ||
                            (angkutTarget.includes("FORKLIFT") ? gAngkut.includes("FORKLIFT") : (gAngkut.includes("MANUAL") || gAngkut.includes("BURUH")));
                        return tradeMatch && sizeMatch && angkutMatch && g.koorlapId === koorlapId;
                    });
                };
                let match = findMatch(sizeLabel);
                if (!match && sizeLabel.toUpperCase().includes("LCL")) {
                    match = findMatch("LCL");
                }
                if (!match) {
                    match = findMatch("ALL");
                }
                return match ? match.gaji : 0;
            };
            const getWageRates = (koorlapId) => [
                resolveWage("IMPORT", "20", "forklift", koorlapId),
                resolveWage("IMPORT", "20", "manual", koorlapId),
                resolveWage("IMPORT", "40", "forklift", koorlapId),
                resolveWage("IMPORT", "40", "manual", koorlapId),
                resolveWage("IMPORT", "lcl hijau", "manual", koorlapId),
                resolveWage("EXPORT", "20", "forklift", koorlapId),
                resolveWage("EXPORT", "20", "manual", koorlapId),
                resolveWage("EXPORT", "40", "forklift", koorlapId),
                resolveWage("EXPORT", "40", "manual", koorlapId),
                resolveWage("EXPORT", "lcl hijau", "manual", koorlapId),
            ];
            const grouped = new Map();
            laporan.detailLaporan.forEach((detail) => {
                const tanggalKey = new Intl.DateTimeFormat('en-CA', {
                    timeZone: 'Asia/Jakarta',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }).format(detail.sesiBongkar.createdAt);
                if (!grouped.has(tanggalKey)) {
                    grouped.set(tanggalKey, []);
                }
                grouped.get(tanggalKey).push(detail);
            });
            const aggregates = new Map();
            const wageTotalAggregates = new Array(10).fill(0);
            const teamMapping = new Map();
            const uniqueTeamIds = Array.from(new Set(laporan.detailLaporan.map(d => d.sesiBongkar.idGroupTeam)));
            uniqueTeamIds.forEach((teamId, index) => {
                var _a;
                const detail = laporan.detailLaporan.find(d => d.sesiBongkar.idGroupTeam === teamId);
                const team = (_a = detail === null || detail === void 0 ? void 0 : detail.sesiBongkar.groupTeam) === null || _a === void 0 ? void 0 : _a.team;
                const teamName = team ? team.map(t => t.employee.namaLengkap).join(" & ") : "Unknown Team";
                const colStart = 28 + (index * 10);
                teamMapping.set(teamId, {
                    colStart,
                    name: teamName,
                    aggregates: new Array(10).fill(0),
                    koorlapId: (detail === null || detail === void 0 ? void 0 : detail.sesiBongkar.idKoorLap) || ""
                });
                for (let i = 0; i < 10; i++) {
                    worksheet.getColumn(colStart + i).width = 10;
                }
            });
            const sortedDates = Array.from(grouped.keys()).sort();
            sortedDates.forEach((tanggal) => {
                const details = grouped.get(tanggal);
                worksheet.getCell(`A${startRow}`).value = new Date(tanggal);
                worksheet.getCell(`A${startRow}`).numFmt = "dd-mm-yyyy";
                worksheet.getCell(`A${startRow}`).alignment = {
                    vertical: "middle",
                    horizontal: "center",
                };
                worksheet.getCell(`A${startRow}`).border = borderExcel_1.fullBorder;
                const rowCounts = new Map();
                const containers = details.map((d) => d.sesiBongkar.noContainer);
                worksheet.getCell(`B${startRow}`).value = containers.join(", ");
                worksheet.getCell(`B${startRow}`).alignment = { wrapText: true };
                worksheet.getCell(`B${startRow}`).border = borderExcel_1.fullBorder;
                if (isBarangAll) {
                    let totalForklift = 0;
                    let forkliftAmount = 0;
                    let totalManual = 0;
                    let manualAmount = 0;
                    details.forEach((d) => {
                        var _a, _b;
                        let price = d.hargaBongkar + d.biayaWrapping;
                        if (!price || price === 0) {
                            const s = d.sesiBongkar;
                            const familyCandidates = allTariffs.filter(t => t.idTradeType === s.idTradeType && t.idContainerSize === s.idContainerSize);
                            const resolvePrice = (candidates, isWrapping) => {
                                const subset = candidates.filter(c => c.jasaWrapping === isWrapping);
                                const exact = subset.find(c => c.idAngkut === s.idAngkut && c.idBarang === s.idBarang);
                                if (exact)
                                    return exact.amount;
                                const exactAngkutAll = subset.find(c => { var _a, _b; return c.idAngkut === s.idAngkut && ((_b = (_a = c.barang) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "all"; });
                                if (exactAngkutAll)
                                    return exactAngkutAll.amount;
                                const anyAngkutAll = subset.find(c => { var _a, _b; return ((_b = (_a = c.barang) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "all"; });
                                if (anyAngkutAll)
                                    return anyAngkutAll.amount;
                                if (subset.length > 0)
                                    return subset[0].amount;
                                return 0;
                            };
                            price = resolvePrice(familyCandidates, false);
                            if (s.jasaWrapping) {
                                price += resolvePrice(familyCandidates, true);
                            }
                        }
                        const angkutName = ((_b = (_a = d.sesiBongkar.angkut) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
                        if (angkutName.includes("forklift")) {
                            totalForklift += 1;
                            forkliftAmount += price;
                        }
                        else if (angkutName.includes("manual") ||
                            angkutName.includes("buruh")) {
                            totalManual += 1;
                            manualAmount += price;
                        }
                    });
                    if (totalForklift > 0) {
                        worksheet.getCell(startRow, 3).value = totalForklift;
                        worksheet.getCell(startRow, 3).numFmt = "#,##0";
                        worksheet.getCell(startRow, 3).alignment = { horizontal: "center" };
                        const curr = aggregates.get(3) || { count: 0, totalAmount: 0 };
                        aggregates.set(3, {
                            count: curr.count + totalForklift,
                            totalAmount: curr.totalAmount + forkliftAmount
                        });
                    }
                    worksheet.getCell(startRow, 3).border = borderExcel_1.fullBorder;
                    if (totalManual > 0) {
                        worksheet.getCell(startRow, 4).value = totalManual;
                        worksheet.getCell(startRow, 4).numFmt = "#,##0";
                        worksheet.getCell(startRow, 4).alignment = { horizontal: "center" };
                        const curr = aggregates.get(4) || { count: 0, totalAmount: 0 };
                        aggregates.set(4, {
                            count: curr.count + totalManual,
                            totalAmount: curr.totalAmount + manualAmount
                        });
                    }
                    worksheet.getCell(startRow, 4).border = borderExcel_1.fullBorder;
                }
                else {
                    details.forEach((d) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        const s = d.sesiBongkar;
                        let basePrice = 0;
                        let wrappingPrice = 0;
                        const groupKey = `${s.idTradeType}-${s.idContainerSize}-${s.idAngkut}`;
                        const candidates = tariffGroupMap.get(groupKey) || [];
                        if (!d.hargaBongkar || d.hargaBongkar === 0) {
                            const baseCandidates = candidates.filter(c => c.jasaWrapping === false);
                            let exact = baseCandidates.find(c => c.idBarang === s.idBarang);
                            if (exact)
                                basePrice = exact.amount;
                            else {
                                let fb = baseCandidates.find(c => c.barangName === "all");
                                if (fb)
                                    basePrice = fb.amount;
                                else if (baseCandidates.length > 0)
                                    basePrice = baseCandidates[0].amount;
                            }
                            if (s.jasaWrapping && ((_b = (_a = s.tradeType) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) !== "EXPORT") {
                                const wrapCandidates = candidates.filter(c => c.jasaWrapping === true);
                                exact = wrapCandidates.find(c => c.idBarang === s.idBarang);
                                if (exact)
                                    wrappingPrice = exact.amount;
                                else {
                                    let fb = wrapCandidates.find(c => c.barangName === "all");
                                    if (fb)
                                        wrappingPrice = fb.amount;
                                    else if (wrapCandidates.length > 0)
                                        wrappingPrice = wrapCandidates[0].amount;
                                }
                            }
                        }
                        else {
                            basePrice = d.hargaBongkar;
                            wrappingPrice = d.biayaWrapping;
                        }
                        const trade = ((_d = (_c = s.tradeType) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || "";
                        const size = ((_f = (_e = s.containerSize) === null || _e === void 0 ? void 0 : _e.name) === null || _f === void 0 ? void 0 : _f.toLowerCase()) || "";
                        const angkut = ((_h = (_g = s.angkut) === null || _g === void 0 ? void 0 : _g.name) === null || _h === void 0 ? void 0 : _h.toLowerCase()) || "";
                        const barang = ((_k = (_j = s.barang) === null || _j === void 0 ? void 0 : _j.name) === null || _k === void 0 ? void 0 : _k.toUpperCase()) || "";
                        let colIndex = -1;
                        if (wrappingPrice > 0) {
                            const c = rowCounts.get(12) || { count: 0, total: 0 };
                            rowCounts.set(12, {
                                count: c.count + 1,
                                total: c.total + wrappingPrice
                            });
                        }
                        if (trade === "IMPORT") {
                            if (size.includes("40")) {
                                if (angkut.includes("forklift"))
                                    colIndex = 3;
                                else if (angkut.includes("manual")) {
                                    if (barang.includes("MESIN"))
                                        colIndex = 4;
                                    else
                                        colIndex = 5;
                                }
                            }
                            else if (size.includes("20")) {
                                if (angkut.includes("forklift"))
                                    colIndex = 6;
                                else if (angkut.includes("manual")) {
                                    if (barang.includes("PLASTIK") && !barang.includes("NON"))
                                        colIndex = 7;
                                    else if (barang.includes("NON"))
                                        colIndex = 8;
                                    else if (barang.includes("MESIN"))
                                        colIndex = 9;
                                }
                            }
                            else if (size.includes("lcl")) {
                                if (size.includes("hijau"))
                                    colIndex = 10;
                                else if (size.includes("merah"))
                                    colIndex = 11;
                            }
                        }
                        else if (trade === "EXPORT") {
                            if (size.includes("40")) {
                                if (angkut.includes("forklift"))
                                    colIndex = 13;
                                else if (angkut.includes("manual"))
                                    colIndex = 14;
                            }
                            else if (size.includes("20")) {
                                if (angkut.includes("forklift"))
                                    colIndex = 15;
                                else if (angkut.includes("manual"))
                                    colIndex = 16;
                            }
                            else if (size.includes("lcl")) {
                                colIndex = 17;
                            }
                        }
                        if (colIndex !== -1) {
                            const curr = rowCounts.get(colIndex) || { count: 0, total: 0 };
                            rowCounts.set(colIndex, {
                                count: curr.count + 1,
                                total: curr.total + basePrice
                            });
                        }
                    });
                    rowCounts.forEach((val, col) => {
                        worksheet.getCell(startRow, col).value = val.count === 0 ? "" : val.count;
                        worksheet.getCell(startRow, col).numFmt = "#,##0";
                        worksheet.getCell(startRow, col).alignment = { horizontal: "center" };
                        const agg = aggregates.get(col) || { count: 0, totalAmount: 0 };
                        aggregates.set(col, {
                            count: agg.count + val.count,
                            totalAmount: agg.totalAmount + val.total
                        });
                    });
                    for (let c = 3; c <= 17; c++) {
                        worksheet.getCell(startRow, c).border = borderExcel_1.fullBorder;
                    }
                }
                const rowWageSessions = new Array(10).fill(0);
                details.forEach((d) => {
                    var _a, _b, _c, _d, _e, _f;
                    const s = d.sesiBongkar;
                    const trade = ((_b = (_a = s.tradeType) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "";
                    const size = ((_d = (_c = s.containerSize) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || "";
                    const angkut = ((_f = (_e = s.angkut) === null || _e === void 0 ? void 0 : _e.name) === null || _f === void 0 ? void 0 : _f.toLowerCase()) || "";
                    if (trade.includes("IMPORT")) {
                        if (size.includes("20")) {
                            if (angkut.includes("forklift"))
                                rowWageSessions[0]++;
                            else
                                rowWageSessions[1]++;
                        }
                        else if (size.includes("40")) {
                            if (angkut.includes("forklift"))
                                rowWageSessions[2]++;
                            else
                                rowWageSessions[3]++;
                        }
                        else if (size.includes("lcl") && size.includes("hijau")) {
                            rowWageSessions[4]++;
                        }
                    }
                    else if (trade.includes("EXPORT")) {
                        if (size.includes("20")) {
                            if (angkut.includes("forklift"))
                                rowWageSessions[5]++;
                            else
                                rowWageSessions[6]++;
                        }
                        else if (size.includes("40")) {
                            if (angkut.includes("forklift"))
                                rowWageSessions[7]++;
                            else
                                rowWageSessions[8]++;
                        }
                        else if (size.includes("lcl") && size.includes("hijau")) {
                            rowWageSessions[9]++;
                        }
                    }
                });
                rowWageSessions.forEach((count, i) => {
                    const cell = worksheet.getCell(startRow, 18 + i);
                    cell.value = count === 0 ? "" : count;
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    cell.border = borderExcel_1.fullBorder;
                    cell.numFmt = "#,##0";
                    wageTotalAggregates[i] += count;
                });
                teamMapping.forEach((map, teamId) => {
                    const teamSessions = new Array(10).fill(0);
                    const teamDetails = details.filter(d => d.sesiBongkar.idGroupTeam === teamId);
                    teamDetails.forEach(d => {
                        var _a, _b, _c, _d, _e, _f;
                        const s = d.sesiBongkar;
                        const trade = ((_b = (_a = s.tradeType) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "";
                        const size = ((_d = (_c = s.containerSize) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || "";
                        const angkut = ((_f = (_e = s.angkut) === null || _e === void 0 ? void 0 : _e.name) === null || _f === void 0 ? void 0 : _f.toLowerCase()) || "";
                        if (trade.includes("IMPORT")) {
                            if (size.includes("20")) {
                                if (angkut.includes("forklift"))
                                    teamSessions[0]++;
                                else
                                    teamSessions[1]++;
                            }
                            else if (size.includes("40")) {
                                if (angkut.includes("forklift"))
                                    teamSessions[2]++;
                                else
                                    teamSessions[3]++;
                            }
                            else if (size.includes("lcl") && size.includes("hijau"))
                                teamSessions[4]++;
                        }
                        else if (trade.includes("EXPORT")) {
                            if (size.includes("20")) {
                                if (angkut.includes("forklift"))
                                    teamSessions[5]++;
                                else
                                    teamSessions[6]++;
                            }
                            else if (size.includes("40")) {
                                if (angkut.includes("forklift"))
                                    teamSessions[7]++;
                                else
                                    teamSessions[8]++;
                            }
                            else if (size.includes("lcl") && size.includes("hijau"))
                                teamSessions[9]++;
                        }
                    });
                    teamSessions.forEach((count, i) => {
                        const cell = worksheet.getCell(startRow, map.colStart + i);
                        cell.value = count === 0 ? "" : count;
                        cell.alignment = { horizontal: "center", vertical: "middle" };
                        cell.border = borderExcel_1.fullBorder;
                        cell.numFmt = "#,##0";
                        map.aggregates[i] += count;
                    });
                });
                startRow++;
            });
            const HEADER_ROW_START = 5;
            (0, headerTarifBongkar_1.default)(worksheet, 3, HEADER_ROW_START, isBarangAll);
            (0, headerGajiKaryawan_1.default)(worksheet, 18, 4, "Total Bongkar Muat");
            (0, footerTarifBongkar_1.default)(worksheet, startRow, aggregates, isBarangAll, allTariffs);
            wageTotalAggregates.forEach((count, i) => {
                const cell = worksheet.getCell(startRow, 18 + i);
                cell.value = count;
                cell.font = { bold: true };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = borderExcel_1.fullBorder;
                cell.numFmt = "#,##0";
            });
            teamMapping.forEach((map) => {
                (0, headerGajiKaryawan_1.default)(worksheet, map.colStart, 4, `Bongkar Muat ${map.name}`);
                const wageRates = getWageRates(map.koorlapId);
                const boldTotalsRow = startRow;
                const ratesRow = startRow + 1;
                const amountTotalRow = startRow + 2;
                const grandTotalRow = startRow + 3;
                let teamGrandTotal = 0;
                map.aggregates.forEach((count, i) => {
                    const col = map.colStart + i;
                    const rate = wageRates[i];
                    const totalAmount = count * rate;
                    teamGrandTotal += totalAmount;
                    const cellBoldCount = worksheet.getCell(boldTotalsRow, col);
                    cellBoldCount.value = count;
                    cellBoldCount.font = { bold: true };
                    cellBoldCount.alignment = { horizontal: "center", vertical: "middle" };
                    cellBoldCount.border = borderExcel_1.fullBorder;
                    cellBoldCount.numFmt = "#,##0";
                    const cellRate = worksheet.getCell(ratesRow, col);
                    cellRate.value = rate;
                    cellRate.alignment = { horizontal: "center", vertical: "middle" };
                    cellRate.border = borderExcel_1.fullBorder;
                    cellRate.numFmt = "#,##0";
                    const cellAmount = worksheet.getCell(amountTotalRow, col);
                    cellAmount.value = totalAmount;
                    cellAmount.alignment = { horizontal: "center", vertical: "middle" };
                    cellAmount.border = borderExcel_1.fullBorder;
                    cellAmount.numFmt = "#,##0";
                });
                const startCol = map.colStart;
                const endCol = map.colStart + 9;
                const startCell = worksheet.getRow(grandTotalRow).getCell(startCol).address;
                const endCell = worksheet.getRow(grandTotalRow).getCell(endCol).address;
                worksheet.mergeCells(`${startCell}:${endCell}`);
                const grandTotalCell = worksheet.getCell(grandTotalRow, startCol);
                grandTotalCell.value = teamGrandTotal;
                grandTotalCell.font = { bold: true };
                grandTotalCell.alignment = { horizontal: "center", vertical: "middle" };
                grandTotalCell.border = borderExcel_1.fullBorder;
                grandTotalCell.numFmt = "#,##0";
            });
            return yield workbook.xlsx.writeBuffer();
        });
        this._detailLaporanRepository = client_1.prisma.detailLaporan;
    }
}
exports.default = ExcelLaporanBongkarMuatService;
