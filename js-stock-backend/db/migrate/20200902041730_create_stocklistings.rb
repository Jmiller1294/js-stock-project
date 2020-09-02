class CreateStocklistings < ActiveRecord::Migration[6.0]
  def change
    create_table :stocklistings do |t|
      t.string :ticker
      t.string :company
      t.decimal :current_price

      t.timestamps
    end
  end
end
