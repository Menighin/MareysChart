'use strict';

class Prototypes {
    static bind() {
        
        if (!Array.prototype.last) {
            Array.prototype.last = function(){
                return this[this.length - 1];
            };
        };


        if (!Date.prototype.addDays) {
            Date.prototype.addDays = function(days) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            }
        }

    }
}

export default Prototypes;