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

  describe '#get_movies_titles' do

    it 'should return some movie titles' do
      expect(get_movie_titles.count).to be(3883)
    end

  end

end
