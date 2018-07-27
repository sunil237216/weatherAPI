var mongoose = require('mongoose');
var Weather =  mongoose.model('Weather',{

    DeviceID:{
        type:String,
        required:true,
        minlength:1,
        trim:true

    },
    Humidity:{
        type:String,
        default:null

    },
    AirPressure:{
        type:String,
        default:null
    },
    Co2:{
        type:String,
        default:null
    }

});


module.exports = {Weather};