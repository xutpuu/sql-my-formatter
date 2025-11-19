# My Perfect SQL Formatter

Formats SQL exactly the way **I** like it — and no other way.

No auto-formatting on save.  
It runs only when **you** tell it to.

### Before → After

**Before**
```sql
select u.id,u.name,o.total from users u join orders o on u.id=o.user_id where o.created_at>'2025-01-01' and u.active=1 limit 100

SELECT
    u.id,
    u.name,
    o.total
FROM
    users u
    INNER JOIN orders o ON u.id = o.user_id
WHERE
    o.created_at > '2025-01-01'
    AND u.active = 1
LIMIT 100

Features

All keywords in UPPERCASE
One clause per line
Commas start new lines (my favorite style)
Properly indented JOINs and ON clauses
Works only on demand — never touches your file on save
Hotkey: Ctrl+Alt+F (or Cmd+Alt+F on macOS)
Fully customizable in a single file

Installation

Download the latest .vsix from Releases
In Cursor / VS Code → Extensions → … → Install from VSIX…
Done!

Or via terminal:
bashcode --install-extension sql-my-formatter-1.0.0.vsix
# or in Cursor
cursor --install-extension sql-my-formatter-1.0.0.vsix
Usage

Open any .sql file
Press Ctrl+Alt+F
or
Right-click → SQL: Format My Way

Customize it in 10 seconds
Want 2-space indent? Commas on the same line? One-line short queries?
Just edit src/extension.ts → change the formatSqlMyWay function → rebuild:
bashnpm run package
License
MIT ©
