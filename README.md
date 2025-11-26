# Smart Task Analyzer

## Setup Instructions

### Prerequisites
- Python 3.8+
- Django 4.0+

### Installation
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Navigate to backend directory: `cd backend`
4. Run migrations: `python manage.py migrate`
5. Start development server: `python manage.py runserver`
6. Open `frontend/index.html` in your web browser

### API Endpoints
- `POST /api/tasks/analyze/` - Analyze and prioritize tasks
- `GET /api/tasks/suggest/` - Get top 3 task suggestions

## Algorithm Explanation

The priority scoring algorithm uses a weighted approach considering four key factors:

1. **Urgency (40% weight)**: Based on due date proximity. Tasks due sooner get higher scores. Past-due tasks receive penalty scores.

2. **Importance (30% weight)**: Direct user-provided importance rating (1-10 scale).

3. **Effort (20% weight)**: Lower effort tasks get slightly higher scores for "quick wins".

4. **Dependencies (10% weight)**: Tasks that block other tasks receive bonus points.

The algorithm normalizes each factor to a 0-100 scale and applies configurable weights. Different sorting strategies adjust these weights:

- **Smart Balance**: Balanced weights as above
- **Fastest Wins**: Effort weight increased to 50%
- **High Impact**: Importance weight increased to 60%
- **Deadline Driven**: Urgency weight increased to 70%

## Design Decisions

1. **Used SQLite**: For simplicity in this assessment
2. **No authentication**: As specified in requirements
3. **Simple frontend**: Vanilla JS to demonstrate core functionality
4. **Weight-based algorithm**: Flexible and configurable approach
5. **JSON dependencies**: Simple list storage for task dependencies

## Time Breakdown

- Backend setup & algorithm: 2 hours
- Frontend development: 1.5 hours
- Testing & documentation: 0.5 hours
- **Total**: 4 hours

## Future Improvements

- User preferences for custom weighting
- Advanced date intelligence (weekends, holidays)
- Dependency visualization
- Task categories and tags
- Persistence with user accounts
