function get_store(chain, subchain, store_id) {
    return fetch("chain/" + chain + "/subchain/" + subchain + "/store/" + store_id)
}

function get_chains() {
    return fetch("chains")
}

function get_subchains(chain) {
    return fetch("chain/" + chain + "/subchains")
}


