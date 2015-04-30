require 'sinatra'
require 'mongo'


def get_movie_titles
  client = Mongo::Client.new(['127.0.0.1:27017'], database: 'recommendation_engine')
  movies = client[:movies].find.distinct(:mid)
  movies.map{|movie| movie[1][4] }
end

get '/' do
  @movie_titles = get_movie_titles
  haml :main

end