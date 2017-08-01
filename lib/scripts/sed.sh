grep -lr '.shtml' admin/ | xargs -I filepath sed -i '' s/.shtml/.html/g filepath
grep -lr '../taikooli/public/admin/index' admin/ | xargs -I filepath sed -i '' s#../taikooli/public/admin/index#index.html#g filepath


grep -lr 'geng-question.html' admin/ | xargs -I filepath sed -i '' s#geng-question.html#sync-questionnaire.html#g filepath
grep -lr 'geng-gift-info.html' admin/ | xargs -I filepath sed -i '' s#geng-gift-info.html#sync-gift.html#g filepath
grep -lr 'geng-store-info.html' admin/ | xargs -I filepath sed -i '' s#geng-store-info.html#sync-store.html#g filepath
grep -lr 'question.html' admin/ | xargs -I filepath sed -i '' s#question.html#questionnaire.html#g filepath


grep -lr 'Time.now.to_i' app/views/generate | xargs -I filepath sed -i '' s#Time.now.to_i#timestamp#g filepath
