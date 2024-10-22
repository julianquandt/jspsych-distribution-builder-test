function preloadStimArray(file){
    
    $.ajax({
        url: file,
        async: false,
        success: function (csvd) {
            tmp_array = $.csv.toArrays(csvd);
        },
        dataType: "text",
        complete: function () {    
        }
        });
        return(tmp_array)
}
    
module.exports = { 
    preloadStimArray
}; 