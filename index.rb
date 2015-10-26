require 'sinatra'
require 'mongo'
require 'haml'
require 'json'

mongo_url = ENV['MONGOLAB_URI'] || 'mongodb://127.0.0.1:27017/recommendation_engine'
@@client = Mongo::Client.new(mongo_url)

def get_movies
  movies = @@client[:movies].find
  movies.map{|movie| {mid: movie['mid'],
                      title: movie['meta']['Title']}}
end

def get_users
  users = @@client[:users].find
  users.map{|user| {uid: user[:uid]}}
end

def get_user_by_id(uid)
  user = @@client[:users].find({uid: uid}).first
  {
      uid: user[:uid],
      age: user[:age],
      gender: user[:gender],
      zipcode: user[:zipcode],
      occupation: user[:occupation],
      genre: user[:genre]
  }
end

def get_movie_by_id(mid)
  movie = @@client[:movies].find({mid: mid}).first
  {
      mid: movie['mid'],
      title: movie['meta']['Title'],
      rating: movie['meta']['imdbRating'],
      genre: movie['meta']['Genre'],
      imgUrl: movie['meta']['Poster'],
      director: movie['meta']['Director'],
      actors: movie['meta']['Actors']
  }
end

def get_recommended_movies(selected_mid)
  selected_movie = get_movie_by_id(selected_mid)

  movies = @@client[:m2m].find({mid: selected_mid}).first['movies'].first(8).
            map{|mid| get_movie_by_id(mid)}

  {selected_movie: selected_movie, movies: movies}
end

def get_movies_for_user(selected_uid)
  movies = @@client[:m2u].find({uid: selected_uid}).first['movies'].first(8).
              map{|mid| get_movie_by_id(mid)}

  {selected_user: get_user_by_id(selected_uid), movies: movies}
end

get '/' do
  @movies = get_movies.take(10)
  @users = get_users.take(10)
  haml :main
end

get '/movies/:mid' do |mid|
  content_type :json
  get_recommended_movies(mid.to_i).to_json
end

get '/users/:uid' do |uid|
  content_type :json
  get_movies_for_user(uid.to_i).to_json
end