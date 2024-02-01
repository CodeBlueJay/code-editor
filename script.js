document.addEventListener("DOMContentLoaded", function() {
    const codeEditor = document.getElementById("code-editor");
    const fileInput = document.getElementById("file-input");

    // Load code from localStorage
    const savedCode = localStorage.getItem("code");
    if (savedCode) {
        codeEditor.value = savedCode;
    }

    // Listen for changes in the file input
    fileInput.addEventListener("change", function() {
        const file = fileInput.files[0];
        if (file) {
            loadFileContent(file);
        }
    });

    // Listen for scroll events to update the highlighted line
    codeEditor.addEventListener("scroll", function() {
        highlightCurrentLine();
    });

    // Listen for input events to update the highlighted line
    codeEditor.addEventListener("input", function(e) {
        handleIndentation(e);
        highlightCurrentLine();
    });

    // Listen for keydown events to handle tab key and save shortcut
    codeEditor.addEventListener("keydown", function(e) {
        handleTabKey(e);
        handleSaveShortcut(e);
    });
});

function saveCode() {
    const codeEditor = document.getElementById("code-editor");
    const codeToSave = codeEditor.value;
    localStorage.setItem("code", codeToSave);
    alert("Code saved successfully!");
}

function loadFileContent(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const codeEditor = document.getElementById("code-editor");
        codeEditor.value = e.target.result;
    };
    reader.readAsText(file);
}

function downloadCode() {
    const codeEditor = document.getElementById("code-editor");
    const codeToDownload = codeEditor.value;
    const blob = new Blob([codeToDownload], { type: "text/plain" });

    const fileInput = document.getElementById("file-input");
    const fileName = fileInput.files[0] ? fileInput.files[0].name : "code.txt";

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

function handleTabKey(e) {
    if (e.key === "Tab") {
        e.preventDefault(); // Prevent default tab behavior

        const codeEditor = document.getElementById("code-editor");
        const cursorPosition = codeEditor.selectionStart;
        const currentLineStart = codeEditor.value.lastIndexOf("\n", cursorPosition - 1) + 1;
        const currentLineEnd = codeEditor.value.indexOf("\n", cursorPosition);
        const currentLine = codeEditor.value.substring(currentLineStart, currentLineEnd !== -1 ? currentLineEnd : undefined);

        const leadingSpaces = currentLine.match(/^\s*/)[0];
        const spacesToAdd = 4 - (leadingSpaces.length % 4);
        const spaces = " ".repeat(spacesToAdd);

        codeEditor.setRangeText(spaces, cursorPosition, cursorPosition, "end");
    }
}

function handleIndentation(e) {
    if (e.key === "Backspace" || e.key === "Tab") {
        const codeEditor = document.getElementById("code-editor");
        const cursorPosition = codeEditor.selectionStart;
        const currentLineStart = codeEditor.value.lastIndexOf("\n", cursorPosition - 1) + 1;
        const currentLineEnd = codeEditor.value.indexOf("\n", cursorPosition);
        const currentLine = codeEditor.value.substring(currentLineStart, currentLineEnd !== -1 ? currentLineEnd : undefined);

        if (e.key === "Backspace") {
            const leadingSpaces = currentLine.match(/^\s*/)[0];
            const spacesToRemove = leadingSpaces.length % 4;
            if (spacesToRemove > 0) {
                codeEditor.setRangeText("", cursorPosition - spacesToRemove, cursorPosition, "end");
            }
        } else if (e.key === "Tab") {
            const leadingSpaces = currentLine.match(/^\s*/)[0];
            const spacesToAdd = 4 - (leadingSpaces.length % 4);
            const spaces = " ".repeat(spacesToAdd);

            codeEditor.setRangeText(spaces, cursorPosition, cursorPosition, "end");
        }
    }
}

function handleSaveShortcut(e) {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault(); // Prevent the browser's default save behavior
        saveCode();
    }
}
