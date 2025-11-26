// src/extension.js
const vscode = require('vscode');

function formatSqlMyWay(sql) {
    if (!sql.trim()) return sql;

    return sql
        // 1. Все ключевые слова — в UPPERCASE
        .replace(/\b(SELECT|FROM|WHERE|AND|OR|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|JOIN|ON|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|OFFSET|UNION|UNION\s+ALL|WITH|INSERT\s+INTO|VALUES|UPDATE|SET|DELETE|CREATE\s+TABLE|ALTER\s+TABLE|AS)\b/gi, 
            match => match.toUpperCase())

        // 2. Нормализуем пробелы + скобки
        .replace(/\s+/g, ' ')
        .replace(/\(/g, ' ( ')
        .replace(/\)/g, ' ) ')
        .trim()

        // 3. Запятые с новой строки + 4 пробела (твой любимый стиль)
        .replace(/,\s*/g, ',\n    ')

        // 4. Основные клаузы с новой строки
        .replace(/\s+(FROM|WHERE|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|JOIN|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|UNION|UNION ALL|WITH|INSERT INTO|VALUES|UPDATE|SET)\s+/gi, '\n$1 ')

        // 5. Магия с отступами
        .split('\n')
        .map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';

            // SELECT без отступа
            if (trimmed === 'SELECT') return 'SELECT';

            // Столбцы после SELECT — 4 пробела
            if (line.includes('SELECT') && trimmed !== 'SELECT') {
                return '    ' + trimmed;
            }

            // FROM, WHERE, JOIN и т.д. — без отступа
            if (/^(FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|UNION|WITH|INSERT INTO|UPDATE|SET|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|JOIN)/i.test(trimmed)) {
                return trimmed;
            }

            // ON — 4 пробела
            if (/^ON /i.test(trimmed)) {
                return '    ' + trimmed;
            }

            // AND / OR после WHERE — 4 пробела
            if (/^(AND|OR) /i.test(trimmed)) {
                return '    ' + trimmed;
            }

            // Всё остальное — на всякий случай 4 пробела
            return '    ' + trimmed;
        })
        .join('\n')
        .replace(/\n+/g, '\n')
        .trim() + '\n';
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('sql-my-formatter.formatMyWay', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        if (editor.document.languageId !== 'sql') {
            vscode.window.showInformationMessage('Только для SQL-файлов, братан :)');
            return;
        }

        const fullText = editor.document.getText();
        const formatted = formatSqlMyWay(fullText);

        editor.edit(editBuilder => {
            const range = new vscode.Range(
                editor.document.positionAt(0),
                editor.document.positionAt(fullText.length)
            );
            editBuilder.replace(range, formatted);
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};