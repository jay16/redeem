for page in $(ls admin/pages)
do
    curl "http://localhost:4567/generate/$page" > admin/$page
    sed -i '' s#/javascripts/#assets/javascripts/#g admin/$page
    sed -i '' s#/stylesheets/#assets/stylesheets/#g admin/$page
    sed -i '' s#/images/#assets/images/#g admin/$page
done
