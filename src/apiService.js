export const getShowsByKey = key => {
    fetch(`http://api.tvmaze.com/search/shows?q=${key}`)
    .then(resp => resp.json())
}

export const getShowById = id => {
    fetch(`http://api.tvmaze.com/shows/${id}?embed=cast`)
    .then(resp => resp.json())
}