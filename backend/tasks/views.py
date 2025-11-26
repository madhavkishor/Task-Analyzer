import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .scoring import calculate_priority_score, detect_circular_dependencies
from .serializers import task_serializer, deserialize_task

@csrf_exempt
@require_http_methods(["POST"])
def analyze_tasks(request):
    """
    POST /api/tasks/analyze/
    Accepts JSON array of tasks and returns them sorted by priority score
    """
    try:
        data = json.loads(request.body)
        
        if not isinstance(data, list):
            return JsonResponse({'error': 'Expected JSON array of tasks'}, status=400)
        
        # Validate tasks and detect circular dependencies
        tasks = []
        for task_data in data:
            task, errors = deserialize_task(task_data)
            if errors:
                return JsonResponse({'error': f'Invalid task data: {errors}'}, status=400)
            tasks.append(task)
        
        circular_deps = detect_circular_dependencies(tasks)
        if circular_deps:
            return JsonResponse({'error': f'Circular dependencies detected: {circular_deps}'}, status=400)
        
        # Get strategy from request or use default
        strategy = request.GET.get('strategy', 'smart_balance')
        
        # Calculate scores and sort
        scored_tasks = []
        for task in tasks:
            score, explanation = calculate_priority_score(task, strategy)
            scored_task = task_serializer(task)
            scored_task['priority_score'] = score
            scored_task['score_explanation'] = explanation
            scored_tasks.append(scored_task)
        
        # Sort by priority score (descending)
        scored_tasks.sort(key=lambda x: x['priority_score'], reverse=True)
        
        return JsonResponse({'tasks': scored_tasks, 'strategy': strategy})
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def suggest_tasks(request):
    """
    GET /api/tasks/suggest/
    Returns top 3 tasks with explanations
    """
    try:
        # For this demo, we'll use sample data
        # In a real app, this would fetch from database
        sample_tasks = [
            {
                'title': 'Complete project documentation',
                'due_date': '2025-11-25',
                'estimated_hours': 2,
                'importance': 8,
                'dependencies': []
            },
            {
                'title': 'Fix critical bug in login',
                'due_date': '2025-11-20', 
                'estimated_hours': 4,
                'importance': 9,
                'dependencies': []
            },
            {
                'title': 'Setup development environment',
                'due_date': '2025-11-30',
                'estimated_hours': 1,
                'importance': 6,
                'dependencies': []
            }
        ]
        
        strategy = request.GET.get('strategy', 'smart_balance')
        scored_tasks = []
        
        for task_data in sample_tasks:
            score, explanation = calculate_priority_score(task_data, strategy)
            task_data['priority_score'] = score
            task_data['score_explanation'] = explanation
            scored_tasks.append(task_data)
        
        scored_tasks.sort(key=lambda x: x['priority_score'], reverse=True)
        top_tasks = scored_tasks[:3]
        
        return JsonResponse({
            'suggested_tasks': top_tasks,
            'strategy': strategy,
            'explanation': f'Top 3 tasks using {strategy.replace("_", " ").title()} strategy'
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
