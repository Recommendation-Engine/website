$(function() {
    $('#movie-selection').change(function() {
        var selectedMovieId = $('#movie-selection').val();

        function render_movie_details(element, classname) {
            $("<tr><td>" +
                "<img src=" + element.imgUrl + " />" +
                "<table>" +
                "<tr><td>" + element.title + "</td></tr>" +
                "<tr><td>" + element.rating + "</td></tr>" +
                "<tr><td>" + element.genre + "</td></tr>" +
                "</table>" +
                "</td></tr>").appendTo(classname)
        }

        $.get('/movies/' + selectedMovieId, function(data){
            $('.selected-movie-details').empty();
            $('.selected-movie-details').append("<table class='selected-movie-table'/>");
            render_movie_details(data.selected_movie,'.selected-movie-table')

            $('.products').empty();
            $('.products').append("<table class='product-table'/>");

            $.each(data.top_5_movies, function(index, element){
                render_movie_details(element,'.product-table');
            });

        });
    });
});