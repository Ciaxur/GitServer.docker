# Complete Clean: docker rmi $(docker images -f "dangling=true" -q)
# docker system prune

NAME=git-server
curr_dir := $(shell pwd)

build-run: build remove run

build:
	docker build . -t $(NAME)
	
run:
	docker run --name=$(NAME) -it -p 80:80 -p 3000:3000 -p 22:22 -v $(curr_dir)/Shared:/home/git/repositories git-server

remove:
	docker container rm $(NAME)