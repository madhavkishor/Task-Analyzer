from datetime import datetime
from .models import Task

def task_serializer(task):
    """Convert task to dictionary for JSON response"""
    if isinstance(task, dict):
        return task
    
    return {
        'id': getattr(task, 'id', None),
        'title': task.title,
        'due_date': task.due_date.isoformat() if hasattr(task.due_date, 'isoformat') else task.due_date,
        'estimated_hours': task.estimated_hours,
        'importance': task.importance,
        'dependencies': task.dependencies,
    }

def deserialize_task(data):
    """
    Validate and convert JSON data to task dictionary
    Returns (task_data, errors)
    """
    errors = []
    task_data = {}
    
    # Validate title
    title = data.get('title', '').strip()
    if not title:
        errors.append('Title is required')
    else:
        task_data['title'] = title
    
    # Validate due_date
    due_date = data.get('due_date')
    if not due_date:
        errors.append('Due date is required')
    else:
        try:
            # Parse date string to ensure it's valid
            datetime.strptime(due_date, '%Y-%m-%d')
            task_data['due_date'] = due_date
        except (ValueError, TypeError):
            errors.append('Invalid due date format. Use YYYY-MM-DD')
    
    # Validate estimated_hours
    estimated_hours = data.get('estimated_hours')
    if estimated_hours is None:
        errors.append('Estimated hours is required')
    else:
        try:
            hours = int(estimated_hours)
            if hours <= 0:
                errors.append('Estimated hours must be positive')
            else:
                task_data['estimated_hours'] = hours
        except (ValueError, TypeError):
            errors.append('Estimated hours must be a number')
    
    # Validate importance
    importance = data.get('importance')
    if importance is None:
        errors.append('Importance is required')
    else:
        try:
            imp = int(importance)
            if imp < 1 or imp > 10:
                errors.append('Importance must be between 1 and 10')
            else:
                task_data['importance'] = imp
        except (ValueError, TypeError):
            errors.append('Importance must be a number between 1 and 10')
    
    # Validate dependencies
    dependencies = data.get('dependencies', [])
    if not isinstance(dependencies, list):
        errors.append('Dependencies must be a list')
    else:
        # Validate each dependency is a string or number
        valid_deps = []
        for dep in dependencies:
            if isinstance(dep, (str, int)):
                valid_deps.append(str(dep))
            else:
                errors.append(f'Invalid dependency: {dep}')
                break
        else:
            task_data['dependencies'] = valid_deps
    
    return task_data, errors
