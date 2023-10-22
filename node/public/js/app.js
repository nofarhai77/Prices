function get_store(chain, subchain, store_id) {
    return fetch("chain/" + chain + "/subchain/" + subchain + "/store/" + store_id)
}

function get_chains() {
    return fetch("chains")
}

function get_subchains(chain) {
    return fetch("chain/" + chain + "/subchains")
}

/* find the price of a specific product */
function get_item(itemName) {
    return fetch("item/" + itemName)
}

/* for autocomplete function
   return cities with name that start with given input */
function get_cities_by_prefix(prefix) {
    return fetch("cities?startWith=" + prefix)
}

