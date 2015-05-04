require 'sinatra'
require 'mongo'


def get_movies
  client = Mongo::Client.new(['127.0.0.1:27017'], database: 'recommendation_engine')
  movies = client[:movies].find
  movies.map{|movie| {:mid => movie["mid"], :title => movie["meta"]["Title"]}}
end

get '/' do
  @movies = get_movies
  haml :main

end