export function vectorSum(vec1, vec2) {
    return [vec1[0] + vec2[0], vec1[1] + vec2[1]]
}

export function vectorSub(vec1, vec2) {
    return [vec1[0] - vec2[0], vec1[1] - vec2[1]]
}

export function vectorEquals(vec1, vec2) {
    return vec1[0] === vec2[0] && vec1[1] === vec2[1]
}

export function vectorInvert(vec) {
    return [-vec[0], -vec[1]]
}