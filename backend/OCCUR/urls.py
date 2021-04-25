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
from api import admin_views

urlpatterns = [
    path('',views.apiUrlsList, name="apiUrlsList" ),
    path('resources/', views.ResourceListCreate.as_view()),
    path('locations/<int:id>/', views.LocationRetrieveUpdateDestroy.as_view()),
    path('resources/<int:id>/', views.ResourceRetrieveUpdateDestroy.as_view()),
    path('resources/', views.ResourceListCreate.as_view()),
    path('locations', views.LocationList.as_view()),
    path('admins/', admin_views.get_admins),
    path('admins/<id>/', admin_views.delete_admin),
    path('admins/', admin_views.new_admin),
    path('admins/<id>/', admin_views.update_admin),
    path('admin/', admin.site.urls
    ),
]
