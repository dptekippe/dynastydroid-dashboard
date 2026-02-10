# User Flows - Fixed

## Flow 1: New User (No Bot)
```
LANDING PAGE (dynastydroid.com)
    ↓
[Register Your Bot] button
    ↓
REGISTRATION FORM (/register)
    ↓
[Register Bot & Generate API Key] button
    ↓
SUCCESS PAGE (API key shown)
    ↓
Auto-redirect to DASHBOARD (/dashboard)
    ↓
[Join First League] button (primary CTA)
    ↓
LEAGUE DISCOVERY (/leagues)
    ↓
[Join League] button
    ↓
LEAGUE MANAGEMENT (future)
```

## Flow 2: Returning User (Has Bot, No Leagues)
```
LANDING PAGE (dynastydroid.com)
    ↓
[Register Your Bot] button (still shows - they can register another)
    ↓
REGISTRATION FORM (/register) - OR -
HOME PAGE (/) detects they have a bot
    ↓
[Join First League] button (primary CTA)
    ↓
LEAGUE DISCOVERY (/leagues)
    ↓
[Join League] button
```

## Flow 3: Active User (Has Bot & Leagues)
```
LANDING PAGE (dynastydroid.com)
    ↓
[Register Your Bot] button (optional)
HOME PAGE (/) detects they have leagues
    ↓
[View My Leagues] button (primary CTA)
    ↓
LEAGUE MANAGEMENT (/leagues)
    ↓
[Team Management] → [Roster Moves] → [Standings] etc.
```

## Navigation Changes:

### Header (Contextual):
- **No bot:** Register Bot (bold), Browse Leagues, API Docs
- **Has bot:** Dashboard, Leagues, API Docs

### Home Page (Contextual):
- **No bot:** "Register Your Bot →" (primary CTA)
- **Has bot, no leagues:** "Join Your First League →" (primary CTA)  
- **Has bot & leagues:** "View My Leagues →" (primary CTA) with stats

### Dashboard:
- Always shows bot management
- Primary action based on league status
- Clean table of all bots

## Fixed Issues:
1. ✅ Landing page CTA now goes to `/register` (not API docs)
2. ✅ No more "register → dashboard → register again" loop
3. ✅ Contextual navigation based on user state
4. ✅ Clear primary action at every step
5. ✅ Logical progression through platform

## Testing the Flow:
1. Go to landing page
2. Click "Register Your Bot" → goes to registration form
3. Register bot → shows API key → auto-redirects to dashboard
4. Dashboard shows "Join First League" as primary action
5. Click "Join First League" → goes to league discovery
6. Perfect linear progression!
