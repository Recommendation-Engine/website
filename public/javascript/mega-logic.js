$(function() {
    var templates = {}

    function word_cloud(data) {
        var fill = d3.scale.category20();
        var draw = function(words) {
            d3.select(".interest").append("svg")
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

        d3.layout.cloud().size([300, 300])
            .words(data.map(function(d) {
                return {text: d.name, size: d.weight*2+10};
            }))
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();
    }

    $('#movie-selection').change(function() {
        var selectedMovieId = $('input[name=movie]').val();

        $.get('/movies/' + selectedMovieId, function(data){
            renderMovie(data.selected_movie);
            renderMovies(data.top_5_movies);
        });
    });

    $('#user-selection').change(function() {
        var selectedUserId = $('input[name=user]').val();
        $.get('/users/' + selectedUserId, function(data){
            renderUser(data.selected_user);
            renderMovies(data.top_5_movies)
        });
    });

    function renderUser(user) {
        if (templates['user']) {        
            $('.search-creteria').html(templates['user'](user));
            word_cloud(user.genre)
        } else {
            $.get("/javascript/templates/user.handlebar", function(template_source) {
                Handlebars.registerHelper('imgSrc', function(gender) {
                    if (gender == 'F') {
                        return "/assets/Female.png";
                    } else {
                        return "/assets/Male.png"
                    }
                });

                templates['user'] = Handlebars.compile(template_source);
                $('.search-creteria').html(templates['user'](user));
                word_cloud(user.genre)
            });            
        }
    }

    function defineMovieHelpers() {
        Handlebars.registerHelper('movieUrl', function(movieUrl) {
            if (movieUrl == 'N/A') {
                return "/assets/movie-not-found.png";
            } else {
                return movieUrl;
            }
        });
    }

    function renderMovie(movie) {   
        var renderUsing = function(template) {
            $('.search-creteria').html("<div class='ui card movie-detail-card'>" + 
                                            template(movie) +
                                            "</div>");
        }        
        if (templates['movie']) {        
            renderUsing(templates['movie']);
        } else {
            $.get("/javascript/templates/movie.handlebar", function(source) {
                defineMovieHelpers();
                templates['movie'] = Handlebars.compile(source);
                renderUsing(templates['movie']);
            });            
        }
    }

    function renderMovies(movies) {
        if (templates['movies']) {
            $(".movie-list").html(templates['movies'](movies));
        } else {
            $.get("/javascript/templates/movie-list.handlebar", function(template_source) {
                $.get("/javascript/templates/movie.handlebar", function(partial_source) {
                    defineMovieHelpers();
                    Handlebars.registerPartial('movieTemplate', partial_source);
                    templates['movies'] = Handlebars.compile(template_source);
                    $(".movie-list").html(templates['movies'](movies));
                });
            });
        }
        
    }

    function active_user_search(){
        $('#movie').removeClass('active');
        $('#user').addClass('active');
        $('#user-selection').show();
        $('#movie-selection').hide();
        $('#user-selection').val("select");
        $('.search-creteria').empty();
        $('.card-list').empty();
    }

    $('#user').on("click", function() {
        active_user_search();
    });


    $('#movie').on("click", function() {
        $('#user').removeClass('active');
        $('#movie').addClass('active');
        $('#user-selection').hide();
        $('#movie-selection').show();
        $('#movie-selection').val("select");
        $('.search-creteria').empty();
        $('.card-list').empty();
    });

    $('#user-selection').dropdown();
    $('#movie-selection').dropdown();

    $(document).ready(function() {
        active_user_search();
    });
});