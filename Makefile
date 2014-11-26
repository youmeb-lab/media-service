start:
	@docker run -v $(shell pwd):/app --rm -p 38000:80 -e TMPDIR=/app/tmp youmeb/media-service ./node_modules/.bin/nodemon --harmony app

install:
	@docker run -v $(shell pwd):/app --rm youmeb/media-service npm i

docker-build:
	@docker build -t youmeb/media-service .

upload:
	@curl -F "image[]=@./file.png" -F "image[]=@./app.js" http://localhost:38000/local/dir/dir/image.png
