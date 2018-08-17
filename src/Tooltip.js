'use strict';

class Tooltip {

    constructor(chart) {
        this.x = 0;
        this.y = 0;
        this.padding = 5;
        this.hidden = false;

        // Creates the frame
        this.frame = document.createElement('div');
        this.frame.style = `
            position: absolute;
        `;
        chart.container.parentNode.appendChild(this.frame);
    }

    /**
     * @param {number} x   Horizontal position of the popup window
     * @param {number} y   Vertical position of the popup window
     */
    setPosition(x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    }

    /**
   * Set the content for the popup window. This can be HTML code or text.
   * @param {string | Element} content
   */
    setText(content) {
        if (content instanceof Element) {
            this.frame.innerHTML = '';
            this.frame.appendChild(content);
        }
        else {
           this.frame.innerHTML = content; // string containing text or HTML
        }
    }

    /**
     * Show the popup window
     * @param {Object:getTooltipInfo} source - an instance of a class that has the method getTooltipInfo
     * @param {Object} pointer - Pointer object representing where the mouse is on both {client, canvas}
     */
    show(source, pointer) {

        if (!source.getTooltipInfo) {
            console.warn('The hovered object does not contain a getTooltipInfo method');
            return;
        }

        // Set the content of the popup
        this.setText(source.getTooltipInfo(pointer));
        this.setPosition(pointer.client.x, pointer.client.y);

        var height = this.frame.clientHeight;
        var width = this.frame.clientWidth;
        var maxHeight = this.frame.parentNode.clientHeight;
        var maxWidth = this.frame.parentNode.clientWidth;

        var left = 0, top = 0;

        var isLeft = false, isTop = true; // Where around the position it's located

        if (this.y - height < this.padding) {
            isTop = false;
        }

        if (this.x + width > maxWidth - this.padding) {
            isLeft = true;
        }

        if (isLeft) {
            left = this.x - width;
        } else {
            left = this.x;
        }

        if (isTop) {
            top = this.y - height;
        } else {
            top = this.y;
        }
        this.frame.style.left = left + "px";
        this.frame.style.top = top + "px";
        this.frame.style.visibility = "visible";
        this.hidden = false;
    }

    /**
   * Hide the popup window
   */
    hide() {
        this.hidden = true;
        this.frame.style.left = "0";
        this.frame.style.top = "0";
        this.frame.style.visibility = "hidden";
    }

}

export default Tooltip;