FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install poetry

WORKDIR /app

RUN pip install --no-cache-dir watchfiles

COPY pyproject.toml poetry.lock /app/

RUN poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-ansi

COPY . .

# RUN poetry install -n

EXPOSE 8000

RUN poetry run python manage.py collectstatic --noinput

VOLUME [ "/app" ]

CMD [ "poetry","run","uvicorn", "bartrify.asgi:application","--host","0.0.0.0","--port","8000", "--reload","--reload-include", "*.py,*.html,*.css,*.js" ]