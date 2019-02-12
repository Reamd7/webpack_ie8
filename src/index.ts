let a = [
    1,2
]

for (const iterator of a) {
    console.log(iterator)
}

Object.defineProperty(a,"asad",{
    value:111
});
console.log(new Set([1,2]))