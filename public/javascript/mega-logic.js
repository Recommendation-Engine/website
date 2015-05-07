$(function() {
    function render_movie_details(element, classname) {
        $("<tr><td>" +
            "<img src=" + (!element.imgUrl) ? 'assets/movie-not-found.jpg' : element.imgUrl + " />" +
            "<table>" +
            "<tr><td>" + element.title + "</td></tr>" +
            "<tr><td>" + element.rating + "</td></tr>" +
            "<tr><td>" + element.genre + "</td></tr>" +
            "</table>" +
            "</td></tr>").appendTo(classname)
    }

    function render_movies(movies) {
        $('.products').empty();
        $('.products').append("<table class='product-table'/>");

        $.each(movies, function (index, element) {
            render_movie_details(element, '.product-table');
        });
    }

    $('#movie-selection').change(function() {
        var selectedMovieId = $('#movie-selection').val();

        $.get('/movies/' + selectedMovieId, function(data){
            $('.selected-movie-details').empty();
            $('.selected-movie-details').append("<table class='selected-movie-table'/>");
            render_movie_details(data.selected_movie,'.selected-movie-table');

            render_movies(data.top_5_movies);
        });
    });

    $('#user-selection').change(function() {
        var selectedUserId = $('#user-selection').val();

        function render_user_details(element, classname) {
            $("<tr><td> Age: " + element.age + "</td></tr>" +
                "<tr><td> Gender: " + element.gender + "</td></tr>" +
                "<tr><td> Zip Code: " + element.zipcode + "</td></tr>" +
                "<tr><td> Occupation: " + element.occupation + "</td></tr>"
            ).appendTo(classname)
        }

        $.get('/users/' + selectedUserId, function(data){
            $('.user-details').empty();
            $('.user-details').append("<table class='selected-user-table'/>");
            render_user_details(data.selected_user,'.selected-user-table');

            render_movies(data.top_5_movies)
        });
    });
});