'use strict';

class Utils {

    /**
     * Retrieve the absolute left value of a DOM element
     * @param {Element} elem           A dom element, for example a div
     * @return {number} left | right   The absolute left position of this element
     *                  top            in the browser page.
     */
    static getAbsoluteLeft(elem) {
        return elem.getBoundingClientRect().left;
    }

    static getAbsoluteRight(elem) {
        return elem.getBoundingClientRect().right;
    }

    static getAbsoluteTop(elem) {
        return elem.getBoundingClientRect().top;
    };

    /**
     * Returns the difference on each coordinate between the given points
     * @param {Object} p1 - Point {x, y} 
     * @param {Object} p2 - Point {x, y} 
     */
    static diffPoints(p1, p2) {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y
        };
    }

    /**
     * 
     * @param {Object} p1 - Point {x, y} 
     * @param {Object} p2 - Point {x, y} 
     */
    static getDistanceBetweenPoints(p1, p2) {
        let a = p1.x - p2.x;
        let b = p1.y - p2.y;
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }

}

export { Utils as default };