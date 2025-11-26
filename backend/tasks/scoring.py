from datetime import datetime, date
from collections import defaultdict, deque

def calculate_priority_score(task, strategy="smart_balance"):
    """
    Calculate priority score for a task based on multiple factors
    
    Args:
        task (dict): Task data
        strategy (str): Scoring strategy
    
    Returns:
        tuple: (score, explanation)
    """
    # Define weights for different strategies
    strategy_weights = {
        'smart_balance': {'urgency': 0.4, 'importance': 0.3, 'effort': 0.2, 'dependencies': 0.1},
        'fastest_wins': {'urgency': 0.2, 'importance': 0.2, 'effort': 0.5, 'dependencies': 0.1},
        'high_impact': {'urgency': 0.1, 'importance': 0.6, 'effort': 0.2, 'dependencies': 0.1},
        'deadline_driven': {'urgency': 0.7, 'importance': 0.2, 'effort': 0.05, 'dependencies': 0.05},
    }
    
    weights = strategy_weights.get(strategy, strategy_weights['smart_balance'])
    
    # Calculate individual scores (0-100 scale)
    urgency_score = calculate_urgency_score(task)
    importance_score = calculate_importance_score(task)
    effort_score = calculate_effort_score(task)
    dependency_score = calculate_dependency_score(task)
    
    # Calculate weighted total score
    total_score = (
        urgency_score * weights['urgency'] +
        importance_score * weights['importance'] +
        effort_score * weights['effort'] +
        dependency_score * weights['dependencies']
    )
    
    # Generate explanation
    explanation = generate_score_explanation(
        task, total_score, urgency_score, importance_score, 
        effort_score, dependency_score, strategy
    )
    
    return round(total_score, 2), explanation

def calculate_urgency_score(task):
    """Calculate score based on due date urgency"""
    due_date = task['due_date']
    if isinstance(due_date, str):
        due_date = datetime.strptime(due_date, '%Y-%m-%d').date()
    
    today = date.today()
    days_until_due = (due_date - today).days
    
    if days_until_due < 0:
        # Past due - high urgency with penalty
        return max(0, 100 + (days_until_due * 2))  # Penalty for being overdue
    elif days_until_due == 0:
        return 100  # Due today
    elif days_until_due <= 1:
        return 95   # Due tomorrow
    elif days_until_due <= 3:
        return 85   # Due in 3 days
    elif days_until_due <= 7:
        return 70   # Due in a week
    elif days_until_due <= 14:
        return 50   # Due in two weeks
    else:
        return 30   # Due later

def calculate_importance_score(task):
    """Convert importance (1-10) to score (0-100)"""
    importance = task['importance']
    return (importance / 10) * 100

def calculate_effort_score(task):
    """Calculate score based on effort (lower effort = higher score)"""
    estimated_hours = task['estimated_hours']
    
    if estimated_hours <= 1:
        return 90   # Quick task
    elif estimated_hours <= 2:
        return 80   # Short task
    elif estimated_hours <= 4:
        return 65   # Medium task
    elif estimated_hours <= 8:
        return 45   # Long task
    else:
        return 25   # Very long task

def calculate_dependency_score(task):
    """Calculate score based on dependencies"""
    dependencies = task.get('dependencies', [])
    
    if not dependencies:
        return 50  # Neutral score for no dependencies
    
    # Tasks with dependencies get slightly higher priority as they block others
    num_dependencies = len(dependencies)
    if num_dependencies >= 3:
        return 80
    elif num_dependencies >= 2:
        return 70
    else:
        return 60

def generate_score_explanation(task, total_score, urgency, importance, effort, dependency, strategy):
    """Generate human-readable explanation for the score"""
    explanations = []
    
    # Strategy context
    strategy_names = {
        'smart_balance': 'Smart Balance',
        'fastest_wins': 'Fastest Wins', 
        'high_impact': 'High Impact',
        'deadline_driven': 'Deadline Driven'
    }
    
    explanations.append(f"Using {strategy_names.get(strategy, 'Smart Balance')} strategy:")
    
    # Component explanations
    if urgency >= 80:
        explanations.append("• High urgency (due soon or overdue)")
    elif urgency >= 60:
        explanations.append("• Medium urgency")
    else:
        explanations.append("• Low urgency")
    
    if importance >= 80:
        explanations.append("• High importance")
    elif importance >= 60:
        explanations.append("• Medium importance") 
    else:
        explanations.append("• Low importance")
        
    if effort >= 80:
        explanations.append("• Quick win (low effort)")
    elif effort >= 60:
        explanations.append("• Moderate effort")
    else:
        explanations.append("• High effort task")
    
    dependencies = task.get('dependencies', [])
    if dependencies:
        explanations.append(f"• Blocks {len(dependencies)} other task(s)")
    else:
        explanations.append("• No dependencies")
    
    return " ".join(explanations)

def detect_circular_dependencies(tasks):
    """
    Detect circular dependencies in tasks
    Returns list of cycles found or empty list if no cycles
    """
    # Build dependency graph
    graph = defaultdict(list)
    task_ids = [str(i) for i in range(len(tasks))]  # Use indices as IDs
    
    for i, task in enumerate(tasks):
        task_id = str(i)
        for dep in task.get('dependencies', []):
            graph[task_id].append(str(dep))
    
    # DFS cycle detection
    def dfs(node, visited, rec_stack, cycle):
        visited.add(node)
        rec_stack.add(node)
        cycle.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                if dfs(neighbor, visited, rec_stack, cycle):
                    return True
            elif neighbor in rec_stack:
                # Cycle detected
                cycle_start = cycle.index(neighbor)
                return cycle[cycle_start:]
        
        rec_stack.remove(node)
        cycle.pop()
        return False
    
    visited = set()
    rec_stack = set()
    
    for node in task_ids:
        if node not in visited:
            cycle = []
            result = dfs(node, visited, rec_stack, cycle)
            if result:
                return result
    
    return []  # No cycles detected
