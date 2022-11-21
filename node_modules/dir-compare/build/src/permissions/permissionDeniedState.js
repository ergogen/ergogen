"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrmissionDenieStateWhenRightMissing = exports.getPrmissionDenieStateWhenLeftMissing = exports.getPermissionDeniedState = void 0;
function getPermissionDeniedState(entry1, entry2) {
    if (entry1.isPermissionDenied && entry2.isPermissionDenied) {
        return "access-error-both";
    }
    else if (entry1.isPermissionDenied) {
        return "access-error-left";
    }
    else if (entry2.isPermissionDenied) {
        return "access-error-right";
    }
    else {
        return "access-ok";
    }
}
exports.getPermissionDeniedState = getPermissionDeniedState;
function getPrmissionDenieStateWhenLeftMissing(entry2) {
    let permissionDeniedState = "access-ok";
    if (entry2.isPermissionDenied) {
        permissionDeniedState = "access-error-right";
    }
    return permissionDeniedState;
}
exports.getPrmissionDenieStateWhenLeftMissing = getPrmissionDenieStateWhenLeftMissing;
function getPrmissionDenieStateWhenRightMissing(entry1) {
    let permissionDeniedState = "access-ok";
    if (entry1.isPermissionDenied) {
        permissionDeniedState = "access-error-left";
    }
    return permissionDeniedState;
}
exports.getPrmissionDenieStateWhenRightMissing = getPrmissionDenieStateWhenRightMissing;
//# sourceMappingURL=permissionDeniedState.js.map