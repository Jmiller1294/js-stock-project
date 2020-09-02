# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


user1 = User.create(username: "Jay1294")
# Stock.create(ticker: "A", company: "Apple", current_price: 146.0, shares: 
#     3, market_value: 450.0, user: user1)
# Stock.create(ticker: "TSLA", company: "Tesla Inc", current_price: 442.68, shares: 
#         10, market_value: 4420.0, user: user1)

Stocklisting.create(ticker: "A", company: "Apple", current_price: 146.0)
Stocklisting.create(ticker: "TSLA", company: "Tesla Inc", current_price: 442.6)
        