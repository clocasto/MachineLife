module.exports = {
    /**
     * 1. Helper function which returns a '0'-padded coordinate string of the provided x and y number coordinates.
     * 2. Requires the grid width as the first argument.
     * @param  {Number}
     * @param  {Number}
     * @param  {Number}
     * @return {String}
     */
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

    /**
     * 1. Helper function which provides a random integer between 0 and the specified max - 1.
     * @param  {Number}
     * @return {Number}
     */
    randNum: function(max) {
        return Math.floor(Math.random() * max);
    }
};
