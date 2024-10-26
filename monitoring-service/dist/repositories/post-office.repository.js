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
exports.PostOfficeRepository = void 0;
const sqlite_provider_1 = __importDefault(require("../infrastructure/db/sqlite.provider"));
const post_office_model_1 = require("../domain/models/post-office.model");
class PostOfficeRepository {
    constructor(dbProvider) {
        this.dbProvider = dbProvider;
    }
    addPostOffice(postOffice) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = `
        INSERT INTO postoffices (id, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
      `;
                const params = Object.values(postOffice);
                this.dbProvider.db.run(query, params, (err) => {
                    if (err) {
                        console.error('Error inserting post office:', err);
                        reject(err);
                    }
                    else {
                        console.log('Post office %s inserted successfully.', postOffice.address);
                        resolve();
                    }
                });
            });
        });
    }
    getAll() {
        return new Promise((resolve, reject) => {
            this.dbProvider.db.all(`SELECT * FROM postoffices;`, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log('Post office rows from repository: ', rows);
                    const result = rows.map((row) => post_office_model_1.PostOffice.map(row));
                    resolve(result);
                }
            });
        });
    }
}
exports.PostOfficeRepository = PostOfficeRepository;
const postOfficeRepo = new PostOfficeRepository(sqlite_provider_1.default);
exports.default = postOfficeRepo;
