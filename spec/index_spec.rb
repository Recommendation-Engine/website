require_relative 'spec_helper'

describe 'index page' do

  describe '/' do

    it 'returns OK' do
      get '/'
      expect(last_response).to be_ok()
    end

    it 'displays ThoughtWorks logo' do
      get '/'
      expect(last_response.body).to include("src='assets/ThoughtWorks.png'")
    end

  end

  describe '/movies/:mid' do
    it 'returns OK' do
      get '/movies/1'
      expect(last_response).to be_ok()
    end
  end

  describe '#get_recommended_movies' do
    it 'should return top 5 recommended movies' do
      movies = get_recommended_movies(1)
      expect(movies.count).to be(5)
    end

  end

  describe '#get_movies' do

    it 'should return all movies' do
      movies = get_movies
      expect(movies.count).to be(3883)
      expect(movies.first()).to eq({mid: 1,
                                 title: 'Toy Story',
                                 imgUrl: 'http://ia.media-imdb.com/images/M/MV5BMTgwMjI4MzU5N15BMl5BanBnXkFtZTcwMTMyNTk3OA@@._V1_SX300.jpg'})
    end

  end

end
