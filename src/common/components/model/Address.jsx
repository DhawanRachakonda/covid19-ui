export default class Address {
    constructor(line1, line2, line3, city, state, country, zipcode) {
        this.line1 = line1 == undefined ? '' : line1;
        this.line2 = line2 == undefined ? '' : line2;
        this.line3 = line3 == undefined ? '' : line3;
        this.city = city == undefined ? '' : city;
        this.state = state == undefined ? '' : state;
        this.country = country == undefined ? '' : country;
        this.zipcode = zipcode == undefined ? '' : zipcode;
    }
}