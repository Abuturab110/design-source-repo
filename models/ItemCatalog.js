class ItemCatalog {
    _transactionType = null;
    _batchId = null;
    _catalogName = null;
    _catalogCode = null;
    newCatalogCode = null;
    description = null;
    defaultCategoryCode = null;
    controlLevel = null;
    _startDate = null;
    endDate = null;
    catalogContentCode = null;
	multItemCatAssignFlag = null;
    publicCatalog = null;
    attributeCategory = null;
    attribute1 = null;
    attribute2 = null;
    attribute3 = null;
    attribute4 = null;
    attribute5 = null;
    attribute6 = null;
    attribute7 = null;
    attribute8 = null;
    attribute9 = null;
    attribute10 = null;
    attribute11 = null;
    attribute12 = null;
    attribute13 = null;
    attribute14 = null;
    attribute15 = null;
    attributeNumber1 = null;
    attributeNumber2 = null;
    attributeNumber3 = null;
    attributeNumber4 = null;
    attributeNumber5 = null;
    attributeNumber6 = null;
    attributeNumber7 = null;
    attributeNumber8 = null;
    attributeNumber9 = null;
    attributeNumber10 = null;
    attributeDate1 = null;
    attributeDate2 = null;
    attributeDate3 = null;
    attributeDate4 = null;
    attributeDate5 = null;
    attributeTimestamp1 = null;
    attributeTimestamp2 = null;
    attributeTimestamp3 = null;
    attributeTimestamp4 = null;
    attributeTimestamp5 = null;

    get transactionType() {
        return this._transactionType;
    }
    set transactionType(value) {
        this._transactionType = value;
    }
	
    get batchId() {
        return this._batchId;
    }
    set batchId(value) {
        this._batchId = value;
    }
	
    get catalogName() {
        return this._catalogName;
    }
    set catalogName(value) {
        this._catalogName = value;
    }
	
    get catalogCode() {
        return this._catalogCode;
    }
    set catalogCode(value) {
        this._catalogCode = value;
    }
	
    get startDate() {
        return this._startDate;
    }
    set startDate(value) {
        this._startDate = value;
    }

};

class ItemCatalogCategory {
    _transactionType = null;
    _batchId = null;
    parentCategoryCode = null;
    _catalogCode = null;
    _categoryName = null;
    _categoryCode = null;
    newCategoryCode = null;
    description = null;
    _startDateActive = null;
    endDateActive = null;
    categoryContentCode = null;
    sourceCatalogCode = null;
    copyOptions = null;
    attributeCategory = null;
    attribute1 = null;
    attribute2 = null;
    attribute3 = null;
    attribute4 = null;
    attribute5 = null;
    attribute6 = null;
    attribute7 = null;
    attribute8 = null;
    attribute9 = null;
    attribute10 = null;
    attribute11 = null;
    attribute12 = null;
    attribute13 = null;
    attribute14 = null;
    attribute15 = null;
    attributeNumber1 = null;
    attributeNumber2 = null;
    attributeNumber3 = null;
    attributeNumber4 = null;
    attributeNumber5 = null;
    attributeNumber6 = null;
    attributeNumber7 = null;
    attributeNumber8 = null;
    attributeNumber9 = null;
    attributeNumber10 = null;
    attributeDate1 = null;
    attributeDate2 = null;
    attributeDate3 = null;
    attributeDate4 = null;
    attributeDate5 = null;
    attributeTimestamp1 = null;
    attributeTimestamp2 = null;
    attributeTimestamp3 = null;
    attributeTimestamp4 = null;
    attributeTimestamp5 = null;
    supplierEnabledFlag = null;

    get transactionType() {
        return this._transactionType;
    }
    set transactionType(value) {
        this._transactionType = value;
    }
	
    get batchId() {
        return this._batchId;
    }
    set batchId(value) {
        this._batchId = value;
    }
	
    get catalogCode() {
        return this._catalogCode;
    }
    set catalogCode(value) {
        this._catalogCode = value;
    }
	
    get categoryName() {
        return this._categoryName;
    }
    set categoryName(value) {
        this._categoryName = value;
    }
	
    get categoryCode() {
        return this._categoryCode;
    }
    set categoryCode(value) {
        this._categoryCode = value;
    }
	
    get startDateActive() {
        return this._startDateActive;
    }
    set startDateActive(value) {
        this._startDateActive = value;
    }
};

module.exports = {
    ItemCatalog,
    ItemCatalogCategory
}