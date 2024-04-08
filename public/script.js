document.addEventListener('DOMContentLoaded', function() {
    const draggables = document.querySelectorAll('#fratList li');
    const slots = document.querySelectorAll('.pyramid-slot');
    const resetButton = document.getElementById('resetButton');
    const submitBtn = document.getElementById('submitButton');

    // Setup drag start event
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', draggable.innerText); // Text to be displayed
            event.dataTransfer.setData('sourceId', draggable.id); // Element id for reference
            event.dataTransfer.effectAllowed = 'move'; // Specify the drag effect
        });
    });

    // Setup drag over and drop events on slots
    slots.forEach(slot => {
        slot.addEventListener('dragover', event => {
            event.preventDefault(); // Necessary to allow the drop
            event.dataTransfer.dropEffect = 'move'; // Specify the drop effect
        });

        slot.addEventListener('drop', event => {
            event.preventDefault();
            const droppedText = event.dataTransfer.getData('text/plain');
            const droppedId = event.dataTransfer.getData('sourceId');
            const droppedElement = document.getElementById(droppedId);

            if (slot.hasChildNodes()) {
                // Swap if the slot has an existing element
                const currentElement = slot.firstChild;
                const currentText = currentElement.textContent;
                const currentId = Array.from(draggables).find(draggable => draggable.textContent === currentText).id;

                currentElement.textContent = droppedText; // Set new text
                document.getElementById(currentId).style.display = 'block'; // Show the swapped out element in the list
                droppedElement.style.display = 'none'; // Hide the dragged element in the list
            } else {
                // If slot is empty, place the new element
                slot.textContent = droppedText;
                droppedElement.style.display = 'none';
            }
        });
    });

    // Setup reset functionality
    resetButton.addEventListener('click', () => {
        slots.forEach(slot => {
            if (slot.firstChild) {
                const text = slot.firstChild.textContent;
                const itemToUnhide = Array.from(draggables).find(draggable => draggable.textContent === text);
                if (itemToUnhide) {
                    itemToUnhide.style.display = 'block';
                }
                slot.textContent = ''; // Clear the text content of the slot
            }
        });
    });

    // Submit rankings to server
    submitBtn.addEventListener('click', () => {
        const rankings = Array.from(slots).map(slot => slot.firstChild ? slot.firstChild.textContent : '');
        fetch('/submit-ranking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rankings })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    });
});
