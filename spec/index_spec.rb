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

  describe '/users/:uid' do
    it 'returns OK' do
      get '/users/1'
      expect(last_response).to be_ok()
    end
  end

  describe '#get_recommended_movies' do
    it 'the first return element should be selected movie' do
      movies = get_recommended_movies(1)
      expect(movies[:selected_movie][:mid]).to be(1)
    end

    it 'should return top 8 recommended movies' do
      movies = get_recommended_movies(1)
      expect(movies[:movies].count).to be(8)
    end

  end

  describe '#get_movie_by_id' do
    it 'should return movie with correct fields' do
      movie = get_movie_by_id(1)
      expect(movie).to include(
          mid: 1,
          title: 'Toy Story',
          imgUrl: 'http://ia.media-imdb.com/images/M/MV5BMTgwMjI4MzU5N15BMl5BanBnXkFtZTcwMTMyNTk3OA@@._V1_SX300.jpg',
          rating: '8.3',
          actors: "Tom Hanks, Tim Allen, Don Rickles, Jim Varney",
          director: "John Lasseter",
          genre: 'Animation, Adventure, Comedy'
        )
    end

  end

  describe '#get_movies' do
    it 'should return all movies' do
      movies = get_movies
      expect(movies.count).to be(3883)
      expect(movies.first()).to eq({mid: 1,
                                 title: 'Toy Story'})
    end
  end

  describe '#get_users' do
    it 'should return all users' do
      users = get_users
      expect(users.count).to be(6040)
      expect(users.first()).to eq({uid:1})
    end
  end

  describe '#get_user_by_id' do
    it 'should return user by user id' do
      user = get_user_by_id(1)
      expect(user[:uid]).to be(1)
      expect(user[:gender]).to eq('F')
      expect(user[:zipcode]).to eq('48067')
      expect(user[:age]).to eq([0,18])
    end
  end
end
