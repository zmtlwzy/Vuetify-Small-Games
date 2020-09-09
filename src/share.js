export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function shuffle(arr) {
    let i = arr.length
    while (i) {
        let j = Math.floor(Math.random() * i--)
            ;[arr[j], arr[i]] = [arr[i], arr[j]]
    }
    return arr
}
