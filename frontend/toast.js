function showToast(message, type = "success") {

    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = message;

    // New toast always appears ABOVE older toasts
    container.insertBefore(toast, container.firstChild);

    setTimeout(() => {
        toast.remove();

        if (container.children.length === 0) {
            container.remove();
        }
    }, 5000);
}