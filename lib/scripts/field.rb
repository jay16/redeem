# encoding: utf-8
#
def fields
  (0..32).to_a.each do |i|
    puts %(t.string   "field#{i}")
  end
end

def migrates
  filename = "db/migrate/20170409090558_create_model.template"
  timestamp = "20170409090558"
  content = File.read(filename)
  (0..10).to_a.each do |i|
    new_content = content.sub("CreateModel", "CreateModel#{i}").sub("sys_model", "sys_model_#{i}")
    new_filename = filename.sub(".template", "_#{i}.rb").sub(timestamp, (timestamp.to_i + i).to_s)
    File.open(new_filename, "w:utf-8") do |file|
      file.puts new_content
    end
  end
end

migrates
