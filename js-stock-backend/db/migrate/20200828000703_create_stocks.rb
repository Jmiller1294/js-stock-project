class CreateStocks < ActiveRecord::Migration[6.0]
  def change
    create_table :stocks do |t|
      t.string :ticker
      t.string :company
      t.decimal :current_price
      t.integer :shares
      t.decimal :market_value
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
