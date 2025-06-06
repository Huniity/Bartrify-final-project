poetry.install:
	poetry install

runserver:
	poetry run python manage.py runserver 

logs:
	docker compose logs -f

down:
	docker compose down --volumes

start:
	COMPOSE_BAKE=True poetry run python manage.py runserver

migrate:
	poetry run python manage.py migrate

migration:
	poetry run python manage.py makemigrations

super:
	poetry run python manage.py createsuperuser

newapp:
	poetry run python manage.py startapp $(app)
	@# to execute run `make newapp app=cenas`

test:
	poetry run pytest -vvv

compose.super:
	docker compose run --rm web poetry run python manage.py createsuperuser

compose.start:
	docker compose up --build --force-recreate -d

compose.migrate:
	docker compose run --rm web poetry run python manage.py migrate

compose.migration:
	docker compose run --rm web poetry run python manage.py makemigrations

compose.collectstatic:
	docker compose exec web poetry run python manage.py collectstatic --noinput

compose.test:
	docker compose run --rm web poetry run pytest -vvv

compose.group:
	docker compose run --rm web poetry run python manage.py loaddata group.json

compose.user:
	docker compose run --rm web poetry run python manage.py loaddata user.json

compose.course:
	docker compose run --rm web poetry run python manage.py loaddata course.json

compose.logs:
	docker compose logs -f

open.terminal:
	code --new-window

open.browser:
	@{ command -v xdg-open >/dev/null && xdg-open http://localhost:8000; } || \
	{ command -v open >/dev/null && open http://localhost:8000; } || \
	{ command -v explorer >/dev/null && explorer "http://localhost:8000"; } || \
	{ command -v python3 >/dev/null && python3 -m webbrowser http://localhost:8000; } || \
	echo "Could not open browser automatically. Please visit http://localhost:8000 in your browser."

create.env:
	@echo "POSTGRES_DB='bartr_db'" > .env
	@echo "POSTGRES_USERNAME='postgres'" >> .env
	@echo "POSTGRES_PASSWORD='bartr'" >> .env
	@echo "POSTGRES_HOST='database'" >> .env
	@echo "POSTGRES_PORT='5432'" >> .env
	@echo "DJANGO_DEBUG='False'" >> .env
	@echo ".env file created successfully."

# lazy.jorge:
# 	make create.env
# 	sleep 1
# 	make poetry.install
# 	sleep 2
# 	make compose.start
# 	sleep 10
# 	make compose.migrate
# 	sleep 2
# 	make compose.group
# 	sleep 1
# 	make compose.user
# 	sleep 1
# 	make compose.course
# 	sleep 1
# 	make open.browser
# 	make compose.logs
