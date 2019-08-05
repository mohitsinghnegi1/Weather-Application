swal("Hello world! Welcome to Our Weather Forcasting WebApp");
//--------some string values-------------------------------------

//URI contains API URL and API Key to access "weather API"
var api_key="3407161a9be638acb48e26fcb713ab5a";
var api_url="https://api.openweathermap.org/data/2.5/weather"
var URI;
var error_msg="Please check The value or format or Internet connection and try again .";
var data_success_msg="Weather data retrived successfully.";
var weather_image_path="http://openweathermap.org/img/wn/";

var suggestions=["city name,country code or city name . eg 1. London,uk   2.London",
                "city name . eg London",
                "country Id . eg 2172797",
                "latitude,longitude . eg 35,139",    //these text will be use as a text in popover
                "zipCode,country . eg 94040,us"
]

//-----------------------main_content----------------------------
//firstly when user choose serching option then this will change the suggestion text in popover
$('#countrySelect').on('change', function() {
    var search_option=$("#countrySelect").val();
    var example =getExample(search_option);
    $("#location").attr("data-content",example);

});
$("#result").hide();
$("#search").click(function(){
    console.log("Search is clicked");
    var location=$("#location").val();
    var search_option=$("#countrySelect").val();
    console.log("location :"+location);

    if(location=="")
    {
        error_mg="Please enter the value!";
        swal("Error!",error_mg, "error");
    }
    else{
        URI =getURI(search_option,location);
        console.log(URI);
        findWeather(URI);
    }
    
  });

//---------------------main_content_end------------------------------



//---------------------util_functions--------------------------------
function getExample(search_option){
    switch(search_option){
        case "location"   : example=suggestions[0];
                           break;
        case "city"       :example=suggestions[1];
                           break;
        case "cityId"     :example=suggestions[2];
                           break;
        case "coordinates": example=suggestions[3];
                           break;
        case "zipCode"    :example=suggestions[4];
                           break;

    }
    return example;

}
function getURI(search_option,location){
    if(search_option=="city" || search_option=="location"){
        URI=api_url+"?appid="+api_key+"&q="+location;
    }
    else if(search_option=="cityId"){
        URI=api_url+"?appid="+api_key+"&id="+location;
    }
    else if(search_option=="coordinates"){
        
        var latlon= location.split(",");

        URI=api_url+"?appid="+api_key+"&lat="+latlon[0]+"&lon="+latlon[1];
    }
    else if(search_option=="zipCode"){
        
        URI=api_url+"?appid="+api_key+"&zip="+location;
    }
    return URI;
}

function findWeather(URI){
    $.ajax({

        url:URI ,
        success: function(weatherData){
            
            setWeatherImage(weatherData);
            showWeatherInfo(weatherData); 
            console.log(data_success_msg);
        },
        error:function(error){
            
            showError(error.responseJSON.message);
    
        } 
    });
}

function setWeatherImage(weatherData){
    var weather_image=weatherData.weather[0].icon+"@2x"+".png"; 
    var weather_image_url=weather_image_path+weather_image
    $("#weather_image").attr("src", weather_image_url);

}

function showWeatherInfo(weatherData){
    console.log("Showing weather Info");
    var successmsg="Showing weather Info for "+$("#location").val();
    swal("Showing Result!",successmsg, "success");
    $("#weather").val(weatherData.weather[0].main);
    $("#description").val(weatherData.weather[0].description);
    $("#temperature").val(weatherData.main.temp);
    $("#pressure").val(weatherData.main.pressure);
    $("#humidity").val(weatherData.main.humidity);
    $("#temp_min").val(weatherData.main.temp_min);
    $("#temp_max").val(weatherData.main.temp_max);
    $("#wind_speed").val(weatherData.wind.speed);
    $("#wind_degree").val(weatherData.wind.deg);
    $("#country_code").val(weatherData.sys.country);
    $("#result").fadeIn(1500);
    setTimeout(function(){
        $("#result").fadeOut(1500);
    }, 4000);
    $("#location").val("");
    }

  
function showError(error){
    if(error=="city not found"){
        swal("Error!",error, "warning");
    }
    else{
        swal("Error!",error_msg, "info");
    }
    console.log(error);
    $("#location").val("");
    
}

//---------------------util_functions_end-------------------------------

//------popover---------------------------------------------------------

$(document).ready(function(){
  $('[data-toggle="popover"]').popover(); 
});

//--------------------------------pop-over-end------------------------