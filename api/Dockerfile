FROM python:3.9.22-alpine3.21

WORKDIR /app

COPY ./requirements.txt ./

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE ${FLASK_RUN_PORT}

# CMD  ["flask", "run"] 

CMD ["gunicorn", "-b", "0.0.0.0:5000", "wsgi:app"]
