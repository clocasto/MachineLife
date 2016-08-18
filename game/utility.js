module.exports = {
    //returns STRINGIFIED version of a specific coordinate with prepended zeroes
    location: function(dim, x, y) {
        function stringify(num) {
            num = num.toString().split('');
            while (num.length < dim.toString().length) {
                num.unshift('0');
            }
            return num.join('');
        }
        return stringify(x) + stringify(y);
    },
    randNum: function(max) {
        return Math.floor(Math.random() * max);
    }
};
