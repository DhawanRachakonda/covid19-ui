import Address from './Address';

export default class ReportCase {
    constructor(name, email, aadharNo, mobileNo, dateOfSusInf, suspectedLocationId, address) {
        this.name = name == undefined ? '' : name;
        this.email = email == undefined ? '' : email;
        this.aadharNo = aadharNo == undefined ? '' : aadharNo;
        this.mobileNo = mobileNo == undefined ? '' : mobileNo;
        this.dateOfSusInf = dateOfSusInf == undefined ? '' : dateOfSusInf;
        this.suspectedLocationId = suspectedLocationId == undefined ? '' : suspectedLocationId;
        this.address = address == undefined ? new Address() : address;
    }
}