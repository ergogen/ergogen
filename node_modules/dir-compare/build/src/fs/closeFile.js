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
const fs_1 = __importDefault(require("fs"));
function closeFilesSync(fd1, fd2) {
    if (fd1) {
        fs_1.default.closeSync(fd1);
    }
    if (fd2) {
        fs_1.default.closeSync(fd2);
    }
}
function closeFilesAsync(fd1, fd2, fdQueue) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fd1 && fd2) {
            return fdQueue.closePromise(fd1).then(() => fdQueue.closePromise(fd2));
        }
        if (fd1) {
            return fdQueue.closePromise(fd1);
        }
        if (fd2) {
            return fdQueue.closePromise(fd2);
        }
    });
}
exports.default = {
    closeFilesSync,
    closeFilesAsync
};
//# sourceMappingURL=closeFile.js.map