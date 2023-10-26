/* load chains */
function get_chains() {
    return fetch("chains")
}

/* load subchains according to given chain */
function get_subchains(chain) {
    return fetch("chain/" + chain + "/subchains")
}

/* load specific store according to given chain, subchain and store_id */
function get_store(chain, subchain, store_id) {
    return fetch("chain/" + chain + "/subchain/" + subchain + "/store/" + store_id)
}

/* for autocomplete function - return cities with given prefix */
function get_cities_by_prefix(prefix) {
    return fetch("cities?startWith=" + prefix)
}

/* show all stores in a specific city */
function get_stores_in_city(city) {
    return fetch("stores?city=" + city)
}

/* for autocomplete function - return items with given prefix */
function get_item_by_prefix(prefix) {
    return fetch("item?itemStartWith=" + prefix)
}

/* find the price of a specific product */
function get_item_prices(itemId) {
    return fetch("item/" + itemId)
}