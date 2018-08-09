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

    static diffPoints(p1, p2) {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y
        };
    }

}

export { Utils as default };