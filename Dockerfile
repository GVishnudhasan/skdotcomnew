FROM python:3.8

WORKDIR /app
COPY requirement.txt .

RUN pip install -r requirement.txt
# RUN pip install opencv-python-headless

COPY . .
EXPOSE 5000
# RUN mkdir logs

CMD ["python", "application.py"]