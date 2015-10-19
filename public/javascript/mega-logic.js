$(function() {
    function render_movie_details(element, classname) {
        var imageUrl = (element.imgUrl == "N/A") ? "assets/movie-not-found.png" : element.imgUrl;
        $("<div class='card small-card'>" +
            "<div class='image'>" +
            "<img src=" + imageUrl + "/>" +
          "</div>" +
          "<div class='content'>" + 
            "<div class='header'>" + element.title + "</div>" +
            "<div class='description'>" +
                "<div>" + element.rating + "</div>" +
                "<div>" + element.genre + "</div>" +
          "</div>" + "</div>").appendTo(classname);
    }

    function render_movies(movies) {
        $('.card-list').empty();

        $.each(movies, function (index, element) {
            render_movie_details(element, '.card-list');
        });
    }

    function active_user_search(){
        $('#movie').removeClass('active');
        $('#user').addClass('active');
        $('#user-selection').show();
        $('#movie-selection').hide();
    }

    $('#movie-selection').change(function() {
        var selectedMovieId = $('#movie-selection').val();

        $.get('/movies/' + selectedMovieId, function(data){
            var imageUrl = (data.selected_movie.imgUrl == "N/A") ? "assets/movie-not-found.png" : data.selected_movie.imgUrl;
            $('.search-creteria').empty();
            $('.search-creteria').append("<div class='ui card movie-detail-card'></div>");
            $('.movie-detail-card').append("<div class='image'>" +
                                                "<img src=" + imageUrl + "/>" +
                                            "</div>" + 
                                            "<div class='content movie-details'>" + 
                                                "<div class='header'>" + data.selected_movie.title + " </div>" + 
                                            "</div>");
            $('.movie-details').append("<div class='discription'>" + 
                                          "<div> Rating: " + data.selected_movie.rating + "</div>" 
                                        + "<div> Genre: " + data.selected_movie.genre + "</div>" +
                                        "</div>" );

            render_movies(data.top_5_movies);
        });
    });

    $('#user-selection').change(function() {
        var selectedUserId = $('#user-selection').val();
        $.get('/users/' + selectedUserId, function(data){
            var imageUrl = '';
            if(data.selected_user.gender == 'F')
                imageUrl = "assets/Female.png";
            else
                imageUrl = "assets/Male.png";
            $('.search-creteria').empty();
            $('.search-creteria').append("<div class='ui card user-detail-card'></div>");
            $('.user-detail-card').append("<div class='image'>" +
                                                "<img src=" + imageUrl + "/>" +
                                            "</div>" +
                                            "<div class='content user-details'>" + 
                                            "<div class='header'> Selected User </div>" + 
                                          "</div>");
            $('.user-details').append("<div> Age: " + data.selected_user.age + "</div>" 
                                    + "<div> Gender: " + data.selected_user.gender + "</div>" 
                                    + "<div> Zip Code: " + data.selected_user.zipcode + "</div>" 
                                    + "<div> Occupation: " + data.selected_user.occupation + "</div>");

            render_movies(data.top_5_movies)
        });
    });

    $('#movie').click(function() {
        $('#user').removeClass('active');
        $('#movie').addClass('active');
        $('#user-selection').hide();
        $('#movie-selection').show();
    });

    $('#user').click(function() {
        active_user_search();
    });

    $( document ).ready(function() {
        active_user_search();
    });
});