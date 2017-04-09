class CreateModel3 < ActiveRecord::Migration
  def change
    # [<tt>:force</tt>]
    #   Set to true to drop the table before creating it.
    #   Set to +:cascade+ to drop dependent objects as well.
    #   Defaults to false.
    create_table "sys_model_3", force: false do |t|
      t.string   "field0"
      t.string   "field1"
      t.string   "field2"
      t.string   "field3"
      t.string   "field4"
      t.string   "field5"
      t.string   "field6"
      t.string   "field7"
      t.string   "field8"
      t.string   "field9"
      t.string   "field10"
      t.string   "field11"
      t.string   "field12"
      t.string   "field13"
      t.string   "field14"
      t.string   "field15"
      t.string   "field16"
      t.string   "field17"
      t.string   "field18"
      t.string   "field19"
      t.string   "field20"
      t.string   "field21"
      t.string   "field22"
      t.string   "field23"
      t.string   "field24"
      t.string   "field25"
      t.string   "field26"
      t.string   "field27"
      t.string   "field28"
      t.string   "field29"
      t.string   "field30"
      t.string   "field31"
      t.string   "field32"
      t.string   "ip"
      t.text     "browser"
      t.timestamps null: false
    end
  end
end
