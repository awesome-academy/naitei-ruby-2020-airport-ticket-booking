class CreateStaffs < ActiveRecord::Migration[6.0]
  def change
    create_table :staffs do |t|
      t.string :user_name
      t.string :email
      t.boolean :is_admin, null: false, default: false

      t.timestamps
    end
    add_index :staffs, :user_name, unique: true
  end
end
