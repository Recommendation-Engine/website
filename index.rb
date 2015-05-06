require 'sinatra'
require 'mongo'
require 'json'

@@client = Mongo::Client.new(['127.0.0.1:27017'], database: 'recommendation_engine')

def get_movies
  movies = @@client[:movies].find
  movies.map{|movie| {mid: movie['mid'],
                      title: movie['meta']['Title']}}
end

def get_movie_by_id(mid)
  movie = @@client[:movies].find({mid: mid}).first()
  {
      mid: movie['mid'],
      title: movie['meta']['Title'],
      rating: movie['meta']['imdbRating'],
      genre: movie['meta']['Genre'],
      imgUrl: movie['meta']['Poster']
  }
end

def get_recommended_movies(selected_mid)
  selected_movie = get_movie_by_id(selected_mid)

  top_5_mid = @@client[:m2m].find({mid: selected_mid}).first()['movies'].first(5)
  top_5_movies = top_5_mid.map{|mid| get_movie_by_id(mid)}

  {selected_movie: selected_movie, top_5_movies: top_5_movies}
end


get '/' do
  @movies = get_movies
  haml :main
end

get '/movies/:mid' do |mid|
  content_type :json
  get_recommended_movies(mid.to_i).to_json
end
