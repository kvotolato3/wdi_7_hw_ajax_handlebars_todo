class CreateTodoItems < ActiveRecord::Migration
  def change
    create_table :todo_items do |t|
      t.text :text
      t.date :completed_at

      t.timestamps
    end
  end
end
