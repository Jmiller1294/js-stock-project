class StocklistingsController < ApplicationController
    def index
        stocklistings = Stocklisting.all
        render json: stocklistings
    end
end
