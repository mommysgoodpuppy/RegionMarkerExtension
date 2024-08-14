import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    console.log("Region Marker extension is activated");

    let timeout: NodeJS.Timeout | undefined = undefined;
    let activeEditor = vscode.window.activeTextEditor;

    function getRegionDecorationType(): vscode.TextEditorDecorationType {
        const config = vscode.workspace.getConfiguration("regionMarker");

        return vscode.window.createTextEditorDecorationType({
            isWholeLine: config.get("useWholeLineForBackground", true),
            fontWeight: config.get("fontWeight", "bold"),
            color: new vscode.ThemeColor("regionMarker.region.foregroundColor"),
            backgroundColor: new vscode.ThemeColor(
                "regionMarker.region.backgroundColor",
            ),
        });
    }

    function getEndregionDecorationType(): vscode.TextEditorDecorationType {
        const config = vscode.workspace.getConfiguration("regionMarker");

        return vscode.window.createTextEditorDecorationType({
            isWholeLine: config.get("useWholeLineForBackground", true),
            fontWeight: config.get("fontWeight", "bold"),
            color: new vscode.ThemeColor(
                "regionMarker.endregion.foregroundColor",
            ),
            backgroundColor: new vscode.ThemeColor(
                "regionMarker.endregion.backgroundColor",
            ),
        });
    }

    let regionDecorationType = getRegionDecorationType();
    let endregionDecorationType = getEndregionDecorationType();

    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        const regEx = /(#region)|(#endregion)/g;
        const text = activeEditor.document.getText();
        const regionDecorations: vscode.DecorationOptions[] = [];
        const endregionDecorations: vscode.DecorationOptions[] = [];
        let match: RegExpExecArray | null;

        while ((match = regEx.exec(text))) {
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(
                match.index + match[0].length,
            );
            const decoration: vscode.DecorationOptions = {
                range: new vscode.Range(startPos, endPos),
            };

            if (match[0] === "#region") {
                regionDecorations.push(decoration);
            } else {
                endregionDecorations.push(decoration);
            }
        }
        activeEditor.setDecorations(regionDecorationType, regionDecorations);
        activeEditor.setDecorations(
            endregionDecorationType,
            endregionDecorations,
        );
    }

    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(updateDecorations, 0);
    }

    if (activeEditor) {
        triggerUpdateDecorations();
    }

    vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations();
            }
        },
        null,
        context.subscriptions,
    );

    vscode.workspace.onDidChangeTextDocument(
        (event) => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations();
            }
        },
        null,
        context.subscriptions,
    );

    vscode.window.onDidChangeActiveColorTheme(
        () => {
            regionDecorationType.dispose();
            endregionDecorationType.dispose();
            regionDecorationType = getRegionDecorationType();
            endregionDecorationType = getEndregionDecorationType();
            triggerUpdateDecorations();
        },
        null,
        context.subscriptions,
    );

    vscode.workspace.onDidChangeConfiguration(
        (event) => {
            if (event.affectsConfiguration("regionMarker")) {
                const oldRegionType = regionDecorationType;
                const oldEndregionType = endregionDecorationType;

                regionDecorationType = getRegionDecorationType();
                endregionDecorationType = getEndregionDecorationType();

                triggerUpdateDecorations();

                // Dispose old decoration types after applying new ones
                oldRegionType.dispose();
                oldEndregionType.dispose();
            }
        },
        null,
        context.subscriptions,
    );
}
