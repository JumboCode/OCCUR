"""OCCUR URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api import views
urlpatterns = [
    path('api/v1/new/resource/', views.ResourceCreate.as_view()),
    # path('api/v1/new/', views.LocationCreate.as_view()),
    path('api/v1/<int:id>/delete/location', views.LocationDestroy.as_view()),
    path('api/v1/<int:id>/delete/resource', views.ResourceDestroy.as_view()),
    path('api/v1/list/resource', views.ResourceList.as_view()),
    path('api/v1/list/location', views.LocationList.as_view()),
    path('admin/', admin.site.urls
    ),
]
