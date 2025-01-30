from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path("Tasks/", view=views.tasks, name="task"),
    path("check/", view=views.check, name="save checks"),
    path("settings/", view=views.preference, name="settings"),
    path("remove/", view=views.removeTask, name="remove task")
]