from rest_framework.decorators import api_view

@api_view(['GET'])
def get_admins():
    