class UsersController < ApplicationController
    def index
        users = User.all
        render json: users 
    end

    def show
        user = User.find_by(id: params[:id])
        render json: user, include: [:stocks]
    end

    def create 
       user = User.create(username: params[:username])
       render json: user
    end
       
end
