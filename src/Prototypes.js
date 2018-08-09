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

        if (!Date.prototype.addMinutes) {
            Date.prototype.addMinutes = function(minutes) {
                var date = new Date(this.valueOf());
                date.setMinutes(date.getMinutes() + minutes);
                return date;
            }
        }

        if (!Date.prototype.toMareysAxisString) {
            Date.prototype.toMareysAxisString = function() {
                return `${this.getHours().toString().padStart(2, '0')}:${this.getMinutes().toString().padStart(2, '0')}`;
            }
        }

    }
}

export default Prototypes;