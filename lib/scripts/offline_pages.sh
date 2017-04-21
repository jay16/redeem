for page in $(ls public/admin/pages)
do
    curl "http://localhost:4567/generate/admin/$page" > public/admin/$page
    sed -i '' s#/javascripts/#assets/javascripts/#g public/admin/$page
    sed -i '' s#/stylesheets/#assets/stylesheets/#g public/admin/$page
    sed -i '' s#/images/#assets/images/#g public/admin/$page
done

for page in $(ls public/ipad/pages)
do
    curl "http://localhost:4567/generate/ipad/$page" > public/ipad/$page
    sed -i '' s#/javascripts/#assets/javascripts/#g public/ipad/$page
    sed -i '' s#/stylesheets/#assets/stylesheets/#g public/ipad/$page
    sed -i '' s#/images/#assets/images/#g public/ipad/$page
done
