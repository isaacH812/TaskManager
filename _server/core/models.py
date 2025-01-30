from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.TextField()
    body = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    sub_tasks = models.JSONField(default=list)
    sub_done = models.JSONField(default=list)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User,  on_delete=models.CASCADE, related_name="task")

class Preference(models.Model):
     id = models.BigAutoField(primary_key=True)
     bar = models.BooleanField(default=True)
     bar_filter = models.TextField(default="1")
     graphic = models.BooleanField(default=True)
     task_filter = models.TextField(default="1")
     task_color = models.BooleanField(default=False)
     user = models.ForeignKey(User,  on_delete=models.CASCADE, related_name="preferance")