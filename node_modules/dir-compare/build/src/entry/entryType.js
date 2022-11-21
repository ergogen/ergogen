module.exports = {
    /**
     * One of 'missing','file','directory','broken-link'
     */
    getType(entry) {
        if (!entry) {
            return 'missing';
        }
        if (entry.isBrokenLink) {
            return 'broken-link';
        }
        if (entry.isDirectory) {
            return 'directory';
        }
        return 'file';
    }
};
//# sourceMappingURL=entryType.js.map