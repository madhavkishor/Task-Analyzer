from django.test import TestCase
from .scoring import calculate_priority_score, detect_circular_dependencies

class ScoringAlgorithmTests(TestCase):
    
    def test_urgency_scoring(self):
        """Test urgency score calculation"""
        from datetime import date, timedelta
        
        # Test overdue task
        overdue_task = {
            'title': 'Overdue task',
            'due_date': (date.today() - timedelta(days=1)).isoformat(),
            'estimated_hours': 2,
            'importance': 5,
            'dependencies': []
        }
        score, explanation = calculate_priority_score(overdue_task)
        self.assertGreater(score, 0)
        
        # Test task due today
        today_task = {
            'title': 'Due today',
            'due_date': date.today().isoformat(),
            'estimated_hours': 2,
            'importance': 5,
            'dependencies': []
        }
        score, explanation = calculate_priority_score(today_task)
        self.assertGreaterEqual(score, 80)
    
    def test_importance_scoring(self):
        """Test importance score calculation"""
        high_importance_task = {
            'title': 'High importance',
            'due_date': '2025-12-01',
            'estimated_hours': 2,
            'importance': 9,
            'dependencies': []
        }
        
        low_importance_task = {
            'title': 'Low importance', 
            'due_date': '2025-12-01',
            'estimated_hours': 2,
            'importance': 3,
            'dependencies': []
        }
        
        high_score, _ = calculate_priority_score(high_importance_task)
        low_score, _ = calculate_priority_score(low_importance_task)
        
        self.assertGreater(high_score, low_score)
    
    def test_circular_dependency_detection(self):
        """Test circular dependency detection"""
        # No circular dependencies
        tasks_no_cycle = [
            {'dependencies': ['1']},  # Task 0 depends on 1
            {'dependencies': []},     # Task 1 has no dependencies
        ]
        self.assertEqual(detect_circular_dependencies(tasks_no_cycle), [])
        
        # Circular dependencies
        tasks_with_cycle = [
            {'dependencies': ['1']},  # Task 0 depends on 1
            {'dependencies': ['0']},  # Task 1 depends on 0 - cycle!
        ]
        cycle = detect_circular_dependencies(tasks_with_cycle)
        self.assertTrue(len(cycle) > 0)

class StrategyTests(TestCase):
    
    def test_different_strategies(self):
        """Test that different strategies produce different scores"""
        task = {
            'title': 'Test task',
            'due_date': '2025-11-25',
            'estimated_hours': 3,
            'importance': 7,
            'dependencies': []
        }
        
        smart_score, _ = calculate_priority_score(task, 'smart_balance')
        fast_score, _ = calculate_priority_score(task, 'fastest_wins')
        impact_score, _ = calculate_priority_score(task, 'high_impact')
        deadline_score, _ = calculate_priority_score(task, 'deadline_driven')
        
        # Scores should be different for different strategies
        scores = [smart_score, fast_score, impact_score, deadline_score]
        self.assertEqual(len(scores), len(set(scores)))  # All unique
