window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("fetch-data").addEventListener("click", () => {
        // document.getElementById("fetch-data").className = 'loading';
        document.getElementById("home").style.display = "none";
        document.body.classList.add('flexremove');

        var chandanElement = document.querySelector('#section2');
        chandanElement.style.display = 'block';
        help();
        
    });
});


function help(){
    const secondsToTimeZoneString = (offsetSeconds) => {
        const hours = Math.floor(offsetSeconds / 3600); 
        const minutes = Math.floor((offsetSeconds % 3600) / 60); 
        const sign = offsetSeconds < 0 ? '-' : '+';
        const formattedOffset = `${sign}${Math.abs(hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return `UTC${formattedOffset}`;
    }

    const degreesToWindDirection = (degrees) => {
        const directions = ["North", "North-Northeast", "Northeast", "East-Northeast", "East", "East-Southeast", "Southeast", "South-Southeast", "South", "South-Southwest", "Southwest", "West-Southwest", "West", "West-Northwest", "Northwest", "North-Northwest"];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

    /**
     * Get current location of user.
     * We'll use `GeoLocation` API.
     */
    if ("geolocation" in navigator) {
        const useUserLocation = () => {
            console.log("Fetching data")
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                /**
                 * Now we have location of user.
                 * Let's fetch weather data and also show location in DOM.
                 */
                document.getElementById("latitude").textContent = `Lat: ${latitude}`;
                document.getElementById("longitude").textContent = `Lat: ${longitude}`;
            
                /**
                 * We are using here `iframe` for showing google map
                 * AIzaSyALJd4lJaW_3pOn-XeE5Bg0Be_FO5u9X0M
                 */
                const iframe = document.createElement("iframe");
                iframe.frameBorder = "0";
                iframe.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
                document.querySelector(".map").appendChild(iframe);

                /**
                 * Fetch weather information                                          
                */

                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=cb38692bd004c473f1b609a257eb5b37`)
                        .then(e => e.json())
                .then(data => {
                    document.body.classList.add('main');
                    document.body.classList.remove('home');

                    document.querySelector("#location span").textContent = data.name;
                    document.querySelector("#speed span").textContent = (data.wind.speed*3.6) + "kmph"; 
                    document.querySelector("#humidity span").textContent = data.main.humidity;
                    document.querySelector("#timezone span").textContent = secondsToTimeZoneString(data.timezone);
                    document.querySelector("#pressure span").textContent = data.main.pressure;
                    document.querySelector("#direction span").textContent = degreesToWindDirection(data.wind.deg)
                    document.querySelector("#uv-index span");
                    document.querySelector("#feels span").textContent = data.main.feels_like;
                })        
                .catch(e => {
                    errorElement.textContent = e.message;
                });
            });
        }

        // navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
            /**
             * If user has denied permission to view location
             */
            // if (permissionStatus.state === 'denied') {
            //     errorElement.textContent = `Location permission denied by the user.`
            // } 
            
            /**
             * Prompt has shown
             */
            // else {
                useUserLocation();
        //     }
        // });
    } else {
        errorElement.textContent = "Geolocation is not supported by your browser.";
    }
}