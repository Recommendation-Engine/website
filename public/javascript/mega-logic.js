$(function() {
    $('#movie-selection').change(function() {
        // get value from drop down
        var movieTuple = $.parseJSON($('#movie-selection').val());
        var selectedMovieId = movieTuple.mid;
        var selectedMovieImgUrl = movieTuple.imgUrl;

        $('#selected-movie-image').attr('src',selectedMovieImgUrl);

        // make request to API for recommendations
        $.get('/movies/' + selectedMovieId, function(data){
            // clear products
            $('.products').empty();
            $('.products').append("<table class='product-table'/>");

            // foreach model element
            $.each(data, function(index, element){
                // add row to table
                $("<tr><td>" +
                    "<img src=" + element.imgUrl + " />" +
                    "<table>" +
                        "<tr><td>" + element.title + "</td></tr>" +
                        "<tr><td>" + element.rating + "</td></tr>" +
                        "<tr><td>" + element.genre + "</td></tr>" +
                    "</table>" +
                "</td></tr>").appendTo('.product-table')
            });

        });
    });
});