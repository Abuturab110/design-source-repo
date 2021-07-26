class ItemClass {
        _itemClassCode = null;
        _itemClassName = null;
        defaultItemClassFlag = 'N';
        disableDate = null;
        nirReqd = 'N';
        versionEnabledFlag = 'N';
        itemCreationAllowedFlag = 'Y';
        itemNumGenMethod = 'P';
        itemDescGenMethod = 'P';
        cfgItemNumGenMethod = 'INH';
        _description = null;
        requestId = null;
        jobDefinitionName = null;
        jobDefinitionPackage = null;
        attribute1 = null;
        attribute10 = null;
        attribute11 = null;
        attribute12 = null;
        attribute13 = null;
        attribute14 = null;
        attribute15 = null;
        attribute16 = null;
        attribute17 = null;
        attribute18 = null;
        attribute19 = null;
        attribute2 = null;
        attribute20 = null;
        attribute3 = null;
        attribute4 = null;
        attribute5 = null;
        attribute6 = null;
        attribute7 = null;
        attribute8 = null;
        attribute9 = null;
        attributeCategory = null;
        attributeDate1 = null;
        attributeDate2 = null;
        attributeDate3 = null;
        attributeDate4 = null;
        attributeDate5 = null;
        attributeNumber1 = null;
        attributeNumber10 = null;
        attributeNumber2 = null;
        attributeNumber3 = null;
        attributeNumber4 = null;
        attributeNumber5 = null;
        attributeNumber6 = null;
        attributeNumber7 = null;
        attributeNumber8 = null;
        attributeNUMBER9 = null;
        attributeTimestamp1 = null;
        attributeTimestamp2 = null;
        attributeTimestamp3 = null;
        attributeTimestamp4 = null;
        attributeTimestamp5 = null;
        enabledFlag = 'Y';
        userVersionEnabledFlag = null;
        userNirReqd = null;
        publicFlag = 'N';
        _parentItemClassCode = null;
        baseChangeMgmtTypeCode = 'NEW_ITEM_REQUEST';
        changeOrderTypeInternalName = null;

        get itemClassCode() {
            return this._itemClassCode;
        }
        set itemClassCode(value) {
            this._itemClassCode = value;
        }
            get itemClassName() {
            return this._itemClassName;
        }
        set itemClassName(value) {
            this._itemClassName = value;
        }
        
        get description() {
            return this._description;
        }
        set description(value) {
            this._description = value;
        }
        
        get parentItemClassCode() {
            return this._parentItemClassCode;
        }
        set parentItemClassCode(value) {
            this._parentItemClassCode = value;
        }
};

module.exports = {
    ItemClass
}