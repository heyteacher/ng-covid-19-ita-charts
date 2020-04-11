ng build --configuration=production  && \
ng build --configuration=production,it  && \
cd dist/prod/ && \
git pull && \
git add . && \
git commit -m "released at `date`" && \
git push && cd ../../../