$(function() {
    function word_cloud(data) {
        var fill = d3.scale.category20();
        d3.layout.cloud().size([300, 300])
            .words(data.map(function(d) {
                return {text: d.name, size: d.weight*2+10};
            }))
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();

        function draw(words) {
            d3.select(".user-details").append("svg")
                .attr("width", 300)
                .attr("height", 300)
                .append("g")
                .attr("transform", "translate(150,150)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", "Impact")
                .style("fill", function(d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
          }
    }
    function render_movie_details(element, classname) {
        var imageUrl = (element.imgUrl == "N/A") ? "assets/movie-not-found.png" : element.imgUrl;
        $("<div class='card small-card'>" +
            "<div class='image'>" +
            "<img src=" + imageUrl + "/>" +
          "</div>" +
          "<div class='content'>" + 
            "<div class='header'>" + element.title + "</div>" +
            "<div class='description' align=left>" +
                "<div><B>Ratings: </B>" + element.rating + "</div>"
                + "<div><B>Director: </B>" + element.director + "</div>"
                + "<div><B>Actors: </B>" + element.actors + "</div>" +
                "<div><B>Genre: </B>" + element.genre + "</div>" +
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
        $('.search-creteria').empty();
        $('.card-list').empty();
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
                                          "<div> <B>Rating: </B>" + data.selected_movie.rating + "</div>" 
                                        + "<div> <B>Director: </B>" + data.selected_movie.director + "</div>"
                                        + "<div> <B>Actors: </B>" + data.selected_movie.actors + "</div>"
                                        + "<div> <B>Genre: </B>" + data.selected_movie.genre + "</div>" +
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
            $('.user-details').append("<div> <B>Age: </B>" + data.selected_user.age + "</div>" 
                                    + "<div> <B>Gender: </B>" + data.selected_user.gender + "</div>" 
                                    + "<div> <B>Zip Code: </B>" + data.selected_user.zipcode + "</div>" 
                                    + "<div> <B>Occupation: </B>" + data.selected_user.occupation + "</div>"
                                    + "<div> <B>Interests: </B></div>");
            word_cloud(data.selected_user.genre)

            render_movies(data.top_5_movies)
        });
    });

    $('#movie').click(function() {
        $('#user').removeClass('active');
        $('#movie').addClass('active');
        $('#user-selection').hide();
        $('#movie-selection').show();
        $('.search-creteria').empty();
        $('.card-list').empty();
    });

    $('#user').click(function() {
        active_user_search();
    });

    $( document ).ready(function() {
        active_user_search();
    });
});