document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const exportBtn = document.getElementById('exportBtn');
    const taskList = document.getElementById('taskList');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const pendingTasks = document.getElementById('pendingTasks');
    const finishedTasks = document.getElementById('finishedTasks');
    const totalTasks = document.getElementById('totalTasks');

    let pendingCount = 0;
    let finishedCount = 0;
    let totalCount = 0;

    const updateCounters = () => {
        totalTasks.textContent = `Total: ${totalCount}`;
        pendingTasks.textContent = `Pending: ${pendingCount}`;
        finishedTasks.textContent = `Finished: ${finishedCount}`;
    };

    // Add Task
    const addTask = () => {
        const taskValue = taskInput.value.trim();
        if (taskValue) {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between bg-gray-700 p-3 rounded shadow-sm transition transform duration-200 hover:shadow-md';

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'mr-2 cursor-pointer';
            checkbox.onclick = () => {
                if (checkbox.checked) {
                    li.classList.add('line-through', 'text-gray-500');
                    pendingCount--;
                    finishedCount++;
                } else {
                    li.classList.remove('line-through', 'text-gray-500');
                    pendingCount++;
                    finishedCount--;
                }
                updateCounters();
            };
            li.appendChild(checkbox);

            // Task Text
            const taskText = document.createElement('span');
            taskText.textContent = taskValue;
            taskText.className = 'flex-grow';
            li.appendChild(taskText);

            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'ml-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition duration-200 ease-in-out';
            editBtn.onclick = () => editTask(taskText, editBtn);
            li.appendChild(editBtn);

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200 ease-in-out';
            deleteBtn.onclick = () => {
                if (!checkbox.checked) pendingCount--;
                else finishedCount--;
                totalCount--;
                taskList.removeChild(li);
                updateCounters();
            };
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
            taskInput.value = ''; // Clear the input field

            pendingCount++;
            totalCount++;
            updateCounters();
        }
    };

    // Edit Task
    const editTask = (taskText, editBtn) => {
        const originalText = taskText.textContent;
        taskText.contentEditable = true;
        taskText.classList.add('border', 'border-blue-500');

        // Change button text to 'Update'
        editBtn.textContent = 'Update';
        editBtn.onclick = () => {
            if (taskText.textContent.trim() !== '') {
                taskText.contentEditable = false;
                taskText.classList.remove('border', 'border-blue-500');

                // Change button text back to 'Edit'
                editBtn.textContent = 'Edit';
                editBtn.onclick = () => editTask(taskText, editBtn);
            } else {
                taskText.textContent = originalText; // Revert to original text if empty
                taskText.contentEditable = false;
                editBtn.textContent = 'Edit';
                editBtn.onclick = () => editTask(taskText, editBtn);
            }
        };

        taskText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                editBtn.click(); // Trigger save on Enter key press
            }
        });
    };

    // Clear All Tasks
    const clearAllTasks = () => {
        taskList.innerHTML = '';
        pendingCount = 0;
        finishedCount = 0;
        totalCount = 0;
        updateCounters();
    };

    // Export Tasks
    const exportTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const taskText = li.querySelector('span').textContent;
            const isCompleted = li.querySelector('input[type="checkbox"]').checked;
            tasks.push({ task: taskText, completed: isCompleted });
        });
        const jsonStr = JSON.stringify(tasks, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "todo-list.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Event Listeners
    addBtn.onclick = addTask;
    exportBtn.onclick = exportTasks;
    clearAllBtn.onclick = clearAllTasks;

    // Allow adding tasks with Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

 