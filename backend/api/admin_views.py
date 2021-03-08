from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
# special permissions needed because GET is usually readonly (and therefore visible to all),
# but we don't want just anyone seeing all of our admins' info
@permission_classes([IsAuthenticated])
def get_admins(request):
    # now we would perform different actions based on request method
    return JsonResponse({'message': 'Hello World!'})
