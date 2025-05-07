jQuery(document).ready(function($) {
    // Initialize Google Places Autocomplete
    function initAutocomplete() {
        var input = document.getElementById('address');  // The input field for the address
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.setFields(['address_component', 'geometry']);  // Request the geometry and address components

        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;  // Exit if no geometry is available for the selected place
            }

            // Get latitude and longitude from the place
            var latitude = place.geometry.location.lat();
            var longitude = place.geometry.location.lng();

            // Store latitude and longitude in hidden form fields
            $('#latitude').val(latitude);
            $('#longitude').val(longitude);
        });
    }

    google.maps.event.addDomListener(window, 'load', initAutocomplete);

    // Handle the form submission and send AJAX request for the price calculation
    $('form').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission

        var latitude = $('#latitude').val();  // Get the latitude from the hidden input
        var longitude = $('#longitude').val();  // Get the longitude from the hidden input

        // Check if latitude and longitude are available
        if (!latitude || !longitude) {
            $('#price-display').text('Please select a valid address.');
            return;
        }

        // Make the AJAX request to the WordPress backend
        $.ajax({
            url: ajaxurl,  // WordPress AJAX handler (automatically available in admin and front-end)
            type: 'POST',
            data: {
                action: 'get_instant_quote',  // The AJAX action hook defined in your PHP
                latitude: latitude,
                longitude: longitude
            },
            success: function(response) {
                var data = JSON.parse(response);  // Parse the response from the server

                if (data.price) {
                    $('#price-display').text('Your Instant Quote: $' + data.price);  // Display the calculated price
                } else {
                    $('#price-display').text('Error: ' + data.error);  // Display error message
                }
            },
            error: function(xhr, status, error) {
                // Handle AJAX errors
                $('#price-display').text('There was an error processing your request.');
            }
        });
    });
});
