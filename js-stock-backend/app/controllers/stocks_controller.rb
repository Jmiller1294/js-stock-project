class StocksController < ApplicationController
    def index
        stocks = Stock.all
        render json: stocks
    end

    def show 
        stock = Stock.find_by(id: params[:id])
        render json: stock
    end

    def create
        stock = Stock.create(ticker: params[:ticker], company: params[:company], current_price: params[:current_price], shares: params[:shares], market_value: params[:market_value], user_id: params[:user_id])
        render json: stock
    end

    def update
        stock = Stock.find_by(id: params[:id])
        stock.update(ticker: params[:ticker], company: params[:company], current_price: params[:current_price], shares: params[:shares], market_value: params[:market_value])
    end

end
