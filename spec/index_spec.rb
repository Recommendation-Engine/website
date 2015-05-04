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

  describe '#get_movies' do

    it 'should return all movies' do
      movies = get_movies
      expect(movies.count).to be(3883)
      expect(movies).to include({:mid => 1, :title =>'Toy Story'})
    end

  end

end
