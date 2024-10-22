function createStimArray(file, block_name){
    
    $.ajax({
        url: file,
        async: false,
        success: function (csvd) {
            tmp_array = $.csv.toArrays(csvd);
        },
        dataType: "text",
        complete: function () {
            // console.log("creating tmp_array")
            // console.log(tmp_array)
    
        }
        });
    
    js_stim_array = []
    for(i = 0; i < tmp_array.length; i++){
        js_stim_array[i] = {stimulus: tmp_array[i][0], data: {stim_name: tmp_array[i][0], block_name: block_name}};
    }
    return js_stim_array;
}

module.exports = { 
    createStimArray
}; 
