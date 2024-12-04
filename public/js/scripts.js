tailwind.config = {
    theme: {
        extend: {
            colors: {
                darkBg: '#2F323A',
                accent: '#6279B8',
                lightText: '#f8f8f8'
            }
        }
    }
}

function copyToClipboard(text, event) {
    navigator.clipboard.writeText(text)
        .then(() => {
            const notification = document.getElementById('copyNotification');
            const { clientX, clientY } = event;

            notification.style.left = `${clientX + 10}px`;
            notification.style.top = `${clientY + 10}px`;
            notification.style.opacity = '1';

            setTimeout(() => {
                notification.style.opacity = '0';
            }, 800);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

function toggleButton() {
    const input = document.getElementById("long-url");
    const button = document.getElementById("submit-button");

    button.disabled = !input.value.trim();
}

