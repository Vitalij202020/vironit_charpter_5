class Store {
    constructor(cities) {
        this.cities = cities
    }

    getAllCities() {
        return this.cities
    }

    getCity(city) {
        return this.cities.filter((obj) => obj.name === city)[0]
    }
}