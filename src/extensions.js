import * as vscode from 'vscode';
function formatSqlMyWay(sql) {
    return sql
        // 1. Ключевые слова в верхний регистр
        .replace(/\b(SELECT|FROM|WHERE|AND|OR|INNER JOIN|LEFT JOIN|RIGHT JOIN|ON|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT INTO|VALUES|UPDATE|SET|DELETE|CREATE TABLE|ALTER TABLE|AS)\b/gi, match => match.toUpperCase())
        // 2. Убираем лишние пробелы
        .replace(/\s+/g, ' ')
        .trim()
        // 3. Каждое основное предложение с новой строки
        .replace(/ (FROM|WHERE|AND|OR|INNER JOIN|LEFT JOIN|RIGHT JOIN|ON|GROUP BY|ORDER BY|HAVING|LIMIT)/gi, '\n$1')
        // 4. JOIN-ы выравниваем
        .replace(/\n(INNER|LEFT|RIGHT) JOIN/g, '\n $1 JOIN')
        // 5. ON тоже отступаем
        .replace(/\nON /gi, '\n    ON ')
        // 6. Запятые в SELECT — с новой строки и отыступом (мой любимый стиль)
        .replace(/,(\s*)/g, ',\n    ')
        // 7. Финальная красота
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n') + '\n';
}
export function activate(context) {
    const disposable = vscode.commands.registerCommand('sqlMyWay.format', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'sql') {
            return;
        }
        const fullText = editor.document.getText();
        const formatted = formatSqlMyWay(fullText);
        editor.edit(editBuilder => {
            const fullRange = new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(fullText.length));
            editBuilder.replace(fullRange, formatted);
        });
    });
    // Автоформат при сохранении (по желанию)
    vscode.workspace.onWillSaveTextDocument(e => {
        if (e.document.languageId === 'sql') {
            e.waitUntil(Promise.resolve([
                vscode.TextEdit.replace(new vscode.Range(e.document.positionAt(0), e.document.positionAt(e.document.getText().length)), formatSqlMyWay(e.document.getText()))
            ]));
        }
    });
    context.subscriptions.push(disposable);
}
export function deactivate() { }
//# sourceMappingURL=extensions.js.map