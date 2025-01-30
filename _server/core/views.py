from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from .models import Task, Preference
from django.http import JsonResponse
from django.forms.models import model_to_dict

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

@login_required
def tasks(req):
    if req.method == "POST":
        body = json.loads(req.body)
        task = Task(
            title=body["title"],
            body=body["notes"],
            start_time=body["start"],
            end_time=body["end"],
            sub_tasks=body["input"],
            sub_done=body["checked"],
            user = req.user
        )
        task.save()
        return JsonResponse({"task": model_to_dict(task)})
    else:
        tasks = [model_to_dict(task) for task in Task.objects.filter(user=req.user)]

        return JsonResponse({"tasks": tasks})
    
@login_required
def preference(req):
    if req.method == "POST":
        body = json.loads(req.body)
        settings = Preference.objects.get(user=req.user)
        settings.bar = body["includeBar"]
        settings.bar_filter = body["barFilter"]
        settings.graphic = body["includeGraph"]
        settings.task_filter = body["taskFilter"]
        settings.task_color = body["taskColor"]
        settings.save()
        return JsonResponse({"settings": model_to_dict(settings)})
    else:
        settings = model_to_dict(Preference.objects.get(user=req.user))

        return JsonResponse({"settings": settings})
    
@login_required
def check(req):

    body = json.loads(req.body)

    index = body["index"]
    id = body["id"]

    task = Task.objects.get(id=id)

    task.sub_done[index] = not task.sub_done[index]
    
    task.save()
    return JsonResponse({"task": model_to_dict(task)})

@login_required
def removeTask(req):
    body = json.loads(req.body)
    id = body["id"]
    task = Task.objects.get(id=id)
    task.completed = True
    task.save()
    return JsonResponse({"task": model_to_dict(task)})